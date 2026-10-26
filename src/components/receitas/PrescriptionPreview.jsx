import React from "react";
import { Printer, ArrowLeft, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_META } from "@/components/receitas/TemplateCard";

export function PrescriptionPreview({ template, onBack, onEdit, onDelete, onUse }) {
  const meta = CATEGORY_META[template.category] || CATEGORY_META.outro;

  function handlePrint() {
    const node = document.getElementById("receita-print");
    if (!node) return;
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receituário — ${template.name}</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;color:#171717;padding:40px;max-width:680px;margin:0 auto;line-height:1.5}
        .brand{font-weight:bold;font-size:18px} .sub{color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
        .section{margin-top:18px;border-top:1px solid #e5e7eb;padding-top:10px}
        .label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#737373;font-weight:bold}
        .value{font-size:15px;margin-top:3px;white-space:pre-wrap}
        .warn{margin-top:24px;font-size:10px;color:#737373;border:1px solid #e5e7eb;padding:12px;border-radius:8px;background:#fafafa}
        h1{font-size:16px;margin:0}
      </style></head><body>${node.innerHTML}</body></html>`
    );
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 300);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 print:hidden">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-neutral-600">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar à lista
        </Button>
        <div className="flex gap-2">
          {onUse && (
            <Button size="sm" onClick={onUse} className="bg-neutral-900 text-white hover:bg-neutral-800">
              <FileText className="w-4 h-4 mr-1" />
              Usar no gerador
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </div>
      </div>

      <div id="receita-print" className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <div className="brand text-neutral-900">DoseCerta</div>
            <div className="sub">Receituário — Prévia</div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>

        <div className="mt-4">
          <h1 className="text-lg font-bold text-neutral-900">{template.name}</h1>
          {template.situation && (
            <p className="text-sm text-neutral-500 mt-0.5">{template.situation}</p>
          )}
        </div>

        <div className="section">
          <div className="label">Medicamento</div>
          <div className="value font-semibold text-neutral-900">{template.medication_name}</div>
        </div>

        <div className="section">
          <div className="label">Posologia</div>
          <div className="value text-neutral-900">{template.posology}</div>
          {template.duration_days ? (
            <div className="text-xs text-neutral-500 mt-1">Duração: {template.duration_days} dias</div>
          ) : null}
        </div>

        {template.orientations && (
          <div className="section">
            <div className="label">Orientações ao paciente</div>
            <div className="value text-neutral-800">{template.orientations}</div>
          </div>
        )}

        {template.notes && (
          <div className="section">
            <div className="label">Observações do profissional</div>
            <div className="value text-neutral-700">{template.notes}</div>
          </div>
        )}

        <div className="warn">
          Prévia gerada a partir de modelo salvo. Não possui validade jurídica, clínica ou prescritiva.
          Confirme a bula vigente e os requisitos legais antes de qualquer uso real.
        </div>
      </div>

      <div className="print:hidden">
        <Button onClick={handlePrint} className="bg-neutral-900 text-white hover:bg-neutral-800">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir / PDF
        </Button>
      </div>
    </div>
  );
}