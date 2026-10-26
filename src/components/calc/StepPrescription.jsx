import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, FileText, Lock } from "lucide-react";

export function StepPrescription({ calcResult, med, patient, population, onSaveNominal }) {
  const [patientName, setPatientName] = useState("");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  function handlePrint() {
    window.print();
  }

  function handleSave() {
    if (!patientName.trim()) return;
    onSaveNominal(patientName.trim());
    setSaved(true);
  }

  if (!calcResult || calcResult.status !== "calculated") {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
        Gere e confirme o resultado do cálculo para acessar a prévia de receituário.
      </div>
    );
  }

  const popLabel = population === "adult" ? "Adulto" : "Criança/adolescente";

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
        <strong>Prévia de receituário.</strong> Documento gerado com valores de referência de fontes padrão.
        Não possui validade jurídica ou clínica. Verifique os requisitos legais vigentes antes de qualquer uso real.
      </div>

      {/* Solicitação de nome apenas aqui */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex items-start gap-2 mb-3">
          <Lock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-neutral-900">Salvar caso nominal (opcional)</h4>
            <p className="text-xs text-neutral-500">
              O nome do paciente é solicitado apenas neste momento. Cálculos anônimos não armazenam identificação.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Nome do paciente (opcional)"
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!patientName.trim() || saved}
            className="px-4 py-2 rounded-lg bg-neutral-100 border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? "Salvo" : "Salvar rascunho"}
          </button>
        </div>
        {saved && (
          <p className="text-xs text-emerald-700 mt-2">
            Caso salvo como rascunho. Reutilização exige atualização dos dados e recálculo com a base vigente.
          </p>
        )}
      </div>

      {/* Prévia do receituário */}
      <div className="rounded-xl border border-neutral-300 bg-white p-6 sm:p-8 print:shadow-none print:border-0" id="prescription-print">
        <div className="text-center mb-6 pb-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Receituário — Prévia</h2>
          <p className="text-xs text-neutral-500 mt-1">DoseCerta · Base de referência v{calcResult.base_version}</p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Paciente</span>
              <p className="font-medium text-neutral-900">{patientName || "Anônimo (não identificado)"}</p>
            </div>
            <div>
              <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">População</span>
              <p className="font-medium text-neutral-900">{popLabel}</p>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <div className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> {med?.name}
            </div>
            {calcResult.is_combination ? (
              <div className="space-y-1 pl-6">
                {calcResult.components.map((c, i) => (
                  <div key={i} className="text-sm text-neutral-700">
                    {c.active_ingredient}: {c.per_dose_mg} mg por tomada
                  </div>
                ))}
                <div className="text-sm text-neutral-700 mt-1">
                  Tomar {calcResult.presentation_quantity} {calcResult.presentation_unit}, {calcResult.doses_per_day}x ao dia
                </div>
              </div>
            ) : (
              <div className="pl-6 space-y-1">
                <p className="text-neutral-800">
                  <strong>{calcResult.dose_per_dose_mg} mg</strong> por tomada
                  {calcResult.presentation_quantity != null && (
                    <span> ({calcResult.presentation_quantity} {calcResult.presentation_unit}
                      {calcResult.presentation_drops ? ` = ${calcResult.presentation_drops} gotas` : ""})</span>
                  )}
                </p>
                <p className="text-neutral-700">
                  {calcResult.doses_per_day}x ao dia, a cada {calcResult.interval_hours} horas
                </p>
                <p className="text-neutral-700">Por {calcResult.duration_days} dias</p>
                {calcResult.total_quantity != null && (
                  <p className="text-neutral-700">Quantidade total: {calcResult.total_quantity} {calcResult.presentation_unit}</p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100 pt-4 text-xs text-neutral-500">
            <p><strong>Monografia:</strong> {calcResult.monograph?.id} — v{calcResult.monograph?.version} (referência)</p>
            <p><strong>Revisão:</strong> {calcResult.monograph?.review_date}</p>
            <p className="mt-2 italic">
              Este documento é uma prévia gerada com valores de referência de fontes padrão.
              Não possui validade jurídica, clínica ou prescritiva. Verifique os requisitos legais vigentes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800"
        >
          <Printer className="w-4 h-4" /> Imprimir prévia
        </button>
        <button
          type="button"
          onClick={() =>
            navigate("/modulos/receita", {
              state: { calcResult, med, patient, population, patientName },
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          <FileText className="w-4 h-4" /> Abrir gerador de receita formal
        </button>
      </div>
    </div>
  );
}