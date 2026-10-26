import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Lightbulb } from "lucide-react";
import { DemoBadge } from "@/components/calc/DemoBadge";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ToothMascot } from "@/components/ToothMascot";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { modules } from "@/components/modules";

export default function Layout() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div className="min-h-screen cheerful-bg flex flex-col relative">
      {/* Topbar */}
      <header className="glass border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <MobileNav />
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="ODONTO-FBBR — página inicial">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-soft">
              <ToothMascot className="w-7 h-7" />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-bold text-foreground text-lg tracking-tight">ODONTO-FBBR</div>
              <div className="text-[10px] text-muted-foreground font-medium">
                O Apoio que faltava para Dentistas e Estudantes
              </div>
            </div>
          </Link>
          <div className="flex-1 max-w-xl">
            <GlobalSearch />
          </div>
          <div className="hidden sm:block">
            <DemoBadge />
          </div>
          {isAuthenticated ? (
            <button type="button" onClick={() => logout("/")} className="shrink-0 text-xs font-semibold text-foreground/70 hover:text-foreground" title={user?.email || ""}>
              Sair
            </button>
          ) : (
            <Link to="/login" className="shrink-0 text-xs font-bold text-blue-700 hover:underline">Entrar</Link>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6 relative">
        {/* Sidebar modules */}
        <nav
          aria-label="Módulos do sistema"
          className="hidden lg:flex flex-col gap-1.5 w-60 shrink-0"
        >
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Módulos
          </div>
          {modules.map((m) => {
            const Icon = m.icon;
            const active = location.pathname === m.path;
            return (
              <Link
                key={m.id}
                to={m.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-soft"
                    : "text-foreground/70 hover:bg-white/70 hover:text-accent-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{m.label}</span>
              </Link>
            );
          })}
          <div className="mt-4 mx-1 p-3 rounded-2xl bg-accentYellow border-2 border-amber-200/70 flex gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-snug">
              Ferramenta profissional de suporte à decisão clínica. Apoia o julgamento profissional — não o substitui.
            </p>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}