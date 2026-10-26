import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, FolderOpen, ArrowRight, Pill, CalendarDays, Stethoscope, Activity, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { FollowUpsWidget } from "@/components/pacientes/FollowUpsWidget";

const STATUS_META = {
  retorno_pendente: { label: "Retorno pendente", chip: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  finalizacao: { label: "Em finalização", chip: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  sem_tratamento: { label: "Sem tratamento ativo", chip: "bg-neutral-100 text-muted-foreground border-border", dot: "bg-neutral-400" },
};

export default function Painel() {
  const { isAuthenticated } = useAuth();
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [casesCount, setCasesCount] = useState(0);
  const [followups, setFollowups] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [p, rx, c, fu, en] = await Promise.all([
          base44.entities.Patient.list("-created_date", 100).catch(() => []),
          base44.entities.Prescription.list("-created_date", 10).catch(() => []),
          base44.entities.SavedCase.list("-created_date", 200).catch(() => []),
          base44.entities.FollowUp.list("-created_date", 200).catch(() => []),
          base44.entities.ClinicalEntry.list("-created_date", 200).catch(() => []),
        ]);
        setPatients(p);
        setPrescriptions(rx);
        setCasesCount(c.length);
        setFollowups(fu || []);
        setEntries(en || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const patientStatus = useMemo(() => {
    const map = {};
    const pendingByPatient = {};
    followups.forEach((f) => {
      if (f.patient_id && f.status === "agendado") pendingByPatient[f.patient_id] = true;
    });
    const entryByPatient = {};
    entries.forEach((e) => {
      if (e.patient_id) entryByPatient[e.patient_id] = true;
    });
    patients.forEach((p) => {
      if (pendingByPatient[p.id]) map[p.id] = "retorno_pendente";
      else if (entryByPatient[p.id]) map[p.id] = "finalizacao";
      else map[p.id] = "sem_tratamento";
    });
    return map;
  }, [patients, followups, entries]);

  const statusCounts = useMemo(() => {
    const counts = { retorno_pendente: 0, finalizacao: 0, sem_tratamento: 0 };
    patients.forEach((p) => {
      const s = patientStatus[p.id];
      if (s) counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [patients, patientStatus]);

  const filteredPatients = useMemo(() => {
    if (statusFilter === "all") return patients.slice(0, 12);
    return patients.filter((p) => patientStatus[p.id] === statusFilter).slice(0, 12);
  }, [patients, patientStatus, statusFilter]);

  const stats = [
    { label: "Pacientes cadastrados", value: patients.length, icon: Users, chip: "from-blue-500 to-indigo-600" },
    { label: "Receitas geradas", value: prescriptions.length, icon: FileText, chip: "from-emerald-500 to-teal-600" },
    { label: "Casos salvos", value: casesCount, icon: FolderOpen, chip: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="space-y-6">
      {!isAuthenticated && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          Para ver e cadastrar seus pacientes, <Link to="/login" className="font-bold underline">entre com sua conta</Link> (ou <Link to="/register" className="font-bold underline">crie uma</Link>). Sem login, esta página fica vazia e o salvamento não funciona.
        </div>
      )}
      
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Painel clínico</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Acompanhamento dos pacientes cadastrados e das últimas receitas geradas.
          </p>
        </div>
        <Link
          to="/pacientes"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-soft hover:opacity-90"
        >
          <Stethoscope className="w-4 h-4" /> Gerenciar pacientes
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.chip} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-foreground leading-none">{loading ? "—" : s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Pacientes
            </h2>
            <Link to="/pacientes" className="text-xs font-semibold text-blue-600 hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <FilterChip
              label="Todos"
              count={patients.length}
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            />
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <FilterChip
                key={key}
                label={meta.label}
                count={statusCounts[key] || 0}
                dot={meta.dot}
                active={statusFilter === key}
                onClick={() => setStatusFilter(key)}
              />
            ))}
          </div>

          {loading ? (
            <SkeletonList />
          ) : patients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum paciente cadastrado"
              desc="Cadastre pacientes para vincular cálculos e receitas ao prontuário."
              cta={{ to: "/pacientes", label: "Cadastrar paciente" }}
            />
          ) : filteredPatients.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-center">
              <ClipboardList className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                Nenhum paciente neste status de tratamento no momento.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredPatients.map((p) => {
                const status = patientStatus[p.id];
                const meta = STATUS_META[status] || STATUS_META.sem_tratamento;
                return (
                  <li key={p.id}>
                    <Link
                      to={`/pacientes/${p.id}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 hover:border-blue-300 hover:shadow-soft transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-accentBlue flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-blue-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground text-sm truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {p.age_years ? `${p.age_years} anos` : "Idade não informada"}
                          {p.allergies ? " · Alergias registradas" : ""}
                        </div>
                      </div>
                      <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.chip}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                        <CalendarDays className="w-3 h-3" />
                        {format(new Date(p.created_date), "dd/MM/yyyy")}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" /> Últimas receitas geradas
            </h2>
            <Link to="/modulos/receita" className="text-xs font-semibold text-blue-600 hover:underline">
              Gerar receita
            </Link>
          </div>

          {loading ? (
            <SkeletonList />
          ) : prescriptions.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhuma receita salva"
              desc="As receitas geradas e salvas no gerador aparecem aqui para acompanhamento."
              cta={{ to: "/modulos/receita", label: "Gerar primeira receita" }}
            />
          ) : (
            <ul className="space-y-2">
              {prescriptions.map((rx) => {
                const firstMed = rx.items?.[0]?.medication || "Medicamento não informado";
                const itemCount = rx.items?.length || 0;
                return (
                  <li key={rx.id}>
                    {rx.patient_id ? (
                      <Link
                        to={`/pacientes/${rx.patient_id}`}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 hover:border-emerald-300 hover:shadow-soft transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-accentMint flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-foreground text-sm truncate">{rx.patient_name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {firstMed}
                            {itemCount > 1 && ` +${itemCount - 1}`}
                          </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                          <CalendarDays className="w-3 h-3" />
                          {rx.date ? format(new Date(rx.date + "T00:00:00"), "dd/MM/yyyy") : "—"}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3">
                        <div className="w-9 h-9 rounded-xl bg-accentMint flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-foreground text-sm truncate">{rx.patient_name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {firstMed}
                            {itemCount > 1 && ` +${itemCount - 1}`}
                          </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                          <CalendarDays className="w-3 h-3" />
                          {rx.date ? format(new Date(rx.date + "T00:00:00"), "dd/MM/yyyy") : "—"}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <FollowUpsWidget />

      <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
        <h2 className="font-bold text-foreground flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-600" /> Acesso rápido
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/calculadora", label: "Calculadora", icon: Pill, chip: "from-blue-500 to-indigo-600" },
            { to: "/modulos/urgencias", label: "Urgências", icon: Activity, chip: "from-rose-500 to-red-600" },
            { to: "/modulos/interacoes", label: "Interações", icon: Stethoscope, chip: "from-pink-500 to-fuchsia-600" },
            { to: "/modulos/laser", label: "Laserterapia", icon: Activity, chip: "from-amber-500 to-orange-600" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.to}
                to={a.to}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background/50 p-4 hover:border-blue-300 hover:shadow-soft transition-all"
              >
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${a.chip} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function FilterChip({ label, count, dot, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent shadow-soft"
          : "bg-white text-muted-foreground border-border hover:border-blue-300"
      }`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
      <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20" : "bg-muted"}`}>
        {count}
      </span>
    </button>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 animate-pulse">
          <div className="w-9 h-9 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="h-2.5 w-3/4 rounded bg-muted" />
          </div>
          <div className="h-3 w-12 rounded bg-muted" />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ icon: Icon, title, desc, cta }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background/40 p-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-bold text-foreground text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">{desc}</p>
      {cta && (
        <Link
          to={cta.to}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-soft hover:opacity-90"
        >
          {cta.label} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}