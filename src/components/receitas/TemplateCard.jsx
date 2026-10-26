import React from "react";
import { Pill, Clock, FileText } from "lucide-react";

export const CATEGORY_META = {
  antibiotico: { label: "Antibiótico", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
  analgesico: { label: "Analgésico", badge: "bg-sky-100 text-sky-800 border-sky-200", dot: "bg-sky-500" },
  antiinflamatorio: { label: "Anti-inflamatório", badge: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  anestesico: { label: "Anestésico", badge: "bg-violet-100 text-violet-800 border-violet-200", dot: "bg-violet-500" },
  corticosteroide: { label: "Corticoide", badge: "bg-rose-100 text-rose-800 border-rose-200", dot: "bg-rose-500" },
  outro: { label: "Outro", badge: "bg-neutral-100 text-foreground/70 border-border", dot: "bg-neutral-400" },
};

export function TemplateCard({ template, onClick, active }) {
  const meta = CATEGORY_META[template.category] || CATEGORY_META.outro;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-200 shadow-glow"
          : "border-border bg-white hover:border-blue-300 hover:shadow-soft"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
        {template.duration_days ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {template.duration_days} dias
          </span>
        ) : null}
      </div>
      <h3 className="font-bold text-foreground text-sm leading-snug">{template.name}</h3>
      <div className="flex items-center gap-1.5 text-xs text-foreground/70 mt-1.5">
        <Pill className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="truncate">{template.medication_name}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.posology}</p>
      {template.situation && (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border">
          <FileText className="w-3 h-3 shrink-0" />
          <span className="truncate">{template.situation}</span>
        </div>
      )}
    </button>
  );
}