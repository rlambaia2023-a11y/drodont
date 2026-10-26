import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { StepIndicator } from "@/components/calc/StepIndicator";
import { StepMedication } from "@/components/calc/StepMedication";
import { StepPatient } from "@/components/calc/StepPatient";
import { StepSafety } from "@/components/calc/StepSafety";
import { StepResult } from "@/components/calc/StepResult";
import { StepPrescription } from "@/components/calc/StepPrescription";
import { SummaryPanel } from "@/components/calc/SummaryPanel";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { calculate, contextSignature, isContextStale } from "@/lib/calculationEngine";
import { runSafetyCheck } from "@/lib/safetyEngine";
import { getMedicationById } from "@/lib/medicationsDatabase";
import { useMedicationBase } from "@/lib/useMedicationBase";
import { base44 } from "@/api/base44Client";

const POP_ADULT = "adult";
const POP_PED = "pediatric";

export default function Calculadora() {
  const [population, setPopulation] = useState(POP_ADULT);
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [med, setMed] = useState({
    query: "",
    medicationId: "",
    medicationName: "",
    indicationId: "",
    routeId: "",
    formId: "",
    presentationId: "",
  });
  const [patient, setPatient] = useState({
    ageYears: null,
    ageMonths: null,
    weightKg: null,
    weightDate: "",
    allergiesText: "",
    currentMedsText: "",
    conditionsText: "",
    pregnancy: null,
    lactation: null,
  });
  const [calcResult, setCalcResult] = useState(null);
  const [safetyAlerts, setSafetyAlerts] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [manualNotes, setManualNotes] = useState("");
  const [staleNotice, setStaleNotice] = useState(false);
  const [prevSig, setPrevSig] = useState(null);

  const { version: baseVersion } = useMedicationBase();
  const medication = useMemo(() => getMedicationById(med.medicationId), [med.medicationId, baseVersion]);

  // Invalidation: any change to inputs invalidates prior calculation
  const currentSig = useMemo(
    () =>
      contextSignature({
        ...med,
        ...patient,
        population,
      }),
    [med, patient, population]
  );

  useEffect(() => {
    if (calcResult && prevSig && isContextStale(prevSig, { ...med, ...patient, population })) {
      setCalcResult(null);
      setSafetyAlerts([]);
      setConfirmed(false);
      setStaleNotice(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSig]);

  // Prefill medication from global search (?m=<id>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mId = params.get("m");
    if (mId) {
      const found = getMedicationById(mId);
      if (found) {
        setMed((prev) => ({
          ...prev,
          query: found.name,
          medicationId: found.id,
          medicationName: found.name,
          indicationId: "",
          routeId: "",
          formId: "",
          presentationId: "",
        }));
      }
    }
  }, []);

  function goTo(s) {
    if (s <= maxReached) setStep(s);
  }

  function next() {
    const n = Math.min(step + 1, 4);
    setStep(n);
    setMaxReached((m) => Math.max(m, n));
    if (n === 3) {
      // Run calculation when entering result
      runCalculation();
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setMed({ query: "", medicationId: "", medicationName: "", indicationId: "", routeId: "", formId: "", presentationId: "" });
    setPatient({ ageYears: null, ageMonths: null, weightKg: null, weightDate: "", allergiesText: "", currentMedsText: "", conditionsText: "", pregnancy: null, lactation: null });
    setCalcResult(null);
    setSafetyAlerts([]);
    setConfirmed(false);
    setManualNotes("");
    setStaleNotice(false);
    setPrevSig(null);
    setStep(0);
    setMaxReached(0);
  }

  function switchPopulation(pop) {
    setPopulation(pop);
    setMed((m) => ({ ...m, indicationId: "", routeId: "", formId: "", presentationId: "" }));
    setCalcResult(null);
    setSafetyAlerts([]);
    setConfirmed(false);
    setStep(0);
    setMaxReached(0);
  }

  function runCalculation() {
    if (!medication) {
      setCalcResult(null);
      return;
    }
    // Parse allergies / meds / conditions from text
    const allergies = (patient.allergiesText || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && s !== "nenhuma" && s !== "nenhum")
      .map((s) => ({ substance: s }));
    const currentMedications = (patient.currentMedsText || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s.toLowerCase() !== "nenhum" && s.toLowerCase() !== "nenhuma")
      .map((s) => ({ name: s }));
    const clinicalConditions = (patient.conditionsText || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && s !== "nenhuma" && s !== "nenhum")
      .map((s) => ({ label: s, key: s }));

    const ctx = {
      medication,
      indicationId: med.indicationId,
      population,
      routeId: med.routeId,
      formId: med.formId,
      presentationId: med.presentationId,
      ageYears: patient.ageYears,
      ageMonths: patient.ageMonths,
      weightKg: patient.weightKg,
      allergies,
      currentMedications,
      clinicalConditions,
      pregnancy: patient.pregnancy,
      lactation: patient.lactation,
    };

    const result = calculate(ctx);
    setCalcResult(result);
    setPrevSig(currentSig);
    setStaleNotice(false);

    if (result.status !== "blocked") {
      const alerts = runSafetyCheck(ctx, result);
      setSafetyAlerts(alerts);
    } else {
      setSafetyAlerts([]);
    }
  }

  async function handleSaveNominal(patientName) {
    try {
      await base44.entities.SavedCase.create({
        patient_name: patientName,
        patient_id: patient.patient_id || null,
        population,
        medication_id: med.medicationId,
        medication_name: med.medicationName,
        indication_id: med.indicationId,
        route_id: med.routeId,
        presentation_id: med.presentationId,
        patient_age_years: patient.ageYears,
        patient_age_months: patient.ageMonths,
        patient_weight_kg: patient.weightKg,
        weight_measure_date: patient.weightDate || null,
        calculation_result: calcResult,
        alerts: safetyAlerts,
        base_version: calcResult?.base_version,
        professional_notes: manualNotes,
        status: "draft",
      });
    } catch (e) {
      console.error("Erro ao salvar caso:", e);
    }
  }

  const canAdvance = useMemo(() => {
    if (step === 0) return med.medicationId && med.indicationId && med.routeId && med.formId && med.presentationId;
    if (step === 1) return patient.ageYears != null;
    return true;
  }, [step, med, patient]);

  const stepTitles = [
    "Indicação e medicamento",
    "Características do paciente",
    "Conferência de segurança",
    "Resultado rastreável",
    "Receituário opcional",
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Calculadora de medicamentos</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-neutral-500">
            Cálculo de doses para adulto e criança/adolescente — valores de referência de fontes padrão.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </button>
      </div>

      {/* Population selector */}
      <div className="inline-flex rounded-lg border border-neutral-300 bg-white p-1" role="tablist" aria-label="População">
        <button
          type="button"
          role="tab"
          aria-selected={population === POP_ADULT}
          onClick={() => switchPopulation(POP_ADULT)}
          className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
            population === POP_ADULT ? "bg-neutral-900 text-white" : "text-neutral-600"
          }`}
        >
          Adulto
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={population === POP_PED}
          onClick={() => switchPopulation(POP_PED)}
          className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
            population === POP_PED ? "bg-neutral-900 text-white" : "text-neutral-600"
          }`}
        >
          Criança/adolescente
        </button>
      </div>

      {/* Stale notice */}
      {staleNotice && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          Os dados foram alterados. O cálculo anterior foi invalidado — recalcule para obter um resultado vigente.
        </div>
      )}

      {/* Step indicator */}
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <StepIndicator current={step} onStepClick={goTo} maxReached={maxReached} />
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main step area */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h2 className="font-bold text-lg text-neutral-900 mb-1">{stepTitles[step]}</h2>
          <p className="text-xs text-neutral-500 mb-5">
            Etapa {step + 1} de 5
          </p>

          <div className="min-h-[300px]">
            {step === 0 && <StepMedication value={med} onChange={setMed} />}
            {step === 1 && <StepPatient population={population} value={patient} onChange={setPatient} />}
            {step === 2 && <StepSafety alerts={safetyAlerts} blocks={calcResult?.blocks || []} />}
            {step === 3 && (
              <StepResult
                calcResult={calcResult}
                alerts={safetyAlerts}
                confirmed={confirmed}
                onConfirm={setConfirmed}
                manualNotes={manualNotes}
                onManualAdjust={setManualNotes}
              />
            )}
            {step === 4 && (
              <StepPrescription
                calcResult={calcResult}
                med={medication}
                patient={patient}
                population={population}
                onSaveNominal={handleSaveNominal}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-neutral-100">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canAdvance}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 2 ? "Calcular" : "Avançar"} <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-neutral-400">Etapa final</span>
            )}
          </div>
        </div>

        {/* Summary sidebar (desktop) */}
        <div className="hidden lg:block">
          <SummaryPanel
            population={population}
            med={medication}
            patient={patient}
            calcResult={calcResult}
            alerts={safetyAlerts}
          />
        </div>
      </div>

      {/* Mobile review step */}
      {step >= 3 && (
        <div className="lg:hidden rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="font-semibold text-sm text-neutral-900 mb-3">Revisão (mobile)</h3>
          <SummaryPanel
            population={population}
            med={medication}
            patient={patient}
            calcResult={calcResult}
            alerts={safetyAlerts}
          />
        </div>
      )}
    </div>
  );
}