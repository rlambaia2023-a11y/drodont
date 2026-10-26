import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Lightbulb } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { modules } from "@/components/modules";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menu"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-border bg-white/70 text-foreground hover:bg-accent"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[78%] max-w-xs p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border flex-row items-center justify-between space-y-0">
          <SheetTitle className="font-heading text-lg font-bold text-foreground">Módulos</SheetTitle>
          <SheetClose asChild>
            <button type="button" aria-label="Fechar menu" className="w-8 h-8 rounded-xl hover:bg-accent flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </SheetClose>
        </SheetHeader>
        <nav aria-label="Módulos do sistema" className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {modules.map((m) => {
            const Icon = m.icon;
            const active = location.pathname === m.path;
            return (
              <Link
                key={m.id}
                to={m.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-soft"
                    : "text-foreground/80 hover:bg-accent"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{m.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 space-y-3 border-t border-border">
          <div className="mx-1 p-3 rounded-2xl bg-accentYellow border-2 border-amber-200/70 flex gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-snug">
              Ferramenta profissional de suporte à decisão clínica. Apoia o julgamento profissional — não o substitui.
            </p>
          </div>
          <div className="px-1">
            <DemoBadge />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}