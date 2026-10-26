import React, { useState, useEffect } from "react";
import { Bookmark, ChevronDown, Check, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { CATEGORY_META } from "@/components/receitas/TemplateCard";

export function TemplatePicker({ onApply }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [appliedId, setAppliedId] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await base44.entities.PrescriptionTemplate.list("-updated_date", 100);
        if (active) setTemplates(data || []);
      } catch {
        if (active) setTemplates([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest("[data-template-picker]")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = templates.filter((t) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      (t.medication_name || "").toLowerCase().includes(q) ||
      (t.situation || "").toLowerCase().includes(q)
    );
  });

  function handleApply(tpl) {
    onApply(tpl);
    setAppliedId(tpl.id);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4" data-template-picker>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Bookmark className="w-4 h-4 text-white" />
        </span>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-neutral-900">Carregar modelo salvo</h3>
          <p className="text-xs text-neutral-500">
            Preenche automaticamente medicamentos, posologia, orientações e notas.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50"
      >
        <span className="flex items-center gap-2">
          <Search className="w-4 h-4 text-neutral-400" />
          {appliedId
            ? templates.find((t) => t.id === appliedId)?.name || "Modelo aplicado"
            : loading
            ? "Carregando modelos..."
            : templates.length === 0
            ? "Nenhum modelo salvo"
            : "Selecionar modelo..."}
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-neutral-200 bg-white shadow-soft max-h-72 overflow-auto">
          <div className="p-2 border-b border-neutral-100 sticky top-0 bg-white">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Buscar por nome, medicamento ou situação..."
              className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-neutral-500">
              {templates.length === 0
                ? "Nenhum modelo salvo. Crie modelos na página Receituários."
                : "Nenhum modelo encontrado."}
            </div>
          ) : (
            <ul className="py-1">
              {filtered.map((t) => {
                const meta = CATEGORY_META[t.category] || CATEGORY_META.outro;
                const isApplied = t.id === appliedId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => handleApply(t)}
                      className={`w-full text-left px-3 py-2.5 hover:bg-neutral-50 flex items-start gap-2 ${isApplied ? "bg-blue-50/50" : ""}`}
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-neutral-900 truncate">{t.name}</span>
                          {isApplied && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">{t.medication_name}</div>
                        {t.situation && <div className="text-[11px] text-neutral-400 truncate">{t.situation}</div>}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}