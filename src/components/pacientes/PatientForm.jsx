import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Heart, Phone } from "lucide-react";
import { FormBanner, FormSection, FieldLabel, selectClass } from "@/components/pacientes/FormParts";

export function PatientForm({ initial, onSubmit, submitLabel = "Salvar", onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    age_years: initial?.age_years ?? "",
    gender: initial?.gender || "",
    weight_kg: initial?.weight_kg ?? "",
    allergies: initial?.allergies || "",
    conditions: initial?.conditions || "",
    current_meds: initial?.current_meds || "",
    contact: initial?.contact || "",
    notes: initial?.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      setSaving(true);
      await onSubmit({
        name: form.name.trim(),
        age_years: form.age_years === "" ? null : Number(form.age_years),
        gender: form.gender || null,
        weight_kg: form.weight_kg === "" ? null : Number(form.weight_kg),
        allergies: form.allergies,
        conditions: form.conditions,
        current_meds: form.current_meds,
        contact: form.contact,
        notes: form.notes,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormBanner
        title={initial ? "Editar paciente" : "Vamos cuidar de um novo sorriso?"}
        subtitle={initial ? "Atualize os dados do prontuário." : "Preencha os dados abaixo — é rápido e acolhedor."}
      />

      <FormSection icon={User} chip="from-sky-400 to-blue-500" title="Identificação" hint="Quem é o paciente?">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Nome *</FieldLabel>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome do paciente" />
          </div>
          <div>
            <FieldLabel>Idade (anos)</FieldLabel>
            <Input type="number" min="0" value={form.age_years} onChange={(e) => set("age_years", e.target.value)} placeholder="Ex.: 34" />
          </div>
          <div>
            <FieldLabel>Sexo</FieldLabel>
            <select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
              className={selectClass}
            >
              <option value="">Não informado</option>
              <option value="female">Feminino</option>
              <option value="male">Masculino</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div>
            <FieldLabel>Peso (kg)</FieldLabel>
            <Input type="number" min="0" step="0.1" value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} placeholder="Ex.: 70" />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={Heart}
        chip="from-pink-400 to-fuchsia-500"
        title="Saúde e histórico"
        hint="Informações clínicas relevantes"
        cardClassName="border-pink-200 bg-pink-50/40"
      >
        <div className="space-y-3">
          <div>
            <FieldLabel>Alergias</FieldLabel>
            <Input value={form.allergies} onChange={(e) => set("allergies", e.target.value)} placeholder="Alergias conhecidas (ou 'nenhuma')" />
          </div>
          <div>
            <FieldLabel>Condições clínicas</FieldLabel>
            <Input value={form.conditions} onChange={(e) => set("conditions", e.target.value)} placeholder="Ex.: insuficiência renal, diabetes..." />
          </div>
          <div>
            <FieldLabel>Medicamentos em uso</FieldLabel>
            <Input value={form.current_meds} onChange={(e) => set("current_meds", e.target.value)} placeholder="Uso contínuo (ou 'nenhum')" />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={Phone}
        chip="from-amber-400 to-orange-500"
        title="Contato e observações"
        hint="Como falar com o paciente"
        cardClassName="border-amber-200 bg-amber-50/40"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Contato</FieldLabel>
            <Input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="Telefone / e-mail" />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Observações</FieldLabel>
            <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Notas gerais do prontuário" />
          </div>
        </div>
      </FormSection>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={saving || !form.name.trim()}
          className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 shadow-soft"
        >
          {saving ? "Salvando..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}