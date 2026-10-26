import React from "react";
import {
  Stethoscope,
  Hand,
  Pill,
  Ambulance,
  AlertTriangle,
  Ban,
  ArrowRight,
} from "lucide-react";
import { STEP_TYPES } from "@/lib/emergencyProtocols";

const stepConfig = {
  [STEP_TYPES.ASSESS]: {
    icon: Stethoscope,
    label: "Avaliação",
    node: "bg-sky-500 text-white",
    ring: "border-sky-200 bg-sky-50",
  },
  [STEP_TYPES.ACTION]: {
    icon: Hand,
    label: "Conduta",
    node: "bg-amber-500 text-white",
    ring: "border-amber-200 bg-amber-50",
  },
  [STEP_TYPES.MEDICATION]: {
    icon: Pill,
    label: "Medicação",
    node: "bg-violet-500 text-white",
    ring: "border-violet-200 bg-violet-50",
  },
  [STEP_TYPES.REFER]: {
    icon: Ambulance,
    label: "Encaminhamento",
    node: "bg-red-500 text-white",
    ring: "border-red-200 bg-red-50",
  },
};

export function ProtocolFlow({ protocol }) {
  return (
    <div className="space-y-5">
      {/* Red flags */}
      {protocol.red_flags?.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4" role="alert">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-sm text-red-900">
              Sinais de gravidade — encaminhar / acionar SAMU
            </h3>
          </div>
          <ul className="space-y-1">
            {protocol.red_flags.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                <span className="text-red-400 mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step flow */}
      <div>
        <h3 className="font-bold text-neutral-900 text-sm mb-3">
          Fluxo de conduta imediata
        </h3>
        <ol className="relative space-y-3">
          {protocol.steps.map((s, i) => {
            const cfg = stepConfig[s.type] || stepConfig[STEP_TYPES.ACTION];
            const Icon = cfg.icon;
            const isLast = i === protocol.steps.length - 1;
            return (
              <li key={i} className="relative flex gap-3">
                {/* Node + connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${cfg.node}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 bg-neutral-200 my-1 min-h-[20px]" />
                  )}
                </div>
                {/* Content */}
                <div className={`flex-1 rounded-lg border p-3 ${cfg.ring} ${isLast ? "mb-0" : "mb-0"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      {i + 1}. {cfg.label}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-neutral-900">{s.title}</h4>
                  <p className="text-sm text-neutral-700 mt-0.5 leading-relaxed">{s.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Medications */}
      {protocol.medications?.length > 0 && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h3 className="font-bold text-sm text-neutral-900 mb-2">Medicações de referência</h3>
          <ul className="space-y-1.5">
            {protocol.medications.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Pill className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">{m.name}</span>
                  <span className="text-neutral-500"> — {m.role}</span>
                  {m.note && <span className="text-neutral-500"> · {m.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contraindications */}
      {protocol.contraindications?.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ban className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-amber-900">Atenção / contraindicações</h3>
          </div>
          <ul className="space-y-1">
            {protocol.contraindications.map((c, i) => (
              <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-400 mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Referral */}
      {protocol.referral?.length > 0 && (
        <div className="rounded-lg border border-neutral-900 bg-neutral-900 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-white" />
            <h3 className="font-bold text-sm text-white">Critérios de encaminhamento</h3>
          </div>
          <ul className="space-y-1">
            {protocol.referral.map((r, i) => (
              <li key={i} className="text-sm text-neutral-200 flex items-start gap-2">
                <span className="text-neutral-500 mt-1.5 w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source */}
      <p className="text-xs text-neutral-400">
        {protocol.source} · v{protocol.version || "ref-0.1.0"}
      </p>
    </div>
  );
}