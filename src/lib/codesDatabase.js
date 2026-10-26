// =============================================================================
// BASE DE CÓDIGOS CIAP-2 / CID-10 / SIGTAP — REFERÊNCIA
// =============================================================================
// AVISO CRÍTICO: Todos os códigos, descrições, categorias, sinônimos, versões
// e vigências abaixo são FICTÍCIOS ou ilustrativos, criados exclusivamente para
// demonstração de arquitetura. NÃO correspondem a terminologias oficiais
// atualizadas, NÃO foram validados contra as fontes oficiais e NÃO devem ser
// usados para registro clínico/prontuário real. Nenhum dado aqui tem validade
// regulatória.
//
// Em produção, esta base seria substituída por terminologias licenciadas e
// atualizadas (CIAP-2, CID-10/SIGTAP do DATASUS) com controle de versão e
// vigência por responsáveis credenciados.
// =============================================================================

export const CODES_BASE_VERSION = "demo-0.1.0-ficticia";
export const CODES_BASE_REVIEW_DATE = "2026-10-01";
export const CODES_BASE_DISCLAIMER =
  "Base de códigos fictícia para demonstração de arquitetura. Não habilitada para registro clínico real.";

export const CODE_SYSTEMS = {
  CIAP2: {
    id: "CIAP-2",
    label: "CIAP-2",
    fullLabel: "Classificação Internacional de Atenção Primária",
    origin: "WONCA / adaptações brasileiras",
    version: "2ª edição (demo)",
    accent: "sky",
  },
  CID10: {
    id: "CID-10",
    label: "CID-10",
    fullLabel: "Classificação Internacional de Doenças, 10ª revisão",
    origin: "OMS / versão brasileira",
    version: "10ª revisão (demo)",
    accent: "violet",
  },
  SIGTAP: {
    id: "SIGTAP",
    label: "SIGTAP",
    fullLabel: "Sistema de Gerenciamento da Tabela de Procedimentos",
    origin: "DATASUS / SUS",
    version: "Tabela unificada (demo)",
    accent: "emerald",
  },
};

// -----------------------------------------------------------------------------
// REGISTROS DE CÓDIGOS (fictícios / ilustrativos, foco em odontologia)
// -----------------------------------------------------------------------------
const codes = [
  // ---- CIAP-2 ----
  {
    system: "CIAP-2",
    code: "D19",
    description: "Dor dentária / dente",
    short_description: "Dor de dente",
    category: "Aparelho digestivo (D)",
    synonyms: ["odontalgia", "dor de dente", "dor dentária"],
    validity: "vigente",
  },
  {
    system: "CIAP-2",
    code: "D20",
    description: "Doença/cárie dentária",
    short_description: "Cárie dentária",
    category: "Aparelho digestivo (D)",
    synonyms: ["cárie", "lesão cariosa", "cárie do esmalte"],
    validity: "vigente",
  },
  {
    system: "CIAP-2",
    code: "D21",
    description: "Doença da polpa / tecidos periapicais",
    short_description: "Problema pulpar",
    category: "Aparelho digestivo (D)",
    synonyms: ["pulpite", "abscesso periapical", "lesão periapical"],
    validity: "vigente",
  },
  {
    system: "CIAP-2",
    code: "D22",
    description: "Gengivite / doença periodontal",
    short_description: "Doença periodontal",
    category: "Aparelho digestivo (D)",
    synonyms: ["gengivite", "periodontite", "sangramento gengival"],
    validity: "vigente",
  },
  {
    system: "CIAP-2",
    code: "D23",
    description: "Edentulismo parcial",
    short_description: "Perda de dente",
    category: "Aparelho digestivo (D)",
    synonyms: ["ausência de dente", "dente ausente", "reabilitação"],
    validity: "vigente",
  },
  {
    system: "CIAP-2",
    code: "D24",
    description: "Trauma dentário / facial",
    short_description: "Trauma dental",
    category: "Aparelho digestivo (D)",
    synonyms: ["fratura dental", "avulsão", "luxação dental"],
    validity: "vigente",
  },
  {
    system: "CIAP-2",
    code: "D25",
    description: "Lesão da mucosa oral",
    short_description: "Lesão bucal",
    category: "Aparelho digestivo (D)",
    synonyms: ["úlcera bucal", "afta", "lesão de mucosa", "leucoplasia"],
    validity: "vigente",
  },
  {
    system: "CIAP-2",
    code: "D95",
    description: "Outro problema dentário / bucal definido",
    short_description: "Outro problema dental",
    category: "Aparelho digestivo (D)",
    synonyms: ["outro", "especificado"],
    validity: "vigente",
  },

  // ---- CID-10 ----
  {
    system: "CID-10",
    code: "K02",
    description: "Cárie dentária",
    short_description: "Cárie dentária",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["cárie", "lesão cariosa"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K02.0",
    description: "Cárie limitada ao esmalte",
    short_description: "Cárie de esmalte",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["cárie incipiente", "mancha branca"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K02.1",
    description: "Cárie da dentina",
    short_description: "Cárie de dentina",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["cárie profunda"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K04",
    description: "Doenças da polpa e dos tecidos periapicais",
    short_description: "Doença pulpar / periapical",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["pulpite", "abscesso periapical", "granuloma"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K04.0",
    description: "Pulpite",
    short_description: "Pulpite",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["inflamação da polpa", "dor pulpar espontânea"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K05",
    description: "Gengivite e doenças periodontais",
    short_description: "Doença periodontal",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["gengivite", "periodontite"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K05.1",
    description: "Gengivite crônica",
    short_description: "Gengivite crônica",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["inflamação gengival crônica"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K08.1",
    description: "Perda de dente devido a acidente, extração ou doença periodontal",
    short_description: "Perda de dente",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["edentulismo", "dente ausente"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "K12",
    description: "Estomatite e lesões afins",
    short_description: "Estomatite",
    category: "Capítulo XI — Aparelho digestivo (K00–K93)",
    synonyms: ["inflamação da mucosa bucal", "estomatite aftosa"],
    validity: "vigente",
  },
  {
    system: "CID-10",
    code: "S02.5",
    description: "Fratura de dente",
    short_description: "Fratura dental",
    category: "Capítulo XIX — Lesões, envenenamentos (S00–T98)",
    synonyms: ["fratura coronária", "fratura radicular", "trauma dental"],
    validity: "vigente",
  },

  // ---- SIGTAP ----
  {
    system: "SIGTAP",
    code: "04.01.01.001-2",
    description: "Consulta / exame clínico odontológico",
    short_description: "Exame clínico odontológico",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["consulta odontológica", "avaliação bucal"],
    validity: "vigente",
  },
  {
    system: "SIGTAP",
    code: "04.01.01.012-8",
    description: "Aplicação de flúor tópico",
    short_description: "Aplicação de flúor",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["flúor tópico", "aplicação tópica de flúor"],
    validity: "vigente",
  },
  {
    system: "SIGTAP",
    code: "04.01.01.025-0",
    description: "Raspagem coronária e alisamento",
    short_description: "Raspagem / alisamento coronário",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["profilaxia", "raspagem supragengival"],
    validity: "vigente",
  },
  {
    system: "SIGTAP",
    code: "04.01.01.030-7",
    description: "Restauração de dente temporário",
    short_description: "Restauração temporária",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["restauração provisória", "obturação temporária"],
    validity: "vigente",
  },
  {
    system: "SIGTAP",
    code: "04.01.01.045-4",
    description: "Exodontia de dente permanente",
    short_description: "Exodontia",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["extração dental", "avulsão cirúrgica"],
    validity: "vigente",
  },
  {
    system: "SIGTAP",
    code: "04.01.01.052-9",
    description: "Tratamento endodôntico — dente unirradicular",
    short_description: "Tratamento de canal",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["endodontia", "tratamento de canal"],
    validity: "vigente",
  },
  {
    system: "SIGTAP",
    code: "04.01.01.060-0",
    description: "Raspagem e alisamento radicular (por quadrante)",
    short_description: "Raspagem radicular",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["raspagem subgengival", "alisamento radicular"],
    validity: "vigente",
  },
  {
    system: "SIGTAP",
    code: "04.01.01.078-3",
    description: "Drenagem de abscesso periapical",
    short_description: "Drenagem de abscesso",
    category: "Procedimentos clínicos odontológicos",
    synonyms: ["drenagem", "abscesso odontogênico"],
    validity: "vigente",
  },
];

// -----------------------------------------------------------------------------
// ACESSO
// -----------------------------------------------------------------------------
export function getAllCodes() {
  return codes;
}

export function searchCodes(query, systemFilter = "ALL") {
  const q = (query || "").trim().toLowerCase();
  return codes.filter((c) => {
    if (systemFilter !== "ALL" && c.system !== systemFilter) return false;
    if (!q) return true;
    const haystack = [
      c.code,
      c.description,
      c.short_description,
      c.category,
      ...(c.synonyms || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getCodeKey(c) {
  return `${c.system}::${c.code}`;
}