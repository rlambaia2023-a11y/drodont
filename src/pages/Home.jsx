import React from "react";
import { Link } from "react-router-dom";
import { Pill, Search, AlertTriangle, Zap, FileText, GitCompare, ArrowRight, Lightbulb, Stethoscope, Calculator, ClipboardCheck, Sparkles } from "lucide-react";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { ToothMascot } from "@/components/ToothMascot";

const modules = [
  {
    id: "calc",
    label: "Calculadora de medicamentos",
    desc: "Cálculo de doses para adulto e criança/adolescente com motor validável e conferência de segurança.",
    icon: Pill,
    path: "/calculadora",
    chip: "from-sky-400 to-blue-600",
  },
  {
    id: "codes",
    label: "CIAP / CID / SIGTAP",
    desc: "Consulta de códigos com descrição, categoria, sinônimos, origem, versão e vigência.",
    icon: Search,
    path: "/modulos/codigos",
    chip: "from-violet-400 to-purple-600",
  },
  {
    id: "emergency",
    label: "Protocolos de urgências",
    desc: "Triagem, sinais de gravidade, passos, contraindicações e critérios de encaminhamento.",
    icon: AlertTriangle,
    path: "/modulos/urgencias",
    chip: "from-rose-400 to-red-600",
  },
  {
    id: "laser",
    label: "Laserterapia / fotobiomodulação",
    desc: "Indicações, contraindicações, proteção ocular e parâmetros por equipamento/protocolo.",
    icon: Zap,
    path: "/modulos/laser",
    chip: "from-amber-400 to-orange-600",
  },
  {
    id: "prescription",
    label: "Gerador de receituários",
    desc: "Modelos salvos com posologia e orientações padrão para preenchimento automático.",
    icon: FileText,
    path: "/modulos/receituarios",
    chip: "from-emerald-400 to-teal-600",
  },
  {
    id: "interactions",
    label: "Interações medicamentosas",
    desc: "Fonte, gravidade revisada, mecanismo e opções de manejo sujeitas à avaliação profissional.",
    icon: GitCompare,
    path: "/modulos/interacoes",
    chip: "from-pink-400 to-fuchsia-600",
  },
];

const flow = [
  { icon: Stethoscope, label: "Selecionar módulo", sub: "Escolha a ferramenta clínica" },
  { icon: Calculator, label: "Calcular / consultar", sub: "Dados, doses e protocolos" },
  { icon: ClipboardCheck, label: "Decisão clínica", sub: "Revisar e confirmar" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white p-8 sm:p-10 shadow-soft">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-yellow-300/30 blur-2xl animate-float" aria-hidden="true" />
        <div className="absolute right-28 top-12 w-20 h-20 rounded-full bg-pink-300/30 blur-xl" aria-hidden="true" />
        <div className="absolute left-6 bottom-6 opacity-90" aria-hidden="true">
          <ToothMascot className="w-16 h-16 drop-shadow-lg" />
        </div>
        <div className="relative ml-0 sm:ml-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur">
              <Sparkles className="w-3 h-3" /> Suporte à decisão clínica
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-1">
            ODONTO-FBBR
          </h1>
          <p className="text-base text-blue-50/90 max-w-2xl leading-snug mb-4">
            O Apoio que faltava para Dentistas e Estudantes
          </p>
          <p className="text-lg text-blue-50 max-w-2xl leading-relaxed mb-6">
            Central de ferramentas clínicas para apoiar a rotina do cirurgião-dentista.
            Seis módulos integrados, com a calculadora de medicamentos como ponto de partida.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/calculadora"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors shadow-soft"
            >
              Abrir calculadora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/painel"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 border-2 border-white/40 text-white text-sm font-bold hover:bg-white/25 transition-colors backdrop-blur"
            >
              Painel clínico <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-accentYellow border-2 border-amber-200/70 p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <strong>Aviso:</strong> Este sistema apoia o julgamento profissional — não o substitui.
          A base de medicamentos usa valores de referência de fontes padrão — confirme sempre a bula vigente antes de prescrever.
        </div>
      </div>

      {/* Process flow */}
      <section className="rounded-2xl bg-white border-2 border-border p-5 sm:p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
          {flow.map((s, i) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={i}>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-accentMint flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Passo {i + 1}</div>
                    <div className="font-heading font-bold text-foreground text-sm leading-tight">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.sub}</div>
                  </div>
                </div>
                {i < flow.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Modules grid */}
      <section>
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">Módulos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.id}
                to={m.path}
                className="group rounded-3xl border-2 border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft hover:border-sky-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.chip} flex items-center justify-center shadow-soft`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-foreground mb-1">{m.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  Acessar <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}