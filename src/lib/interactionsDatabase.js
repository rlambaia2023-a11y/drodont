// =============================================================================
// BASE DE INTERAÇÕES MEDICAMENTOSAS — REFERÊNCIA
// =============================================================================
// Interações relevantes à prática odontológica, com gravidade revisada.
// Valores de referência de fontes padrão.
// =============================================================================

import { ALERT_LEVELS } from "./medicationsDatabase";

export const INTERACTIONS_VERSION = "1.0.0";

export const interactions = [
  {
    id: "int-amox-anticoncepcional",
    drug_a: "amoxicilina",
    drug_b: "anticoncepcional oral",
    severity: ALERT_LEVELS.INFO,
    mechanism:
      "Redução da eficácia anticoncepcional por alteração da flora intestinal (evidência controversa).",
    clinical_effect: "Possível redução da eficácia do anticoncepcional oral.",
    management:
      "Orientar método contraceptivo adicional durante o uso do antibiótico.",
    source: "Base de interações DoseCerta (referência)",
    version: INTERACTIONS_VERSION,
  },
  {
    id: "int-ibu-varfarina",
    drug_a: "ibuprofeno",
    drug_b: "varfarina",
    severity: ALERT_LEVELS.REVIEW,
    mechanism:
      "Potencialização do efeito anticoagulante e aumento do risco de sangramento.",
    clinical_effect: "Risco aumentado de sangramento.",
    management:
      "Avaliar relação risco/benefício e monitorar sinais de sangramento; considerar paracetamol como alternativa.",
    source: "Base de interações DoseCerta (referência)",
    version: INTERACTIONS_VERSION,
  },
  {
    id: "int-metro-varfarina",
    drug_a: "metronidazol",
    drug_b: "varfarina",
    severity: ALERT_LEVELS.REVIEW,
    mechanism: "Inibição do metabolismo da varfarina — aumento do INR.",
    clinical_effect: "Risco aumentado de sangramento.",
    management: "Monitorar INR e ajustar a dose do anticoagulante se necessário.",
    source: "Base de interações DoseCerta (referência)",
    version: INTERACTIONS_VERSION,
  },
  {
    id: "int-ibu-aas",
    drug_a: "ibuprofeno",
    drug_b: "ácido acetilsalicílico",
    severity: ALERT_LEVELS.REVIEW,
    mechanism:
      "O ibuprofeno compete pelo sítio de ligação, reduzindo o efeito antiagregante do AAS.",
    clinical_effect: "Redução da proteção cardiovascular do AAS.",
    management: "Avaliar a necessidade; espaçar a administração quando possível.",
    source: "Base de interações DoseCerta (referência)",
    version: INTERACTIONS_VERSION,
  },
  {
    id: "int-metro-alcool",
    drug_a: "metronidazol",
    drug_b: "álcool",
    severity: ALERT_LEVELS.BLOCK,
    mechanism:
      "Reação dissulfiram-like (efeito antabuse): acetaldeído acumulado provoca náuseas, vômitos, taquicardia e hipotensão.",
    clinical_effect: "Reação adversa grave com álcool.",
    management:
      "Evitar o consumo de álcool durante o uso e até 48 horas após o término do metronidazol.",
    source: "Base de interações DoseCerta (referência)",
    version: INTERACTIONS_VERSION,
  },
];