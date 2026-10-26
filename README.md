# drodont (ODONTO-FBBR) — versão própria

App adaptado de um export do Base44 para hospedagem própria, sem SDK
Base44 e sem voltar ao Base44.

Frontend Vite + React + Tailwind. Backend próprio sem dependências em
`server.mjs`: serve `dist/` com fallback SPA e API em `/api/*`.

## O que o app faz

Central de ferramentas clínicas de suporte à decisão em odontologia:
calculadora de medicamentos, CIAP/CID/SIGTAP, urgências, laserterapia,
receituários, interações, apostilas, painel clínico, pacientes,
prontuários, odontograma e análise de raio-x por IA.

## Backend próprio

- Auth local: e-mail + senha (scrypt, token aleatório). Sem login Google,
  sem OTP por e-mail. Redefinição por e-mail ainda não existe; a página
  de esqueci a senha diz isso abertamente.
- Entidades: Patient, ClinicalEntry, FollowUp, Odontogram, Prescription,
  PrescriptionTemplate, SavedCase, WeightEntry, XrayAnalysis, Medication.
- Dados em `DATA_DIR` (ou `/app/data` se existir, ou `./data`). Com volume
  montado em `/app/data` na Railway, os dados sobrevivem a redeploys.
  Sem volume, os dados somem a cada deploy.
- Pacientes e prontuários: a API só devolve e só permite criar/alterar
  registros do próprio usuário logado (a base de medicamentos, estática,
  é pública). Calculadoras e consultas de códigos funcionam sem login;
  pacientes, painel e raio-x exigem conta — o aviso aparece nessas
  páginas quando não há login.
- Upload: imagens de raio-x em `/uploads/` (10 MB no máximo, só imagem).
- Lembretes de retorno: o endpoint
  `POST /api/functions/sendFollowUpReminders` lista os retornos
  vencidos há até 14 dias ou previstos em até 3 dias, mas **não envia
  e-mail** (não há SMTP configurado) e não marca nada como lembrado.
  O envio diário por e-mail é pendência, não está ativo.

## IA: só Gemini, sem OpenAI

A análise de raio-x usa o Gemini (modelo `gemini-3.5-flash-lite` por padrão, o modelo do tier gratuito, com
fallback para `gemini-3.8-flash` só se o configurado der 404), pela API nativa
do Gemini, com a imagem enviada em base64 e o mesmo esquema JSON
estruturado do original (tipo de exame, qualidade, achados com
severidade e confiança, diferencial, conduta e urgência).

- Com `GEMINI_API_KEY` configurada, a análise funciona de verdade.
- Sem chave, o servidor devolve erro honesto ("IA não configurada")
  em vez de inventar achados — nunca inventar achado clínico.
- Nenhuma chamada vai para a OpenAI e nenhuma variável `OPENAI_*` é lida.
- A análise é suporte à decisão e não substitui o julgamento
  profissional; o disclaimer vem na própria resposta.

## Rodar local

```bash
npm install
npm run build
node server.mjs   # http://localhost:8080, /health em /health
```

Variáveis: `PORT`, `DATA_DIR`, `GEMINI_API_KEY`, `GEMINI_MODEL`.

## Deploy

Dockerfile + `railway.json` (builder DOCKERFILE). Na Railway, anexar
um volume em `/app/data` e definir `GEMINI_API_KEY` para ligar a
análise de raio-x. Dados antigos do Base44 não vieram no ZIP e começam
vazios — é preciso recadastrar pacientes e modelos.
