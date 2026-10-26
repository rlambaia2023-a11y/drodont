// =============================================================================
// PROTOCOLOS DE FOTOBIOMODULAÇÃO (LASERTERAPIA) — REFERÊNCIA
// =============================================================================
// Parâmetros de referência para laserterapia de baixa potência (PBM) em
// odontologia. Apoiam a decisão do profissional — NÃO substituem o protocolo
// do fabricante nem a avaliação clínica. Ajuste conforme o equipamento e a
// resposta do paciente.
// =============================================================================

export const LASER_VERSION = "1.0.0";
export const LASER_REVIEW_DATE = "2026-10-06";
export const LASER_DISCLAIMER =
  "Parâmetros de fotobiomodulação de referência. Ajuste conforme o equipamento e a resposta do paciente. Não substitui o protocolo do fabricante nem a avaliação profissional.";

export const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "cicatrizacao", label: "Cicatrização" },
  { id: "analgesia", label: "Analgesia" },
  { id: "mucosite", label: "Mucosite" },
  { id: "atm", label: "ATM / dor orofacial" },
  { id: "hipersensibilidade", label: "Hipersensibilidade" },
  { id: "aftas", label: "Úlceras / aftas" },
];

export const protocols = [
  {
    id: "mucosite-radioterapia",
    name: "Mucosite oral por radioterapia",
    category: "mucosite",
    laser_type: "red",
    wavelength_nm: "660 nm",
    summary:
      "Prevenção e tratamento da mucosite oral em pacientes sob radioterapia de cabeça e pescoço.",
    indications: [
      "Prevenção de mucosite oral antes/início da radioterapia",
      "Tratamento de mucosite grau I–III",
      "Redução da dor e melhora da deglutição",
    ],
    parameters: {
      power_mw: 100,
      energy_per_point_j: 2,
      time_per_point_s: 20,
      spot_size_mm2: 4,
      points: "Múltiplos pontos pela mucosa afetada",
      sessions: "Durante toda a RT",
      interval_days: "Diária ou 3x/semana",
      technique:
        "Aplicação pontual ou escaneamento na mucosa oral, iniciando antes da radioterapia.",
    },
    contraindications: [
      "Lesões malignas ativas na área de aplicação",
      "Precaução em gestantes",
    ],
    eye_protection:
      "Óculos de proteção específico para 660 nm (vermelho) para paciente e operador.",
    notes:
      "Não aplicar sobre a tireoide nem diretamente sobre os olhos. Ajustar energia conforme tolerância.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
  {
    id: "aftas-ulceras",
    name: "Úlceras aftosas e traumáticas",
    category: "aftas",
    laser_type: "red",
    wavelength_nm: "660 nm",
    summary: "Redução de dor e cicatrização de aftas e úlceras traumáticas da mucosa.",
    indications: [
      "Úlceras aftosas recorrentes",
      "Úlceras traumáticas da mucosa",
      "Lesões de mucosa em cicatrização",
    ],
    parameters: {
      power_mw: 60,
      energy_per_point_j: 1.5,
      time_per_point_s: 25,
      spot_size_mm2: 4,
      points: "1–4 pontos ao redor e sobre a lesão",
      sessions: "1–3 sessões",
      interval_days: "48h",
      technique:
        "Aplicação pontual circundando a lesão; limpar o tecido necrótico antes da aplicação.",
    },
    contraindications: [
      "Lesões com suspeita de malignidade — encaminhar para biópsia",
    ],
    eye_protection: "Óculos de proteção para 660 nm (vermelho).",
    notes: "Higienizar a lesão antes da aplicação.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
  {
    id: "cicatrizacao-pos-exodontia",
    name: "Cicatrização pós-operatória (exodontia)",
    category: "cicatrizacao",
    laser_type: "ir",
    wavelength_nm: "830 nm",
    summary:
      "Aceleração da cicatrização e redução do edema pós-exodontia e cirurgias mucosas.",
    indications: [
      "Pós-operatório de exodontia simples ou cirúrgica",
      "Cirurgias de mucosa e enxertos",
      "Redução de edema e dor pós-cirúrgica",
    ],
    parameters: {
      power_mw: 100,
      energy_per_point_j: 3,
      time_per_point_s: 30,
      spot_size_mm2: 4,
      points: "3–6 pontos no alvéolo e margens",
      sessions: "1–3 sessões",
      interval_days: "48–72h",
      technique:
        "Aplicação pontual no leito cirúrgico imediatamente após o procedimento e nas revisões.",
    },
    contraindications: [
      "Infecção aguda não drenada — tratar o foco primeiro",
      "Hemorragia ativa não controlada",
    ],
    eye_protection: "Óculos de proteção para 780–830 nm (infravermelho).",
    notes: "Aplicar imediatamente após o procedimento otimiza o efeito biomodulador.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
  {
    id: "analgesia-pos-operatoria",
    name: "Analgesia pós-operatória",
    category: "analgesia",
    laser_type: "ir",
    wavelength_nm: "830 nm",
    summary: "Controle da dor pós-operatória por efeito analgésico e anti-inflamatório.",
    indications: [
      "Dor pós-cirúrgica odontológica",
      "Dor pós-instrumentação endodôntica",
    ],
    parameters: {
      power_mw: 100,
      energy_per_point_j: 2.5,
      time_per_point_s: 25,
      spot_size_mm2: 4,
      points: "3–5 pontos no local cirúrgico",
      sessions: "1–2 sessões",
      interval_days: "48h",
      technique: "Aplicação pontual no sítio cirúrgico e pontos de dor referida.",
    },
    contraindications: ["Dor de causa não esclarecida — investigar antes"],
    eye_protection: "Óculos de proteção para 780–830 nm (infravermelho).",
    notes: "Complementar, não substituir, a analgesia sistêmica quando necessária.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
  {
    id: "hipersensibilidade-dentinaria",
    name: "Hipersensibilidade dentinária",
    category: "hipersensibilidade",
    laser_type: "ir",
    wavelength_nm: "830 nm",
    summary: "Redução da hipersensibilidade cervical por biomodulação pulpar.",
    indications: [
      "Hipersensibilidade cervical",
      "Sensibilidade pós-clareamento",
    ],
    parameters: {
      power_mw: 60,
      energy_per_point_j: 1.5,
      time_per_point_s: 25,
      spot_size_mm2: 4,
      points: "1 ponto por face sensível",
      sessions: "2–4 sessões",
      interval_days: "48–72h",
      technique: "Aplicação pontual na face vestibular cervical do dente afetado.",
    },
    contraindications: [
      "Cárie ativa — tratar antes",
      "Fratura coronária com exposição pulpar",
    ],
    eye_protection: "Óculos de proteção para 780–830 nm (infravermelho).",
    notes: "Avaliar e excluir causa patológica antes do tratamento sintomático.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
  {
    id: "atm-dor-orofacial",
    name: "Desordem temporomandibular / dor orofacial",
    category: "atm",
    laser_type: "ir",
    wavelength_nm: "830 nm",
    summary: "Alívio da dor muscular e articular em desordens temporomandibulares.",
    indications: [
      "Dor muscular mastigatória (mialgia)",
      "Dor articular (capsulite, artralgia)",
      "Disfunção temporomandibular com dor",
    ],
    parameters: {
      power_mw: 100,
      energy_per_point_j: 3,
      time_per_point_s: 30,
      spot_size_mm2: 4,
      points: "3–6 pontos musculares e articulares",
      sessions: "6–10 sessões",
      interval_days: "2x/semana",
      technique:
        "Aplicação pontual nos pontos gatilho e na ATM, com a mandíbula em repouso.",
    },
    contraindications: [
      "Infecção ou neoplasia na área",
      "Dor de causa não esclarecida — investigar",
    ],
    eye_protection:
      "Óculos de proteção para 780–830 nm (infravermelho) para paciente e operador.",
    notes:
      "Associar orientação de autocuidado, fisioterapia e placa miorrelaxante quando indicado.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
  {
    id: "parestesia-neuralgia",
    name: "Parestesia / neuralgia pós-operatória",
    category: "analgesia",
    laser_type: "ir",
    wavelength_nm: "830 nm",
    summary: "Estímulo à regeneração neural em parestesias pós-cirúrgicas.",
    indications: [
      "Parestesia pós-cirúrgica (ex.: exodontia de terceiros)",
      "Neuralgia pós-operatória",
    ],
    parameters: {
      power_mw: 100,
      energy_per_point_j: 3,
      time_per_point_s: 30,
      spot_size_mm2: 4,
      points: "Pontos no trajeto do nervo afetado",
      sessions: "6–12 sessões",
      interval_days: "2–3x/semana",
      technique: "Aplicação ao longo do trajeto do nervo na área de parestesia.",
    },
    contraindications: [
      "Causa não esclarecida — investigar antes",
      "Lesão neurológica central",
    ],
    eye_protection: "Óculos de proteção para 780–830 nm (infravermelho).",
    notes: "Quanto mais precoce o início, melhor o prognóstico. Encaminhar se não houver melhora.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
  {
    id: "queilite-lesao-mucosa",
    name: "Queilite e lesões de mucosa",
    category: "aftas",
    laser_type: "red",
    wavelength_nm: "660 nm",
    summary: "Cicatrização de queilites e lesões ulceradas de lábio e mucosa.",
    indications: [
      "Queilite angular",
      "Queilite exfoliativa",
      "Lesões ulceradas de lábio",
    ],
    parameters: {
      power_mw: 60,
      energy_per_point_j: 1.5,
      time_per_point_s: 25,
      spot_size_mm2: 4,
      points: "2–4 pontos na lesão",
      sessions: "2–4 sessões",
      interval_days: "48h",
      technique: "Aplicação pontual sobre a lesão, com o lábio em repouso.",
    },
    contraindications: [
      "Lesão com suspeita de malignidade — encaminhar",
      "Queilite angular fúngica sem tratamento",
    ],
    eye_protection: "Óculos de proteção para 660 nm (vermelho).",
    notes: "Tratar a causa subjacente (mordida, infecção) associadamente.",
    source: "Protocolo de fotobiomodulação em odontologia (referência)",
  },
];

export function getLaserProtocolById(id) {
  return protocols.find((p) => p.id === id) || null;
}

export function filterLaserByCategory(categoryId) {
  if (!categoryId || categoryId === "all") return protocols;
  return protocols.filter((p) => p.category === categoryId);
}