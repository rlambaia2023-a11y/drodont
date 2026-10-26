// =============================================================================
// PROTOCOLOS DE URGÊNCIAS ODONTOLÓGICAS — REFERÊNCIA
// =============================================================================
// Protocolos de referência para emergências comuns no consultório odontológico.
// Apoiam a decisão do profissional — NÃO substituem avaliação clínica nem
// treinamento em suporte avançado de vida. Em emergência com risco de vida,
// acione o SAMU (192).
// =============================================================================

export const PROTOCOLS_VERSION = "1.0.0";
export const PROTOCOLS_REVIEW_DATE = "2026-10-06";
export const PROTOCOLS_DISCLAIMER =
  "Protocolos de referência. Apoiam a decisão — não substituem avaliação profissional. Em emergência com risco de vida, acione o SAMU (192).";

export const SEVERITY = {
  CRITICAL: "critical",
  URGENT: "urgent",
};

// Tipos de etapa do fluxo: assess | action | medication | refer
export const STEP_TYPES = {
  ASSESS: "assess",
  ACTION: "action",
  MEDICATION: "medication",
  REFER: "refer",
};

export const protocols = [
  // ============ EMERGÊNCIAS MÉDICAS ============
  {
    id: "anafilaxia",
    name: "Anafilaxia / reação alérgica grave",
    severity: SEVERITY.CRITICAL,
    summary:
      "Reação de hipersensibilidade sistêmica, rápida, com risco de via aérea e choque.",
    red_flags: [
      "Edema de via aérea (glote)/estridor ou dificuldade respiratória",
      "Hipotensão, taquicardia ou sinais de choque",
      "Broncoespasmo severo/sibilância",
      "Síncope ou alteração do nível de consciência",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Reconhecer",
        detail:
          "Início súbito após contato com alérgeno (medicação, látex, contraste), envolvendo pele (urticária) e/ou via aérea e circulação. Não espere evolução para agir.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Interromper a exposição",
        detail:
          "Suspender imediatamente o agente suspeito. Posicionar o paciente em decúbito dorsal com membros inferiores elevados.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Acionar o SAMU",
        detail: "Acionar o SAMU (192) imediatamente — não adie a adrenalina à espera de socorro.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Garantir via aérea",
        detail: "Oxigênio suplementar 10 L/min se disponível; monitorar pulso e respiração.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Adrenalina IM (1ª linha)",
        detail:
          "Adrenalina 0,3–0,5 mg IM (vasto lateral da coxa) no adulto; 0,01 mg/kg na criança. Repetir a cada 5–10 min se necessário.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Segunda linha (após adrenalina)",
        detail:
          "Anti-histamínico (difenhidramina) e corticoide (hidrocortisona) como adjuvantes — nunca no lugar da adrenalina.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail:
          "Encaminhar para emergência médica após estabilização — risco de reação bifásica nas 24h seguintes.",
      },
    ],
    medications: [
      { name: "Adrenalina (epinefrina)", role: "1ª linha", note: "0,3–0,5 mg IM adulto; 0,01 mg/kg criança" },
      { name: "Difenhidramina (anti-histamínico)", role: "2ª linha", note: "após adrenalina" },
      { name: "Hidrocortisona (corticoide)", role: "2ª linha", note: "após adrenalina" },
      { name: "Oxigênio", role: "Suporte", note: "10 L/min" },
    ],
    contraindications: [
      "Não adiar a adrenalina em anafilaxia — é a medida que salva.",
    ],
    referral: [
      "Sempre encaminhar ao SAMU e hospitalar — risco de reação bifásica nas 24h.",
    ],
    source: "Protocolo de emergências médicas em odontologia (referência)",
  },
  {
    id: "sincope",
    name: "Síncope / lipotimia",
    severity: SEVERITY.CRITICAL,
    summary: "Perda transitória de consciência, geralmente vasovagal no consultório.",
    red_flags: [
      "Não recupera a consciência em poucos minutos",
      "Convulsão ou movimentos anormais",
      "Dor torácica, palpitações ou dispneia",
      "Histórico cardíaco ou síncope de esforço",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Diferenciar",
        detail:
          "Síncope vasovagal (comum, breve, precedida de palidez/sudorese/náusea) vs. causas graves (cardíaca, hipoglicemia, embolia). Checar pulso e respiração.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Posicionar",
        detail:
          "Interromper o procedimento. Decúbito dorsal com membros inferiores elevados. Afrouxar roupas e garantir ventilação.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Monitorar sinais vitais",
        detail:
          "Se pulso/respiração ausentes, iniciar RCP imediatamente e acionar o SAMU.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Estímulos e conforto",
        detail: "Compressas frias ou amoníaco tônico se disponível; aguardar recuperação espontânea.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail:
          "Se não recuperar em 2–3 min ou houver sinais de gravidade, acionar o SAMU.",
      },
    ],
    medications: [
      { name: "—", role: "Geralmente não medicamentoso", note: "Recuperação espontânea na síncope vasovagal" },
    ],
    contraindications: [],
    referral: [
      "Encaminhar se síncope não vasovagal, recorrente ou em paciente cardíaco.",
    ],
    source: "Protocolo de emergências médicas em odontologia (referência)",
  },
  {
    id: "crise-hipertensiva",
    name: "Crise hipertensiva",
    severity: SEVERITY.CRITICAL,
    summary: "Elevação importante da pressão arterial, com ou sem lesão de órgão-alvo.",
    red_flags: [
      "PA ≥ 180/120 mmHg com lesão de órgão-alvo",
      "Cefaleia intensa, visão turva, toror ou déficit neurológico",
      "Dor torácica ou dispneia",
      "Epistaxe severa ou difícil controle",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Aferir e diferenciar",
        detail:
          "Aferir PA. Diferenciar elevação assintomática (adiar eletivo) de crise hipertensiva com lesão de órgão-alvo (urgência).",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Interromper e acalmar",
        detail: "Interromper o procedimento. Manter o paciente sentado e calmo; reavaliar a PA após 5–10 min em repouso.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Não reduzir abruptamente",
        detail:
          "Não reduzir a PA abruptamente — risco de isquemia. Não iniciar anti-hipertensivo no consultório odontológico sem avaliação médica.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail:
          "Acionar o SAMU se PA ≥ 180/120 com sintomas de lesão de órgão-alvo. Postergar procedimento eletivo e encaminhar ao médico se PA ≥ 140/90 não controlada.",
      },
    ],
    medications: [
      { name: "Encaminhamento médico", role: "Ajuste de anti-hipertensivos", note: "Não iniciar anti-hipertensivo no consultório odontológico" },
    ],
    contraindications: [],
    referral: [
      "Encaminhar à emergência se crise hipertensiva; adiar eletivo e encaminhar ao médico se descontrole pressórico.",
    ],
    source: "Protocolo de emergências médicas em odontologia (referência)",
  },
  {
    id: "hipoglicemia",
    name: "Hipoglicemia",
    severity: SEVERITY.CRITICAL,
    summary: "Glicemia baixa, comum em diabéticos, com risco de comprometimento neurológico.",
    red_flags: [
      "Confusão, letargia ou agitação",
      "Convulsão ou perda de consciência",
      "Diabético em uso de insulina/antidiabético",
      "Sudorese, tremor e palidez intensas",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Suspeitar e confirmar",
        detail:
          "Suspeitar em diabético com sudorese, tremor, confusão, palidez. Confirmar glicemia capilar se possível (< 70 mg/dL).",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Se consciente",
        detail: "Oferecer 15–20 g de carboidrato simples (açúcar, suco, balas) por via oral.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Reavaliar",
        detail: "Reavaliar em 15 min; repetir o carboidrato se a glicemia permanecer baixa.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Se inconsciente",
        detail:
          "NÃO oferecer nada por via oral. Posicionar em decúbito lateral e acionar o SAMU.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Glucagon (se inconsciente)",
        detail: "Glucagon 1 mg IM/SC no adulto, se disponível, enquanto aguarda o socorro.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail: "Encaminhar se não recuperar, se inconsciente ou se a causa não for esclarecida.",
      },
    ],
    medications: [
      { name: "Carboidrato simples (açúcar/suco)", role: "1ª linha (consciente)", note: "15–20 g" },
      { name: "Glucagon", role: "Inconsciente", note: "1 mg IM/SC adulto" },
    ],
    contraindications: [
      "Nunca oferecer via oral a paciente inconsciente — risco de aspiração.",
    ],
    referral: ["Acionar o SAMU se inconsciente ou sem recuperação."],
    source: "Protocolo de emergências médicas em odontologia (referência)",
  },
  {
    id: "hemorragia-pos-exodontia",
    name: "Hemorragia severa pós-exodontia",
    severity: SEVERITY.CRITICAL,
    summary: "Sangramento profuso ou persistente após exodontia/procedimento cirúrgico.",
    red_flags: [
      "Sangramento pulsátil ou profuso que não cede à compressão",
      "Hematoma expansivo",
      "Sinais de hipovolemia (taquicardia, palidez, hipotensão)",
      "Paciente em uso de anticoagulante/antiagregante",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Avaliar origem e intensidade",
        detail:
          "Verificar origem (alveolar, gengival, tecido mole) e intensidade; checar uso de anticoagulantes/antiagregantes e comorbidades.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Compressão local",
        detail: "Compressão local firme com gaze estéril por 20–30 min (mordida sobre o alvéolo).",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Hemostasia mecânica",
        detail:
          "Suturar o alvéolo/tecido mole se necessário; colocar colagulante local (esponja de gelatina/óxido de celulose) no alvéolo.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Orientar cuidados",
        detail:
          "Paciente sentado, evitar esforço/fisga/bochecho; orientar gelo local e morder gaze, sem bochechos nas primeiras horas.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail:
          "Acionar o SAMU se houver sinais de hipovolemia ou sangramento não controlado após as medidas; avaliação médica em anticoagulados com sangramento persistente.",
      },
    ],
    medications: [
      { name: "Esponja de gelatina / colagulante local", role: "Hemostasia local", note: "No alvéolo" },
      { name: "Sutura", role: "Mecânica", note: "Fechamento do alvéolo/tecido" },
    ],
    contraindications: [],
    referral: [
      "SAMU se hipovolemia; avaliação médica em anticoagulados com sangramento persistente.",
    ],
    source: "Protocolo de urgências odontológicas (referência)",
  },

  // ============ URGÊNCIAS ODONTOLÓGICAS ============
  {
    id: "abscesso-odontogenico",
    name: "Abscesso odontogênico / infecção aguda",
    severity: SEVERITY.URGENT,
    summary: "Infecção de origem dentária com edema, dor e potencial de propagação facial.",
    red_flags: [
      "Edema extenso cruzando linhas anatômicas",
      "Trismo, disfagia ou dispneia (compromisso de via aérea)",
      "Febre alta ou toxemia",
      "Infecção em espaços fasciais (submandibular, sublingual, retrofaríngeo)",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Avaliar extensão e via aérea",
        detail:
          "Avaliar origem dentária, extensão do edema, compromisso de via aérea e sinais sistêmicos. Priorizar drenagem do foco.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Tratar o foco",
        detail:
          "Drenagem do foco (incisão e drenagem) quando possível; desbridamento do canal/início de tratamento endodôntico ou exodontia do dente causador.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Antibiótico",
        detail:
          "Amoxicilina 500 mg 8/8h (adulto); em infecções graves, associar metronidazol; em alérgicos à penicilina, clindamicina 300 mg 6/6h.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Analgesia/AINE",
        detail: "Ibuprofeno 400–600 mg 8/8h para controle de dor e inflamação.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail:
          "Encaminhar ao SAMU/emergência se compromisso de via aérea, trismo importante, febre alta ou toxemia — risco de angina de Ludwig.",
      },
    ],
    medications: [
      { name: "Amoxicilina", role: "Antibiótico 1ª linha", note: "500 mg 8/8h adulto" },
      { name: "Metronidazol", role: "Cobertura anaeróbia", note: "400 mg 8/8h (associado)" },
      { name: "Clindamicina", role: "Alternativa (alérgico)", note: "300 mg 6/6h" },
      { name: "Ibuprofeno", role: "Analgesia/AINE", note: "400–600 mg 8/8h" },
    ],
    contraindications: [
      "Não prescrever antibiótico sem tratar o foco (drenagem/tratamento de canal) — a antibioticoterapia isolada não substitui o manejo do foco.",
    ],
    referral: [
      "SAMU se compromisso de via aérea/angina de Ludwig; manejo ambulatorial se estável.",
    ],
    source: "Protocolo de urgências odontológicas (referência)",
  },
  {
    id: "alveolite",
    name: "Alveolite (dor pós-exodontia)",
    severity: SEVERITY.URGENT,
    summary: "Dor intensa 2–3 dias após exodontia por desagregamento do coágulo do alvéolo.",
    red_flags: [
      "Febre ou edema crescente (sugere infecção, não alveolite)",
      "Trismo importante",
      "Sangramento ativo associado",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Confirmar quadro",
        detail:
          "Dor intensa 2–3 dias após exodontia, sem melhora com analgesia; alvéolo seco (ausência de coágulo) e hálito característico.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Irrigação e limpeza",
        detail:
          "Irrigação delicada do alvéolo com soro fisiológico; curetagem suave para remover debris, sem esfregar agressivamente.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Curativo oxidante",
        detail:
          "Introduzir curativo oxidante (eugenol/iodoformo) no alvéolo. Não curetar agressivamente — preservar tecido de granulação.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Analgesia sistêmica",
        detail: "Ibuprofeno 400 mg 8/8h ou paracetamol 750 mg 6/6h.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Reavaliar",
        detail:
          "Se surgirem sinais de infecção (febre, edema), reavaliar como infecção e não como alveolite.",
      },
    ],
    medications: [
      { name: "Curativo oxidante (eugenol/iodoformo)", role: "Tópico", note: "No alvéolo" },
      { name: "Ibuprofeno", role: "Analgesia", note: "400 mg 8/8h" },
      { name: "Paracetamol", role: "Alternativo", note: "750 mg 6/6h" },
    ],
    contraindications: [
      "Antibiótico geralmente NÃO indicado em alveolite sem infecção.",
    ],
    referral: ["Reavaliar se evolução para infecção."],
    source: "Protocolo de urgências odontológicas (referência)",
  },
  {
    id: "trauma-avulsao",
    name: "Trauma dental — avulsão",
    severity: SEVERITY.URGENT,
    summary: "Dente permanente completamente fora do alvéolo — o tempo extraoral é crítico.",
    red_flags: [
      "Trauma associado com perda de consciência/convulsão — avaliar TCE",
      "Fratura de mandíbula ou maxila",
      "Lesão extensa de tecido mole",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Confirmar avulsão e tempo",
        detail:
          "Confirmar avulsão (dente completo fora do alvéolo). Verificar o tempo extraoral — crítico para o prognóstico (ideal reimplante em até 30–60 min).",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Reimplantar (dente permanente)",
        detail:
          "Reimplantar imediatamente se possível, no adulto/criança com dente permanente. NÃO reimplantar dente decíduo.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Armazenar (se não reimplantar)",
        detail:
          "Armazenar em leite, soro fisiológico ou saliva (não em água, não em álcool). Limpar o alvéolo com soro se necessário; não esfregar a raiz.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Fixação e radiografia",
        detail:
          "Encaminhar ao dentista imediatamente para ferulização e radiografia; avaliar profilaxia antitetânica se solo contaminado.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail:
          "Dentista de plantão em até 30–60 min; SAMU se TCE ou fratura facial.",
      },
    ],
    medications: [
      { name: "—", role: "Manejo mecânico", note: "Reimplante + ferulização" },
      { name: "Profilaxia antitetânica", role: "Avaliar", note: "Se solo contaminado" },
    ],
    contraindications: [
      "NÃO reimplantar dente decíduo (risco de anquilose/dano ao sucessor permanente).",
      "NÃO esfregar/escovar a raiz — destrói o ligamento periodontal.",
    ],
    referral: ["Dentista imediato (≤ 60 min); SAMU se TCE ou fratura facial."],
    source: "Protocolo de trauma dental (referência)",
  },
  {
    id: "trauma-fratura-coronaria",
    name: "Trauma dental — fratura coronária",
    severity: SEVERITY.URGENT,
    summary: "Fratura do dente, com ou sem exposição pulpar.",
    red_flags: [
      "Exposição pulpar (dor ao ar/estímulos térmicos)",
      "Fratura radicular associada",
      "Luxação ou mobilidade aumentada",
      "TCE associado",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Classificar a fratura",
        detail:
          "Classificar (esmalte, esmalte-dentina, exposição pulpar, raiz). Testar vitalidade e mobilidade; radiografia periapical para descartar fratura radicular/luxação.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Sem exposição pulpar",
        detail:
          "Fratura de esmalte/dentina sem exposição: proteção com cimento de hidróxido de cálcio e restauração provisória; recuperar o fragmento se possível (reatamento com adesivo).",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Com exposição pulpar",
        detail:
          "Capeamento pulpar ou tratamento endodôntico conforme o tempo e a vitalidade pulpar.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Analgesia",
        detail: "Ibuprofeno 400 mg 8/8h se houver dor.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail: "Encaminhar para tratamento definitivo; SAMU se TCE.",
      },
    ],
    medications: [
      { name: "Hidróxido de cálcio", role: "Capeamento pulpar", note: "Sobre a exposição pulpar" },
      { name: "Ibuprofeno", role: "Analgesia", note: "400 mg 8/8h se dor" },
    ],
    contraindications: [],
    referral: ["Dentista para tratamento definitivo; SAMU se TCE."],
    source: "Protocolo de trauma dental (referência)",
  },
  {
    id: "dor-pulpar-aguda",
    name: "Dor pulpar aguda (pulpite irreversível)",
    severity: SEVERITY.URGENT,
    summary: "Dor espontânea, pulsátil e noturna, indicando inflamação pulpar irreversível.",
    red_flags: [
      "Edema facial associado",
      "Febre ou sinais sistêmicos",
      "Trismo (sugere propagação)",
    ],
    steps: [
      {
        type: STEP_TYPES.ASSESS,
        title: "Identificar o dente causador",
        detail:
          "Dor espontânea, pulsátil, noturna, prolongada ao frio/quente. Identificar o dente causador por teste térmico e percussão; radiografia periapical.",
      },
      {
        type: STEP_TYPES.ACTION,
        title: "Tratamento endodôntico de urgência",
        detail:
          "Abertura coronária e descompressão pulpar; exérese do tecido necrótico/pulpar, medicação intracanal (hidróxido de cálcio) e selamento provisório.",
      },
      {
        type: STEP_TYPES.MEDICATION,
        title: "Analgesia",
        detail: "Ibuprofeno 400–600 mg 8/8h ou paracetamol 750 mg 6/6h.",
      },
      {
        type: STEP_TYPES.REFER,
        title: "Encaminhar",
        detail:
          "Encaminhar para tratamento endodôntico definitivo; avaliar propagação para periapical (abscesso).",
      },
    ],
    medications: [
      { name: "Ibuprofeno", role: "Analgesia/AINE", note: "400–600 mg 8/8h" },
      { name: "Paracetamol", role: "Alternativo", note: "750 mg 6/6h" },
      { name: "Hidróxido de cálcio", role: "Medicação intracanal", note: "No canal" },
    ],
    contraindications: [
      "Antibiótico NÃO indicado em pulpite sem sinais sistêmicos ou propagação.",
    ],
    referral: ["Encaminhar para endodontista."],
    source: "Protocolo de urgências odontológicas (referência)",
  },
];

export function getProtocolsBySeverity(severity) {
  return protocols.filter((p) => p.severity === severity);
}

export function getProtocolById(id) {
  return protocols.find((p) => p.id === id) || null;
}