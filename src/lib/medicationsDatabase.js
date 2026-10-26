// =============================================================================
// BASE DE MEDICAMENTOS — VALORES DE REFERÊNCIA
// =============================================================================
// AVISO: Os medicamentos, princípios ativos, concentrações e doses abaixo são
// valores de referência de fontes padrão (bulas e consensos de farmacologia
// odontológica). O sistema apoia o julgamento profissional e NÃO substitui a
// bula vigente nem o julgamento profissional.
// Confirme sempre a bula oficial atualizada antes de prescrever.
//
// Em produção, esta base deve ser revista e versionada por responsáveis
// clínicos credenciados, com controle de vigência por medicamento.
// =============================================================================

import { base44 } from "@/api/base44Client";

export const BASE_VERSION = "1.0.0";
export const BASE_REVIEW_DATE = "2026-10-06";
export const BASE_DISCLAIMER =
  "Base de medicamentos com valores de referência de fontes padrão. Apoia o julgamento profissional — confirme sempre a bula vigente antes de prescrever.";

// Tipos de regime suportados pelo motor
// - "fixed": dose fixa por tomada (independente de peso)
// - "per_kg_per_dose": dose por kg POR TOMADA
// - "per_kg_per_day": dose por kg POR DIA (dividida em N tomadas)
export const REGIME_TYPES = {
  FIXED: "fixed",
  PER_KG_PER_DOSE: "per_kg_per_dose",
  PER_KG_PER_DAY: "per_kg_per_day",
};

// Tipos de alerta de segurança
export const ALERT_LEVELS = {
  INFO: "info",
  REVIEW: "review",
  BLOCK: "block",
};

// -----------------------------------------------------------------------------
// MONOGRAFIAS VERSIONADAS (referência)
// -----------------------------------------------------------------------------
const monographs = {
  "mon-amoxicilina-v01": {
    id: "mon-amoxicilina-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Amoxicilina",
      "Antimicrobianos em Odontologia — consenso ABON",
      "Guia de prescrição antimicrobiana odontológica",
    ],
    validity: "vigente",
    notes:
      "Valores de referência de fontes padrão. Confira a bula vigente.",
  },
  "mon-amox-clav-v01": {
    id: "mon-amox-clav-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Amoxicilina + Ácido clavulânico",
      "Antimicrobianos em Odontologia — consenso ABON",
    ],
    validity: "vigente",
  },
  "mon-clindamicina-v01": {
    id: "mon-clindamicina-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Clindamicina",
      "Antimicrobianos em Odontologia — consenso ABON",
      "Recomendação de profilaxia/uso de antibióticos em odontologia",
    ],
    validity: "vigente",
  },
  "mon-metronidazol-v01": {
    id: "mon-metronidazol-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Metronidazol",
      "Antimicrobianos em Odontologia — consenso ABON",
    ],
    validity: "vigente",
  },
  "mon-ibuprofeno-v01": {
    id: "mon-ibuprofeno-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Ibuprofeno",
      "Protocolo de analgesia pós-operatória em odontologia",
    ],
    validity: "vigente",
  },
  "mon-paracetamol-v01": {
    id: "mon-paracetamol-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Paracetamol",
      "Protocolo de analgesia pós-operatória em odontologia",
    ],
    validity: "vigente",
  },
  "mon-dexametasona-v01": {
    id: "mon-dexametasona-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Dexametasona",
      "Protocolo de manejo pós-cirúrgico em odontologia",
    ],
    validity: "vigente",
  },
  "mon-lidocaina-v01": {
    id: "mon-lidocaina-v01",
    version: "1.0.0",
    review_date: "2026-10-06",
    author: "Equipe clínica DoseCerta",
    references: [
      "Bula padrão — Lidocaína 2% com adrenalina",
      "Manual de anestésicos locais em odontologia",
      "Recomendações para uso de vasoconstritores em pacientes de risco",
    ],
    validity: "vigente",
  },
};

// -----------------------------------------------------------------------------
// MEDICAMENTOS (referência)
// -----------------------------------------------------------------------------
export const medications = [
  // ---- Amoxicilina ----
  {
    id: "med-amoxicilina-500",
    name: "Amoxicilina 500 mg",
    active_ingredients: [
      { name: "amoxicilina", synonyms: ["amoxil", "amoxicil", "amoxilina"] },
    ],
    monograph_id: "mon-amoxicilina-v01",
    is_combination: false,
    indications: [
      {
        id: "ind-amox-infec-dental",
        label: "Infecção dentária / abscesso odontogênico",
        populations: ["adult", "pediatric"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.FIXED,
            dose_per_dose_mg: 500,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: null,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: 1000,
            max_per_day_mg: 4000,
            duration_days: 7,
            requires_weight: false,
            min_age_years: 18,
            max_age_years: null,
            rounding: "round_to_nearest_250",
            allow_presentation_conversion: true,
            notes: "Adulto: 500 mg 8/8h. Em infecções graves, até 1 g 8/8h (máx. 4 g/dia).",
          },
          {
            population: "pediatric",
            regime_type: REGIME_TYPES.PER_KG_PER_DAY,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: 40,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: 500,
            max_per_day_mg: 1500,
            duration_days: 7,
            requires_weight: true,
            min_age_years: 1,
            max_age_years: 17,
            rounding: "round_to_nearest_50",
            allow_presentation_conversion: true,
            notes: "Criança: 40 mg/kg/dia 8/8h (máx. 500 mg/tomada, 1,5 g/dia).",
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-oral",
        label: "Oral",
        forms: [
          {
            id: "form-capsula",
            label: "Cápsula/comprimido",
            presentations: [
              {
                id: "pres-amox-500-cap",
                label: "Cápsula 500 mg",
                concentration_value: 500,
                concentration_unit: "mg/unidade",
                amount_per_unit: 500,
                unit: "cápsula",
                drops_per_ml: null,
                conversion_factor: 1,
              },
            ],
          },
          {
            id: "form-suspensao",
            label: "Suspensão oral",
            presentations: [
              {
                id: "pres-amox-250-susp",
                label: "Suspensão 250 mg/5 mL (50 mg/mL)",
                concentration_value: 50,
                concentration_unit: "mg/mL",
                amount_per_unit: 50,
                unit: "mL",
                drops_per_ml: null,
                conversion_factor: null,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_penicilina",
        label: "Alergia à penicilina",
        level: ALERT_LEVELS.BLOCK,
        reason: "Amoxicilina é uma penicilina — alergia documentada contraindica o uso.",
        match_terms: ["penicilina", "penicillin"],
      },
      {
        condition_key: "allergy_amoxicilina",
        label: "Alergia à amoxicilina",
        level: ALERT_LEVELS.BLOCK,
        reason: "Alergia documentada ao princípio ativo contraindica o uso.",
        match_terms: ["amoxicilina", "amoxil"],
      },
    ],
    cautions: [
      {
        condition_key: "renal",
        label: "Insuficiência renal",
        level: ALERT_LEVELS.REVIEW,
        reason: "Ajuste de intervalo pode ser necessário conforme clearance de creatinina.",
      },
    ],
  },

  // ---- Amoxicilina + Ácido clavulânico (combinado) ----
  {
    id: "med-amox-clav",
    name: "Amoxicilina + Ácido clavulânico 500 + 125 mg",
    active_ingredients: [
      { name: "amoxicilina", synonyms: ["amoxil"] },
      { name: "ácido clavulânico", synonyms: ["clavulanato", "clavulanico"] },
    ],
    monograph_id: "mon-amox-clav-v01",
    is_combination: true,
    indications: [
      {
        id: "ind-amoxclav-infec-dental",
        label: "Infecção dentária grave / abscesso com risco de resistência",
        populations: ["adult"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.FIXED,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: null,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: null,
            max_per_day_mg: null,
            duration_days: 7,
            requires_weight: false,
            min_age_years: 18,
            max_age_years: null,
            rounding: null,
            allow_presentation_conversion: false,
            notes:
              "Combinado: 1 comprimido 500 + 125 mg 8/8h. Cada princípio ativo tem limites próprios.",
            components: [
              {
                active_ingredient: "amoxicilina",
                amount_per_unit_mg: 500,
                max_per_dose_mg: 1000,
                max_per_day_mg: 3000,
              },
              {
                active_ingredient: "ácido clavulânico",
                amount_per_unit_mg: 125,
                max_per_dose_mg: 250,
                max_per_day_mg: 750,
              },
            ],
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-oral",
        label: "Oral",
        forms: [
          {
            id: "form-comprimido",
            label: "Comprimido",
            presentations: [
              {
                id: "pres-amoxclav-500-125",
                label: "Comprimido 500 mg + 125 mg",
                concentration_value: null,
                concentration_unit: "combinado",
                amount_per_unit: null,
                unit: "comprimido",
                drops_per_ml: null,
                conversion_factor: 1,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_penicilina",
        label: "Alergia à penicilina",
        level: ALERT_LEVELS.BLOCK,
        reason: "Componente amoxicilina (penicilina) — alergia contraindica o uso.",
        match_terms: ["penicilina", "penicillin"],
      },
      {
        condition_key: "allergy_amoxicilina",
        label: "Alergia à amoxicilina",
        level: ALERT_LEVELS.BLOCK,
        reason: "Componente amoxicilina presente — alergia contraindica o uso.",
        match_terms: ["amoxicilina", "amoxil"],
      },
      {
        condition_key: "hepatica",
        label: "Disfunção hepática associada ao amox-clav",
        level: ALERT_LEVELS.BLOCK,
        reason:
          "Histórico de icterícia/disfunção hepática associada ao amoxicilina-clavulanato contraindica o uso.",
        match_terms: ["hepatica", "hepatico", "figado", "ictericia"],
      },
    ],
    cautions: [
      {
        condition_key: "renal",
        label: "Insuficiência renal",
        level: ALERT_LEVELS.REVIEW,
        reason: "Ajuste de dose/intervalo conforme função renal.",
      },
    ],
  },

  // ---- Clindamicina ----
  {
    id: "med-clindamicina-300",
    name: "Clindamicina 300 mg",
    active_ingredients: [
      { name: "clindamicina", synonyms: ["clindamicin", "dalacin", "clindox"] },
    ],
    monograph_id: "mon-clindamicina-v01",
    is_combination: false,
    indications: [
      {
        id: "ind-clinda-infec-dental",
        label: "Infecção dentária em alérgicos à penicilina",
        populations: ["adult", "pediatric"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.FIXED,
            dose_per_dose_mg: 300,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: null,
            interval_hours: 6,
            doses_per_day: 4,
            max_per_dose_mg: 450,
            max_per_day_mg: 1800,
            duration_days: 7,
            requires_weight: false,
            min_age_years: 18,
            max_age_years: null,
            rounding: "round_to_nearest_150",
            allow_presentation_conversion: true,
            notes: "Adulto: 300 mg 6/6h. Em infecções graves, até 450 mg 6/6h (máx. 1,8 g/dia).",
          },
          {
            population: "pediatric",
            regime_type: REGIME_TYPES.PER_KG_PER_DAY,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: 20,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: 300,
            max_per_day_mg: 1800,
            duration_days: 7,
            requires_weight: true,
            min_age_years: 1,
            max_age_years: 17,
            rounding: "round_to_nearest_75",
            allow_presentation_conversion: true,
            notes: "Criança: 8–25 mg/kg/dia em 3–4 tomadas (máx. 1,8 g/dia).",
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-oral",
        label: "Oral",
        forms: [
          {
            id: "form-capsula",
            label: "Cápsula",
            presentations: [
              {
                id: "pres-clinda-300-cap",
                label: "Cápsula 300 mg",
                concentration_value: 300,
                concentration_unit: "mg/unidade",
                amount_per_unit: 300,
                unit: "cápsula",
                drops_per_ml: null,
                conversion_factor: 1,
              },
            ],
          },
          {
            id: "form-suspensao",
            label: "Suspensão oral",
            presentations: [
              {
                id: "pres-clinda-75-susp",
                label: "Suspensão 75 mg/5 mL (15 mg/mL)",
                concentration_value: 15,
                concentration_unit: "mg/mL",
                amount_per_unit: 15,
                unit: "mL",
                drops_per_ml: null,
                conversion_factor: null,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_clindamicina",
        label: "Alergia à clindamicina",
        level: ALERT_LEVELS.BLOCK,
        reason: "Alergia documentada ao princípio ativo contraindica o uso.",
        match_terms: ["clindamicina", "clindamicin", "dalacin"],
      },
      {
        condition_key: "colite",
        label: "Histórico de colite associada a antibiótico",
        level: ALERT_LEVELS.BLOCK,
        reason:
          "Clindamicina está associada à colite por C. difficile — contraindicada em histórico de colite associada a antibióticos.",
        match_terms: ["colite", "colitis", "c. difficile", "difficile"],
      },
    ],
    cautions: [
      {
        condition_key: "renal",
        label: "Insuficiência renal",
        level: ALERT_LEVELS.REVIEW,
        reason: "Ajuste de dose/intervalo conforme função renal.",
      },
      {
        condition_key: "hepatica",
        label: "Insuficiência hepática",
        level: ALERT_LEVELS.REVIEW,
        reason: "Monitorar função hepática em uso prolongado.",
        match_terms: ["hepatica", "hepatico", "figado"],
      },
    ],
  },

  // ---- Metronidazol ----
  {
    id: "med-metronidazol-400",
    name: "Metronidazol 400 mg",
    active_ingredients: [
      { name: "metronidazol", synonyms: ["flagyl", "metronid"] },
    ],
    monograph_id: "mon-metronidazol-v01",
    is_combination: false,
    indications: [
      {
        id: "ind-metro-infec-anaerobia",
        label: "Infecção odontogênica anaeróbia (associado ou isolado)",
        populations: ["adult", "pediatric"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.FIXED,
            dose_per_dose_mg: 400,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: null,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: 500,
            max_per_day_mg: 1500,
            duration_days: 7,
            requires_weight: false,
            min_age_years: 18,
            max_age_years: null,
            rounding: "round_to_nearest_200",
            allow_presentation_conversion: true,
            notes:
              "Adulto: 400 mg 8/8h. Frequentemente associado à amoxicilina em infecções graves.",
          },
          {
            population: "pediatric",
            regime_type: REGIME_TYPES.PER_KG_PER_DAY,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: 30,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: 400,
            max_per_day_mg: 1500,
            duration_days: 7,
            requires_weight: true,
            min_age_years: 1,
            max_age_years: 17,
            rounding: "round_to_nearest_50",
            allow_presentation_conversion: true,
            notes: "Criança: 20–30 mg/kg/dia em 3 tomadas (máx. 1,5 g/dia).",
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-oral",
        label: "Oral",
        forms: [
          {
            id: "form-comprimido",
            label: "Comprimido",
            presentations: [
              {
                id: "pres-metro-400-tab",
                label: "Comprimido 400 mg",
                concentration_value: 400,
                concentration_unit: "mg/unidade",
                amount_per_unit: 400,
                unit: "comprimido",
                drops_per_ml: null,
                conversion_factor: 1,
              },
            ],
          },
          {
            id: "form-suspensao",
            label: "Suspensão oral",
            presentations: [
              {
                id: "pres-metro-250-susp",
                label: "Suspensão 250 mg/5 mL (50 mg/mL)",
                concentration_value: 50,
                concentration_unit: "mg/mL",
                amount_per_unit: 50,
                unit: "mL",
                drops_per_ml: null,
                conversion_factor: null,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_metronidazol",
        label: "Alergia ao metronidazol",
        level: ALERT_LEVELS.BLOCK,
        reason: "Alergia documentada ao princípio ativo contraindica o uso.",
        match_terms: ["metronidazol", "flagyl", "metronid"],
      },
      {
        condition_key: "alcool",
        label: "Uso de álcool",
        level: ALERT_LEVELS.BLOCK,
        reason:
          "Reação dissulfiram-like (efeito antabuse) com álcool — contraindicado o consumo de álcool durante e até 48h após o uso.",
        match_terms: ["alcool", "etanol", "alcoolismo"],
      },
    ],
    cautions: [
      {
        condition_key: "neurologica",
        label: "Doença neurológica",
        level: ALERT_LEVELS.REVIEW,
        reason: "Risco de neuropatia periférica e crises em pacientes neurológicos — avaliar.",
        match_terms: ["neurologica", "neuropatia", "convulsao", "epilepsia"],
      },
      {
        condition_key: "hepatica",
        label: "Insuficiência hepática",
        level: ALERT_LEVELS.REVIEW,
        reason: "Acúmulo do fármaco — ajuste de dose.",
        match_terms: ["hepatica", "hepatico", "figado"],
      },
      {
        condition_key: "pregnancy",
        label: "Gestação (1º trimestre)",
        level: ALERT_LEVELS.REVIEW,
        reason: "Contraindicado no 1º trimestre; avaliar nos demais trimestes.",
      },
    ],
  },

  // ---- Ibuprofeno ----
  {
    id: "med-ibuprofeno-400",
    name: "Ibuprofeno 400 mg",
    active_ingredients: [
      { name: "ibuprofeno", synonyms: ["advil", "motrin", "alivium"] },
    ],
    monograph_id: "mon-ibuprofeno-v01",
    is_combination: false,
    indications: [
      {
        id: "ind-ibuprofeno-analgesia",
        label: "Analgesia / anti-inflamatório odontológico",
        populations: ["adult", "pediatric"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.FIXED,
            dose_per_dose_mg: 400,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: null,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: 600,
            max_per_day_mg: 2400,
            duration_days: 5,
            requires_weight: false,
            min_age_years: 18,
            max_age_years: null,
            rounding: "round_to_nearest_200",
            allow_presentation_conversion: true,
            notes: "Adulto: 400–600 mg 6/6h ou 8/8h. Máx. 2,4 g/dia.",
          },
          {
            population: "pediatric",
            regime_type: REGIME_TYPES.PER_KG_PER_DAY,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: 30,
            interval_hours: 8,
            doses_per_day: 3,
            max_per_dose_mg: 400,
            max_per_day_mg: 40,
            max_per_day_unit: "mg/kg",
            duration_days: 5,
            requires_weight: true,
            min_age_years: 0,
            max_age_years: 12,
            rounding: "round_to_nearest_50",
            allow_presentation_conversion: true,
            notes:
              "Criança: 20–30 mg/kg/dia em 3–4 tomadas (máx. 40 mg/kg/dia ou 2,4 g/dia). A partir de 6 meses.",
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-oral",
        label: "Oral",
        forms: [
          {
            id: "form-comprimido",
            label: "Comprimido",
            presentations: [
              {
                id: "pres-ibu-400-tab",
                label: "Comprimido 400 mg",
                concentration_value: 400,
                concentration_unit: "mg/unidade",
                amount_per_unit: 400,
                unit: "comprimido",
                drops_per_ml: null,
                conversion_factor: 1,
              },
              {
                id: "pres-ibu-600-tab",
                label: "Comprimido 600 mg",
                concentration_value: 600,
                concentration_unit: "mg/unidade",
                amount_per_unit: 600,
                unit: "comprimido",
                drops_per_ml: null,
                conversion_factor: 1,
              },
            ],
          },
          {
            id: "form-suspensao",
            label: "Suspensão oral",
            presentations: [
              {
                id: "pres-ibu-50-susp",
                label: "Suspensão 50 mg/5 mL (10 mg/mL)",
                concentration_value: 10,
                concentration_unit: "mg/mL",
                amount_per_unit: 10,
                unit: "mL",
                drops_per_ml: 20,
                conversion_factor: null,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_ibuprofeno",
        label: "Alergia ao ibuprofeno/AINEs",
        level: ALERT_LEVELS.BLOCK,
        reason: "Alergia a anti-inflamatórios não esteroidais contraindica o uso.",
        match_terms: ["ibuprofeno", "advil", "alivium", "anti-inflamatorio", "aine"],
      },
      {
        condition_key: "allergy_aas",
        label: "Alergia ao AAS/aspirina",
        level: ALERT_LEVELS.BLOCK,
        reason: "Reatividade cruzada com AINEs — contraindica o uso.",
        match_terms: ["aas", "aspirina", "acido acetilsalicilico", "acetilsalicilico"],
      },
      {
        condition_key: "ulcera",
        label: "Úlcera péptica ativa",
        level: ALERT_LEVELS.BLOCK,
        reason: "AINEs contraindicados em úlcera péptica ativa/sangramento.",
        match_terms: ["ulcera", "peptica", "gastrica", "gastroduodenal"],
      },
      {
        condition_key: "sangramento",
        label: "Transtorno de coagulação/sangramento",
        level: ALERT_LEVELS.BLOCK,
        reason: "AINEs agravam o risco de sangramento.",
        match_terms: ["sangramento", "coagulacao", "hemorragia", "anticoagulante"],
      },
    ],
    cautions: [
      {
        condition_key: "renal",
        label: "Insuficiência renal",
        level: ALERT_LEVELS.REVIEW,
        reason: "AINEs podem reduzir o fluxo renal — cautela em insuficiência renal.",
      },
      {
        condition_key: "hepatica",
        label: "Insuficiência hepática",
        level: ALERT_LEVELS.REVIEW,
        reason: "Cautela em disfunção hepática.",
        match_terms: ["hepatica", "hepatico", "figado"],
      },
      {
        condition_key: "asma",
        label: "Asma",
        level: ALERT_LEVELS.REVIEW,
        reason: "AINEs podem desencadear broncoespasmo em asmáticos sensíveis.",
      },
      {
        condition_key: "pregnancy",
        label: "Gestação",
        level: ALERT_LEVELS.REVIEW,
        reason: "Evitar, sobretudo no 3º trimestre (risco fetal e materno).",
      },
    ],
  },

  // ---- Paracetamol ----
  {
    id: "med-paracetamol-750",
    name: "Paracetamol 750 mg",
    active_ingredients: [
      { name: "paracetamol", synonyms: ["acetaminofen", "tylenol"] },
    ],
    monograph_id: "mon-paracetamol-v01",
    is_combination: false,
    indications: [
      {
        id: "ind-parac-analgesia",
        label: "Analgesia / antitérmico",
        populations: ["adult", "pediatric"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.FIXED,
            dose_per_dose_mg: 750,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: null,
            interval_hours: 6,
            doses_per_day: 4,
            max_per_dose_mg: 1000,
            max_per_day_mg: 4000,
            duration_days: 5,
            requires_weight: false,
            min_age_years: 18,
            max_age_years: null,
            rounding: "round_to_nearest_250",
            allow_presentation_conversion: true,
            notes: "Adulto: 750 mg 6/6h (máx. 1 g/tomada, 4 g/dia).",
          },
          {
            population: "pediatric",
            regime_type: REGIME_TYPES.PER_KG_PER_DOSE,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: 15,
            dose_per_kg_per_day_mg: null,
            interval_hours: 6,
            doses_per_day: 4,
            max_per_dose_mg: 500,
            max_per_day_mg: 60,
            max_per_day_unit: "mg/kg",
            duration_days: 5,
            requires_weight: true,
            min_age_years: 0,
            max_age_years: 12,
            rounding: "round_to_nearest_50",
            allow_presentation_conversion: true,
            notes: "Criança: 10–15 mg/kg/tomada 6/6h (máx. 60 mg/kg/dia).",
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-oral",
        label: "Oral",
        forms: [
          {
            id: "form-comprimido",
            label: "Comprimido",
            presentations: [
              {
                id: "pres-parac-750-tab",
                label: "Comprimido 750 mg",
                concentration_value: 750,
                concentration_unit: "mg/unidade",
                amount_per_unit: 750,
                unit: "comprimido",
                drops_per_ml: null,
                conversion_factor: 1,
              },
            ],
          },
          {
            id: "form-suspensao",
            label: "Suspensão/gotas",
            presentations: [
              {
                id: "pres-parac-200-susp",
                label: "Suspensão 200 mg/5 mL (40 mg/mL)",
                concentration_value: 40,
                concentration_unit: "mg/mL",
                amount_per_unit: 40,
                unit: "mL",
                drops_per_ml: 20,
                conversion_factor: null,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_paracetamol",
        label: "Alergia ao paracetamol",
        level: ALERT_LEVELS.BLOCK,
        reason: "Alergia documentada ao princípio ativo contraindica o uso.",
        match_terms: ["paracetamol", "acetaminofen", "tylenol"],
      },
      {
        condition_key: "hepatica",
        label: "Insuficiência hepática grave",
        level: ALERT_LEVELS.BLOCK,
        reason: "Hepatotoxicidade — contraindicado em insuficiência hepática grave.",
        match_terms: ["hepatica", "hepatico", "figado", "cirrose"],
      },
    ],
    cautions: [
      {
        condition_key: "alcool",
        label: "Consumo de álcool",
        level: ALERT_LEVELS.REVIEW,
        reason: "Aumenta o risco de hepatotoxicidade.",
        match_terms: ["alcool", "etanol"],
      },
      {
        condition_key: "renal",
        label: "Insuficiência renal",
        level: ALERT_LEVELS.REVIEW,
        reason: "Cautela em uso prolongado em insuficiência renal.",
      },
    ],
  },

  // ---- Dexametasona ----
  {
    id: "med-dexametasona-4",
    name: "Dexametasona 4 mg",
    active_ingredients: [
      { name: "dexametasona", synonyms: ["decadron", "dexa"] },
    ],
    monograph_id: "mon-dexametasona-v01",
    is_combination: false,
    indications: [
      {
        id: "ind-dexa-antiinflamatorio",
        label: "Anti-inflamatório esteroide pós-cirúrgico",
        populations: ["adult"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.FIXED,
            dose_per_dose_mg: 4,
            dose_per_kg_per_dose_mg: null,
            dose_per_kg_per_day_mg: null,
            interval_hours: 24,
            doses_per_day: 1,
            max_per_dose_mg: 8,
            max_per_day_mg: 8,
            duration_days: 3,
            requires_weight: false,
            min_age_years: 18,
            max_age_years: null,
            rounding: "round_to_nearest_2",
            allow_presentation_conversion: true,
            notes:
              "Adulto: 4 mg em dose única diária. Em pós-operatório, pode-se usar 8 mg como dose de ataque.",
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-oral",
        label: "Oral",
        forms: [
          {
            id: "form-comprimido",
            label: "Comprimido",
            presentations: [
              {
                id: "pres-dexa-4-tab",
                label: "Comprimido 4 mg",
                concentration_value: 4,
                concentration_unit: "mg/unidade",
                amount_per_unit: 4,
                unit: "comprimido",
                drops_per_ml: null,
                conversion_factor: 1,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_dexametasona",
        label: "Alergia à dexametasona",
        level: ALERT_LEVELS.BLOCK,
        reason: "Alergia documentada ao princípio ativo contraindica o uso.",
        match_terms: ["dexametasona", "decadron", "dexa"],
      },
      {
        condition_key: "infeccao",
        label: "Infecção sistêmica não controlada",
        level: ALERT_LEVELS.BLOCK,
        reason:
          "Corticoide imunossupressor — contraindicado em infecção sistêmica ativa não controlada.",
        match_terms: ["infeccao", "infeccao sistemica", "septicemia"],
      },
    ],
    cautions: [
      {
        condition_key: "diabetes",
        label: "Diabetes mellitus",
        level: ALERT_LEVELS.REVIEW,
        reason: "Corticoide eleva a glicemia — monitorar.",
      },
      {
        condition_key: "ulcera",
        label: "Úlcera péptica",
        level: ALERT_LEVELS.REVIEW,
        reason: "Corticoide aumenta o risco de úlcera/sangramento.",
        match_terms: ["ulcera", "peptica", "gastrica"],
      },
      {
        condition_key: "pregnancy",
        label: "Gestação",
        level: ALERT_LEVELS.REVIEW,
        reason: "Avaliar risco/benefício em gestação.",
      },
    ],
  },

  // ---- Lidocaína 2% com adrenalina ----
  {
    id: "med-lidocaina-2-adrenalina",
    name: "Lidocaína 2% com adrenalina 1:100.000",
    active_ingredients: [
      { name: "lidocaína", synonyms: ["lidocaina", "xilocaína", "xylocaine"] },
    ],
    monograph_id: "mon-lidocaina-v01",
    is_combination: false,
    indications: [
      {
        id: "ind-lido-anestesia",
        label: "Anestesia local odontológica (infiltrativa/troncular)",
        populations: ["adult", "pediatric"],
        regimes: [
          {
            population: "adult",
            regime_type: REGIME_TYPES.PER_KG_PER_DOSE,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: 4.4,
            dose_per_kg_per_day_mg: null,
            interval_hours: null,
            doses_per_day: 1,
            max_per_dose_mg: 500,
            max_per_day_mg: 500,
            duration_days: 1,
            requires_weight: true,
            min_age_years: 18,
            max_age_years: null,
            rounding: null,
            allow_presentation_conversion: true,
            notes:
              "Dose máxima recomendada: 4,4 mg/kg (com adrenalina), até 500 mg totais por atendimento (≈ 7 tubetes de 1,8 mL). 1 tubete = 1,8 mL = 36 mg de lidocaína.",
          },
          {
            population: "pediatric",
            regime_type: REGIME_TYPES.PER_KG_PER_DOSE,
            dose_per_dose_mg: null,
            dose_per_kg_per_dose_mg: 4.4,
            dose_per_kg_per_day_mg: null,
            interval_hours: null,
            doses_per_day: 1,
            max_per_dose_mg: 200,
            max_per_day_mg: 200,
            duration_days: 1,
            requires_weight: true,
            min_age_years: 3,
            max_age_years: 17,
            rounding: null,
            allow_presentation_conversion: true,
            notes:
              "Criança: 4,4 mg/kg (com adrenalina). Reduzir a dose em crianças pequenas. 1 tubete = 1,8 mL = 36 mg.",
          },
        ],
      },
    ],
    routes: [
      {
        id: "route-injetavel",
        label: "Injetável (infiltrativa/troncular)",
        forms: [
          {
            id: "form-tubete",
            label: "Tubete dental",
            presentations: [
              {
                id: "pres-lido-18ml",
                label: "Tubete 1,8 mL — Lidocaína 2% (20 mg/mL) + adrenalina 1:100.000",
                concentration_value: 20,
                concentration_unit: "mg/mL",
                amount_per_unit: 20,
                unit: "mL",
                drops_per_ml: null,
                conversion_factor: null,
              },
            ],
          },
        ],
      },
    ],
    contraindications: [
      {
        condition_key: "allergy_lidocaina",
        label: "Alergia à lidocaína/anestésicos amida",
        level: ALERT_LEVELS.BLOCK,
        reason: "Alergia a anestésicos locais tipo amida contraindica o uso.",
        match_terms: ["lidocaina", "lidocaína", "xilocaina", "xilocaína", "anestesico local", "amida"],
      },
    ],
    cautions: [
      {
        condition_key: "cardiaca",
        label: "Doença cardiovascular grave",
        level: ALERT_LEVELS.REVIEW,
        reason: "A adrenalina aumenta o trabalho cardíaco — avaliar em cardiopatias graves.",
        match_terms: ["cardiaca", "cardiaco", "coracao", "cardio", "isquemia"],
      },
      {
        condition_key: "tireoide",
        label: "Hipertireoidismo não controlado",
        level: ALERT_LEVELS.REVIEW,
        reason: "A adrenalina pode precipitar crise tireotóxica — cautela.",
        match_terms: ["tireoide", "hipertireoidismo", "hipertireoide"],
      },
      {
        condition_key: "pregnancy",
        label: "Gestação",
        level: ALERT_LEVELS.REVIEW,
        reason:
          "Categoria C — avaliar risco/benefício; preferir apresentação sem vasoconstritor quando possível.",
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// BASE GERENCIADA (entidade Medication) — fonte estruturada e consistente
// -----------------------------------------------------------------------------
// O conteúdo clínico usado nos cálculos é mantido em uma entidade gerenciada
// (Medication), com medicamentos, concentrações, faixas de dose, limites
// máximos e referências bibliográficas estruturados. O motor consome o dataset
// carregado; a base estática acima é a semente/fallback de segurança.
let dataset = { medications, monographs };
let baseLoaded = false;
const baseListeners = new Set();
function notifyBase() {
  baseListeners.forEach((l) => l());
}

export function isBaseLoaded() {
  return baseLoaded;
}

export function subscribeBase(cb) {
  baseListeners.add(cb);
  return () => baseListeners.delete(cb);
}

export async function loadMedicationBase() {
  try {
    const records = await base44.entities.Medication.list("-name", 200);
    if (records && records.length > 0) {
      const meds = records.map((r) => {
        const doc = r.document || {};
        const mono = r.monograph || doc.monograph || {};
        return {
          id: r.slug || doc.id,
          name: r.name || doc.name,
          active_ingredients: doc.active_ingredients || [],
          is_combination: !!doc.is_combination,
          monograph_id: doc.monograph_id,
          indications: doc.indications || [],
          routes: doc.routes || [],
          contraindications: doc.contraindications || [],
          cautions: doc.cautions || [],
          verified: r.verified !== false,
          base_version: r.base_version || BASE_VERSION,
          review_date: r.review_date || BASE_REVIEW_DATE,
          category: r.category,
          monograph: {
            ...mono,
            references: (mono.references && mono.references.length)
              ? mono.references
              : (r.references || []),
          },
        };
      });
      const monos = {};
      meds.forEach((m) => {
        if (m.monograph && m.monograph_id) monos[m.monograph_id] = m.monograph;
      });
      dataset = { medications: meds, monographs: monos };
      baseLoaded = true;
      notifyBase();
    }
    return dataset;
  } catch (e) {
    console.error("Falha ao carregar a base gerenciada — usando base de referência local.", e);
    return dataset;
  }
}

export function getMedicationById(id) {
  return dataset.medications.find((m) => m.id === id) || null;
}

export function searchMedications(query) {
  if (!query || query.trim() === "") return dataset.medications;
  const q = query.toLowerCase().trim();
  return dataset.medications.filter((m) => {
    if (m.name.toLowerCase().includes(q)) return true;
    return m.active_ingredients.some(
      (ai) =>
        ai.name.toLowerCase().includes(q) ||
        (ai.synonyms || []).some((s) => s.toLowerCase().includes(q))
    );
  });
}

export function getMonographById(id) {
  return dataset.monographs[id] || null;
}

export function getRegime(medication, indicationId, population) {
  const indication = medication.indications.find((i) => i.id === indicationId);
  if (!indication) return null;
  if (!indication.populations.includes(population)) return null;
  const regime = indication.regimes.find((r) => r.population === population);
  return regime || null;
}

export function getPresentation(medication, routeId, formId, presentationId) {
  const route = medication.routes.find((r) => r.id === routeId);
  if (!route) return null;
  const form = route.forms.find((f) => f.id === formId);
  if (!form) return null;
  return form.presentations.find((p) => p.id === presentationId) || null;
}

export function getRoute(medication, routeId) {
  return medication.routes.find((r) => r.id === routeId) || null;
}

export function getForm(medication, routeId, formId) {
  const route = getRoute(medication, routeId);
  if (!route) return null;
  return route.forms.find((f) => f.id === formId) || null;
}