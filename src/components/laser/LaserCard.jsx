import React from "react";
import { Zap } from "lucide-react";

const typeColor = {
  red: "bg-red-100 text-red-700",
  ir: "bg-rose-100 text-rose-700",
};

export function LaserCard({ protocol, active, onClick }) {
  const tc = typeColor[protocol.laser_type] || "bg-blue-100 text-blue-700";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200 shadow-glow"
          : "border-border bg-white hover:bg-blue-50/40 hover:shadow-soft"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tc}`}>
          <Zap className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              {protocol.wavelength_nm}
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