import React from "react";
import { Check, Plus, Copy } from "lucide-react";
import { CODE_SYSTEMS } from "@/lib/codesDatabase";

const accentMap = {
  sky: {
    badge: "bg-sky-100 text-sky-800",
    codeBg: "bg-sky-50 text-sky-900 border-sky-200",
  },
  violet: {
    badge: "bg-violet-100 text-violet-800",
    codeBg: "bg-violet-50 text-violet-900 border-violet-200",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-800",
    codeBg: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
};

export function CodeCard({ code, selected, onSelect, onCopy }) {
  const sys = CODE_SYSTEMS[code.system];
  const a = accentMap[sys?.accent] || accentMap.sky;
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        selected
          ? "border-blue-400 bg-blue-50/50 ring-1 ring-blue-300 shadow-soft"
          : "border-border bg-white hover:border-blue-300 hover:shadow-soft"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${a.badge}`}
            >
              {sys?.label || code.system}
            </span>
            <span
              className={`font-mono text-sm font-bold px-2 py-0.5 rounded border ${a.codeBg}`}
            >
              {code.code}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {code.validity}
            </span>
          </div>
          <h3 className="font-bold text-foreground text-sm leading-snug">
            {code.description}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{code.category}</p>
          {code.synonyms?.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground/60">Sinônimos: </span>
              {code.synonyms.join(" · ")}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelect(code)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selected
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-soft"
                : "bg-white border border-border text-foreground/70 hover:bg-accent"
            }`}
            aria-pressed={selected}
          >
            {selected ? (
              <>
                <Check className="w-3.5 h-3.5" /> Selecionado
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Selecionar
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onCopy(code)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-accent"
          >
            <Copy className="w-3.5 h-3.5" /> Copiar
          </button>
        </div>
      </div>
    </div>
  );
}