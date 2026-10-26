import React, { useState, useRef } from "react";
import { ImagePlus, ScanLine, Loader2, AlertTriangle, FileImage, Stethoscope, Activity, ShieldCheck, RotateCcw, ChevronRight, Save, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { ToothMascot } from "@/components/ToothMascot";

const SEVERITY_STYLES = {
  leve: "bg-emerald-100 text-emerald-700 border-emerald-200",
  moderada: "bg-amber-100 text-amber-700 border-amber-200",
  severa: "bg-rose-100 text-rose-700 border-rose-200",
  "não aplicável": "bg-sky-100 text-sky-700 border-sky-200"
};

const URGENCY_STYLES = {
  rotina: "bg-emerald-100 text-emerald-700 border-emerald-200",
  preferencial: "bg-amber-100 text-amber-700 border-amber-200",
  urgente: "bg-rose-100 text-rose-700 border-rose-200"
};

export default function RaioX() {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientContext, setPatientContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(selected) {
    if (!selected) return;
    setError(null);
    setAnalysis(null);
    setSignedUrl(null);
    setSavedId(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file: selected });
      setImageUri(file_uri);
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 3600 });
      setSignedUrl(signed_url);
    } catch (e) {
      setError("Falha ao carregar a imagem. Tente novamente.");
      setFile(null);
      setPreviewUrl(null);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function analyze() {
    if (!signedUrl) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await base44.functions.invoke("analyzeXray", {
        image_url: signedUrl,
        patient_context: patientContext
      });
      const data = res?.data || res;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data.analysis || data);
    } catch (e) {
      setError(e?.message || "Erro na análise. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setSignedUrl(null);
    setAnalysis(null);
    setError(null);
    setPatientContext("");
    setPatientName("");
    setImageUri(null);
    setSavedId(null);
  }

  async function saveAnalysis() {
    if (!analysis || !patientName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const rec = await base44.entities.XrayAnalysis.create({
        patient_name: patientName.trim(),
        image_uri: imageUri || null,
        context: patientContext || null,
        analysis,
        exam_date: new Date().toISOString().slice(0, 10),
      });
      setSavedId(rec.id);
    } catch (e) {
      setError(e?.message || "Não foi possível salvar a análise.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {!isAuthenticated && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          Para ver e cadastrar seus pacientes, <Link to="/login" className="font-bold underline">entre com sua conta</Link> (ou <Link to="/register" className="font-bold underline">crie uma</Link>). Sem login, esta página fica vazia e o salvamento não funciona.
        </div>
      )}
      
      {/* Header */}
      <div className="glass rounded-3xl border border-border p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-soft shrink-0">
            <ScanLine className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
              Análise de Raio-X Odontológico
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Envie uma radiografia para receber uma avaliação técnica estruturada com achados, diagnóstico diferencial e conduta sugerida.
            </p>
          </div>
          <ToothMascot className="w-12 h-12 hidden sm:block animate-float" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload + preview */}
        <div className="glass rounded-3xl border border-border p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5 text-violet-600" />
            <h2 className="font-heading font-semibold text-lg text-foreground">Imagem do exame</h2>
          </div>

          {!previewUrl ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
                dragOver ? "border-violet-500 bg-violet-50" : "border-border bg-white/60 hover:bg-white"
              }`}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mb-4">
                <ImagePlus className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Arraste a radiografia ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou WEBP · armazenamento privado</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-border bg-black/5">
                <img src={previewUrl} alt="Pré-visualização do raio-x" className="w-full max-h-80 object-contain bg-black/5" />
              </div>
              <p className="text-xs text-muted-foreground truncate">{file?.name}</p>
              <div className="flex gap-2">
                <button
                  onClick={analyze}
                  disabled={!signedUrl || loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold shadow-soft hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                  {loading ? "Analisando..." : "Analisar raio-x"}
                </button>
                <button
                  onClick={reset}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border-2 border-border text-sm font-medium text-foreground/70 hover:bg-accent disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" /> Trocar
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nome do paciente *
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ex.: Maria Silva"
              className="mt-1.5 w-full rounded-2xl border border-input bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contexto do paciente (opcional)
            </label>
            <textarea
              value={patientContext}
              onChange={(e) => setPatientContext(e.target.value)}
              placeholder="Ex.: paciente 34 anos, queixa de dor no dente 36, sensibilidade ao frio..."
              rows={3}
              className="mt-1.5 w-full rounded-2xl border border-input bg-white/70 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="glass rounded-3xl border border-border p-6 shadow-soft">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
              <p className="font-semibold text-foreground">Analisando a radiografia...</p>
              <p className="text-sm text-muted-foreground mt-1">Identificando achados e elaborando a conduta.</p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <AnalysisResults analysis={analysis} />
              {savedId ? (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Análise salva no prontuário de <strong>{patientName}</strong>.</span>
                </div>
              ) : (
                <button
                  onClick={saveAnalysis}
                  disabled={saving || !patientName.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-soft hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Salvando..." : "Salvar análise no prontuário"}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accentBlue flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-blue-500" />
              </div>
              <p className="font-semibold text-foreground">A análise aparecerá aqui</p>
              <p className="text-sm text-muted-foreground mt-1">Envie uma imagem e clique em analisar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalysisResults({ analysis }) {
  const a = analysis || {};
  const findings = a.findings || [];
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600" />
        <h2 className="font-heading font-semibold text-lg text-foreground">Resultado da análise</h2>
      </div>

      {/* Exam type + quality */}
      <div className="grid sm:grid-cols-2 gap-3">
        {a.exam_type && (
          <div className="rounded-2xl bg-white/70 border border-border p-3">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tipo de exame</div>
            <div className="text-sm font-semibold text-foreground mt-0.5">{a.exam_type}</div>
          </div>
        )}
        {a.image_quality && (
          <div className="rounded-2xl bg-white/70 border border-border p-3">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Qualidade da imagem</div>
            <div className="text-sm font-semibold mt-0.5 flex items-center gap-1.5">
              <span className={a.image_quality.adequate ? "text-emerald-600" : "text-rose-600"}>
                {a.image_quality.adequate ? "Adequada" : "Inadequada"}
              </span>
            </div>
            {a.image_quality.issues && (
              <p className="text-xs text-muted-foreground mt-1">{a.image_quality.issues}</p>
            )}
          </div>
        )}
      </div>

      {/* Regions */}
      {a.regions_observed?.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Regiões observadas</div>
          <div className="flex flex-wrap gap-1.5">
            {a.regions_observed.map((r, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium border border-sky-200">{r}</span>
            ))}
          </div>
        </div>
      )}

      {/* Findings */}
      {findings.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Achados ({findings.length})</div>
          <div className="space-y-2">
            {findings.map((f, i) => (
              <div key={i} className="rounded-2xl bg-white/70 border border-border p-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="font-semibold text-sm text-foreground">
                    {f.tooth && <span className="text-blue-600 mr-1.5">{f.tooth}</span>}
                    {f.finding}
                  </div>
                  <div className="flex gap-1.5">
                    {f.severity && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${SEVERITY_STYLES[f.severity] || SEVERITY_STYLES["não aplicável"]}`}>
                        {f.severity}
                      </span>
                    )}
                    {f.confidence && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        conf. {f.confidence}
                      </span>
                    )}
                  </div>
                </div>
                {f.description && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Differential */}
      {a.differential?.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Diagnóstico diferencial</div>
          <ul className="space-y-1">
            {a.differential.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <ChevronRight className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Solution */}
      {a.solution && (
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-5 h-5 text-violet-600" />
            <h3 className="font-heading font-semibold text-foreground">Conduta sugerida</h3>
            {a.solution.urgency && (
              <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${URGENCY_STYLES[a.solution.urgency] || URGENCY_STYLES.rotina}`}>
                {a.solution.urgency}
              </span>
            )}
          </div>
          {a.solution.approach && <p className="text-sm text-foreground leading-relaxed">{a.solution.approach}</p>}
          {a.solution.steps?.length > 0 && (
            <ol className="mt-2.5 space-y-1.5">
              {a.solution.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Recommendations */}
      {a.recommendations?.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Recomendações</div>
          <ul className="space-y-1">
            {a.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      {a.disclaimer && (
        <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{a.disclaimer}</span>
        </div>
      )}
    </div>
  );
}