import React from "react";
import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ToothMascot } from "@/components/ToothMascot";

export function FormBanner({ title, subtitle, gradient = "from-sky-400 via-blue-500 to-indigo-500" }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-4 text-white`}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-yellow-300/30 blur-xl" aria-hidden="true" />
      <div className="absolute right-16 top-2 opacity-80" aria-hidden="true">
        <Sparkles className="w-4 h-4 text-yellow-200" />
      </div>
      <div className="relative flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0 backdrop-blur">
          <ToothMascot className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-blue-50 leading-snug">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function FormSection({ icon: Icon, chip, title, hint, cardClassName = "border-border bg-white/60", children }) {
  return (
    <section className={`rounded-2xl border-2 ${cardClassName} p-4`}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br ${chip} flex items-center justify-center shadow-soft shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-sm text-foreground leading-tight">{title}</h3>
          {hint && <p className="text-[11px] text-muted-foreground leading-tight">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ children }) {
  return <Label className="block text-xs font-semibold text-foreground/70 mb-1">{children}</Label>;
}

export const selectClass =
  "w-full h-9 rounded-md border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";