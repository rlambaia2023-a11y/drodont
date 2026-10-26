import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search, ArrowRight, Pill, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { PatientForm } from "@/components/pacientes/PatientForm";
import { ToothMascot } from "@/components/ToothMascot";

export default function Pacientes() {
  const { isAuthenticated } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await base44.entities.Patient.list("-created_date", 100).catch(() => []);
      setPatients(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data) {
    const created = await base44.entities.Patient.create(data);
    setPatients([created, ...patients]);
    setShowForm(false);
  }

  const filtered = patients.filter((p) =>
    !query.trim() ? true : p.name.toLowerCase().includes(query.toLowerCase().trim())
  );

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
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Pacientes</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Cadastro de pacientes e prontuários. Cada cálculo e receita vinculada compõe o histórico clínico.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-soft hover:opacity-90"
        >
          <UserPlus className="w-4 h-4" /> {showForm ? "Fechar" : "Novo paciente"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
          <PatientForm onSubmit={handleCreate} submitLabel="Cadastrar" onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar paciente por nome..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl border border-border bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-sky-300 bg-white/60 p-10 text-center relative overflow-hidden">
          <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-yellow-200/40 blur-xl" aria-hidden="true" />
          <div className="absolute right-6 top-4 opacity-70" aria-hidden="true">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-soft">
            <ToothMascot className="w-11 h-11" />
          </div>
          <h3 className="font-heading font-bold text-foreground text-base mb-1">
            {query ? "Nenhum paciente encontrado" : "Ainda não há pacientes por aqui"}
          </h3>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
            Cadastre um paciente para vincular cálculos e receitas ao prontuário e cuidar bem do sorriso dele.
          </p>
          {!query && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-soft hover:opacity-90"
            >
              <UserPlus className="w-4 h-4" /> Cadastrar primeiro paciente
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/pacientes/${p.id}`}
              className="group rounded-2xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-soft">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.age_years ? `${p.age_years} anos` : "Idade não informada"}
                    {p.weight_kg ? ` · ${p.weight_kg} kg` : ""}
                  </p>
                  {p.allergies && (
                    <p className="text-xs text-amber-700 mt-1 truncate">
                      Alergias: {p.allergies}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Cadastrado em {format(new Date(p.created_date), "dd/MM/yyyy")}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}