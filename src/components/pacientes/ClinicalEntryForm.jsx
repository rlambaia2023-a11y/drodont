import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Stethoscope, Activity, FileText, CalendarDays, ClipboardList } from "lucide-react";
import { FormBanner, FormSection, FieldLabel, selectClass } from "@/components/pacientes/FormParts";

const CATEGORIES = [
  { value: "anotacao", label: "Anotação", icon: FileText, chip: "from-sky-400 to-blue-500" },
  { value: "procedimento", label: "Procedimento", icon: Stethoscope, chip: "from-emerald-400 to-teal-500" },
  { value: "evolucao", label: "Evolução", icon: Activity, chip: "from-amber-400 to-orange-500" },
];

export function ClinicalEntryForm({ onSubmit, onCancel }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    date: today,
    category: "anotacao",
    notes: "",
    evolution: "",
    procedure_name: "",
    tooth_region: "",
    materials: "",
    procedure_notes: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const isProc = form.category === "procedimento";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.date) return;
    try {
      setSaving(true);
      await onSubmit({
        date: form.date,
        category: form.category,
        notes: form.notes,
        evolution: form.evolution,
        procedure_name: isProc ? form.procedure_name : null,
        tooth_region: isProc ? form.tooth_region : null,
        materials: isProc ? form.materials : null,
        procedure_notes: isProc ? form.procedure_notes : null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormBanner
        title="Novo registro de atendimento"
        subtitle="Conte como foi o atendimento — cada detalhe ajuda o próximo passo."
      />

      <FormSection
        icon={CalendarDays}
        chip="from-sky-400 to-blue-500"
        title="Quando e o quê"
        hint="Data e tipo de registro"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Data do atendimento *</FieldLabel>
            <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Categoria do registro</FieldLabel>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = form.category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => set("category", c.value)}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl border text-[11px] font-semibold transition-all ${
                      active
                        ? `bg-gradient-to-br ${c.chip} text-white border-transparent shadow-soft`
                        : "border-border bg-white text-foreground/60 hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={ClipboardList}
        chip="from-sky-400 to-blue-500"
        title="Anotação clínica"
        hint="Queixa, achados e observações do atendimento"
        cardClassName="border-sky-200 bg-sky-50/40"
      >
        <Textarea
          rows={2}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Queixa, achados, observações do atendimento..."
        />
      </FormSection>

      <FormSection
        icon={Activity}
        chip="from-amber-400 to-orange-500"
        title="Evolução do tratamento"
        hint="Resposta do caso e próximos passos"
        cardClassName="border-amber-200 bg-amber-50/40"
      >
        <Textarea
          rows={2}
          value={form.evolution}
          onChange={(e) => set("evolution", e.target.value)}
          placeholder="Como o caso evoluiu, resposta, próximos passos..."
        />
      </FormSection>

      {isProc && (
        <FormSection
          icon={Stethoscope}
          chip="from-emerald-400 to-teal-500"
          title="Detalhamento do procedimento"
          hint="Dente, materiais e observações técnicas"
          cardClassName="border-emerald-200 bg-emerald-50/50"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel>Procedimento</FieldLabel>
              <Input value={form.procedure_name} onChange={(e) => set("procedure_name", e.target.value)} placeholder="Ex.: Restauração, exodontia, profilaxia..." />
            </div>
            <div>
              <FieldLabel>Dente / região</FieldLabel>
              <Input value={form.tooth_region} onChange={(e) => set("tooth_region", e.target.value)} placeholder="Ex.: 36, quadrante superior direito..." />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Materiais utilizados</FieldLabel>
              <Input value={form.materials} onChange={(e) => set("materials", e.target.value)} placeholder="Ex.: resina composta, anestésico lidocaína..." />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Observações do procedimento</FieldLabel>
              <Textarea rows={2} value={form.procedure_notes} onChange={(e) => set("procedure_notes", e.target.value)} placeholder="Detalhes técnicos, intercorrências..." />
            </div>
          </div>
        </FormSection>
      )}

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={saving || !form.date}
          className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 shadow-soft"
        >
          {saving ? "Salvando..." : "Adicionar ao prontuário"}
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