import React from "react";
import { AlertCard, BlockCard, SuccessBanner } from "@/components/calc/AlertCard";
import { ALERT_LEVELS } from "@/lib/medicationsDatabase";

export function StepResult({ calcResult, alerts, onConfirm, confirmed, onManualAdjust, manualNotes }) {
  const hasBlock = calcResult?.blocks?.length > 0 || alerts?.some((a) => a.level === ALERT_LEVELS.BLOCK);

  if (!calcResult || calcResult.status === "pending") {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
        Preencha as etapas anteriores para gerar o resultado do cálculo.
      </div>
    );
  }

  if (calcResult.status === "blocked") {
    return (
      <div className="space-y-4">
        {calcResult.blocks.map((b, i) => (
          <BlockCard key={i} block={b} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Aviso de uso profissional */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
        <strong>Resultado de referência.</strong> Cálculo com valores de referência — confirme a bula vigente antes de prescrever.
      </div>

      {/* Resultado calculado */}
      <div className="rounded-xl border-2 border-neutral-900 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-neutral-900">Resultado do cálculo</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white">
            Calculado
          </span>
        </div>

        {calcResult.is_combination ? (
          <div className="space-y-3">
            <p className="text-xs text-neutral-500 mb-2">
              Medicamento combinado — cada princípio ativo tem limites próprios:
            </p>
            {calcResult.components.map((c, i) => (
              <div key={i} className="rounded-lg bg-neutral-50 p-3 border border-neutral-200">
                <div className="font-semibold text-sm text-neutral-900">{c.active_ingredient}</div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                  <div><dt className="inline text-neutral-500">Dose/tomada: </dt><dd className="inline font-medium">{c.per_dose_mg} mg</dd></div>
                  <div><dt className="inline text-neutral-500">Dose/dia: </dt><dd className="inline font-medium">{c.per_day_mg} mg</dd></div>
                  <div><dt className="inline text-neutral-500">Limite/tomada: </dt><dd className="inline font-medium">{c.max_per_dose_mg} mg</dd></div>
                  <div><dt className="inline text-neutral-500">Limite/dia: </dt><dd className="inline font-medium">{c.max_per_day_mg} mg</dd></div>
                </dl>
                <div className={`text-xs font-medium mt-2 ${c.within_dose_limit && c.within_day_limit ? "text-emerald-600" : "text-red-600"}`}>
                  {c.within_dose_limit && c.within_day_limit
                    ? "Dentro dos limites"
                    : "Atenção: limite excedido"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Dose por tomada</dt>
              <dd className="text-2xl font-bold text-neutral-900 mt-0.5">{calcResult.dose_per_dose_mg} mg</dd>
            </div>
            {calcResult.presentation_quantity != null && (
              <div>
                <dt className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Apresentação</dt>
                <dd className="text-2xl font-bold text-neutral-900 mt-0.5">
                  {calcResult.presentation_quantity} {calcResult.presentation_unit}
                </dd>
                {calcResult.presentation_drops && (
                  <dd className="text-sm text-neutral-600">{calcResult.presentation_drops} gotas</dd>
                )}
              </div>
            )}
            <div>
              <dt className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Dose diária</dt>
              <dd className="text-lg font-semibold text-neutral-900 mt-0.5">{calcResult.dose_per_day_mg} mg</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Intervalo</dt>
              <dd className="text-lg font-semibold text-neutral-900 mt-0.5">
                {calcResult.interval_hours != null
                  ? `${calcResult.interval_hours} h (${calcResult.doses_per_day}x/dia)`
                  : `Dose única (${calcResult.doses_per_day}x)`}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Duração</dt>
              <dd className="text-lg font-semibold text-neutral-900 mt-0.5">{calcResult.duration_days} dias</dd>
            </div>
            {calcResult.total_quantity != null && (
              <div>
                <dt className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Quantidade total</dt>
                <dd className="text-lg font-semibold text-neutral-900 mt-0.5">{calcResult.total_quantity} {calcResult.presentation_unit}</dd>
              </div>
            )}
          </dl>
        )}

        {/* Limites aplicados */}
        {calcResult.limits && (calcResult.limits.dose_limit_applied || calcResult.limits.day_limit_applied || calcResult.limits.rounding_applied) && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Limites e arredondamentos aplicados</div>
            <ul className="space-y-1 text-xs text-neutral-700">
              {calcResult.limits.dose_limit_applied && (
                <li>Valor original: {calcResult.limits.original_dose_per_dose_mg} mg/tomada → limite aplicado: {calcResult.limits.max_per_dose_mg} mg</li>
              )}
              {calcResult.limits.day_limit_applied && (
                <li>Valor diário original: {calcResult.limits.original_dose_per_day_mg} mg → ajustado ao limite diário</li>
              )}
              {calcResult.limits.rounding_applied && (
                <li>Arredondamento aplicado conforme regra da monografia</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Memória de cálculo */}
      <details className="rounded-lg border border-neutral-200 bg-white">
        <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-neutral-700 select-none">
          Memória de cálculo (rastreabilidade)
        </summary>
        <div className="px-4 pb-4">
          <ol className="space-y-2 text-sm">
            {calcResult.calculation_memory.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-neutral-400 font-mono text-xs shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="font-medium text-neutral-800">{s.step}</div>
                  <div className="text-xs text-neutral-600">{s.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </details>

      {/* Monografia */}
      {calcResult.monograph && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h4 className="font-semibold text-neutral-900">Monografia</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
              v{calcResult.monograph.version}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Referência
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-600">
            <div><dt className="inline font-semibold">Revisor: </dt><dd className="inline">{calcResult.monograph.author}</dd></div>
            <div><dt className="inline font-semibold">Revisão: </dt><dd className="inline">{calcResult.monograph.review_date}</dd></div>
            <div className="col-span-2"><dt className="inline font-semibold">Referências: </dt><dd className="inline">{calcResult.monograph.references.join("; ")}</dd></div>
          </dl>
        </div>
      )}

      {/* Alertas */}
      {alerts?.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-neutral-900">Alertas de segurança</h4>
          {alerts.map((a, i) => (
            <AlertCard key={i} alert={a} />
          ))}
        </div>
      )}

      {/* Decisões do profissional (separação visual) */}
      <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-4">
        <h4 className="font-semibold text-sm text-neutral-900 mb-1">Decisões do profissional</h4>
        <p className="text-xs text-neutral-500 mb-3">
          Área para registro de ajustes manuais e justificativas. Esta informação é separada do cálculo automático.
        </p>
        <textarea
          value={manualNotes}
          onChange={(e) => onManualAdjust(e.target.value)}
          rows={3}
          placeholder="Ex.: Ajustei a duração para 5 dias conforme avaliação clínica do caso..."
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      {/* Confirmação expressa */}
      {!hasBlock && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => onConfirm(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <span className="text-sm text-neutral-700">
              Confirmo que revisei o resultado, os alertas de segurança e as limitações do sistema.
              Compreendo que este sistema <strong>apoia o julgamento profissional e não o substitui</strong>.
            </span>
          </label>
          {confirmed && (
            <SuccessBanner>
              Confirmação registrada. Você pode prosseguir para a prévia de receituário.
            </SuccessBanner>
          )}
        </div>
      )}
    </div>
  );
}