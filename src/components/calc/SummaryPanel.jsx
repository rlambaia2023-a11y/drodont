import React from "react";
import { Pill, User, ShieldCheck, FileText } from "lucide-react";

export function SummaryPanel({ population, med, patient, calcResult, alerts }) {
  const hasBlock = alerts?.some((a) => a.level === "block") || calcResult?.blocks?.length > 0;
  const hasReview = alerts?.some((a) => a.level === "review");
  const popLabel = population === "adult" ? "Adulto" : "Criança/adolescente";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 sticky top-20">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
        Resumo do cálculo
      </h3>

      <div className="space-y-4 text-sm">
        <div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-1">
            <User className="w-3.5 h-3.5" /> Paciente
          </div>
          <dl className="space-y-0.5">
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-500">População</dt>
              <dd className="font-medium text-neutral-900 text-right">{popLabel}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-500">Idade</dt>
              <dd className="font-medium text-neutral-900 text-right">
                {patient.ageYears != null ? `${patient.ageYears} anos` : "—"}
                {patient.ageMonths ? ` ${patient.ageMonths}m` : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-500">Peso</dt>
              <dd className="font-medium text-neutral-900 text-right">
                {patient.weightKg != null ? `${patient.weightKg} kg` : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-1">
            <Pill className="w-3.5 h-3.5" /> Medicamento
          </div>
          <div className="font-medium text-neutral-900">{med?.name || "Não selecionado"}</div>
          {med?.active_ingredients && (
            <div className="text-xs text-neutral-500 mt-0.5">
              {med.active_ingredients.map((a) => a.name).join(" + ")}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Segurança
          </div>
          {hasBlock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Bloqueio ativo
            </span>
          ) : hasReview ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Revisão obrigatória
            </span>
          ) : alerts?.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Informativo
            </span>
          ) : calcResult?.status === "calculated" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sem alertas
            </span>
          ) : (
            <span className="text-xs text-neutral-400">Aguardando cálculo</span>
          )}
        </div>

        {calcResult?.status === "calculated" && (
          <div className="pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-2">
              <FileText className="w-3.5 h-3.5" /> Resultado
            </div>
            {calcResult.is_combination ? (
              <div className="space-y-1">
                {calcResult.components.map((c, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-medium text-neutral-900">{c.active_ingredient}:</span>{" "}
                    {c.per_dose_mg} mg/tomada
                  </div>
                ))}
              </div>
            ) : (
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Dose/tomada</dt>
                  <dd className="font-bold text-neutral-900">{calcResult.dose_per_dose_mg} mg</dd>
                </div>
                {calcResult.presentation_quantity != null && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Apresentação</dt>
                    <dd className="font-medium text-neutral-900">
                      {calcResult.presentation_quantity} {calcResult.presentation_unit}
                      {calcResult.presentation_drops ? ` (${calcResult.presentation_drops} gotas)` : ""}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Intervalo</dt>
                  <dd className="font-medium text-neutral-900">
                    {calcResult.interval_hours != null ? `${calcResult.interval_hours}h` : "Dose única"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Duração</dt>
                  <dd className="font-medium text-neutral-900">{calcResult.duration_days} dias</dd>
                </div>
              </dl>
            )}
          </div>
        )}
      </div>
    </div>
  );
}