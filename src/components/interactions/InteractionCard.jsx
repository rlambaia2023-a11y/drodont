import React from "react";
import { Info, AlertTriangle, Ban } from "lucide-react";
import { ALERT_LEVELS } from "@/lib/medicationsDatabase";

export const SEVERITY_CONFIG = {
  [ALERT_LEVELS.INFO]: {
    icon: Info,
    label: "Informativo",
    badge: "bg-sky-100 text-sky-800",
    ring: "border-sky-200 bg-white hover:bg-sky-50 hover:shadow-soft",
    ringActive: "border-sky-400 bg-sky-50 ring-2 ring-sky-200 shadow-glow",
  },
  [ALERT_LEVELS.REVIEW]: {
    icon: AlertTriangle,
    label: "Revisar",
    badge: "bg-amber-200 text-amber-900",
    ring: "border-amber-200 bg-white hover:bg-amber-50 hover:shadow-soft",
    ringActive: "border-amber-400 bg-amber-50 ring-2 ring-amber-200 shadow-glow",
  },
  [ALERT_LEVELS.BLOCK]: {
    icon: Ban,
    label: "Evitar",
    badge: "bg-red-200 text-red-900",
    ring: "border-red-200 bg-white hover:bg-red-50 hover:shadow-soft",
    ringActive: "border-red-400 bg-red-50 ring-2 ring-red-200 shadow-glow",
  },
};

export function InteractionCard({ interaction, active, onClick }) {
  const c = SEVERITY_CONFIG[interaction.severity] || SEVERITY_CONFIG[ALERT_LEVELS.INFO];
  const Icon = c.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active ? c.ringActive : c.ring
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-neutral-100 text-foreground/70">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
              {c.label}
            </span>
          </div>
          <h3 className="font-bold text-foreground text-sm leading-snug capitalize">
            {interaction.drug_a} × {interaction.drug_b}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
            {interaction.clinical_effect}
          </p>
        </div>
      </div>
    </button>
  );
}