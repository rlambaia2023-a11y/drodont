import React from "react";
import { ExternalLink, Pill, ShieldCheck } from "lucide-react";

const EXTERNAL_URL = "https://calculadoraodonto.manus.space";

export default function Calculadora2() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shrink-0 shadow-soft">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground">Calculadora Odonto (externa)</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Cálculo clínico odontológico com parâmetros, limites e referências — ferramenta informativa de conferência.
              </p>
            </div>
          </div>
          <a
            href={EXTERNAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-soft hover:opacity-90"
          >
            <ExternalLink className="w-4 h-4" /> Abrir em nova aba
          </a>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-accentYellow border-2 border-amber-200/70 p-3">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-snug">
            Conteúdo hospedado em serviço externo (calculadoraodonto.manus.space). Suporte informativo, não prescrição — confira anamnese, bula vigente e protocolo local. O cálculo não substitui o julgamento do cirurgião-dentista.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-border bg-white shadow-soft overflow-hidden">
        <iframe
          src={EXTERNAL_URL}
          title="Calculadora Odonto externa"
          className="w-full"
          style={{ height: "min(78vh, 820px)", border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}