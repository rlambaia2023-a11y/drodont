// =============================================================================
// MOTOR DE SEGURANÇA — VALORES DE REFERÊNCIA
// =============================================================================
// Analisa alergias, contraindicações, cautelas, duplicidade terapêutica e
// interações medicamento-medicamento. Classifica avisos em:
//   - informativo (INFO)
//   - revisão obrigatória (REVIEW)
//   - bloqueio do cálculo automático (BLOCK)
// NÃO atribui gravidade apenas por correspondência de palavras — segue regras
// explícitas da monografia. Cada alerta traz motivo, implicação clínica,
// fonte/versão, dado que o acionou e caminho de correção.
// =============================================================================

import { ALERT_LEVELS } from "./medicationsDatabase";
import { interactions } from "./interactionsDatabase";

function normalize(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function runSafetyCheck(context, calcResult) {
  const {
    medication,
    allergies = [],
    clinicalConditions = [],
    currentMedications = [],
    pregnancy,
    lactation,
  } = context;

  const alerts = [];

  // 1. Contraindicações e cautelas da monografia
  const allChecks = [
    ...(medication.contraindications || []),
    ...(medication.cautions || []),
  ];

  for (const check of allChecks) {
    const triggered = evaluateCondition(check, {
      allergies,
      clinicalConditions,
      pregnancy,
      lactation,
    });
    if (triggered) {
      alerts.push({
        level: check.level,
        title: check.label,
        reason: check.reason,
        clinical_implication: getClinicalImplication(check.level),
        source: `Monografia ${medication.monograph_id} (referência, validação)`,
        triggered_by: describeTrigger(check, { allergies, clinicalConditions }),
        fix_path: getFixPath(check.level),
      });
    }
  }

  // 2. Duplicidade terapêutica
  if (medication.active_ingredients && currentMedications.length > 0) {
    for (const ai of medication.active_ingredients) {
      const allNames = [ai.name, ...(ai.synonyms || [])].map(normalize);
      for (const cm of currentMedications) {
        const cmNorm = normalize(cm.name || cm);
        if (!cmNorm) continue;
        if (allNames.some((n) => cmNorm.includes(n) || n.includes(cmNorm))) {
          alerts.push({
            level: ALERT_LEVELS.REVIEW,
            title: "Possível duplicidade terapêutica",
            reason: `Princípio ativo "${ai.name}" já consta em uso atual (${cm.name || cm}).`,
            clinical_implication:
              "Revisar risco de dose cumulativa e toxicidade.",
            source: "Análise de duplicidade (referência)",
            triggered_by: `Medicamento em uso: ${cm.name || cm}`,
            fix_path:
              "Confirmar com o profissional se a duplicidade é intencional ou suspender um dos itens.",
          });
        }
      }
    }
  }

  // 3. Interações medicamento-medicamento
  if (currentMedications.length > 0 && medication.active_ingredients) {
    const medAiNames = medication.active_ingredients
      .flatMap((ai) => [ai.name, ...(ai.synonyms || [])])
      .map(normalize)
      .filter(Boolean);
    for (const cm of currentMedications) {
      const cmNorm = normalize(cm.name || cm);
      if (!cmNorm) continue;
      const interaction = interactions.find((i) => {
        const a = normalize(i.drug_a);
        const b = normalize(i.drug_b);
        const matchesA = medAiNames.some(
          (n) => n === a || n.includes(a) || a.includes(n)
        );
        const matchesB = cmNorm === b || cmNorm.includes(b) || b.includes(cmNorm);
        return matchesA && matchesB;
      });
      if (interaction) {
        alerts.push({
          level: interaction.severity,
          title: `Interação: ${interaction.drug_a} + ${interaction.drug_b}`,
          reason: interaction.mechanism,
          clinical_implication: interaction.clinical_effect,
          source: `${interaction.source} — versão ${interaction.version}`,
          triggered_by: `Medicamento em uso: ${cm.name || cm}`,
          fix_path: interaction.management,
        });
      }
    }
  }

  // 4. Riscos críticos não respondidos (Sim/Não/Não sei) — branco nunca é negativo
  if (pregnancy === "unknown") {
    alerts.push({
      level: ALERT_LEVELS.REVIEW,
      title: "Gestação: resposta 'Não sei'",
      reason:
        "Não foi possível confirmar ausência de gestação. Avaliação clínica necessária.",
      clinical_implication:
        "Alguns fármacos são contraindicados em gestação. Sem confirmação, não se pode presumir segurança.",
      source: "Avaliação de risco crítico (referência)",
      triggered_by: "Resposta 'Não sei' para gestação",
      fix_path: "Confirmar o status de gestação antes de prosseguir.",
    });
  }

  return alerts;
}

function evaluateCondition(check, ctx) {
  const { allergies, clinicalConditions, pregnancy, lactation } = ctx;
  const key = check.condition_key;
  const nKey = normalize(key);
  const terms = (check.match_terms || []).map(normalize).filter(Boolean);

  if (key.startsWith("allergy_")) {
    const allergen = normalize(key.replace("allergy_", ""));
    const allTerms = [allergen, ...terms].filter(Boolean);
    if (
      allTerms.length &&
      allergies.some((a) => {
        const s = normalize(a.substance || a);
        if (!s) return false;
        return allTerms.some((t) => s.includes(t) || t.includes(s));
      })
    )
      return true;
  }

  // Condições clínicas: chave ou qualquer termo adicional como substring
  const condTerms = [nKey, ...terms].filter(Boolean);
  const condMatch = clinicalConditions.some((c) => {
    const cl = normalize(c.key || c.label || c);
    if (!cl) return false;
    return condTerms.some((t) => cl.includes(t) || t.includes(cl));
  });
  if (condMatch) return true;

  if (key === "pregnancy" && pregnancy === "yes") return true;
  if (key === "lactation" && lactation === "yes") return true;

  return false;
}

function describeTrigger(check, ctx) {
  const { allergies, clinicalConditions } = ctx;
  const key = check.condition_key;
  const terms = [normalize(key.replace("allergy_", "")), ...(check.match_terms || []).map(normalize)].filter(Boolean);

  if (key.startsWith("allergy_")) {
    const a = allergies.find((al) => {
      const s = normalize(al.substance || al);
      return s && terms.some((t) => s.includes(t) || t.includes(s));
    });
    if (a) return `Alergia declarada: ${a.substance || a}`;
  }

  const condTerms = [normalize(key), ...(check.match_terms || []).map(normalize)].filter(Boolean);
  const c = clinicalConditions.find((cn) => {
    const cl = normalize(cn.key || cn.label || cn);
    return cl && condTerms.some((t) => cl.includes(t) || t.includes(cl));
  });
  if (c) return `Condição clínica: ${c.label || c}`;

  return check.label || key;
}

function getClinicalImplication(level) {
  switch (level) {
    case ALERT_LEVELS.BLOCK:
      return "Cálculo automático bloqueado. Não prosseguir sem avaliação profissional.";
    case ALERT_LEVELS.REVIEW:
      return "Revisão obrigatória do profissional antes de utilizar o resultado.";
    default:
      return "Informação complementar para decisão clínica.";
  }
}

function getFixPath(level) {
  switch (level) {
    case ALERT_LEVELS.BLOCK:
      return "Selecione outro medicamento ou regime, ou avalie com o profissional responsável.";
    case ALERT_LEVELS.REVIEW:
      return "Confirme a pertinência clínica e documente a decisão antes de prosseguir.";
    default:
      return "Considere a informação no contexto clínico.";
  }
}