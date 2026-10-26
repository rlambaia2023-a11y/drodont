import React from "react";
import { Check } from "lucide-react";

const steps = [
  { id: 0, label: "Indicação" },
  { id: 1, label: "Paciente" },
  { id: 2, label: "Segurança" },
  { id: 3, label: "Resultado" },
  { id: 4, label: "Receituário" },
];

export function StepIndicator({ current, onStepClick, maxReached }) {
  return (
    <ol
      className="flex items-center w-full overflow-x-auto no-scrollbar gap-1"
      aria-label="Etapas do cálculo"
    >
      {steps.map((s, i) => {
        const isCurrent = i === current;
        const isDone = i < current;
        const isReachable = i <= maxReached;
        return (
          <li key={s.id} className="flex items-center shrink-0">
            <button
              type="button"
              disabled={!isReachable}
              onClick={() => isReachable && onStepClick(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCurrent
                  ? "bg-neutral-900 text-white"
                  : isDone
                  ? "text-neutral-700 hover:bg-neutral-100"
                  : isReachable
                  ? "text-neutral-500 hover:bg-neutral-100"
                  : "text-neutral-300 cursor-not-allowed"
              }`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                  isCurrent
                    ? "bg-white text-neutral-900"
                    : isDone
                    ? "bg-emerald-500 text-white"
                    : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={`w-4 sm:w-6 h-px mx-0.5 ${isDone ? "bg-emerald-400" : "bg-neutral-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}