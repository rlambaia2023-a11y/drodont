import React from "react";
import { X, ClipboardCopy, CheckCheck } from "lucide-react";
import { CODE_SYSTEMS } from "@/lib/codesDatabase";

export function SelectedCodesPanel({ selected, onRemove, onClear, onCopyAll, copiedAll }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sticky top-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
          Códigos selecionados
          <span className="text-xs font-normal text-neutral-400">
            ({selected.length})
          </span>
        </h2>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
          >
            Limpar
          </button>
        )}
      </div>

      {selected.length === 0 ? (
        <p className="text-xs text-neutral-400 leading-relaxed">
          Nenhum código selecionado. Use o botão <strong>Selecionar</strong> ao
          lado de um código para montar o conjunto que você usará no
          prontuário.
        </p>
      ) : (
        <>
          <ul className="space-y-2 mb-3">
            {selected.map((c) => {
              const sys = CODE_SYSTEMS[c.system];
              return (
                <li
                  key={`${c.system}-${c.code}`}
                  className="flex items-start justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                        {sys?.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-900">
                        {c.code}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-snug mt-0.5 truncate">
                      {c.short_description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(c)}
                    className="text-neutral-400 hover:text-neutral-900 shrink-0"
                    aria-label={`Remover ${c.system} ${c.code}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={onCopyAll}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
          >
            {copiedAll ? (
              <>
                <CheckCheck className="w-4 h-4" /> Copiado!
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" /> Copiar todos
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}