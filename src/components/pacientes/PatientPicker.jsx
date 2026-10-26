import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { UserPlus, Users, X } from "lucide-react";
import { ToothMascot } from "@/components/ToothMascot";

export function PatientPicker({ onChange, selectedId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("select");
  const [form, setForm] = useState({ name: "", age_years: "", weight_kg: "", allergies: "", conditions: "", current_meds: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    base44.entities.Patient.list("-created_date", 100)
      .then(setPatients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSelect(e) {
    const id = e.target.value;
    if (id === "__new__") {
      setMode("new");
      return;
    }
    if (!id) {
      onChange && onChange(null);
      return;
    }
    const p = patients.find((x) => x.id === id);
    if (p) onChange && onChange(p);
  }

  async function handleCreate() {
    if (!form.name.trim()) return;
    try {
      setCreating(true);
      const created = await base44.entities.Patient.create({
        name: form.name.trim(),
        age_years: form.age_years === "" ? null : Number(form.age_years),
        weight_kg: form.weight_kg === "" ? null : Number(form.weight_kg),
        allergies: form.allergies,
        conditions: form.conditions,
        current_meds: form.current_meds,
      });
      setPatients([created, ...patients]);
      setMode("select");
      setForm({ name: "", age_years: "", weight_kg: "", allergies: "", conditions: "", current_meds: "" });
      onChange && onChange(created);
    } finally {
      setCreating(false);
    }
  }

  if (mode === "new") {
    return (
      <div className="space-y-2.5 rounded-2xl border-2 border-sky-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-soft">
              <ToothMascot className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-sm text-blue-700">Novo paciente</span>
          </div>
          <button type="button" onClick={() => setMode("select")} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          placeholder="Nome do paciente *"
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            value={form.age_years}
            onChange={(e) => setForm((s) => ({ ...s, age_years: e.target.value }))}
            placeholder="Idade (anos)"
            className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.weight_kg}
            onChange={(e) => setForm((s) => ({ ...s, weight_kg: e.target.value }))}
            placeholder="Peso (kg)"
            className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          type="text"
          value={form.allergies}
          onChange={(e) => setForm((s) => ({ ...s, allergies: e.target.value }))}
          placeholder="Alergias (ou 'nenhuma')"
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={form.conditions}
          onChange={(e) => setForm((s) => ({ ...s, conditions: e.target.value }))}
          placeholder="Condições clínicas"
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={form.current_meds}
          onChange={(e) => setForm((s) => ({ ...s, current_meds: e.target.value }))}
          placeholder="Medicamentos em uso"
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !form.name.trim()}
          className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {creating ? "Criando..." : "Criar e vincular"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Users className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <select
          value={selectedId || ""}
          onChange={handleSelect}
          disabled={loading}
          className="w-full appearance-none pl-9 pr-8 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">{loading ? "Carregando..." : "Selecione um paciente (opcional)"}</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.age_years ? ` — ${p.age_years} anos` : ""}
            </option>
          ))}
          <option value="__new__">+ Novo paciente...</option>
        </select>
      </div>
    </div>
  );
}