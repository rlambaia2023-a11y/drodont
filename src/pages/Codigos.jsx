import React, { useState, useMemo, useEffect } from "react";
import { Search, X, ShieldAlert } from "lucide-react";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { CodeCard } from "@/components/codes/CodeCard";
import { SelectedCodesPanel } from "@/components/codes/SelectedCodesPanel";
import {
  searchCodes,
  getCodeKey,
  CODE_SYSTEMS,
  CODES_BASE_VERSION,
  CODES_BASE_REVIEW_DATE,
  CODES_BASE_DISCLAIMER,
} from "@/lib/codesDatabase";

const SYSTEM_TABS = [
  { id: "ALL", label: "Todos" },
  { id: "CIAP-2", label: "CIAP-2" },
  { id: "CID-10", label: "CID-10" },
  { id: "SIGTAP", label: "SIGTAP" },
];

const STORAGE_KEY = "dosecerta.selectedCodes";

export default function Codigos() {
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState("ALL");
  const [selected, setSelected] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Persist selected codes locally (prontuário em construção)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelected(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      /* ignore */
    }
  }, [selected]);

  // Prefill search from global search (?q=<query>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, []);

  const results = useMemo(
    () => searchCodes(query, systemFilter),
    [query, systemFilter]
  );

  const selectedKeys = useMemo(
    () => new Set(selected.map(getCodeKey)),
    [selected]
  );

  function handleSelect(code) {
    const key = getCodeKey(code);
    setSelected((prev) => {
      if (prev.some((c) => getCodeKey(c) === key)) {
        return prev.filter((c) => getCodeKey(c) !== key);
      }
      return [...prev, code];
    });
  }

  function handleRemove(code) {
    setSelected((prev) => prev.filter((c) => getCodeKey(c) !== getCodeKey(code)));
  }

  function copyText(code) {
    return `${code.system}\t${code.code}\t${code.description}`;
  }

  async function handleCopy(code) {
    try {
      await navigator.clipboard.writeText(copyText(code));
      const key = getCodeKey(code);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      /* ignore */
    }
  }

  async function handleCopyAll() {
    if (selected.length === 0) return;
    const text = selected.map(copyText).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <DemoBadge />
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Base {CODES_BASE_VERSION}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Consulta de códigos CIAP / CID / SIGTAP
        </h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          Busque e selecione os códigos corretos para o preenchimento do
          prontuário. Os códigos selecionados ficam reunidos no painel lateral
          e podem ser copiados para registro.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 flex gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          {CODES_BASE_DISCLAIMER} Revisão base: {CODES_BASE_REVIEW_DATE}. Em
          produção, as terminologias oficiais vigentes substituem esta base
          demonstrativa.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Search + results */}
        <div className="space-y-4 min-w-0">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, descrição ou sinônimo…"
              className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              aria-label="Buscar códigos"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* System filter */}
          <div
            className="flex flex-wrap gap-1.5"
            role="tablist"
            aria-label="Filtrar por sistema de classificação"
          >
            {SYSTEM_TABS.map((t) => {
              const active = systemFilter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSystemFilter(t.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              {results.length} resultado{results.length === 1 ? "" : "s"}
              {query && (
                <>
                  {" "}para <strong className="text-neutral-700">“{query}”</strong>
                </>
              )}
            </p>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <p className="text-sm text-neutral-500">
                Nenhum código encontrado. Ajuste a busca ou o filtro de sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((c) => (
                <CodeCard
                  key={`${c.system}-${c.code}`}
                  code={c}
                  selected={selectedKeys.has(getCodeKey(c))}
                  onSelect={handleSelect}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </div>

        {/* Selected panel */}
        <div className="lg:block">
          <SelectedCodesPanel
            selected={selected}
            onRemove={handleRemove}
            onClear={() => setSelected([])}
            onCopyAll={handleCopyAll}
            copiedAll={copiedAll}
          />
        </div>
      </div>
    </div>
  );
}