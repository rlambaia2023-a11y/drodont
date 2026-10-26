import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarDays, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { base44 } from "@/api/base44Client";

const TYPE_LABEL = {
  retorno: "Retorno",
  consulta_acompanhamento: "Acompanhamento",
  outros: "Acompanhamento"
};

export function FollowUpsWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await base44.entities.FollowUp.filter({ status: "agendado" }, "scheduled_date", 50);
        const today = new Date().toISOString().slice(0, 10);
        const upcoming = (all || [])
          .filter((f) => f.scheduled_date && f.scheduled_date >= shiftDays(today, -14))
          .sort((a, b) => (a.scheduled_date || "").localeCompare(b.scheduled_date || ""));
        setItems(upcoming);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const overdue = items.filter((f) => f.scheduled_date < today);
  const soon = items.filter((f) => f.scheduled_date >= today);

  return (
    <section className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </span>
          Próximos retornos e acompanhamentos
        </h2>
        {overdue.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> {overdue.length} em atraso
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando retornos...</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-violet-200 bg-white/60 p-6 text-center">
          <p className="text-sm text-muted-foreground">Nenhum retorno agendado no momento.</p>
          <p className="text-xs text-muted-foreground mt-1">Agende retornos na página do paciente para receber lembretes automáticos.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 6).map((f) => {
            const isOverdue = f.scheduled_date < today;
            return (
              <li key={f.id}>
                <Link
                  to={`/pacientes/${f.patient_id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 hover:border-violet-300 hover:shadow-soft transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? "bg-rose-100" : "bg-accentBlue"}`}>
                    <CalendarDays className={`w-4 h-4 ${isOverdue ? "text-rose-600" : "text-blue-700"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground text-sm truncate">{f.patient_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {TYPE_LABEL[f.type] || "Retorno"}{f.reason ? ` · ${f.reason}` : ""}
                    </div>
                  </div>
                  <div className={`text-[11px] font-semibold shrink-0 ${isOverdue ? "text-rose-600" : "text-foreground"}`}>
                    {format(parseISO(f.scheduled_date + "T00:00:00"), "dd/MM")}
                    {isOverdue && <div className="text-[9px] text-rose-500 uppercase">atraso</div>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function shiftDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}