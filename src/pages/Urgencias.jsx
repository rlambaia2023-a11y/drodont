import React, { useState, useEffect } from "react";
import {
  AlertTriangle, Siren, HeartPulse, Droplet, ShieldAlert, Thermometer, Activity, Bone as Tooth, Zap, Phone
} from "lucide-react";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { EmergencyCard } from "@/components/emergency/EmergencyCard";
import { ProtocolFlow } from "@/components/emergency/ProtocolFlow";
import {
  getProtocolsBySeverity,
  getProtocolById,
  SEVERITY,
  PROTOCOLS_VERSION,
  PROTOCOLS_REVIEW_DATE,
  PROTOCOLS_DISCLAIMER,
} from "@/lib/emergencyProtocols";

const iconMap = {
  anafilaxia: Siren,
  sincope: HeartPulse,
  "crise-hipertensiva": Activity,
  hipoglicemia: Droplet,
  "hemorragia-pos-exodontia": Droplet,
  "abscesso-odontogenico": Thermometer,
  alveolite: Tooth,
  "trauma-avulsao": Tooth,
  "trauma-fratura-coronaria": Tooth,
  "dor-pulpar-aguda": Zap,
};

export default function Urgencias() {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p && getProtocolById(p)) setSelectedId(p);
  }, []);

  const critical = getProtocolsBySeverity(SEVERITY.CRITICAL);
  const urgent = getProtocolsBySeverity(SEVERITY.URGENT);
  const selected = selectedId ? getProtocolById(selectedId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <DemoBadge />
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Protocolos v{PROTOCOLS_VERSION}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Protocolos de urgências odontológicas
        </h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          Condutas imediatas para emergências comuns no consultório. Selecione
          o quadro para ver o fluxo passo a passo.
        </p>
      </div>

      {/* SAMU banner */}
      <div className="rounded-lg border border-red-300 bg-red-50 p-3 flex items-center gap-3">
        <Phone className="w-5 h-5 text-red-600 shrink-0" />
        <p className="text-sm text-red-900">
          <strong>Emergência com risco de vida?</strong> Acione imediatamente o
          SAMU — <strong>192</strong>. Não adie a adrenalina nem o socorro.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 flex gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          {PROTOCOLS_DISCLAIMER} Revisão base: {PROTOCOLS_REVIEW_DATE}.
        </p>
      </div>

      {/* Quick access — medical emergencies */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <h2 className="font-bold text-neutral-900">Emergências médicas</h2>
          <span className="text-xs text-neutral-400">— risco de vida, ação imediata</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {critical.map((p) => (
            <EmergencyCard
              key={p.id}
              protocol={p}
              icon={iconMap[p.id] || AlertTriangle}
              active={selectedId === p.id}
              onClick={() => setSelectedId(p.id)}
            />
          ))}
        </div>
      </section>

      {/* Quick access — dental urgencies */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Tooth className="w-4 h-4 text-amber-600" />
          <h2 className="font-bold text-neutral-900">Urgências odontológicas</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {urgent.map((p) => (
            <EmergencyCard
              key={p.id}
              protocol={p}
              icon={iconMap[p.id] || Tooth}
              active={selectedId === p.id}
              onClick={() => setSelectedId(p.id)}
            />
          ))}
        </div>
      </section>

      {/* Selected protocol detail */}
      {selected ? (
        <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                selected.severity === SEVERITY.CRITICAL
                  ? "bg-red-600 text-white"
                  : "bg-amber-500 text-white"
              }`}
            >
              {selected.severity === SEVERITY.CRITICAL ? "Emergência" : "Urgência"}
            </span>
            <h2 className="text-xl font-bold text-neutral-900">{selected.name}</h2>
          </div>
          <p className="text-sm text-neutral-600 mb-5">{selected.summary}</p>
          <ProtocolFlow protocol={selected} />
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
          <AlertTriangle className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">
            Selecione um quadro acima para visualizar o fluxo de conduta imediata.
          </p>
        </div>
      )}
    </div>
  );
}