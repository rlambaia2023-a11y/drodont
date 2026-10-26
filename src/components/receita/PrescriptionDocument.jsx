import React from "react";

export function PrescriptionDocument({ prescriber, prescription, calcMeta, innerRef }) {
  const items = prescription.items || [];
  const fmtDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div ref={innerRef} id="receita-doc" className="doc rounded-xl border border-neutral-300 bg-white p-6 sm:p-10 text-neutral-900">
      {/* Header */}
      <div className="hdr flex items-start justify-between gap-4 pb-4 border-b border-neutral-300">
        <div>
          <div className="pname font-bold text-lg leading-tight text-neutral-900">
            {prescriber.name || "Nome do profissional"}
          </div>
          <div className="cro text-sm text-neutral-700">
            {prescriber.cro ? `CRO: ${prescriber.cro}` : "CRO:"}
          </div>
          {prescriber.specialty && (
            <div className="pspec text-xs text-neutral-500">{prescriber.specialty}</div>
          )}
          {prescriber.contact && (
            <div className="pcontact text-xs text-neutral-500 mt-0.5">{prescriber.contact}</div>
          )}
        </div>
        <div className="text-right">
          <div className="lbl text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Receituário
          </div>
          <div className="title text-base font-bold text-neutral-900">Odontológico</div>
        </div>
      </div>

      {/* Patient + date */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-sm border-b border-neutral-200">
        <DocField label="Paciente" value={prescription.patient_name || ""} />
        <DocField label="Idade" value={prescription.patient_age || ""} />
        <DocField
          label="Peso"
          value={prescription.patient_weight ? `${prescription.patient_weight} kg` : ""}
        />
        <DocField label="Data" value={fmtDate(prescription.date)} />
      </div>

      {/* Items */}
      <div className="sec py-4">
        <div className="sec-lbl text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
          USAR / TOMAR
        </div>
        {items.length === 0 ? (
          <div className="empty text-sm text-neutral-400 italic">
            Nenhum medicamento adicionado.
          </div>
        ) : (
          <ol className="items space-y-3">
            {items.map((it, i) => (
              <li key={i} className="item text-sm">
                <div className="med font-semibold text-neutral-900">
                  {i + 1}. {it.medication || "—"}
                </div>
                {it.posology && (
                  <div className="pos text-neutral-800 whitespace-pre-wrap pl-5">
                    {it.posology}
                  </div>
                )}
                <div className="meta pl-5 text-neutral-600 text-xs flex flex-wrap gap-x-4">
                  {it.quantity && <span>Quantidade: {it.quantity}</span>}
                  {it.duration && <span>Duração: {it.duration}</span>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Orientations */}
      {prescription.orientations && (
        <div className="sec py-3 border-t border-neutral-200">
          <div className="sec-lbl text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Orientações ao paciente
          </div>
          <div className="ori text-sm text-neutral-800 whitespace-pre-wrap">
            {prescription.orientations}
          </div>
        </div>
      )}

      {prescription.notes && (
        <div className="sec py-3 border-t border-neutral-200">
          <div className="sec-lbl text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Observações
          </div>
          <div className="notes text-xs text-neutral-600 whitespace-pre-wrap">
            {prescription.notes}
          </div>
        </div>
      )}

      {/* Signature */}
      <div className="sig mt-10 pt-4">
        <div className="loc text-sm text-neutral-700">
          {[prescriber.city, fmtDate(prescription.date)].filter(Boolean).join(", ")}
        </div>
        <div className="sigline mt-8 border-t border-neutral-700 w-64" />
        <div className="signame text-sm font-semibold mt-1">{prescriber.name || ""}</div>
        <div className="sigcro text-xs text-neutral-600">
          {prescriber.cro ? `CRO ${prescriber.cro}` : ""}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="warn mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-400 leading-relaxed">
        Prévia de receituário odontológico gerada com valores de referência de fontes padrão.
        Não possui validade jurídica, clínica ou prescritiva. Confirme a bula vigente e os
        requisitos legais antes de qualquer uso real.
        {calcMeta && ` Base de referência v${calcMeta}.`}
      </div>
    </div>
  );
}

function DocField({ label, value }) {
  return (
    <div className="field">
      <div className="lbl text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </div>
      <div className="val font-medium text-neutral-900">{value || "—"}</div>
    </div>
  );
}