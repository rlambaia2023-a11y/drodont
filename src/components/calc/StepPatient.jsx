import React from "react";
import { Users } from "lucide-react";
import { PatientPicker } from "@/components/pacientes/PatientPicker";

function TriState({ name, label, value, onChange, hint }) {
  const options = [
    { v: "yes", l: "Sim" },
    { v: "no", l: "Não" },
    { v: "unknown", l: "Não sei" },
  ];
  return (
    <fieldset>
      <legend className="block text-sm font-semibold text-neutral-700 mb-1.5">{label}</legend>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange({ [name]: o.v })}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {o.l}
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs text-neutral-500 mt-1">{hint}</p>}
    </fieldset>
  );
}

export function StepPatient({ population, value, onChange }) {
  const isPediatric = population === "pediatric";

  function update(patch) {
    onChange({ ...value, ...patch });
  }

  function handlePickPatient(p) {
    if (!p) {
      onChange({ ...value, patient_id: null, patient_name: "" });
      return;
    }
    onChange({
      ...value,
      patient_id: p.id,
      patient_name: p.name,
      ageYears: p.age_years ?? value.ageYears,
      weightKg: p.weight_kg ?? value.weightKg,
      allergiesText: p.allergies ?? value.allergiesText,
      conditionsText: p.conditions ?? value.conditionsText,
      currentMedsText: p.current_meds ?? value.currentMedsText,
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-3">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-700">
          <Users className="w-3.5 h-3.5" /> Vincular ao prontuário
        </div>
        <PatientPicker selectedId={value.patient_id} onChange={handlePickPatient} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age-years" className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Idade (anos)
          </label>
          <input
            id="age-years"
            type="number"
            min="0"
            max="120"
            value={value.ageYears ?? ""}
            onChange={(e) => update({ ageYears: e.target.value === "" ? null : parseInt(e.target.value) })}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        {isPediatric && (
          <div>
            <label htmlFor="age-months" className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Meses adicionais
            </label>
            <input
              id="age-months"
              type="number"
              min="0"
              max="11"
              value={value.ageMonths ?? ""}
              onChange={(e) => update({ ageMonths: e.target.value === "" ? null : parseInt(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        )}
      </div>

      {isPediatric && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight-kg" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Peso aferido (kg)
              </label>
              <input
                id="weight-kg"
                type="number"
                min="0"
                step="0.1"
                value={value.weightKg ?? ""}
                onChange={(e) => update({ weightKg: e.target.value === "" ? null : parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                aria-describedby="weight-hint"
              />
              <p id="weight-hint" className="text-xs text-neutral-500 mt-1">
                Peso não pode ser inferido da idade.
              </p>
            </div>
            <div>
              <label htmlFor="weight-date" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Data da aferição
              </label>
              <input
                id="weight-date"
                type="date"
                value={value.weightDate ?? ""}
                onChange={(e) => update({ weightDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
        </>
      )}

      {!isPediatric && (
        <div>
          <label htmlFor="weight-adult" className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Peso (kg) <span className="font-normal text-neutral-400">— somente se o regime exigir</span>
          </label>
          <input
            id="weight-adult"
            type="number"
            min="0"
            step="0.1"
            value={value.weightKg ?? ""}
            onChange={(e) => update({ weightKg: e.target.value === "" ? null : parseFloat(e.target.value) })}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      )}

      <div>
        <label htmlFor="allergies" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Alergias e reações prévias
        </label>
        <input
          id="allergies"
          type="text"
          value={value.allergiesText ?? ""}
          onChange={(e) => update({ allergiesText: e.target.value })}
          placeholder="Liste substâncias com alergia conhecida (ou 'nenhuma')"
          className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div>
        <label htmlFor="current-meds" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Medicamentos em uso
        </label>
        <input
          id="current-meds"
          type="text"
          value={value.currentMedsText ?? ""}
          onChange={(e) => update({ currentMedsText: e.target.value })}
          placeholder="Liste medicamentos em uso contínuo (ou 'nenhum')"
          className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div>
        <label htmlFor="conditions" className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Condições clínicas relevantes
        </label>
        <input
          id="conditions"
          type="text"
          value={value.conditionsText ?? ""}
          onChange={(e) => update({ conditionsText: e.target.value })}
          placeholder="Ex.: insuficiência renal, diabetes, úlcera gástrica..."
          className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      {!isPediatric && (
        <div className="grid sm:grid-cols-2 gap-4">
          <TriState
            name="pregnancy"
            label="Gestação"
            value={value.pregnancy}
            onChange={update}
            hint="Resposta em branco não é interpretada como negativa."
          />
          <TriState
            name="lactation"
            label="Lactação"
            value={value.lactation}
            onChange={update}
          />
        </div>
      )}
    </div>
  );
}