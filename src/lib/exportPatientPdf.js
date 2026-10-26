import { jsPDF } from "jspdf";
import { format } from "date-fns";

const NAVY = [30, 58, 138];
const BLUE = [37, 99, 235];
const SKY = [219, 234, 251];
const MUTED = [100, 116, 139];
const EMERALD = [5, 150, 105];
const AMBER = [180, 130, 20];
const PINK = [190, 70, 120];
const VIOLET = [139, 92, 246];

const STATUS_LABEL = {
  sao: "São",
  carie: "Cárie",
  restauracao: "Restauração",
  ausente: "Ausente",
  implante: "Implante",
  coroa: "Coroa",
  tratamento_canal: "Tratamento de canal",
  fratura: "Fratura",
};

function fmtDate(d) {
  if (!d) return "—";
  try {
    return format(new Date(d + (d.length === 10 ? "T00:00:00" : "")), "dd/MM/yyyy");
  } catch {
    return String(d);
  }
}

export function exportPatientPdf({ patient, entries = [], cases = [], prescriptions = [], weights = [], odontograms = [] }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentW = pageW - margin * 2;
  let y = margin;

  function ensure(space) {
    if (y + space > pageH - margin - 24) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  }

  function paragraph(text, { size = 10, color = NAVY, gap = 4, bold = false } = {}) {
    if (!text) return;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text), contentW);
    lines.forEach((ln) => {
      ensure(size + 2);
      doc.text(ln, margin, y);
      y += size + 2;
    });
    y += gap;
  }

  function heading(label, color = BLUE) {
    y += 6;
    ensure(26);
    doc.setFillColor(...color);
    doc.roundedRect(margin, y - 10, 5, 14, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...NAVY);
    doc.text(label, margin + 12, y);
    y += 14;
  }

  function kv(label, value) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    const labelW = doc.getTextWidth(label + ": ");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...NAVY);
    const valLines = doc.splitTextToSize(String(value || "—"), contentW - labelW);
    valLines.forEach((ln, i) => {
      ensure(13);
      if (i === 0) doc.text(label + ": ", margin, y);
      doc.text(ln, margin + labelW, y);
      y += 13;
    });
  }

  function divider() {
    ensure(10);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + contentW, y);
    y += 8;
  }

  function addFooter() {
    const fy = pageH - 28;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.6);
    doc.line(margin, fy, margin + contentW, fy);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("ODONTO-FBBR · Prontuário clínico · Documento gerado em " + format(new Date(), "dd/MM/yyyy 'às' HH:mm"), margin, fy + 12);
    doc.text("Ferramenta de suporte à decisão clínica — não substitui o julgamento profissional.", margin, fy + 22);
  }

  // ===== Header band =====
  doc.setFillColor(...BLUE);
  doc.roundedRect(margin, margin, contentW, 64, 10, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("ODONTO-FBBR", margin + 18, margin + 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Prontuário clínico do paciente", margin + 18, margin + 48);
  doc.setFontSize(9);
  doc.text("Emitido em " + format(new Date(), "dd/MM/yyyy 'às' HH:mm"), margin + contentW - 160, margin + 48);
  y = margin + 84;

  // ===== Patient summary =====
  heading("Dados do paciente");
  kv("Nome", patient?.name);
  kv("Idade", patient?.age_years ? `${patient.age_years} anos` : "—");
  kv("Sexo", patient?.gender === "female" ? "Feminino" : patient?.gender === "male" ? "Masculino" : patient?.gender === "other" ? "Outro" : "—");
  kv("Peso atual", patient?.weight_kg ? `${patient.weight_kg} kg` : "—");
  kv("Alergias", patient?.allergies || "—");
  kv("Condições clínicas", patient?.conditions || "—");
  kv("Medicamentos em uso", patient?.current_meds || "—");
  kv("Contato", patient?.contact || "—");
  if (patient?.notes) kv("Observações", patient.notes);
  divider();

  // ===== Odontograma =====
  const odoSorted = [...odontograms]
    .filter((o) => o.teeth && o.teeth.length)
    .sort((a, b) => new Date(b.date || b.created_date) - new Date(a.date || a.created_date));
  if (odoSorted.length) {
    heading("Odontograma", VIOLET);
    const latest = odoSorted[0];
    kv("Data do registro", fmtDate(latest.date || latest.created_date));
    if (latest.notes) kv("Observações gerais", latest.notes);
    const teeth = latest.teeth || [];
    const quads = {};
    teeth.forEach((t) => {
      const q = (t.tooth || "").charAt(0) || "?";
      (quads[q] = quads[q] || []).push(t);
    });
    Object.keys(quads)
      .sort()
      .forEach((q) => {
        ensure(16);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...MUTED);
        doc.text(`Quadrante ${q}`, margin, y);
        y += 13;
        quads[q].forEach((t) => {
          const status = STATUS_LABEL[t.status] || t.status || "—";
          let line = `${t.tooth} — ${status}`;
          if (t.surface) line += ` (face ${t.surface})`;
          paragraph(line, { size: 10, color: NAVY, gap: 1 });
          if (t.procedures?.length)
            paragraph("Procedimentos: " + t.procedures.join(", "), { size: 9, color: MUTED, gap: 1 });
          if (t.notes) paragraph("Obs.: " + t.notes, { size: 9, color: MUTED, gap: 1 });
        });
      });
    if (odoSorted.length > 1) {
      paragraph(
        `+${odoSorted.length - 1} registro(s) anterior(es) de odontograma não exibido(s) neste documento.`,
        { size: 9, color: MUTED, gap: 2 }
      );
    }
    divider();
  }

  // ===== Weight tracking =====
  const wSorted = [...weights].filter((w) => w.date && w.weight_kg != null).sort((a, b) => new Date(a.date) - new Date(b.date));
  if (wSorted.length) {
    heading("Acompanhamento de peso", EMERALD);
    wSorted.forEach((w) => {
      kv(fmtDate(w.date), `${w.weight_kg} kg${w.note ? " — " + w.note : ""}`);
    });
    divider();
  }

  // ===== Prescriptions =====
  const rxSorted = [...prescriptions].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  if (rxSorted.length) {
    heading("Receitas emitidas", PINK);
    rxSorted.forEach((rx, i) => {
      ensure(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...NAVY);
      doc.text(`Receita ${i + 1} — ${fmtDate(rx.date || rx.created_date)}`, margin, y);
      y += 14;
      kv("Paciente", rx.patient_name || patient?.name);
      if (rx.patient_age) kv("Idade", rx.patient_age);
      if (rx.patient_weight) kv("Peso", rx.patient_weight);
      if (rx.items?.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...MUTED);
        ensure(13);
        doc.text("Medicamentos:", margin, y);
        y += 13;
        rx.items.forEach((it, j) => {
          paragraph(`${j + 1}. ${it.medication || "—"}${it.posology ? " — " + it.posology : ""}${it.quantity ? " · " + it.quantity : ""}${it.duration ? " · " + it.duration : ""}`, { size: 10, color: NAVY, gap: 2 });
        });
      }
      if (rx.orientations) paragraph("Orientações: " + rx.orientations, { size: 10, color: NAVY, gap: 2 });
      if (rx.notes) paragraph("Observações: " + rx.notes, { size: 10, color: MUTED, gap: 2 });
      if (rx.prescriber_name) kv("Profissional", `${rx.prescriber_name}${rx.prescriber_cro ? " · CRO " + rx.prescriber_cro : ""}`);
      y += 4;
      divider();
    });
  }

  // ===== Clinical history timeline =====
  const history = [
    ...entries.map((e) => ({
      date: e.date || e.created_date,
      sort: e.date ? new Date(e.date + "T00:00:00") : new Date(e.created_date),
      type: "entry",
      ref: e,
    })),
    ...cases.map((c) => ({ date: c.created_date, sort: new Date(c.created_date), type: "calc", ref: c })),
  ].sort((a, b) => b.sort - a.sort);

  if (history.length) {
    heading("Histórico clínico (linha do tempo)", AMBER);
    history.forEach((h) => {
      if (h.type === "entry") {
        const e = h.ref;
        const catLabel = e.category === "procedimento" ? "Procedimento" : e.category === "evolucao" ? "Evolução" : "Anotação";
        const catColor = e.category === "procedimento" ? EMERALD : e.category === "evolucao" ? AMBER : BLUE;
        ensure(16);
        doc.setFillColor(...catColor);
        doc.roundedRect(margin, y - 10, 5, 12, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...NAVY);
        doc.text(`${catLabel} · ${fmtDate(e.date)}`, margin + 12, y);
        y += 14;
        if (e.notes) paragraph(e.notes, { size: 10, gap: 2 });
        if (e.category === "procedimento") {
          if (e.procedure_name) kv("Procedimento", e.procedure_name);
          if (e.tooth_region) kv("Dente/região", e.tooth_region);
          if (e.materials) kv("Materiais", e.materials);
          if (e.procedure_notes) paragraph("Obs.: " + e.procedure_notes, { size: 9, color: MUTED, gap: 2 });
        }
        if (e.evolution) paragraph("Evolução: " + e.evolution, { size: 10, color: EMERALD, gap: 2 });
        y += 4;
        divider();
      } else {
        const c = h.ref;
        ensure(16);
        doc.setFillColor(...BLUE);
        doc.roundedRect(margin, y - 10, 5, 12, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...NAVY);
        doc.text(`Cálculo · ${fmtDate(c.created_date)}`, margin + 12, y);
        y += 14;
        kv("Medicamento", c.medication_name || "—");
        kv("População", c.population === "pediatric" ? "Criança/adolescente" : "Adulto");
        if (c.patient_weight_kg) kv("Peso na ocasião", c.patient_weight_kg + " kg");
        if (c.calculation_result) {
          const r = c.calculation_result;
          if (r.dose_per_dose_mg) kv("Dose/tomada", r.dose_per_dose_mg + " mg");
          if (r.doses_per_day) kv("Frequência", r.doses_per_day + "x ao dia");
          if (r.duration_days) kv("Duração", r.duration_days + " dias");
        }
        kv("Situação", c.status === "confirmed" ? "Confirmado" : "Rascunho");
        y += 4;
        divider();
      }
    });
  }

  if (history.length === 0 && rxSorted.length === 0 && odoSorted.length === 0) {
    paragraph("Sem registros clínicos ou receitas vinculados a este paciente.", { size: 11, color: MUTED });
  }

  addFooter();

  const safeName = (patient?.name || "paciente").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  doc.save(`prontuario_${safeName}.pdf`);
}