import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Pill, FileText, Activity, Edit3, CalendarDays, Stethoscope, Plus, ClipboardList, Download, Bell, CalendarClock, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { base44 } from "@/api/base44Client";
import { PatientForm } from "@/components/pacientes/PatientForm";
import { ClinicalEntryForm } from "@/components/pacientes/ClinicalEntryForm";
import { WeightChart } from "@/components/pacientes/WeightChart";
import { FollowUpForm } from "@/components/pacientes/FollowUpForm";
import { OdontogramEditor } from "@/components/pacientes/OdontogramEditor";
import { ToothMascot } from "@/components/ToothMascot";
import { exportPatientPdf } from "@/lib/exportPatientPdf";

const FUTYPE_LABEL = {
  retorno: "Retorno",
  consulta_acompanhamento: "Acompanhamento",
  outros: "Acompanhamento"
};

const CATEGORY_META = {
  anotacao: { label: "Anotação", icon: FileText, chip: "from-sky-400 to-blue-500", tone: "sky" },
  procedimento: { label: "Procedimento", icon: Stethoscope, chip: "from-emerald-400 to-teal-500", tone: "emerald" },
  evolucao: { label: "Evolução", icon: Activity, chip: "from-amber-400 to-orange-500", tone: "amber" },
};

export default function PacienteDetalhe() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [cases, setCases] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [entries, setEntries] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showEntry, setShowEntry] = useState(false);
  const [followups, setFollowups] = useState([]);
  const [odontograms, setOdontograms] = useState([]);
  const [showFollowUp, setShowFollowUp] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [p, c, rx, en, w, fu, odo] = await Promise.all([
        base44.entities.Patient.get(id).catch(() => null),
        base44.entities.SavedCase.filter({ patient_id: id }, "-created_date", 50).catch(() => []),
        base44.entities.Prescription.filter({ patient_id: id }, "-created_date", 50).catch(() => []),
        base44.entities.ClinicalEntry.filter({ patient_id: id }, "-date", 50).catch(() => []),
        base44.entities.WeightEntry.filter({ patient_id: id }, "date", 100).catch(() => []),
        base44.entities.FollowUp.filter({ patient_id: id }, "scheduled_date", 50).catch(() => []),
        base44.entities.Odontogram.filter({ patient_id: id }, "-date", 50).catch(() => []),
      ]);
      setPatient(p);
      setCases(c);
      setPrescriptions(rx);
      setEntries(en);
      setWeights(w);
      setFollowups(fu || []);
      setOdontograms(odo || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFollowUp(data) {
    await base44.entities.FollowUp.create(data);
    setShowFollowUp(false);
    const fu = await base44.entities.FollowUp.filter({ patient_id: id }, "scheduled_date", 50);
    setFollowups(fu || []);
  }

  async function handleCompleteFollowUp(fuId) {
    await base44.entities.FollowUp.update(fuId, { status: "concluido" });
    const fu = await base44.entities.FollowUp.filter({ patient_id: id }, "scheduled_date", 50);
    setFollowups(fu || []);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleUpdate(data) {
    const updated = await base44.entities.Patient.update(id, data);
    setPatient(updated);
    setEditing(false);
  }

  async function handleAddEntry(data) {
    await base44.entities.ClinicalEntry.create({ ...data, patient_id: id });
    setShowEntry(false);
    const en = await base44.entities.ClinicalEntry.filter({ patient_id: id }, "-date", 50);
    setEntries(en);
  }

  async function handleAddWeight(data) {
    await base44.entities.WeightEntry.create({ ...data, patient_id: id });
    const w = await base44.entities.WeightEntry.filter({ patient_id: id }, "date", 100);
    setWeights(w);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-2xl bg-white/60 animate-pulse" />
        <div className="h-40 rounded-3xl border-2 border-border bg-white animate-pulse" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-border bg-white/60 p-10 text-center">
        <p className="text-sm text-muted-foreground mb-4">Paciente não encontrado.</p>
        <Link to="/pacientes" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Voltar para pacientes
        </Link>
      </div>
    );
  }

  // Merge history
  const history = [
    ...entries.map((e) => ({
      id: e.id,
      kind: "entry",
      date: e.date || e.created_date,
      sortDate: e.date ? new Date(e.date + "T00:00:00") : new Date(e.created_date),
      entry: e,
    })),
    ...cases.map((c) => ({
      id: c.id,
      kind: "calc",
      date: c.created_date,
      sortDate: new Date(c.created_date),
      title: c.medication_name || "Cálculo sem medicamento",
      subtitle: c.population === "pediatric" ? "Criança/adolescente" : "Adulto",
      status: c.status,
    })),
    ...prescriptions.map((r) => ({
      id: r.id,
      kind: "rx",
      date: r.created_date,
      sortDate: new Date(r.created_date),
      title: r.items?.[0]?.medication || "Receita sem medicamento",
      subtitle: r.items?.length > 1 ? `${r.items.length} medicamentos` : "1 medicamento",
      rxDate: r.date,
    })),
  ].sort((a, b) => b.sortDate - a.sortDate);

  return (
    <div className="space-y-6">
      <Link to="/pacientes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Pacientes
      </Link>

      {/* Patient header */}
      <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shrink-0 shadow-soft">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">{patient.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {patient.age_years ? `${patient.age_years} anos` : "Idade não informada"}
                {patient.weight_kg ? ` · ${patient.weight_kg} kg` : ""}
                {patient.gender === "female" ? " · Feminino" : patient.gender === "male" ? " · Masculino" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => exportPatientPdf({ patient, entries, cases, prescriptions, weights, odontograms })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-sm font-semibold shadow-soft hover:opacity-90"
            >
              <Download className="w-4 h-4" /> Exportar PDF
            </button>
            <button
              type="button"
              onClick={() => setEditing((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 border-border text-sm font-medium text-foreground/70 hover:bg-accent"
            >
              <Edit3 className="w-4 h-4" /> {editing ? "Cancelar" : "Editar"}
            </button>
          </div>
        </div>

        {editing ? (
          <div className="mt-5 pt-5 border-t-2 border-dashed border-border">
            <PatientForm initial={patient} onSubmit={handleUpdate} submitLabel="Atualizar" onCancel={() => setEditing(false)} />
          </div>
        ) : (
          <div className="mt-5 pt-5 border-t-2 border-dashed border-border grid sm:grid-cols-2 gap-4 text-sm">
            <Info label="Alergias" value={patient.allergies || "Não informado"} alert={!!patient.allergies} />
            <Info label="Condições clínicas" value={patient.conditions || "Não informado"} />
            <Info label="Medicamentos em uso" value={patient.current_meds || "Não informado"} />
            <Info label="Contato" value={patient.contact || "Não informado"} />
            {patient.notes && (
              <div className="sm:col-span-2">
                <Info label="Observações" value={patient.notes} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* New clinical entry */}
      <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-600" /> Registro de atendimento
          </h2>
          <button
            type="button"
            onClick={() => setShowEntry((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-soft hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> {showEntry ? "Fechar" : "Nova entrada"}
          </button>
        </div>

        {showEntry ? (
          <ClinicalEntryForm onSubmit={handleAddEntry} onCancel={() => setShowEntry(false)} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Registre anotações clínicas, procedimentos (com dente/região e materiais) e a evolução do tratamento. Cada entrada entra na linha do tempo abaixo.
          </p>
        )}
      </div>

      {/* Follow-ups / returns */}
      <div className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/60 to-indigo-50/40 p-5 shadow-soft">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </span>
            Retornos e acompanhamentos
          </h2>
          <button
            type="button"
            onClick={() => setShowFollowUp((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold shadow-soft hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> {showFollowUp ? "Fechar" : "Agendar retorno"}
          </button>
        </div>

        {showFollowUp && (
          <div className="mb-4">
            <FollowUpForm patient={patient} onSubmit={handleAddFollowUp} onCancel={() => setShowFollowUp(false)} />
          </div>
        )}

        {followups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum retorno agendado. Agende um retorno para receber lembretes automáticos por e-mail.
          </p>
        ) : (
          <ul className="space-y-2">
            {followups.map((f) => {
              const today = new Date().toISOString().slice(0, 10);
              const isOverdue = f.status === "agendado" && f.scheduled_date < today;
              return (
                <li key={f.id} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? "bg-rose-100" : "bg-accentBlue"}`}>
                    <CalendarClock className={`w-4 h-4 ${isOverdue ? "text-rose-600" : "text-blue-700"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground text-sm">
                      {FUTYPE_LABEL[f.type] || "Retorno"}
                      {f.reason ? ` — ${f.reason}` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {format(parseISO(f.scheduled_date + "T00:00:00"), "dd/MM/yyyy")}
                      {isOverdue && <span className="text-rose-600 font-semibold ml-1">· em atraso</span>}
                      {f.status === "concluido" && <span className="text-emerald-600 font-semibold ml-1">· concluído</span>}
                    </div>
                    {f.notes && <div className="text-xs text-muted-foreground mt-0.5 truncate">{f.notes}</div>}
                  </div>
                  {f.status === "agendado" && (
                    <button
                      type="button"
                      onClick={() => handleCompleteFollowUp(f.id)}
                      title="Marcar como concluído"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-emerald-200 text-emerald-700 text-xs font-medium hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concluir
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Odontogram */}
      <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </span>
          Odontograma
        </h2>
        <OdontogramEditor patient={patient} />
      </div>

      {/* Weight tracking chart */}
      <WeightChart entries={weights} onAdd={handleAddWeight} />

      {/* History timeline */}
      <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-600" /> Histórico clínico
        </h2>

        {history.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-background/40 p-8 text-center">
            <div className="w-14 h-14 rounded-3xl bg-accentBlue flex items-center justify-center mx-auto mb-3">
              <ToothMascot className="w-9 h-9" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sem registros vinculados ainda. Adicione uma entrada de atendimento ou vincule cálculos e receitas a este paciente.
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowEntry(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Registrar atendimento
              </button>
              <Link to="/calculadora" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 border-border text-sm font-medium text-foreground/70 hover:bg-accent">
                <Pill className="w-4 h-4" /> Novo cálculo
              </Link>
              <Link to="/modulos/receita" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 border-border text-sm font-medium text-foreground/70 hover:bg-accent">
                <FileText className="w-4 h-4" /> Nova receita
              </Link>
            </div>
          </div>
        ) : (
          <ol className="relative border-l-2 border-sky-200 ml-3 space-y-4">
            {history.map((h) => {
              if (h.kind === "entry") {
                return <EntryItem key={`entry-${h.id}`} entry={h.entry} />;
              }
              const isCalc = h.kind === "calc";
              const Icon = isCalc ? Pill : FileText;
              return (
                <li key={`${h.kind}-${h.id}`} className="ml-5">
                  <span className="absolute -left-[13px] w-6 h-6 rounded-full bg-white border-2 border-sky-300 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-sky-600" />
                  </span>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{h.title}</div>
                      <div className="text-xs text-muted-foreground">{h.subtitle}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end">
                        <CalendarDays className="w-3 h-3" />
                        {format(h.sortDate, "dd/MM/yyyy")}
                      </div>
                      {isCalc && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 inline-block ${
                          h.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {h.status === "confirmed" ? "Confirmado" : "Rascunho"}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function EntryItem({ entry }) {
  const meta = CATEGORY_META[entry.category] || CATEGORY_META.anotacao;
  const Icon = meta.icon;
  return (
    <li className="ml-5">
      <span className={`absolute -left-[13px] w-6 h-6 rounded-full bg-white border-2 border-sky-300 flex items-center justify-center`}>
        <Icon className="w-3 h-3 text-sky-600" />
      </span>
      <div className="rounded-2xl border-2 border-border bg-background/40 p-3">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${meta.chip} text-white text-[10px] font-bold uppercase tracking-wider`}>
            <Icon className="w-3 h-3" /> {meta.label}
          </span>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {format(new Date((entry.date || entry.created_date) + (entry.date ? "T00:00:00" : "")), "dd/MM/yyyy")}
          </div>
        </div>

        {entry.notes && <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">{entry.notes}</p>}

        {entry.category === "procedimento" && (entry.procedure_name || entry.tooth_region || entry.materials) && (
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-2.5 mb-2 text-xs space-y-1">
            {entry.procedure_name && (
              <div><span className="font-semibold text-emerald-800">Procedimento:</span> <span className="text-emerald-900">{entry.procedure_name}</span></div>
            )}
            {entry.tooth_region && (
              <div><span className="font-semibold text-emerald-800">Dente/região:</span> <span className="text-emerald-900">{entry.tooth_region}</span></div>
            )}
            {entry.materials && (
              <div><span className="font-semibold text-emerald-800">Materiais:</span> <span className="text-emerald-900">{entry.materials}</span></div>
            )}
            {entry.procedure_notes && (
              <div className="text-emerald-800 italic">{entry.procedure_notes}</div>
            )}
          </div>
        )}

        {entry.evolution && (
          <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-2 text-xs">
            <span className="font-semibold text-amber-800">Evolução: </span>
            <span className="text-amber-900 whitespace-pre-wrap">{entry.evolution}</span>
          </div>
        )}
      </div>
    </li>
  );
}

function Info({ label, value, alert }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
      <div className={`text-sm ${alert ? "text-amber-700 font-medium" : "text-foreground"}`}>{value}</div>
    </div>
  );
}