import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Plus, Trash2, Printer, RotateCcw, ArrowLeft, Stethoscope } from "lucide-react";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PrescriptionDocument } from "@/components/receita/PrescriptionDocument";
import { TemplatePicker } from "@/components/receitas/TemplatePicker";
import { Save, BookmarkPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { PatientPicker } from "@/components/pacientes/PatientPicker";

const PRESCRIBER_KEY = "dosecerta.prescriber";

const todayISO = () => new Date().toISOString().slice(0, 10);
const emptyItem = () => ({ medication: "", posology: "", quantity: "", duration: "" });

export default function Receita() {
  const location = useLocation();
  const incoming = location.state || {};
  const docRef = useRef(null);

  const [prescriber, setPrescriber] = useState({
    name: "",
    cro: "",
    specialty: "",
    contact: "",
    city: "",
  });
  const [prescription, setPrescription] = useState({
    date: todayISO(),
    patient_name: "",
    patient_age: "",
    patient_weight: "",
    items: [emptyItem()],
    orientations: "",
    notes: "",
  });
  const [calcMeta, setCalcMeta] = useState(null);
  const [saving, setSaving] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const { toast } = useToast();

  // Load prescriber from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRESCRIBER_KEY);
      if (raw) setPrescriber((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  // Persist prescriber on change
  useEffect(() => {
    try {
      localStorage.setItem(PRESCRIBER_KEY, JSON.stringify(prescriber));
    } catch {
      /* ignore */
    }
  }, [prescriber]);

  // Prefill from incoming state (template or calculator result)
  useEffect(() => {
    if (incoming.template) {
      const t = incoming.template;
      setPrescription((p) => ({
        ...p,
        items: [
          {
            medication: t.medication_name || "",
            posology: t.posology || "",
            quantity: "",
            duration: t.duration_days ? `${t.duration_days} dias` : "",
          },
        ],
        orientations: t.orientations || "",
        notes: t.notes || "",
      }));
    } else if (incoming.calcResult) {
      const c = incoming.calcResult;
      const med = incoming.med;
      let posology = "";
      let quantity = "";
      if (c.is_combination) {
        posology =
          `${c.doses_per_day}x ao dia — ` +
          c.components.map((x) => `${x.active_ingredient} ${x.per_dose_mg} mg`).join(" + ");
      } else {
        posology = `${c.dose_per_dose_mg} mg por tomada, ${c.doses_per_day}x ao dia (a cada ${c.interval_hours}h)`;
        if (c.presentation_quantity != null) {
          quantity = `${c.presentation_quantity} ${c.presentation_unit}` +
            (c.presentation_drops ? ` (${c.presentation_drops} gotas)` : "");
        }
      }
      if (c.duration_days) posology += ` por ${c.duration_days} dias`;
      setPrescription((p) => ({
        ...p,
        patient_name: incoming.patientName || p.patient_name,
        items: [
          {
            medication: med?.name || "",
            posology,
            quantity,
            duration: c.duration_days ? `${c.duration_days} dias` : "",
          },
        ],
      }));
      setCalcMeta(c.base_version || null);
      if (incoming.patient?.patient_id) setPatientId(incoming.patient.patient_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setP = (k, v) => setPrescription((s) => ({ ...s, [k]: v }));
  const setPr = (k, v) => setPrescriber((s) => ({ ...s, [k]: v }));

  function updateItem(i, patch) {
    setPrescription((s) => ({
      ...s,
      items: s.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }));
  }
  function addItem() {
    setPrescription((s) => ({ ...s, items: [...s.items, emptyItem()] }));
  }
  function removeItem(i) {
    setPrescription((s) => ({ ...s, items: s.items.filter((_, idx) => idx !== i) }));
  }
  function clearAll() {
    setPrescription({
      date: todayISO(),
      patient_name: "",
      patient_age: "",
      patient_weight: "",
      items: [emptyItem()],
      orientations: "",
      notes: "",
    });
    setCalcMeta(null);
  }

  function applyTemplate(t) {
    setPrescription((p) => ({
      ...p,
      items: [
        {
          medication: t.medication_name || "",
          posology: t.posology || "",
          quantity: "",
          duration: t.duration_days ? `${t.duration_days} dias` : "",
        },
      ],
      orientations: t.orientations || p.orientations,
      notes: t.notes || p.notes,
    }));
    toast({ title: "Modelo carregado", description: `Prescrição preenchida com "${t.name}".` });
  }

  async function handleSaveAsTemplate() {
    const first = prescription.items[0];
    if (!first?.medication.trim() || !first?.posology.trim()) {
      toast({ title: "Preencha medicamento e posologia", description: "É necessário ao menos um item para salvar como modelo.", variant: "destructive" });
      return;
    }
    const name = window.prompt("Nome do modelo:", first.medication);
    if (!name) return;
    try {
      await base44.entities.PrescriptionTemplate.create({
        name: name.trim(),
        category: "outro",
        medication_name: first.medication,
        posology: first.posology,
        duration_days: null,
        orientations: prescription.orientations || "",
        notes: prescription.notes || "",
      });
      toast({ title: "Modelo salvo", description: "Agora você pode carregá-lo em receitas futuras." });
    } catch {
      toast({ title: "Erro ao salvar modelo", variant: "destructive" });
    }
  }

  function handlePrint() {
    const node = docRef.current;
    if (!node) return;
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receituário Odontológico</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;color:#171717;padding:40px;max-width:720px;margin:0 auto;line-height:1.5}
        .doc{border:1px solid #e5e7eb;border-radius:12px;padding:40px}
        .hdr{display:flex;justify-content:space-between;border-bottom:1px solid #d4d4d4;padding-bottom:12px}
        .pname{font-weight:bold;font-size:18px}
        .cro{font-size:13px;color:#404040;margin-top:2px}
        .pspec,.pcontact{font-size:11px;color:#737373}
        .title{font-weight:bold;font-size:16px}
        .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#737373;font-weight:bold}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 0;border-bottom:1px solid #e5e7eb}
        .field{margin-bottom:4px}
        .field .lbl{margin-bottom:2px}
        .val{font-size:14px;font-weight:500}
        .sec{padding:12px 0}
        .sec-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#737373;font-weight:bold;margin-bottom:6px}
        .items{list-style:none;padding-left:0;margin:0}
        .item{margin-bottom:10px}
        .med{font-weight:bold;font-size:14px}
        .pos{font-size:13px;color:#262626;padding-left:16px;margin-top:2px}
        .meta{font-size:11px;color:#737373;padding-left:16px;margin-top:2px}
        .ori{font-size:13px;color:#262626}
        .notes{font-size:12px;color:#525252}
        .sig{margin-top:40px}
        .loc{font-size:13px;color:#404040}
        .sigline{border-top:1px solid #404040;width:260px;margin-top:32px}
        .signame{font-weight:600;font-size:13px;margin-top:4px}
        .sigcro{font-size:11px;color:#737373}
        .warn{margin-top:16px;border-top:1px solid #e5e7eb;padding-top:10px;font-size:10px;color:#737373}
        .empty{font-size:13px;color:#a3a3a3;font-style:italic}
      </style></head><body>${node.innerHTML}</body></html>`
    );
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 300);
  }

  async function handleSave() {
    if (!prescription.patient_name.trim()) {
      toast({ title: "Informe o nome do paciente", description: "A receita precisa de um paciente para ser salva.", variant: "destructive" });
      return;
    }
    try {
      setSaving(true);
      await base44.entities.Prescription.create({
        patient_name: prescription.patient_name,
        patient_age: prescription.patient_age,
        patient_weight: prescription.patient_weight,
        date: prescription.date,
        items: prescription.items,
        orientations: prescription.orientations,
        notes: prescription.notes,
        prescriber_name: prescriber.name,
        prescriber_cro: prescriber.cro,
        patient_id: patientId,
      });
      toast({ title: "Receita salva", description: "A receita foi registrada no painel clínico." });
    } catch (e) {
      toast({ title: "Erro ao salvar", description: "Não foi possível salvar a receita.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Gerador de receita formal
            </h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-neutral-500 max-w-2xl">
            Monte o receituário odontológico com dados do profissional, paciente, medicamentos e
            orientações — pronto para imprimir.
          </p>
        </div>
        <Link
          to="/modulos/receituarios"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          <ArrowLeft className="w-4 h-4" /> Modelos
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_minmax(0,520px)] gap-6 items-start">
        {/* Form */}
        <div className="space-y-5">
          <TemplatePicker onApply={applyTemplate} />

          <Section title="Profissional" icon={Stethoscope}>
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Nome do profissional">
                <Input
                  value={prescriber.name}
                  onChange={(e) => setPr("name", e.target.value)}
                  placeholder="Dr(a). Nome"
                />
              </FormField>
              <FormField label="CRO">
                <Input
                  value={prescriber.cro}
                  onChange={(e) => setPr("cro", e.target.value)}
                  placeholder="CRO-SP 12345"
                />
              </FormField>
              <FormField label="Especialidade">
                <Input
                  value={prescriber.specialty}
                  onChange={(e) => setPr("specialty", e.target.value)}
                  placeholder="Ex.: Bucomaxilofacial"
                />
              </FormField>
              <FormField label="Contato">
                <Input
                  value={prescriber.contact}
                  onChange={(e) => setPr("contact", e.target.value)}
                  placeholder="Telefone / e-mail"
                />
              </FormField>
              <FormField label="Cidade (para assinatura)">
                <Input
                  value={prescriber.city}
                  onChange={(e) => setPr("city", e.target.value)}
                  placeholder="Ex.: São Paulo - SP"
                />
              </FormField>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Dados do profissional salvos automaticamente neste navegador.
            </p>
          </Section>

          <Section title="Paciente e data">
            <div className="mb-3">
              <PatientPicker
                selectedId={patientId}
                onChange={(p) => {
                  if (!p) {
                    setPatientId(null);
                    return;
                  }
                  setPatientId(p.id);
                  setPrescription((s) => ({
                    ...s,
                    patient_name: p.name,
                    patient_age: p.age_years ? String(p.age_years) : s.patient_age,
                    patient_weight: p.weight_kg ? String(p.weight_kg) : s.patient_weight,
                  }));
                }}
              />
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <FormField label="Nome do paciente">
                  <Input
                    value={prescription.patient_name}
                    onChange={(e) => setP("patient_name", e.target.value)}
                    placeholder="Nome"
                  />
                </FormField>
              </div>
              <FormField label="Idade">
                <Input
                  value={prescription.patient_age}
                  onChange={(e) => setP("patient_age", e.target.value)}
                  placeholder="Ex.: 34 anos"
                />
              </FormField>
              <FormField label="Peso (kg)">
                <Input
                  value={prescription.patient_weight}
                  onChange={(e) => setP("patient_weight", e.target.value)}
                  placeholder="Ex.: 70"
                />
              </FormField>
              <FormField label="Data">
                <Input
                  type="date"
                  value={prescription.date}
                  onChange={(e) => setP("date", e.target.value)}
                />
              </FormField>
            </div>
          </Section>

          <Section title="Medicamentos">
            <div className="space-y-3">
              {prescription.items.map((it, i) => (
                <div key={i} className="rounded-lg border border-neutral-200 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500">Item {i + 1}</span>
                    {prescription.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>
                    )}
                  </div>
                  <FormField label="Medicamento e apresentação">
                    <Input
                      value={it.medication}
                      onChange={(e) => updateItem(i, { medication: e.target.value })}
                      placeholder="Ex.: Amoxicilina 500 mg — cápsula"
                    />
                  </FormField>
                  <FormField label="Posologia">
                    <Textarea
                      rows={2}
                      value={it.posology}
                      onChange={(e) => updateItem(i, { posology: e.target.value })}
                      placeholder="Ex.: Tomar 1 cápsula de 8/8h por 7 dias"
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Quantidade">
                      <Input
                        value={it.quantity}
                        onChange={(e) => updateItem(i, { quantity: e.target.value })}
                        placeholder="Ex.: 21 cápsulas"
                      />
                    </FormField>
                    <FormField label="Duração">
                      <Input
                        value={it.duration}
                        onChange={(e) => updateItem(i, { duration: e.target.value })}
                        placeholder="Ex.: 7 dias"
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              <Plus className="w-4 h-4" /> Adicionar medicamento
            </button>
          </Section>

          <Section title="Orientações e observações">
            <FormField label="Orientações ao paciente">
              <Textarea
                rows={3}
                value={prescription.orientations}
                onChange={(e) => setP("orientations", e.target.value)}
                placeholder="Ex.: Tomar com água, preferencialmente com alimento. Completar o tratamento."
              />
            </FormField>
            <FormField label="Observações do profissional">
              <Textarea
                rows={2}
                value={prescription.notes}
                onChange={(e) => setP("notes", e.target.value)}
                placeholder="Ex.: Reavaliar em 48–72h."
              />
            </FormField>
          </Section>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Salvando..." : "Salvar receita"}
            </Button>
            <Button onClick={handlePrint} className="bg-neutral-900 text-white hover:bg-neutral-800">
              <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
            </Button>
            <Button variant="outline" onClick={handleSaveAsTemplate}>
              <BookmarkPlus className="w-4 h-4 mr-1" /> Salvar como modelo
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <RotateCcw className="w-4 h-4 mr-1" /> Limpar
            </Button>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20">
          <PrescriptionDocument
            innerRef={docRef}
            prescriber={prescriber}
            prescription={prescription}
            calcMeta={calcMeta}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
      <h3 className="font-bold text-sm text-neutral-900 mb-3 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-neutral-500" />}
        {title}
      </h3>
      {children}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <Label className="block text-xs font-semibold text-neutral-600 mb-1">{label}</Label>
      {children}
    </div>
  );
}