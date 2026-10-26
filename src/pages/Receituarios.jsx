import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Stethoscope, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TemplateCard, CATEGORY_META } from "@/components/receitas/TemplateCard";
import { TemplateForm } from "@/components/receitas/TemplateForm";
import { PrescriptionPreview } from "@/components/receitas/PrescriptionPreview";

export default function Receituarios() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | form | preview
  const [editing, setEditing] = useState(null); // template or null (new)
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await base44.entities.PrescriptionTemplate.list("-updated_date", 100);
      setTemplates(data);
    } catch (e) {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleNew() {
    setEditing(null);
    setView("form");
  }

  function handleEdit(tpl) {
    setEditing(tpl);
    setView("form");
  }

  async function handleSubmit(value) {
    if (editing?.id) {
      await base44.entities.PrescriptionTemplate.update(editing.id, value);
    } else {
      await base44.entities.PrescriptionTemplate.create(value);
    }
    await load();
    setView("list");
    setEditing(null);
  }

  async function handleDelete(tpl) {
    if (!window.confirm(`Excluir o modelo "${tpl.name}"?`)) return;
    await base44.entities.PrescriptionTemplate.delete(tpl.id);
    await load();
    setView("list");
    setSelected(null);
  }

  function openPreview(tpl) {
    setSelected(tpl);
    setView("preview");
  }

  const filtered = templates.filter((t) => {
    const matchCat = filter === "all" || t.category === filter;
    const q = query.toLowerCase().trim();
    const matchQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.medication_name || "").toLowerCase().includes(q) ||
      (t.situation || "").toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <DemoBadge />
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Modelos de receituário
          </span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Modelos de receituário
        </h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          Salve prescrições usadas frequentemente e preencha automaticamente a
          posologia e orientações padrão para diferentes situações clínicas.
        </p>
      </div>

      {view === "list" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, medicamento ou situação..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => navigate("/modulos/receita")}>
              <FileText className="w-4 h-4 mr-1" />
              Gerar receita formal
            </Button>
            <Button onClick={handleNew} className="bg-neutral-900 text-white hover:bg-neutral-800">
              <Plus className="w-4 h-4 mr-1" />
              Novo modelo
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip label="Todos" value="all" filter={filter} onClick={setFilter} />
            {Object.entries(CATEGORY_META).map(([k, m]) => (
              <FilterChip key={k} label={m.label} value={k} filter={filter} onClick={setFilter} />
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 rounded-xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500 mb-4">
                {templates.length === 0
                  ? "Nenhum modelo salvo ainda. Crie seu primeiro modelo de receituário."
                  : "Nenhum modelo encontrado para os filtros atuais."}
              </p>
              {templates.length === 0 && (
                <Button onClick={handleNew} className="bg-neutral-900 text-white hover:bg-neutral-800">
                  <Plus className="w-4 h-4 mr-1" />
                  Criar modelo
                </Button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((t) => (
                <TemplateCard key={t.id} template={t} onClick={() => openPreview(t)} />
              ))}
            </div>
          )}
        </>
      )}

      {view === "form" && (
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              {editing ? "Editar modelo" : "Novo modelo de receituário"}
            </h2>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <TemplateForm
              initialValue={editing || null}
              onSubmit={handleSubmit}
              onCancel={() => {
                setView("list");
                setEditing(null);
              }}
              submitLabel={editing ? "Salvar alterações" : "Salvar modelo"}
            />
          </div>
        </div>
      )}

      {view === "preview" && selected && (
        <div className="max-w-2xl">
          <PrescriptionPreview
            template={selected}
            onBack={() => setView("list")}
            onEdit={() => handleEdit(selected)}
            onDelete={() => handleDelete(selected)}
            onUse={() => navigate("/modulos/receita", { state: { template: selected } })}
          />
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, value, filter, onClick }) {
  const active = filter === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}