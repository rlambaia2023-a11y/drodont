import React, { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Plus, TrendingUp, Scale } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToothMascot } from "@/components/ToothMascot";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-2xl border-2 border-sky-200 bg-white px-3 py-2 shadow-soft text-xs">
      <div className="font-heading font-bold text-foreground">{p.weight_kg} kg</div>
      <div className="text-muted-foreground">{format(new Date(p.date + "T00:00:00"), "dd/MM/yyyy")}</div>
    </div>
  );
}

export function WeightChart({ entries, onAdd }) {
  const today = new Date().toISOString().slice(0, 10);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const data = useMemo(
    () =>
      [...entries]
        .filter((e) => e.date && e.weight_kg != null)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((e) => ({
          date: e.date,
          weight_kg: e.weight_kg,
          label: format(new Date(e.date + "T00:00:00"), "dd/MM"),
          full: format(new Date(e.date + "T00:00:00"), "dd/MM/yyyy"),
        })),
    [entries]
  );

  const stats = useMemo(() => {
    if (!data.length) return null;
    const first = data[0].weight_kg;
    const last = data[data.length - 1].weight_kg;
    const diff = last - first;
    return { first, last, diff };
  }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date || weight === "") return;
    try {
      setSaving(true);
      await onAdd({ date, weight_kg: Number(weight), note: note || null });
      setWeight("");
      setNote("");
      setShow(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-soft">
            <Scale className="w-4 h-4 text-white" />
          </div>
          Acompanhamento de peso
        </h2>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-soft hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> {show ? "Fechar" : "Nova aferição"}
        </button>
      </div>

      {show && (
        <form onSubmit={handleSubmit} className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-3 mb-4 flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Data</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Peso (kg)</label>
            <Input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Ex.: 70" className="w-32" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Observação</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcional" />
          </div>
          <Button type="submit" disabled={saving || !date || weight === ""} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90">
            {saving ? "Salvando..." : "Registrar"}
          </Button>
        </form>
      )}

      {data.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-8 text-center">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-soft">
            <ToothMascot className="w-9 h-9" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Sem aferições de peso registradas.</p>
          <p className="text-xs text-muted-foreground">Adicione a primeira medição para acompanhar a evolução do tratamento ao longo do tempo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stats && (
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="text-emerald-700 font-semibold">Primeira:</span> <span className="font-bold text-foreground">{stats.first} kg</span>
              </div>
              <div className="px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
                <span className="text-sky-700 font-semibold">Atual:</span> <span className="font-bold text-foreground">{stats.last} kg</span>
              </div>
              <div className={`px-3 py-1.5 rounded-2xl border text-xs flex items-center gap-1 ${stats.diff > 0 ? "bg-amber-50 border-amber-200 text-amber-700" : stats.diff < 0 ? "bg-pink-50 border-pink-200 text-pink-700" : "bg-neutral-50 border-neutral-200 text-muted-foreground"}`}>
                <TrendingUp className={`w-3.5 h-3.5 ${stats.diff < 0 ? "rotate-180" : ""}`} />
                {stats.diff > 0 ? `+${stats.diff.toFixed(1)} kg` : `${stats.diff.toFixed(1)} kg`}
              </div>
            </div>
          )}

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="#e0eefb" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#dbeafe" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} unit=" kg" width={48} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="weight_kg" stroke="#2563eb" strokeWidth={3} fill="url(#weightFill)" dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}