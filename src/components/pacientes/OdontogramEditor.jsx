import React, { useState, useEffect } from "react";
import { Save, Loader2, RotateCcw, ClipboardList, Stethoscope, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/pacientes/FormParts";

const STATUS = {
  sao: { label: "Sadio", color: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500" },
  carie: { label: "Cárie", color: "bg-rose-100 text-rose-700 border-rose-300", dot: "bg-rose-500" },
  restauracao: { label: "Restauração", color: "bg-sky-100 text-sky-700 border-sky-300", dot: "bg-sky-500" },
  ausente: { label: "Ausente", color: "bg-slate-100 text-slate-500 border-slate-300", dot: "bg-slate-400" },
  implante: { label: "Implante", color: "bg-violet-100 text-violet-700 border-violet-300", dot: "bg-violet-500" },
  coroa: { label: "Coroa", color: "bg-amber-100 text-amber-700 border-amber-300", dot: "bg-amber-500" },
  tratamento_canal: { label: "Trat. de canal", color: "bg-indigo-100 text-indigo-700 border-indigo-300", dot: "bg-indigo-500" },
  fratura: { label: "Fratura", color: "bg-orange-100 text-orange-700 border-orange-300", dot: "bg-orange-500" },
};

const PROCEDURES = [
  "Profilaxia",
  "Restauração",
  "Tratamento de canal",
  "Extração",
  "Selante",
  "Coroa protética",
  "Implante",
  "Apicetomia",
  "Raspagem subgengival",
  "Clareamento",
];

const UPPER_RIGHT = ["18", "17", "16", "15", "14", "13", "12", "11"];
const UPPER_LEFT = ["21", "22", "23", "24", "25", "26", "27", "28"];
const LOWER_LEFT = ["31", "32", "33", "34", "35", "36", "37", "38"];
const LOWER_RIGHT = ["48", "47", "46", "45", "44", "43", "42", "41"];

export function OdontogramEditor({ patient }) {
  const [teeth, setTeeth] = useState({});
  const [recordId, setRecordId] = useState(null);
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Odontogram.filter({ patient_id: patient.id }, "-date", 5);
        const latest = list?.[0];
        if (latest) {
          setRecordId(latest.id);
          setNotes(latest.notes || "");
          const map = {};
          (latest.teeth || []).forEach((t) => {
            map[t.tooth] = { ...t, procedures: t.procedures || [] };
          });
          setTeeth(map);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [patient.id]);

  function ensure(tooth) {
    return teeth[tooth] || { tooth, status: "sao", surface: "", procedures: [], notes: "" };
  }

  function setStatus(tooth, status) {
    setTeeth((s) => ({ ...s, [tooth]: { ...ensure(tooth), tooth, status } }));
  }

  function toggleProcedure(tooth, proc) {
    setTeeth((s) => {
      const cur = ensure(tooth);
      const has = (cur.procedures || []).includes(proc);
      return { ...s, [tooth]: { ...cur, procedures: has ? cur.procedures.filter((p) => p !== proc) : [...(cur.procedures || []), proc] } };
    });
  }

  function setField(tooth, field, value) {
    setTeeth((s) => ({ ...s, [tooth]: { ...ensure(tooth), [field]: value } }));
  }

  function clearTooth(tooth) {
    setTeeth((s) => {
      const next = { ...s };
      delete next[tooth];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      const teethArr = Object.values(teeth).map((t) => ({
        tooth: t.tooth,
        status: t.status || "sao",
        surface: t.surface || "",
        procedures: t.procedures || [],
        notes: t.notes || "",
      }));
      const payload = {
        patient_id: patient.id,
        patient_name: patient.name,
        date: new Date().toISOString().slice(0, 10),
        teeth: teethArr,
        notes,
      };
      if (recordId) {
        await base44.entities.Odontogram.update(recordId, payload);
      } else {
        const rec = await base44.entities.Odontogram.create(payload);
        setRecordId(rec.id);
      }
    } finally {
      setSaving(false);
    }
  }

  function clearAll() {
    setTeeth({});
    setSelected(null);
  }

  if (loading) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Carregando odontograma...</div>;
  }

  const marked = Object.values(teeth).filter((t) => t.status !== "sao" || (t.procedures && t.procedures.length) || t.notes);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs text-muted-foreground">Notação FDI · clique em um dente para registrar condição, procedimentos e anotações.</p>
        <button onClick={clearAll} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-3.5 h-3.5" /> Limpar tudo
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(STATUS).map(([k, v]) => (
          <span key={k} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${v.color}`}>
            <span className={`w-2 h-2 rounded-full ${v.dot}`} /> {v.label}
          </span>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl border-2 border-border bg-white p-3 sm:p-4 overflow-x-auto">
        <div className="min-w-[520px] space-y-2">
          <Row label="Superior" right={UPPER_RIGHT} left={UPPER_LEFT} teeth={teeth} onSelect={setSelected} selected={selected} />
          <div className="border-t-2 border-dashed border-border my-1" />
          <Row label="Inferior" right={LOWER_RIGHT} left={LOWER_LEFT} teeth={teeth} onSelect={setSelected} selected={selected} />
        </div>
      </div>

      {/* Selected tooth editor */}
      {selected && (
        <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-heading font-bold text-sm text-foreground">Dente {selected}</div>
            <div className="flex gap-2">
              <button onClick={() => clearTooth(selected)} className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" /> Limpar dente
              </button>
              <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground">Fechar</button>
            </div>
          </div>

          {/* Condition */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Condição</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(STATUS).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setStatus(selected, k)}
                  className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                    teeth[selected]?.status === k ? v.color + " ring-2 ring-violet-400" : "bg-white border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Procedures */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Procedimentos</div>
            <div className="flex flex-wrap gap-1.5">
              {PROCEDURES.map((p) => {
                const on = (teeth[selected]?.procedures || []).includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => toggleProcedure(selected, p)}
                    className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                      on ? "bg-violet-600 text-white border-violet-600" : "bg-white border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Surface + notes */}
          <div className="grid sm:grid-cols-2 gap-2">
            <div>
              <FieldLabel>Superfície</FieldLabel>
              <Input
                value={teeth[selected]?.surface || ""}
                onChange={(e) => setField(selected, "surface", e.target.value)}
                placeholder="O, M, D, V, L"
              />
            </div>
            <div>
              <FieldLabel>Anotação</FieldLabel>
              <Input
                value={teeth[selected]?.notes || ""}
                onChange={(e) => setField(selected, "notes", e.target.value)}
                placeholder="Anotação do dente"
              />
            </div>
          </div>
        </div>
      )}

      {/* Marked teeth summary */}
      {marked.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-background/50 p-3">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5" /> Dentes marcados ({marked.length})
          </div>
          <ul className="space-y-1.5">
            {marked.map((t) => {
              const meta = STATUS[t.status] || STATUS.sao;
              return (
                <li key={t.tooth} className="flex items-start gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full border font-bold shrink-0 ${meta.color}`}>{t.tooth}</span>
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">{meta.label}</span>
                    {t.surface && <span className="text-muted-foreground"> · sup. {t.surface}</span>}
                    {t.procedures?.length > 0 && (
                      <span className="text-violet-700"> · {t.procedures.join(", ")}</span>
                    )}
                    {t.notes && <span className="text-muted-foreground italic"> · {t.notes}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <FieldLabel>Observações gerais</FieldLabel>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Observações gerais do odontograma"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold shadow-soft hover:opacity-90 disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Salvando..." : "Salvar odontograma"}
      </button>
    </div>
  );
}

function Row({ label, right, left, teeth, onSelect, selected }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-stretch gap-1">
        <div className="flex gap-1">
          {right.map((t) => (
            <ToothButton key={t} tooth={t} data={teeth[t]} onSelect={onSelect} selected={selected} />
          ))}
        </div>
        <div className="w-2" />
        <div className="flex gap-1">
          {left.map((t) => (
            <ToothButton key={t} tooth={t} data={teeth[t]} onSelect={onSelect} selected={selected} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ToothButton({ tooth, data, onSelect, selected }) {
  const meta = STATUS[data?.status] || STATUS.sao;
  const isSel = selected === tooth;
  const hasProcs = data?.procedures?.length > 0;
  const isMarked = data && (data.status !== "sao" || hasProcs || data.notes);
  return (
    <button
      onClick={() => onSelect(tooth)}
      className={`relative flex flex-col items-center justify-center w-9 h-12 rounded-lg border-2 text-xs font-bold transition-all ${meta.color} ${
        isSel ? "ring-2 ring-violet-500 scale-105" : "hover:scale-105"
      } ${isMarked ? "shadow-soft" : ""}`}
      title={data?.status ? `${meta.label}${hasProcs ? " · " + data.procedures.join(", ") : ""}` : "Sadio"}
    >
      <span>{tooth}</span>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} mt-0.5`} />
      {hasProcs && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-600 border border-white flex items-center justify-center">
          <Stethoscope className="w-2 h-2 text-white" />
        </span>
      )}
    </button>
  );
}