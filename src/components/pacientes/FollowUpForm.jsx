import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarDays, Bell, CalendarClock } from "lucide-react";
import { FormBanner, FormSection, FieldLabel, selectClass } from "@/components/pacientes/FormParts";

const TYPES = [
  { value: "retorno", label: "Retorno" },
  { value: "consulta_acompanhamento", label: "Consulta de acompanhamento" },
  { value: "outros", label: "Outros" },
];

export function FollowUpForm({ patient, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    scheduled_date: "",
    type: "retorno",
    reason: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.scheduled_date) return;
    setSaving(true);
    try {
      await onSubmit({
        patient_id: patient.id,
        patient_name: patient.name,
        scheduled_date: form.scheduled_date,
        type: form.type,
        reason: form.reason,
        notes: form.notes,
        status: "agendado",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormBanner
        title="Agendar retorno"
        subtitle="Programe o acompanhamento e receba lembretes automáticos por e-mail."
        gradient="from-violet-400 via-violet-500 to-indigo-500"
      />

      <FormSection
        icon={CalendarClock}
        chip="from-violet-500 to-indigo-600"
        title="Data e tipo"
        hint="Quando e qual acompanhamento"
        cardClassName="border-violet-200 bg-violet-50/40"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Data do retorno *</FieldLabel>
            <Input
              type="date"
              required
              value={form.scheduled_date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => update("scheduled_date", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Tipo</FieldLabel>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className={selectClass}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={Bell}
        chip="from-amber-400 to-orange-500"
        title="Motivo e observações"
        hint="Por que este retorno"
        cardClassName="border-amber-200 bg-amber-50/40"
      >
        <div className="space-y-3">
          <div>
            <FieldLabel>Motivo</FieldLabel>
            <Input
              type="text"
              value={form.reason}
              onChange={(e) => update("reason", e.target.value)}
              placeholder="Ex.: Retorno após RCT dente 36"
            />
          </div>
          <div>
            <FieldLabel>Observações</FieldLabel>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={2}
              placeholder="Opcional"
            />
          </div>
        </div>
      </FormSection>

      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
        <Bell className="w-3.5 h-3.5 shrink-0" />
        <span>Um lembrete automático por e-mail é enviado diariamente às 08h para retornos próximos do prazo.</span>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-90 shadow-soft"
        >
          <CalendarDays className="w-4 h-4" /> {saving ? "Agendando..." : "Agendar retorno"}
        </Button>
      </div>
    </form>
  );
}