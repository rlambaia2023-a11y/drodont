import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, Pill, AlertTriangle, Hash } from "lucide-react";
import { searchMedications } from "@/lib/medicationsDatabase";
import { protocols } from "@/lib/emergencyProtocols";
import { searchCodes, getCodeKey } from "@/lib/codesDatabase";

const MIN_CHARS = 2;

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function onDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < MIN_CHARS) return null;

    const meds = searchMedications(q).slice(0, 5).map((m) => ({
      kind: "med",
      id: m.id,
      title: m.name,
      subtitle: m.active_ingredients.map((ai) => ai.name).join(" + "),
      to: `/calculadora?m=${encodeURIComponent(m.id)}`,
    }));

    const ql = q.toLowerCase();
    const protos = protocols
      .filter(
        (p) =>
          p.name.toLowerCase().includes(ql) ||
          p.summary.toLowerCase().includes(ql)
      )
      .slice(0, 5)
      .map((p) => ({
        kind: "proto",
        id: p.id,
        title: p.name,
        subtitle: p.summary,
        to: `/modulos/urgencias?p=${encodeURIComponent(p.id)}`,
      }));

    const codes = searchCodes(q, "ALL").slice(0, 5).map((c) => ({
      kind: "code",
      id: getCodeKey(c),
      title: `${c.code} · ${c.system}`,
      subtitle: c.description,
      to: `/modulos/codigos?q=${encodeURIComponent(c.code)}`,
    }));

    return { meds, protos, codes };
  }, [query]);

  const showPanel = open && results;
  const total = results
    ? results.meds.length + results.protos.length + results.codes.length
    : 0;

  function pick() {
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Buscar medicamento, protocolo ou código..."
        className="w-full pl-10 pr-9 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white focus:border-transparent"
        aria-label="Busca global"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setOpen(false);
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700"
          aria-label="Limpar busca"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {showPanel && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl border border-neutral-200 bg-white shadow-lg z-50 max-h-[70vh] overflow-y-auto">
          {total === 0 ? (
            <div className="p-6 text-center text-sm text-neutral-500">
              Nenhum resultado para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div>
              {results.meds.length > 0 && (
                <Section
                  icon={Pill}
                  label="Medicamentos"
                  items={results.meds}
                  onPick={pick}
                />
              )}
              {results.protos.length > 0 && (
                <Section
                  icon={AlertTriangle}
                  label="Protocolos de urgência"
                  items={results.protos}
                  onPick={pick}
                />
              )}
              {results.codes.length > 0 && (
                <Section
                  icon={Hash}
                  label="Códigos (CIAP / CID / SIGTAP)"
                  items={results.codes}
                  onPick={pick}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ icon: Icon, label, items, onPick }) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      {items.map((it) => (
        <Link
          key={it.kind + it.id}
          to={it.to}
          onClick={onPick}
          className="flex flex-col px-3 py-2 hover:bg-neutral-50 border-t border-neutral-100"
        >
          <span className="text-sm font-medium text-neutral-900 truncate">
            {it.title}
          </span>
          <span className="text-xs text-neutral-500 truncate">{it.subtitle}</span>
        </Link>
      ))}
    </div>
  );
}