# drodont (ODONTO-FBBR)

App adaptado de um export do Base44 para hospedagem própria. Sem SDK
Base44, sem `base44 dev`, sem retorno ao Base44.

Frontend Vite + React + Tailwind. Backend próprio sem dependências em
`server.mjs`: serve `dist/` com fallback SPA e API em `/api/*` (auth
local, entidades Patient/ClinicalEntry/FollowUp/Odontogram/Prescription/
PrescriptionTemplate/SavedCase/WeightEntry/XrayAnalysis/Medication,
upload, IA).

O arquivo `src/api/base44Client.js` é só um adaptador com o mesmo formato
que as páginas já usavam; ele chama a API própria, não o Base44.

Dados em DATA_DIR ou `/app/data` (volume na Railway). Sem volume, os
dados somem a cada redeploy. Entidades de pacientes/prontuários só
devolvem registros do próprio usuário logado; Medication é pública.

IA: só Gemini, sem OpenAI. Raio-x por Gemini Vision
(gemini-3.8-flash, imagem em base64, esquema JSON estruturado); sem
GEMINI_API_KEY, erro honesto, sem inventar achado clínico. Lembretes de
retorno: endpoint lista os vencimentos, mas não envia e-mail (sem SMTP)
e não marca como lembrado.

Login local: e-mail + senha (scrypt). Sem login Google, sem OTP por
e-mail. Redefinição de senha por e-mail ainda não existe; a página de
esqueci a senha diz isso abertamente.

Deploy: Dockerfile + railway.json, serviço `drodont` na Railway.
