import React from "react";
import { ToothMascot } from "@/components/ToothMascot";
import { Heart, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-8 border-t-2 border-dashed border-border/70 bg-white/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shrink-0 shadow-soft">
            <ToothMascot className="w-6 h-6" />
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              Dr. Erick Jesus e Daniella Carvalho Gomes de Cerqueira
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              Desenvolvimento <span className="font-bold text-foreground">SANJORGE2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}