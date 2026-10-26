import React, { useState, useEffect } from "react";
import { BookOpen, Lock, User, KeyRound, GraduationCap, FileText, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { ToothMascot } from "@/components/ToothMascot";

const GATE_KEY = "apostilas_auth_harrison";

const DISCIPLINES = [
  { id: "anatomia", name: "Anatomia", icon: BookOpen, color: "from-sky-400 to-blue-600", desc: "Anatomia humana e odontológica aplicada." },
  { id: "histologia", name: "Histologia", icon: BookOpen, color: "from-emerald-400 to-teal-600", desc: "Estudo dos tecidos bucais e dentários." },
  { id: "embriologia", name: "Embriologia", icon: BookOpen, color: "from-violet-400 to-indigo-600", desc: "Desenvolvimento craniofacial e dental." },
  { id: "bioquimica", name: "Bioquímica", icon: BookOpen, color: "from-amber-400 to-orange-600", desc: "Bioquímica aplicada à odontologia." },
  { id: "fisiologia", name: "Fisiologia", icon: BookOpen, color: "from-rose-400 to-pink-600", desc: "Fisiologia da mastigação, saliva e oclusão." },
  { id: "microbiologia", name: "Microbiologia", icon: BookOpen, color: "from-lime-400 to-green-600", desc: "Microbiologia bucal e biofilme." },
  { id: "patologia", name: "Patologia Geral e Bucal", icon: BookOpen, color: "from-red-400 to-rose-600", desc: "Lesões, doenças e processos patológicos." },
  { id: "patologia_bucal", name: "Patologia Bucal", icon: BookOpen, color: "from-fuchsia-400 to-purple-600", desc: "Diagnóstico de lesões da cavidade bucal." },
  { id: "farmacologia", name: "Farmacologia", icon: BookOpen, color: "from-cyan-400 to-sky-600", desc: "Farmacologia aplicada à clínica odontológica." },
  { id: "anestesiologia", name: "Anestesiologia", icon: BookOpen, color: "from-blue-400 to-indigo-600", desc: "Técnicas anestésicas e manejo." },
  { id: "radiologia", name: "Radiologia Odontológica", icon: BookOpen, color: "from-slate-400 to-gray-700", desc: "Interpretação de exames de imagem." },
  { id: "diagnostico", name: "Diagnóstico Bucal / Semiótica", icon: BookOpen, color: "from-teal-400 to-cyan-600", desc: "Semiologia e exame clínico." },
  { id: "clinica", name: "Clínica Odontológica Integrada", icon: BookOpen, color: "from-sky-500 to-blue-700", desc: "Integração clínica do paciente." },
  { id: "dentistica", name: "Dentística", icon: BookOpen, color: "from-amber-400 to-yellow-600", desc: "Restaurações e procedimentos estéticos." },
  { id: "endodontia", name: "Endodontia", icon: BookOpen, color: "from-orange-400 to-red-600", desc: "Tratamento de canal e polpa dental." },
  { id: "periodontia", name: "Periodontia", icon: BookOpen, color: "from-pink-400 to-rose-600", desc: "Saúde e tratamento dos tecidos de suporte." },
  { id: "cirurgia", name: "Cirurgia Bucomaxilofacial", icon: BookOpen, color: "from-red-500 to-rose-700", desc: "Procedimentos cirúrgicos e trauma facial." },
  { id: "implantodontia", name: "Implantodontia", icon: BookOpen, color: "from-indigo-400 to-blue-700", desc: "Reabilitação com implantes." },
  { id: "ortodontia", name: "Ortodontia", icon: BookOpen, color: "from-violet-500 to-purple-700", desc: "Movimentação e alinhamento dental." },
  { id: "odontopediatria", name: "Odontopediatria", icon: BookOpen, color: "from-green-400 to-emerald-600", desc: "Atendimento odontológico infantil." },
  { id: "protese", name: "Prótese Dentária", icon: BookOpen, color: "from-yellow-400 to-amber-600", desc: "Próteses fixas e removíveis." },
  { id: "oclusao", name: "Oclusão e ATM", icon: BookOpen, color: "from-blue-500 to-cyan-700", desc: "Oclusão, disfunção e articulação temporomandibular." },
  { id: "materiais", name: "Materiais Dentários", icon: BookOpen, color: "from-zinc-400 to-slate-600", desc: "Propriedades e manipulação de materiais." },
  { id: "preventiva", name: "Odontologia Preventiva e Social", icon: BookOpen, color: "from-teal-400 to-green-600", desc: "Prevenção e promoção de saúde bucal." },
  { id: "saude_coletiva", name: "Saúde Coletiva", icon: BookOpen, color: "from-emerald-500 to-teal-700", desc: "Saúde pública e epidemiologia bucal." },
  { id: "emergencias", name: "Emergências Médicas no Consultório", icon: BookOpen, color: "from-rose-500 to-red-700", desc: "Manejo de urgências e emergências." },
  { id: "medicina_oral", name: "Medicina Oral", icon: BookOpen, color: "from-purple-400 to-fuchsia-600", desc: "Manifestações bucais de doenças sistêmicas." },
];

function Gate({ onUnlock }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username.trim() === "harrison" && password === "harrison") {
        sessionStorage.setItem(GATE_KEY, "1");
        onUnlock();
      } else {
        setError("Usuário ou senha incorretos. Acesso restrito.");
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border-2 border-border bg-white p-7 shadow-soft">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-soft mb-3">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-xl font-bold text-foreground">Apostilas — Acesso restrito</h1>
          <p className="text-sm text-muted-foreground mt-1 leading-snug">
            Conteúdo de apoio exclusivo para dentistas e cirurgiões. Informe suas credenciais para acessar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <User className="w-3 h-3" /> Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-border bg-background text-sm focus:outline-none focus:border-primary"
              placeholder="Usuário"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-border bg-background text-sm focus:outline-none focus:border-primary"
              placeholder="Senha"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-soft hover:opacity-90 disabled:opacity-60"
          >
            <Lock className="w-4 h-4" /> {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t-2 border-dashed border-border flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-snug">
            Ferramenta profissional de suporte à decisão clínica. Apoia o julgamento profissional — não o substitui.
          </p>
        </div>
      </div>
    </div>
  );
}

function DisciplineCard({ discipline }) {
  const [open, setOpen] = useState(false);
  const Icon = discipline.icon;
  return (
    <div className="rounded-3xl border-2 border-border bg-white overflow-hidden shadow-soft">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/40 transition-colors"
      >
        <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${discipline.color} flex items-center justify-center shrink-0 shadow-soft`}>
          <Icon className="w-5 h-5 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-heading font-bold text-foreground text-sm">{discipline.name}</div>
          <div className="text-xs text-muted-foreground truncate">{discipline.desc}</div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t-2 border-dashed border-border">
          <div className="rounded-2xl border-2 border-dashed border-border bg-background/40 p-5 text-center">
            <FileText className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma apostila anexada ainda. Os PDFs desta disciplina serão disponibilizados em breve.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Apostilas() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(GATE_KEY) === "1");
    setReady(true);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem(GATE_KEY);
    setUnlocked(false);
  }

  if (!ready) return null;
  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shrink-0 shadow-soft">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Apostilas e materiais de apoio</h1>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug max-w-2xl">
                Biblioteca de apostilas e materiais de estudo para dentistas e cirurgiões, organizada por disciplina. Os PDFs serão anexados progressivamente.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 border-border text-sm font-medium text-foreground/70 hover:bg-accent"
          >
            <Lock className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {DISCIPLINES.map((d) => (
          <DisciplineCard key={d.id} discipline={d} />
        ))}
      </div>

      <div className="rounded-3xl border-2 border-dashed border-border bg-background/40 p-6 text-center">
        <div className="w-14 h-14 rounded-3xl bg-accentBlue flex items-center justify-center mx-auto mb-3">
          <ToothMascot className="w-9 h-9" />
        </div>
        <p className="text-sm text-muted-foreground">
          Novas apostilas e PDFs serão adicionados em breve. Em caso de dúvida, procure o responsável pelo conteúdo.
        </p>
      </div>

      <footer className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft text-center">
        <p className="text-sm text-foreground font-medium leading-relaxed">
          <span className="font-bold">Ideia e Criação:</span> Dr. Erick Jesus, Coordenador do curso de Odontologia e Colaborador. E Daniella Carvalho Gomes de Cerqueira — Coordenação dos cursos de saúde FBBR.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="font-semibold">Desenvolvimento:</span> SANJORGE2026
        </p>
      </footer>
    </div>
  );
}