import { Pill, Search, AlertTriangle, Zap, FileText, GitCompare, LayoutDashboard, Users, ScanLine, GraduationCap, Calculator } from "lucide-react";

export const modules = [
  { id: "painel", label: "Painel clínico", path: "/painel", icon: LayoutDashboard, status: "active" },
  { id: "raiox", label: "Raio-X", path: "/raio-x", icon: ScanLine, status: "active" },
  { id: "pacientes", label: "Pacientes", path: "/pacientes", icon: Users, status: "active" },
  { id: "calc", label: "Calculadora", path: "/calculadora", icon: Pill, status: "active" },
  { id: "codes", label: "CIAP / CID / SIGTAP", path: "/modulos/codigos", icon: Search, status: "active" },
  { id: "emergency", label: "Urgências", path: "/modulos/urgencias", icon: AlertTriangle, status: "active" },
  { id: "laser", label: "Laserterapia", path: "/modulos/laser", icon: Zap, status: "active" },
  { id: "prescription", label: "Receituários", path: "/modulos/receituarios", icon: FileText, status: "active" },
  { id: "interactions", label: "Interações", path: "/modulos/interacoes", icon: GitCompare, status: "active" },
  { id: "apostilas", label: "Apostilas", path: "/apostilas", icon: GraduationCap, status: "active" },
  { id: "calc2", label: "Calculadora Odonto", path: "/calculadora2", icon: Calculator, status: "active" },
];