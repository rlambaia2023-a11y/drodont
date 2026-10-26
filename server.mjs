// drodont (ODONTO-FBBR) em hospedagem própria (sem Base44, sem dependências).
// Serve dist/ com fallback SPA e API em /api/*: auth local, entidades,
// upload e IA. Dados em DATA_DIR (ou /app/data se existir, ou ./data).
// Senhas: scrypt com salt. Tokens aleatórios.
// Pacientes/prontuários: só o próprio usuário logado vê e altera os seus
// registros (created_by = e-mail). Medication é pública para leitura.
// IA: só Gemini, sem OpenAI. Raio-x pela API nativa do Gemini
// (gemini-3.5-flash-lite por padrão, imagem em base64, esquema JSON estruturado,
// cache por hash da imagem + contexto, sem retry em cota 429).
// Sem GEMINI_API_KEY, erro honesto, sem inventar achado clínico.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = Number(process.env.PORT || 8080)
const DATA_DIR = process.env.DATA_DIR || (fs.existsSync('/app/data') ? '/app/data' : path.join(__dirname, 'data'))
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
const DB_FILE = path.join(DATA_DIR, 'drodont-db.json')
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.gif': 'image/gif' }
const COLLECTIONS = { Patient: 'patients', ClinicalEntry: 'clinicalEntries', FollowUp: 'followUps', Odontogram: 'odontograms', Prescription: 'prescriptions', PrescriptionTemplate: 'prescriptionTemplates', SavedCase: 'savedCases', WeightEntry: 'weightEntries', XrayAnalysis: 'xrayAnalyses', Medication: 'medications' }

function emptyDb() { const db = { users: {}, tokens: {}, xrayCache: [] }; for (const k of Object.values(COLLECTIONS)) db[k] = []; return db }
function loadDb() { try { return { ...emptyDb(), ...JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) } } catch { return emptyDb() } }
function saveDb(db) { fs.mkdirSync(DATA_DIR, { recursive: true }); const tmp = DB_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(db)); fs.renameSync(tmp, DB_FILE) }
let db = loadDb()

function json(res, status, obj) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)) }
function readBody(req, maxBytes = 5_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = []
    req.on('data', (c) => { size += c.length; if (size > maxBytes) { reject(new Error('Corpo muito grande')); req.destroy(); return } chunks.push(c) })
    req.on('end', () => { const t = Buffer.concat(chunks).toString('utf-8'); if (!t) return resolve({}); try { resolve(JSON.parse(t)) } catch { reject(new Error('JSON inválido')) } })
    req.on('error', reject)
  })
}
function readRaw(req, maxBytes = 12_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = []
    req.on('data', (c) => { size += c.length; if (size > maxBytes) { reject(new Error('Arquivo muito grande')); req.destroy(); return } chunks.push(c) })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}
function hashPassword(p, s) { return crypto.scryptSync(p, s, 64).toString('hex') }
function authEmail(req) { const h = req.headers.authorization || ''; const t = h.startsWith('Bearer ') ? h.slice(7) : null; return t ? (db.tokens[t] || null) : null }
function sortList(list, sort) {
  if (!sort) return [...list]
  const desc = sort.startsWith('-'); const field = desc ? sort.slice(1) : sort
  return [...list].sort((a, b) => {
    const va = a[field], vb = b[field]
    if (va == null && vb == null) return 0; if (va == null) return 1; if (vb == null) return -1
    if (typeof va === 'number' && typeof vb === 'number') return desc ? vb - va : va - vb
    const c = String(va).localeCompare(String(vb)); return desc ? -c : c
  })
}
function applyFilter(list, filter) {
  if (!filter) return list
  let where = null; try { where = JSON.parse(filter) } catch { return list }
  return list.filter((item) => Object.entries(where).every(([k, v]) => item[k] === v))
}
function cleanBody(body) { const out = {}; for (const [k, v] of Object.entries(body || {})) { if (!['id', 'created_date', 'updated_date', 'created_by', 'created_by_id'].includes(k)) out[k] = v } return out }

const XRAY_PROMPT = `Você é um especialista em radiologia odontológica auxiliando um cirurgião-dentista em um sistema de suporte à decisão clínica (ODONTO-FBBR).
Analise a imagem de raio-x / radiografia odontológica fornecida e produza uma AVALIAÇÃO TÉCNICA ESTRUTURADA, em português do Brasil, com rigor clínico. Siga exatamente o esquema JSON solicitado.
Diretrizes: 1) Identifique o tipo de exame (periapical, panorâmica, interproximal/bite-wing, oclusal, etc.) e a região/anatomia visível. 2) Avalie a qualidade técnica (adequada? artefatos, superposição, contraste, posicionamento). 3) Liste cada achado por dente/região, com severidade (leve, moderada, severa) e confiança (alto, médio, baixo): cáries, lesões periapicais, perda óssea, restaurações, coroas, pinos, implantes, reabsorções, inclusos, cistos, fraturas, cálculo, espessamento do ligamento periodontal, etc. 4) Diagnóstico diferencial plausível. 5) Recomendações objetivas. 6) "solution": conduta por etapas e urgência (rotina, preferencial, urgente). 7) Sempre o disclaimer de que é suporte à decisão e não substitui o julgamento profissional. 8) Se NÃO for raio-x odontológico, informe em image_quality.issues e retorne findings vazio. 9) Não invente achados não visíveis; quando incerto, confiança baixa.
Responda SOMENTE com JSON válido, sem markdown, seguindo exatamente este esquema:
{"exam_type":"string","image_quality":{"adequate":true,"issues":"string"},"regions_observed":["string"],"findings":[{"tooth":"string","finding":"string","severity":"leve|moderada|severa|não aplicável","confidence":"alto|médio|baixo","description":"string"}],"differential":["string"],"recommendations":["string"],"solution":{"approach":"string","steps":["string"],"urgency":"rotina|preferencial|urgente"},"disclaimer":"string"}`

async function analyzeXrayWithGemini(buf, mimeType, patientContext) {
  // Melhorias grátis (2026-10-26): modelo padrão Flash-Lite (tier gratuito),
  // sem retry em cota: um 429 (quota esgotada) para na hora e devolve erro
  // em pt-BR, sem tentar outro modelo e sem gastar mais chamadas. Só o 404
  // (modelo descontinuado) cai para o gemini-3.8-flash.
  const models = [...new Set([GEMINI_MODEL, 'gemini-3.8-flash'])]
  let lastError = null
  for (const model of models) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
      body: JSON.stringify({ contents: [{ parts: [
        { text: XRAY_PROMPT + `\n\nContexto opcional do paciente (use apenas se relevante): ${patientContext || 'nenhum informado'}` },
        { inlineData: { mimeType, data: buf.toString('base64') } },
      ] }], generationConfig: { temperature: 0.2 } }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      lastError = new Error(data?.error?.message || `Gemini retornou ${res.status}`)
      if (res.status === 429) {
        // Cota: não tenta outro modelo. Mensagem clara, sem gastar mais.
        const retry = (data?.error?.message || '').match(/retry in ([0-9]+h[0-9]+m[0-9.]+s)/i)
        throw new Error(`Cota gratuita do Gemini esgotada${retry ? `, tente de novo em cerca de ${retry[1].replace(/\.[0-9]+s$/, 's')}` : ''}. Nenhuma outra chamada foi feita.`)
      }
      if (res.status !== 404 || model === models[models.length - 1]) break; continue
    }
    const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('')
    const clean = String(text).replace(/```json|```/g, '').trim()
    const start = clean.indexOf('{'), end = clean.lastIndexOf('}')
    try { return JSON.parse(start >= 0 && end > start ? clean.slice(start, end + 1) : clean) }
    catch { throw new Error('Gemini devolveu uma análise em formato inválido') }
  }
  throw lastError || new Error('Falha na IA')
}
function shiftDays(d, n) { const x = new Date(d + 'T00:00:00'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10) }

async function handleApi(req, res, url) {
  const pathname = url.pathname
  try {
    if (req.method === 'POST' && (pathname === '/api/auth/register' || pathname === '/api/auth/login')) {
      const body = await readBody(req)
      const email = String(body.email || '').trim().toLowerCase()
      const password = String(body.password || '')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { error: 'E-mail inválido' })
      if (password.length < 6) return json(res, 400, { error: 'A senha precisa ter pelo menos 6 caracteres' })
      if (pathname === '/api/auth/register') {
        if (db.users[email]) return json(res, 409, { error: 'Já existe uma conta com este e-mail. Entre com ela.' })
        const salt = crypto.randomBytes(16).toString('hex')
        db.users[email] = { salt, hash: hashPassword(password, salt), created_date: new Date().toISOString() }
      } else {
        const user = db.users[email]
        if (!user || user.hash !== hashPassword(password, user.salt)) return json(res, 401, { error: 'E-mail ou senha inválidos' })
      }
      const token = crypto.randomBytes(32).toString('hex'); db.tokens[token] = email; saveDb(db)
      return json(res, 200, { token, email })
    }
    if (req.method === 'GET' && pathname === '/api/auth/me') {
      const email = authEmail(req)
      if (!email || !db.users[email]) return json(res, 401, { error: 'Não autenticado' })
      return json(res, 200, { email, full_name: email.split('@')[0] })
    }
    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      const h = req.headers.authorization || ''
      if (h.startsWith('Bearer ')) { delete db.tokens[h.slice(7)]; saveDb(db) }
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathname === '/api/auth/reset-request') {
      await readBody(req).catch(() => ({}))
      return json(res, 200, { ok: true, email_enviado: false, aviso: 'Redefinição por e-mail ainda não está ativa nesta versão própria.' })
    }
    if (req.method === 'POST' && pathname === '/api/auth/reset') {
      return json(res, 400, { error: 'Token de redefinição inválido ou expirado. A redefinição por e-mail ainda não está ativa.' })
    }

    const entityMatch = pathname.match(/^\/api\/entities\/([A-Za-z]+)(?:\/([^/]+))?$/)
    if (entityMatch) {
      const name = entityMatch[1], id = entityMatch[2], key = COLLECTIONS[name]
      if (!key) return json(res, 404, { error: 'Entidade desconhecida' })
      const email = authEmail(req), isMedication = name === 'Medication'
      if (!isMedication && !email) return json(res, 401, { error: 'Entre com sua conta para acessar pacientes e prontuários.' })
      const owned = (list) => isMedication ? list : list.filter((x) => x.created_by === email)
      if (req.method === 'GET' && !id) {
        let list = sortList(applyFilter(owned(db[key]), url.searchParams.get('filter')), url.searchParams.get('sort'))
        const limit = Number(url.searchParams.get('limit') || 0)
        if (limit > 0) list = list.slice(0, limit)
        return json(res, 200, list)
      }
      if (req.method === 'GET' && id) {
        const item = owned(db[key]).find((x) => x.id === id)
        return item ? json(res, 200, item) : json(res, 404, { error: 'Não encontrado' })
      }
      if (req.method === 'POST' && !id) {
        const body = await readBody(req)
        if (name === 'Patient' && !body.name) return json(res, 400, { error: 'Nome do paciente é obrigatório' })
        if (name === 'XrayAnalysis' && !body.patient_name) return json(res, 400, { error: 'Nome do paciente é obrigatório' })
        const now = new Date().toISOString()
        const item = { ...cleanBody(body), id: crypto.randomUUID(), created_date: now, updated_date: now, created_by: email, created_by_id: email }
        db[key].unshift(item); saveDb(db)
        return json(res, 201, item)
      }
      if (req.method === 'PUT' && id) {
        const item = owned(db[key]).find((x) => x.id === id)
        if (!item) return json(res, 404, { error: 'Não encontrado' })
        Object.assign(item, cleanBody(await readBody(req)), { updated_date: new Date().toISOString() }); saveDb(db)
        return json(res, 200, item)
      }
      if (req.method === 'DELETE' && id) {
        const before = db[key].length
        db[key] = db[key].filter((x) => !(x.id === id && (isMedication || x.created_by === email)))
        if (db[key].length === before) return json(res, 404, { error: 'Não encontrado' })
        saveDb(db); return json(res, 200, { ok: true })
      }
      return json(res, 405, { error: 'Método não permitido' })
    }

    if (req.method === 'POST' && pathname === '/api/ai/xray') {
      const email = authEmail(req)
      if (!email) return json(res, 401, { error: 'Entre com sua conta para analisar um raio-x.' })
      const body = await readBody(req)
      const imageUrl = String(body.image_url || ''), patientContext = String(body.patient_context || '')
      if (!imageUrl.startsWith('/uploads/')) return json(res, 400, { error: 'Envie a imagem pelo upload do próprio sistema (/uploads/*). URLs externas não são aceitas.' })
      const filePath = path.join(UPLOAD_DIR, path.basename(decodeURIComponent(imageUrl)))
      if (!fs.existsSync(filePath)) return json(res, 404, { error: 'Imagem não encontrada. Envie novamente.' })
      // Cache grátis: mesma imagem + mesmo contexto, mesmo usuário, não
      // gasta cota de novo. O cache vale mesmo sem chave ativa, porque
      // nenhum chamado ao Gemini é feito nesse caso.
      const imageBytes = fs.readFileSync(filePath)
      const cacheKey = crypto.createHash('sha256').update(imageBytes).update('|').update(patientContext.trim().toLowerCase()).digest('hex')
      const cached = (db.xrayCache || []).find((c) => c.created_by === email && c.key === cacheKey)
      if (cached) return json(res, 200, { analysis: cached.analysis, cached: true, ia_configurada: Boolean(GEMINI_KEY), provedor: 'gemini', modelo: GEMINI_MODEL })
      if (!GEMINI_KEY) return json(res, 503, { error: 'IA não configurada neste servidor. Configure GEMINI_API_KEY nas variáveis da Railway para ligar a análise de raio-x. Nenhum achado foi inventado.' })
      const mime = TYPES[path.extname(filePath).toLowerCase()] || 'image/jpeg'
      try {
        const analysis = await analyzeXrayWithGemini(imageBytes, mime, patientContext)
        db.xrayCache = db.xrayCache || []
        db.xrayCache.unshift({ key: cacheKey, created_by: email, analysis, created_date: new Date().toISOString() })
        if (db.xrayCache.length > 500) db.xrayCache = db.xrayCache.slice(0, 500)
        saveDb(db)
        return json(res, 200, { analysis, cached: false, ia_configurada: true, provedor: 'gemini', modelo: GEMINI_MODEL })
      } catch (e) { return json(res, 502, { error: `Falha na análise com Gemini: ${e.message}` }) }
    }

    if (req.method === 'POST' && pathname === '/api/functions/sendFollowUpReminders') {
      const email = authEmail(req)
      if (!email) return json(res, 401, { error: 'Entre com sua conta para listar os retornos.' })
      const today = new Date().toISOString().slice(0, 10)
      const due = db.followUps.filter((f) => f.created_by === email && f.status === 'agendado' && f.scheduled_date && f.scheduled_date >= shiftDays(today, -14) && f.scheduled_date <= shiftDays(today, 3))
      due.sort((a, b) => String(a.scheduled_date).localeCompare(String(b.scheduled_date)))
      return json(res, 200, { ok: true, due_count: due.length, professionals_notified: 0, run_date: today, due, email_enviado: false, aviso: 'O envio diário por e-mail ainda não está ativo nesta versão própria (não há SMTP configurado). Nada foi marcado como lembrado; use esta lista para acompanhar manualmente.' })
    }

    if (req.method === 'POST' && pathname === '/api/upload') {
      const email = authEmail(req)
      if (!email) return json(res, 401, { error: 'Entre com sua conta para enviar arquivos.' })
      const contentType = req.headers['content-type'] || ''
      const bm = contentType.match(/boundary=(.+)$/)
      if (!bm) return json(res, 400, { error: 'Envie o arquivo como multipart/form-data' })
      const boundary = bm[1].trim()
      const raw = await readRaw(req)
      const headerEnd = raw.indexOf('\r\n\r\n')
      if (headerEnd < 0) return json(res, 400, { error: 'Upload inválido' })
      const header = raw.slice(0, headerEnd).toString('utf-8')
      const fm = header.match(/filename="([^"]*)"/)
      const ext = path.extname(fm ? fm[1] : 'arquivo').toLowerCase().replace(/[^a-z0-9.]/g, '') || '.bin'
      if (!['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) return json(res, 400, { error: 'Tipo de arquivo não permitido (use imagem)' })
      const endMarker = Buffer.from(`\r\n--${boundary}`)
      const end = raw.lastIndexOf(endMarker)
      if (end < 0) return json(res, 400, { error: 'Upload inválido' })
      const fileData = raw.slice(headerEnd + 4, end)
      if (fileData.length > 10_000_000) return json(res, 400, { error: 'Arquivo maior que 10 MB' })
      fs.mkdirSync(UPLOAD_DIR, { recursive: true })
      const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
      fs.writeFileSync(path.join(UPLOAD_DIR, name), fileData)
      return json(res, 200, { file_url: `/uploads/${name}` })
    }
    return json(res, 404, { error: 'Rota da API não encontrada' })
  } catch (e) { return json(res, 400, { error: e.message || 'Requisição inválida' }) }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/health') {
    const counts = {}
    for (const [name, key] of Object.entries(COLLECTIONS)) counts[name] = db[key].length
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, app: 'drodont', ia_configurada: Boolean(GEMINI_KEY), provedor: GEMINI_KEY ? 'gemini' : 'nenhum', modelo: GEMINI_MODEL, data_dir: DATA_DIR, ...counts }))
    return
  }
  if (url.pathname.startsWith('/api/')) { await handleApi(req, res, url); return }
  if (url.pathname.startsWith('/uploads/')) {
    const filePath = path.join(UPLOAD_DIR, path.basename(decodeURIComponent(url.pathname)))
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Não encontrado'); return }
    res.writeHead(200, { 'content-type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
    fs.createReadStream(filePath).pipe(res); return
  }
  let filePath = path.join(DIST, decodeURIComponent(url.pathname))
  if (!filePath.startsWith(DIST)) { res.writeHead(403); res.end('Forbidden'); return }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) filePath = path.join(DIST, 'index.html')
  res.writeHead(200, { 'content-type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
})
server.listen(PORT, () => { console.log(`drodont ouvindo na porta ${PORT} (dados em ${DATA_DIR}, IA configurada: ${Boolean(GEMINI_KEY)} (provedor gemini))`) })
