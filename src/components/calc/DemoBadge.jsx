import React from "react";
import { ShieldCheck } from "lucide-react";

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-700 text-[11px] font-bold uppercase tracking-wider">
      <ShieldCheck className="w-3 h-3" aria-hidden="true" />
      Suporte à decisão clínica
    </span>
  );
}