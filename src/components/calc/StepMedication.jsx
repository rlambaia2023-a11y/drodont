import React, { useState, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import { searchMedications, getRoute, getForm } from "@/lib/medicationsDatabase";
import { useMedicationBase } from "@/lib/useMedicationBase";

export function StepMedication({ value, onChange }) {
  const [query, setQuery] = useState(value.query || "");
  const { version: baseVersion } = useMedicationBase();
  const results = useMemo(() => searchMedications(query), [query, baseVersion]);

  function selectMed(med) {
    onChange({
      ...value,
      query,
      medicationId: med.id,
      medicationName: med.name,
      indicationId: "",
      routeId: "",
      formId: "",
      presentationId: "",
    });
  }

  const med = results.find((m) => m.id === value.medicationId);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="med-search" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Pesquisar princípio ativo ou sinônimo
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
          <input
            id="med-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: amoxicilina, ibuprofeno, lidocaína..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-neutral-500 mt-1.5">
          Valores de referência de fontes padrão. Confirme sempre a bula vigente.
        </p>
      </div>

      {/* Lista de medicamentos */}
      <div className="grid gap-2">
        {results.map((m) => {
          const active = m.id === value.medicationId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => selectMed(m)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                active
                  ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-neutral-900">{m.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {m.active_ingredients.map((ai) => ai.name).join(" + ")}
                    {m.is_combination && " (combinado)"}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Seleção detalhada após escolher medicamento */}
      {med && (
        <div className="space-y-5 pt-4 border-t border-neutral-200">
          <div>
            <span className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Indicação odontológica
            </span>
            <div className="grid gap-2">
              {med.indications.map((ind) => {
                const active = ind.id === value.indicationId;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() =>
                      onChange({ ...value, indicationId: ind.id, routeId: "", formId: "", presentationId: "" })
                    }
                    className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                      active ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"
                    }`}
                    aria-pressed={active}
                  >
                    {ind.label}
                    <span className="block text-xs text-neutral-500 mt-0.5">
                      Populações: {ind.populations.map((p) => (p === "adult" ? "Adulto" : "Criança/adolescente")).join(", ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {value.indicationId && (
            <>
              <div>
                <label htmlFor="route-select" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Via de administração
                </label>
                <select
                  id="route-select"
                  value={value.routeId}
                  onChange={(e) => onChange({ ...value, routeId: e.target.value, formId: "", presentationId: "" })}
                  className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="">Selecione a via...</option>
                  {med.routes.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              {value.routeId && (
                <div>
                  <label htmlFor="form-select" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    Forma farmacêutica
                  </label>
                  <select
                    id="form-select"
                    value={value.formId}
                    onChange={(e) => onChange({ ...value, formId: e.target.value, presentationId: "" })}
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="">Selecione a forma...</option>
                    {getRoute(med, value.routeId).forms.map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {value.formId && (
                <div>
                  <span className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    Apresentação / concentração exata
                  </span>
                  <div className="grid gap-2">
                    {getForm(med, value.routeId, value.formId).presentations.map((p) => {
                      const active = p.id === value.presentationId;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => onChange({ ...value, presentationId: p.id })}
                          className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                            active ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"
                          }`}
                          aria-pressed={active}
                        >
                          <div className="font-medium text-neutral-900">{p.label}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            Concentração: {p.concentration_value ? `${p.concentration_value} ${p.concentration_unit}` : p.concentration_unit}
                            {p.drops_per_ml ? ` · ${p.drops_per_ml} gotas/mL` : ""}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}