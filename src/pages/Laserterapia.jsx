import React, { useState, useMemo, useEffect } from "react";
import { Search, ShieldAlert, Zap } from "lucide-react";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { LaserCard } from "@/components/laser/LaserCard";
import { LaserDetail } from "@/components/laser/LaserDetail";
import { Input } from "@/components/ui/input";
import {
  protocols,
  CATEGORIES,
  LASER_VERSION,
  LASER_REVIEW_DATE,
  LASER_DISCLAIMER,
  getLaserProtocolById,
} from "@/lib/laserProtocols";

export default function Laserterapia() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p && getLaserProtocolById(p)) setSelectedId(p);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return protocols.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      const hay = [p.name, p.summary, ...(p.indications || [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  const selected = selectedId ? getLaserProtocolById(selectedId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <DemoBadge />
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Fotobiomodulação v{LASER_VERSION}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Laserterapia / fotobiomodulação
        </h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          Indicações, contraindicações, proteção ocular e parâmetros por protocolo.
          Selecione um protocolo para ver o detalhamento.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 flex gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          {LASER_DISCLAIMER} Revisão base: {LASER_REVIEW_DATE}.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar protocolo ou indicação..."
          className="pl-10"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              category === c.id
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
          <Zap className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Nenhum protocolo encontrado.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((p) => (
            <LaserCard
              key={p.id}
              protocol={p}
              active={selectedId === p.id}
              onClick={() => setSelectedId(p.id)}
            />
          ))}
        </div>
      )}

      {/* Detail */}
      {selected ? (
        <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white">
              {selected.wavelength_nm}
            </span>
            <h2 className="text-xl font-bold text-neutral-900">{selected.name}</h2>
          </div>
          <p className="text-sm text-neutral-600 mb-5">{selected.summary}</p>
          <LaserDetail protocol={selected} />
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
          <Zap className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">
            Selecione um protocolo acima para ver parâmetros, indicações e proteção ocular.
          </p>
        </div>
      )}
    </div>
  );
}