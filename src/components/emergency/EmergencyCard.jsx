import React from "react";

export function EmergencyCard({ protocol, icon: Icon, active, onClick }) {
  const isCritical = protocol.severity === "critical";
  const ring = isCritical
    ? active
      ? "border-red-400 bg-red-50 ring-2 ring-red-200 shadow-glow"
      : "border-red-200 bg-white hover:bg-red-50 hover:shadow-soft"
    : active
    ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200 shadow-glow"
    : "border-amber-200 bg-white hover:bg-amber-50 hover:shadow-soft";
  const iconBg = isCritical ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";
  const badge = isCritical
    ? "bg-gradient-to-r from-rose-500 to-red-600 text-white"
    : "bg-gradient-to-r from-amber-400 to-orange-500 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${ring}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${badge}`}>
              {isCritical ? "Emergência" : "Urgência"}
            </span>
          </div>
          <h3 className="font-bold text-foreground text-sm leading-snug">
            {protocol.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
            {protocol.summary}
          </p>
        </div>
      </div>
    </button>
  );
}