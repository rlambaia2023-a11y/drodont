import React from "react";
import { Info, AlertTriangle, Ban, CheckCircle2 } from "lucide-react";
import { ALERT_LEVELS } from "@/lib/medicationsDatabase";

const config = {
  [ALERT_LEVELS.INFO]: {
    icon: Info,
    border: "border-sky-200",
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
    titleColor: "text-sky-900",
    label: "Informativo",
    labelBg: "bg-sky-100 text-sky-800",
  },
  [ALERT_LEVELS.REVIEW]: {
    icon: AlertTriangle,
    border: "border-amber-300",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    label: "Revisão obrigatória",
    labelBg: "bg-amber-200 text-amber-900",
  },
  [ALERT_LEVELS.BLOCK]: {
    icon: Ban,
    border: "border-red-300",
    bg: "bg-red-50",
    iconColor: "text-red-600",
    titleColor: "text-red-900",
    label: "Bloqueio do cálculo",
    labelBg: "bg-red-200 text-red-900",
  },
};

export function AlertCard({ alert }) {
  const c = config[alert.level] || config[ALERT_LEVELS.INFO];
  const Icon = c.icon;
  return (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} p-4 shadow-soft`}
      role={alert.level === ALERT_LEVELS.BLOCK ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${c.iconColor} shrink-0 mt-0.5`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${c.labelBg}`}>
              {c.label}
            </span>
            <h4 className={`font-bold text-sm ${c.titleColor}`}>{alert.title}</h4>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed mb-2">{alert.reason}</p>
          <dl className="space-y-1 text-xs text-neutral-600">
            <div>
              <dt className="inline font-semibold">Implicação clínica: </dt>
              <dd className="inline">{alert.clinical_implication}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Dado que acionou: </dt>
              <dd className="inline">{alert.triggered_by}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Fonte/versão: </dt>
              <dd className="inline">{alert.source}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Caminho de correção: </dt>
              <dd className="inline">{alert.fix_path}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export function BlockCard({ block }) {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4" role="alert">
      <div className="flex items-start gap-3">
        <Ban className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="font-bold text-sm text-red-900 mb-1">Cálculo bloqueado</h4>
          <p className="text-sm text-red-800 mb-2">{block.reason}</p>
          <p className="text-xs text-red-700">
            <span className="font-semibold">Como sanar: </span>
            {block.fix}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SuccessBanner({ children }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-sm text-emerald-800">{children}</div>
    </div>
  );
}