import React, { useState, useMemo, useEffect } from "react";
import { Search, ShieldAlert, GitCompare } from "lucide-react";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { InteractionCard, SEVERITY_CONFIG } from "@/components/interactions/InteractionCard";
import { InteractionDetail } from "@/components/interactions/InteractionDetail";
import { Input } from "@/components/ui/input";
import { interactions, INTERACTIONS_VERSION } from "@/lib/interactionsDatabase";
import { ALERT_LEVELS } from "@/lib/medicationsDatabase";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: ALERT_LEVELS.BLOCK, label: "Evitar" },
  { id: ALERT_LEVELS.REVIEW, label: "Revisar" },
  { id: ALERT_LEVELS.INFO, label: "Informativo" },
];

export default function Interacoes() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const i = params.get("i");
    if (i && interactions.find((x) => x.id === i)) setSelectedId(i);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return interactions.filter((x) => {
      const matchSev = severity === "all" || x.severity === severity;
      if (!matchSev) return false;
      if (!q) return true;
      const hay = [x.drug_a, x.drug_b, x.mechanism, x.clinical_effect, x.management]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, severity]);

  const selected = selectedId ? interactions.find((x) => x.id === selectedId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <DemoBadge />
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Interações v{INTERACTIONS_VERSION}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Interações medicamentosas
        </h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          Fonte, gravidade revisada, mecanismo e opções de manejo sujeitas à
          avaliação profissional. Selecione um par para ver o detalhamento.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 flex gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          Base de interações de referência. Apoia a decisão — não substitui a
          consulta a fontes oficiais nem a avaliação do profissional diante do
          quadro do paciente.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar fármaco ou efeito..."
          className="pl-10"
        />
      </div>

      {/* Severity filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSeverity(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              severity === f.id
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
          <GitCompare className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Nenhuma interação encontrada.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((x) => (
            <InteractionCard
              key={x.id}
              interaction={x}
              active={selectedId === x.id}
              onClick={() => setSelectedId(x.id)}
            />
          ))}
        </div>
      )}

      {/* Detail */}
      {selected ? (
        <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4 capitalize">
            {selected.drug_a} × {selected.drug_b}
          </h2>
          <InteractionDetail interaction={selected} />
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
          <GitCompare className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">
            Selecione um par acima para ver mecanismo, efeito clínico e manejo.
          </p>
        </div>
      )}
    </div>
  );
}