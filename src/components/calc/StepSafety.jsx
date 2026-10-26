import React from "react";
import { AlertCard, BlockCard } from "@/components/calc/AlertCard";
import { ALERT_LEVELS } from "@/lib/medicationsDatabase";

export function StepSafety({ alerts, blocks }) {
  const blockAlerts = alerts.filter((a) => a.level === ALERT_LEVELS.BLOCK);
  const reviewAlerts = alerts.filter((a) => a.level === ALERT_LEVELS.REVIEW);
  const infoAlerts = alerts.filter((a) => a.level === ALERT_LEVELS.INFO);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4">
        <h3 className="font-semibold text-sm text-neutral-900 mb-1">Conferência de segurança</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Análise de alergias, contraindicações, cautelas, duplicidade terapêutica e interações.
          A gravidade é definida pela monografia revisada — não por correspondência de palavras.
        </p>
      </div>

      {blocks.length === 0 && blockAlerts.length === 0 && alerts.length === 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Nenhum alerta de segurança identificado para o contexto informado.
          Lembre-se: a ausência de alertas não garante segurança absoluta.
        </div>
      )}

      {blocks.map((b, i) => (
        <BlockCard key={`b-${i}`} block={b} />
      ))}
      {blockAlerts.map((a, i) => (
        <AlertCard key={`ba-${i}`} alert={a} />
      ))}
      {reviewAlerts.map((a, i) => (
        <AlertCard key={`ra-${i}`} alert={a} />
      ))}
      {infoAlerts.map((a, i) => (
        <AlertCard key={`ia-${i}`} alert={a} />
      ))}
    </div>
  );
}