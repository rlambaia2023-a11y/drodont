import React from "react";
import { SEVERITY_CONFIG } from "./InteractionCard";
import { ALERT_LEVELS } from "@/lib/medicationsDatabase";

function Field({ label, text }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h3 className="font-bold text-sm text-neutral-900 mb-1">{label}</h3>
      <p className="text-sm text-neutral-700 leading-relaxed">{text}</p>
    </div>
  );
}

export function InteractionDetail({ interaction }) {
  const c = SEVERITY_CONFIG[interaction.severity] || SEVERITY_CONFIG[ALERT_LEVELS.INFO];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${c.badge}`}>
          {c.label}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Fármaco A
          </div>
          <div className="text-sm font-semibold text-neutral-900 capitalize mt-0.5">
            {interaction.drug_a}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Fármaco B
          </div>
          <div className="text-sm font-semibold text-neutral-900 capitalize mt-0.5">
            {interaction.drug_b}
          </div>
        </div>
      </div>

      <Field label="Mecanismo" text={interaction.mechanism} />
      <Field label="Efeito clínico" text={interaction.clinical_effect} />

      <div className="rounded-lg border border-neutral-900 bg-neutral-900 p-4">
        <h3 className="font-bold text-sm text-white mb-1">Manejo</h3>
        <p className="text-sm text-neutral-200 leading-relaxed">{interaction.management}</p>
      </div>

      <p className="text-xs text-neutral-400">
        {interaction.source} · v{interaction.version}
      </p>
    </div>
  );
}