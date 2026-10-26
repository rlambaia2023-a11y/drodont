// =============================================================================
// MOTOR DE CÁLCULO DETERMINÍSTICO — REFERÊNCIA
// =============================================================================
// Motor separado da base de medicamentos e da interface. Determinístico: mesma
// entrada sempre produz mesma saída. NÃO usa IA. NÃO inventa doses.
// Aplica limites, arredondamentos e conversões previstos na regra validada.
// Bloqueia o resultado quando dados essenciais faltam.
// =============================================================================

import {
  REGIME_TYPES,
  getRegime,
  getPresentation,
  getMonographById,
  BASE_VERSION,
  BASE_REVIEW_DATE,
} from "./medicationsDatabase";

// Arredondamentos previstos nas regras de referência
function applyRounding(value, rule) {
  if (!rule) return value;
  const factor = parseFloat(rule.replace("round_to_nearest_", ""));
  if (isNaN(factor) || factor <= 0) return value;
  return Math.round(value / factor) * factor;
}

function formatMg(value) {
  const rounded = Math.round(value * 100) / 100;
  return rounded;
}

// -----------------------------------------------------------------------------
// Função principal: recebe contexto clínico, retorna resultado rastreável
// -----------------------------------------------------------------------------
export function calculate(context) {
  const {
    medication,
    indicationId,
    population,
    routeId,
    formId,
    presentationId,
    ageYears,
    ageMonths,
    ageDays,
    weightKg,
    clinicalConditions = [],
    allergies = [],
    currentMedications = [],
    pregnancy = null,
    lactation = null,
  } = context;

  const result = {
    status: "pending",
    blocks: [],
    pending: [],
    alerts: [],
    calculation_memory: [],
    base_version: BASE_VERSION,
    base_review_date: BASE_REVIEW_DATE,
    is_demo: true,
    dose_per_dose_mg: null,
    dose_per_day_mg: null,
    interval_hours: null,
    doses_per_day: null,
    duration_days: null,
    presentation_quantity: null,
    presentation_unit: null,
    total_quantity: null,
    limits: null,
    monograph: null,
  };

  // 0. Bloquear se dados clínicos não confirmados na base gerenciada
  if (medication.verified === false) {
    result.status = "blocked";
    result.blocks.push({
      reason:
        "Os dados clínicos deste medicamento não estão confirmados na base gerenciada (dose ou referência pendente de validação).",
      fix:
        "Selecione outro medicamento com dados confirmados ou aguarde a validação da base clínica.",
    });
    return result;
  }

  // 1. Validar regime aplicável
  const regime = getRegime(medication, indicationId, population);
  if (!regime) {
    result.status = "blocked";
    result.blocks.push({
      reason:
        "Não há regime validado para esta indicação e população neste medicamento.",
      fix:
        "Selecione outra indicação ou troque a população (Adulto/Criança). Consulte a monografia.",
    });
    return result;
  }

  // 1b. Validar vigência da monografia (referência confirmada)
  const mono = getMonographById(medication.monograph_id);
  if (mono && mono.validity && mono.validity !== "vigente") {
    result.status = "blocked";
    result.blocks.push({
      reason: `Monografia não vigente (status: ${mono.validity}). Referência não confirmada na base gerenciada.`,
      fix: "Utilize a versão vigente da monografia antes de calcular.",
    });
    return result;
  }

  // 2. Validar faixa etária específica da monografia (sem fronteira global)
  const totalMonths = (ageYears || 0) * 12 + (ageMonths || 0);
  if (regime.min_age_years != null && ageYears != null) {
    if (ageYears < regime.min_age_years) {
      result.status = "blocked";
      result.blocks.push({
        reason: `Idade ${ageYears} anos abaixo do mínimo de ${regime.min_age_years} anos previsto na monografia.`,
        fix: "Selecione outro regime ou medicamento adequado à faixa etária.",
      });
      return result;
    }
  }
  if (regime.max_age_years != null && ageYears != null) {
    if (ageYears > regime.max_age_years) {
      result.status = "blocked";
      result.blocks.push({
        reason: `Idade ${ageYears} anos acima do máximo de ${regime.max_age_years} anos previsto na monografia.`,
        fix: "Selecione outro regime ou medicamento adequado à faixa etária.",
      });
      return result;
    }
  }

  // 3. Verificar peso quando exigido
  if (regime.requires_weight && (weightKg == null || weightKg <= 0)) {
    result.status = "blocked";
    result.blocks.push({
      reason:
        "Este regime exige peso aferido em kg para cálculo por kg. Peso não pode ser inferido da idade.",
      fix: "Informe o peso aferido e a data da aferição para desbloquear o cálculo.",
    });
    return result;
  }

  // 4. Validar apresentação/concentração
  const presentation = getPresentation(
    medication,
    routeId,
    formId,
    presentationId
  );
  if (!presentation) {
    result.status = "blocked";
    result.blocks.push({
      reason: "Apresentação/concentração não selecionada ou inválida.",
      fix: "Selecione a apresentação e concentração exata do medicamento.",
    });
    return result;
  }

  // 5. Cálculo conforme tipo de regime
  let rawDosePerDose = null;
  let rawDosePerDay = null;
  let calcSteps = [];

  if (regime.regime_type === REGIME_TYPES.FIXED) {
    if (medication.is_combination) {
      // Medicamento combinado: dose fixa por unidade, limites por componente
      calcSteps.push({
        step: "Regime fixo combinado",
        detail:
          "Dose por tomada = 1 unidade da apresentação combinada. Limites por componente tratados separadamente.",
      });
      rawDosePerDose = 1; // 1 unidade
      result.is_combination = true;
      result.components = regime.components.map((c) => ({
        active_ingredient: c.active_ingredient,
        amount_per_unit_mg: c.amount_per_unit_mg,
        per_dose_mg: c.amount_per_unit_mg,
        per_day_mg: c.amount_per_unit_mg * regime.doses_per_day,
        max_per_dose_mg: c.max_per_dose_mg,
        max_per_day_mg: c.max_per_day_mg,
        within_dose_limit:
          c.amount_per_unit_mg <= c.max_per_dose_mg,
        within_day_limit:
          c.amount_per_unit_mg * regime.doses_per_day <= c.max_per_day_mg,
      }));
      calcSteps.push({
        step: "Verificação de limites por componente",
        detail: result.components
          .map(
            (c) =>
              `${c.active_ingredient}: ${c.per_dose_mg} mg/tomada (limite ${c.max_per_dose_mg}), ${c.per_day_mg} mg/dia (limite ${c.max_per_day_mg})`
          )
          .join("; "),
      });
    } else {
      rawDosePerDose = regime.dose_per_dose_mg;
      calcSteps.push({
        step: "Regime fixo",
        detail: `Dose por tomada = ${rawDosePerDose} mg (direto da monografia).`,
      });
    }
  } else if (regime.regime_type === REGIME_TYPES.PER_KG_PER_DOSE) {
    const raw = regime.dose_per_kg_per_dose_mg * weightKg;
    calcSteps.push({
      step: "Dose por kg por tomada",
      detail: `${regime.dose_per_kg_per_dose_mg} mg/kg × ${weightKg} kg = ${formatMg(raw)} mg por tomada.`,
    });
    rawDosePerDose = raw;
  } else if (regime.regime_type === REGIME_TYPES.PER_KG_PER_DAY) {
    const rawDay = regime.dose_per_kg_per_day_mg * weightKg;
    const rawPerDose = rawDay / regime.doses_per_day;
    calcSteps.push({
      step: "Dose por kg por dia",
      detail: `${regime.dose_per_kg_per_day_mg} mg/kg/dia × ${weightKg} kg = ${formatMg(rawDay)} mg/dia.`,
    });
    calcSteps.push({
      step: "Divisão em tomadas",
      detail: `${formatMg(rawDay)} mg/dia ÷ ${regime.doses_per_day} tomadas = ${formatMg(rawPerDose)} mg por tomada.`,
    });
    rawDosePerDay = rawDay;
    rawDosePerDose = rawPerDose;
  }

  // 6. Aplicar limites (por tomada e diário) — apenas não-combinados
  if (!medication.is_combination) {
    let limitedDosePerDose = rawDosePerDose;
    let doseLimitApplied = false;

    if (regime.max_per_dose_mg != null && rawDosePerDose > regime.max_per_dose_mg) {
      calcSteps.push({
        step: "Limite por tomada aplicado",
        detail: `Valor original ${formatMg(rawDosePerDose)} mg excede limite de ${regime.max_per_dose_mg} mg/tomada. Dose ajustada para o limite.`,
      });
      limitedDosePerDose = regime.max_per_dose_mg;
      doseLimitApplied = true;
    }

    let limitedDosePerDay;
    if (regime.regime_type === REGIME_TYPES.PER_KG_PER_DAY) {
      limitedDosePerDay = rawDosePerDay;
    } else {
      limitedDosePerDay = limitedDosePerDose * regime.doses_per_day;
    }

    let dayLimitApplied = false;
    if (regime.max_per_day_mg != null) {
      const maxDay = regime.max_per_day_unit === "mg/kg"
        ? regime.max_per_day_mg * weightKg
        : regime.max_per_day_mg;
      if (limitedDosePerDay > maxDay) {
        calcSteps.push({
          step: "Limite diário aplicado",
          detail: `Valor original ${formatMg(limitedDosePerDay)} mg/dia excede limite de ${formatMg(maxDay)} mg/dia. Dose diária ajustada.`,
        });
        limitedDosePerDay = maxDay;
        limitedDosePerDose = maxDay / regime.doses_per_day;
        dayLimitApplied = true;
      }
    }

    // 7. Arredondamento
    let finalDosePerDose = limitedDosePerDose;
    let roundingApplied = false;
    if (regime.rounding) {
      const before = finalDosePerDose;
      finalDosePerDose = applyRounding(finalDosePerDose, regime.rounding);
      if (before !== finalDosePerDose) {
        roundingApplied = true;
        calcSteps.push({
          step: "Arredondamento aplicado",
          detail: `${formatMg(before)} mg → ${formatMg(finalDosePerDose)} mg (regra: ${regime.rounding}).`,
        });
      }
    }

    let finalDosePerDay = finalDosePerDose * regime.doses_per_day;
    if (regime.regime_type === REGIME_TYPES.PER_KG_PER_DAY && dayLimitApplied) {
      finalDosePerDay = limitedDosePerDay;
    }

    result.dose_per_dose_mg = formatMg(finalDosePerDose);
    result.dose_per_day_mg = formatMg(finalDosePerDay);
    result.interval_hours = regime.interval_hours;
    result.doses_per_day = regime.doses_per_day;
    result.duration_days = regime.duration_days;
    result.limits = {
      max_per_dose_mg: regime.max_per_dose_mg,
      max_per_day_mg: regime.max_per_day_mg,
      max_per_day_unit: regime.max_per_day_unit || null,
      dose_limit_applied: doseLimitApplied,
      day_limit_applied: dayLimitApplied,
      rounding_applied: roundingApplied,
      original_dose_per_dose_mg: formatMg(rawDosePerDose),
      original_dose_per_day_mg: formatMg(rawDosePerDay || rawDosePerDose * regime.doses_per_day),
    };

    // 8. Conversão para unidade de apresentação (somente quando autorizado)
    if (
      regime.allow_presentation_conversion &&
      presentation.concentration_value &&
      presentation.concentration_unit
    ) {
      if (presentation.concentration_unit === "mg/unidade") {
        const units = finalDosePerDose / presentation.amount_per_unit;
        const roundedUnits = Math.round(units * 10) / 10;
        result.presentation_quantity = roundedUnits;
        result.presentation_unit = presentation.unit;
        calcSteps.push({
          step: "Conversão para unidade de apresentação",
          detail: `${formatMg(finalDosePerDose)} mg ÷ ${presentation.amount_per_unit} mg/unidade = ${roundedUnits} ${presentation.unit}(s).`,
        });
      } else if (presentation.concentration_unit === "mg/mL") {
        const volumeMl = finalDosePerDose / presentation.concentration_value;
        const roundedVolume = Math.round(volumeMl * 100) / 100;
        result.presentation_quantity = roundedVolume;
        result.presentation_unit = "mL";
        calcSteps.push({
          step: "Conversão para volume",
          detail: `${formatMg(finalDosePerDose)} mg ÷ ${presentation.concentration_value} mg/mL = ${roundedVolume} mL.`,
        });
        if (presentation.drops_per_ml) {
          const drops = Math.round(volumeMl * presentation.drops_per_ml);
          result.presentation_drops = drops;
          result.drops_per_ml = presentation.drops_per_ml;
          calcSteps.push({
            step: "Conversão para gotas (fator verificado da apresentação)",
            detail: `${roundedVolume} mL × ${presentation.drops_per_ml} gotas/mL = ${drops} gotas.`,
          });
        }
      }
      // Quantidade total
      const totalUnits =
        result.presentation_quantity * regime.doses_per_day * regime.duration_days;
      result.total_quantity = Math.round(totalUnits * 100) / 100;
    } else if (!regime.allow_presentation_conversion) {
      result.presentation_quantity = null;
      calcSteps.push({
        step: "Conversão não autorizada",
        detail:
          "A monografia não autoriza conversão para esta apresentação. Use a dose em mg do princípio ativo.",
      });
    }
  } else {
    // Combinado: quantidade = 1 unidade por tomada
    result.dose_per_dose_mg = null;
    result.dose_per_day_mg = null;
    result.interval_hours = regime.interval_hours;
    result.doses_per_day = regime.doses_per_day;
    result.duration_days = regime.duration_days;
    result.presentation_quantity = 1;
    result.presentation_unit = presentation.unit;
    const totalUnits = 1 * regime.doses_per_day * regime.duration_days;
    result.total_quantity = totalUnits;
  }

  result.calculation_memory = calcSteps;
  result.monograph = getMonographById(medication.monograph_id);
  result.regime_type = regime.regime_type;
  result.requires_weight = regime.requires_weight;
  result.status = "calculated";

  return result;
}

// Invalidação: comparar contexto atual com snapshot anterior
export function contextSignature(context) {
  const keys = [
    "medicationId",
    "indicationId",
    "population",
    "routeId",
    "formId",
    "presentationId",
    "ageYears",
    "ageMonths",
    "ageDays",
    "weightKg",
  ];
  return keys.map((k) => `${k}=${context[k] ?? ""}`).join("|");
}

export function isContextStale(prevSignature, currentContext) {
  if (!prevSignature) return false;
  return prevSignature !== contextSignature(currentContext);
}