import React from "react";
import { CheckCircle2, Ban, Eye } from "lucide-react";

function Param({ label, value }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </div>
      <div className="text-sm font-semibold text-neutral-900 mt-0.5">{value || "—"}</div>
    </div>
  );
}

export function LaserDetail({ protocol }) {
  const p = protocol.parameters || {};
  return (
    <div className="space-y-5">
      {/* Parameters */}
      <div>
        <h3 className="font-bold text-neutral-900 text-sm mb-3">Parâmetros sugeridos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Param label="Comprimento" value={protocol.wavelength_nm} />
          <Param
            label="Tipo"
            value={protocol.laser_type === "red" ? "Vermelho" : "Infravermelho"}
          />
          <Param label="Potência" value={p.power_mw ? `${p.power_mw} mW` : "—"} />
          <Param
            label="Energia/ponto"
            value={p.energy_per_point_j ? `${p.energy_per_point_j} J` : "—"}
          />
          <Param
            label="Tempo/ponto"
            value={p.time_per_point_s ? `${p.time_per_point_s} s` : "—"}
          />
          <Param
            label="Área do feixe"
            value={p.spot_size_mm2 ? `${p.spot_size_mm2} mm²` : "—"}
          />
          <Param label="Pontos" value={p.points} />
          <Param label="Sessões" value={p.sessions} />
          <Param label="Intervalo" value={p.interval_days} />
        </div>
        {p.technique && (
          <p className="text-xs text-neutral-600 mt-2">
            <strong>Técnica:</strong> {p.technique}
          </p>
        )}
      </div>

      {/* Indications */}
      {protocol.indications?.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-emerald-900">Indicações</h3>
          </div>
          <ul className="space-y-1">
            {protocol.indications.map((i, idx) => (
              <li key={idx} className="text-sm text-emerald-800 flex items-start gap-2">
                <span className="text-emerald-400 mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contraindications */}
      {protocol.contraindications?.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ban className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-amber-900">
              Contraindicações / precauções
            </h3>
          </div>
          <ul className="space-y-1">
            {protocol.contraindications.map((c, idx) => (
              <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-400 mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Eye protection */}
      <div className="rounded-lg border border-sky-300 bg-sky-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-sky-600" />
          <h3 className="font-bold text-sm text-sky-900">Proteção ocular</h3>
        </div>
        <p className="text-sm text-sky-800">{protocol.eye_protection}</p>
      </div>

      {/* Notes */}
      {protocol.notes && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h3 className="font-bold text-sm text-neutral-900 mb-1">Observações</h3>
          <p className="text-sm text-neutral-700">{protocol.notes}</p>
        </div>
      )}

      <p className="text-xs text-neutral-400">{protocol.source}</p>
    </div>
  );
}