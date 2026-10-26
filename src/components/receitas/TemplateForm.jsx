import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CATEGORY_META } from "@/components/receitas/TemplateCard";

const empty = {
  name: "",
  category: "outro",
  situation: "",
  medication_name: "",
  posology: "",
  duration_days: "",
  orientations: "",
  notes: "",
};

export function TemplateForm({ initialValue, onSubmit, onCancel, submitLabel }) {
  const [value, setValue] = useState(initialValue || empty);

  useEffect(() => {
    setValue(initialValue || empty);
  }, [initialValue]);

  const set = (k, v) => setValue((s) => ({ ...s, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!value.name.trim() || !value.medication_name.trim() || !value.posology.trim()) return;
    onSubmit({
      ...value,
      duration_days: value.duration_days === "" ? null : Number(value.duration_days),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="tpl-name" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Nome do modelo *
        </Label>
        <Input
          id="tpl-name"
          value={value.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ex.: Antibiótico para infecção odontogênica"
          className="w-full"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tpl-cat" className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Categoria
          </Label>
          <Select value={value.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger id="tpl-cat" className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_META).map(([k, m]) => (
                <SelectItem key={k} value={k}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tpl-dur" className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Duração (dias)
          </Label>
          <Input
            id="tpl-dur"
            type="number"
            min="0"
            value={value.duration_days}
            onChange={(e) => set("duration_days", e.target.value)}
            placeholder="Ex.: 7"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tpl-sit" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Situação clínica / indicação
        </Label>
        <Input
          id="tpl-sit"
          value={value.situation}
          onChange={(e) => set("situation", e.target.value)}
          placeholder="Ex.: Infecção dentária / abscesso odontogênico"
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="tpl-med" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Medicamento e apresentação *
        </Label>
        <Input
          id="tpl-med"
          value={value.medication_name}
          onChange={(e) => set("medication_name", e.target.value)}
          placeholder="Ex.: Amoxicilina 500 mg — cápsula"
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="tpl-pos" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Posologia padrão *
        </Label>
        <Textarea
          id="tpl-pos"
          value={value.posology}
          onChange={(e) => set("posology", e.target.value)}
          placeholder="Ex.: Tomar 1 cápsula (500 mg) de 8/8 horas, por 7 dias."
          rows={2}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="tpl-ori" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Orientações ao paciente
        </Label>
        <Textarea
          id="tpl-ori"
          value={value.orientations}
          onChange={(e) => set("orientations", e.target.value)}
          placeholder="Ex.: Tomar com água, preferencialmente com alimento. Completar o tratamento mesmo que os sintomas melhorem."
          rows={3}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="tpl-notes" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Observações do profissional
        </Label>
        <Textarea
          id="tpl-notes"
          value={value.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Ex.: Reavaliar em 48–72h. Ajustar em insuficiência renal."
          rows={2}
          className="w-full"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800">
          {submitLabel || "Salvar modelo"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}