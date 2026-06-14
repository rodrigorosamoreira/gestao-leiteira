/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  Database,
  Users,
  Compass,
  PieChart,
  Warehouse,
  Leaf,
  Plus,
  Compass as PastureIcon,
  HelpCircle,
  FileText,
  Workflow,
  Download,
  Activity,
  Heart,
  Droplet,
  Settings,
  Bot
} from "lucide-react";

import { FarmProvider } from "./context/FarmContext";

// Import modules
import DashboardView from "./components/DashboardView";
import RebanhoView from "./components/RebanhoView";
import ReproducaoView from "./components/ReproducaoView";
import LeiteView from "./components/LeiteView";
import NutricaoView from "./components/NutricaoView";
import EstoqueView from "./components/EstoqueView";
import SanidadeView from "./components/SanidadeView";
import FinanceiroView from "./components/FinanceiroView";
import PastagensView from "./components/PastagensView";
import FuncionariosView from "./components/FuncionariosView";
import RelatoriosView from "./components/RelatoriosView";
import IAssistantView from "./components/IAssistantView";
import ModelagemView from "./components/ModelagemView";

type Tab =
  | "painel"
  | "rebanho"
  | "reproducao"
  | "leite"
  | "nutricao"
  | "estoque"
  | "sanidade"
  | "financeiro"
  | "pastagens"
  | "funcionarios"
  | "relatorios"
  | "assistente"
  | "documentacao";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("painel");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "painel", label: "Painel Principal", icon: LayoutDashboard },
    { id: "rebanho", label: "Controle de Rebanho", icon: Database },
    { id: "reproducao", label: "Reprodução & Partos", icon: Heart },
    { id: "leite", label: "Ordenhas & CBT/CCS", icon: Droplet },
    { id: "nutricao", label: "Dietas & Ração", icon: Leaf },
    { id: "estoque", label: "Almoxarifado & Insumos", icon: Warehouse },
    { id: "sanidade", label: "Vacinas & Carências", icon: Activity },
    { id: "financeiro", label: "Fluxo de Caixa", icon: PieChart },
    { id: "pastagens", label: "Pastejo Rotacionado", icon: Compass },
    { id: "funcionarios", label: "Equipe de Campo", icon: Users },
    { id: "relatorios", label: "Fichas & Planilhas", icon: Download },
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as Tab);
    setIsMobileMenuOpen(false);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "painel":
        return <DashboardView onNavigate={(tab) => handleNavigate(tab)} />;
      case "rebanho":
        return <RebanhoView />;
      case "reproducao":
        return <ReproducaoView />;
      case "leite":
        return <LeiteView />;
      case "nutricao":
        return <NutricaoView />;
      case "estoque":
        return <EstoqueView />;
      case "sanidade":
        return <SanidadeView />;
      case "financeiro":
        return <FinanceiroView />;
      case "pastagens":
        return <PastagensView />;
      case "funcionarios":
        return <FuncionariosView />;
      case "relatorios":
        return <RelatoriosView />;
      case "assistente":
        return <IAssistantView />;
      case "documentacao":
        return <ModelagemView />;
      default:
        return <DashboardView onNavigate={(tab) => handleNavigate(tab)} />;
    }
  };

  return (
    <FarmProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
        
        {/* Left Side Navigation (Desktop Sidebar Panels) */}
        <aside className="hidden lg:flex flex-col w-[260px] bg-slate-900 text-slate-300 border-r border-slate-950 shrink-0 select-none">
          {/* Logo brand */}
          <div className="h-16 flex items-center px-6 border-b border-slate-950/60 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-550 flex items-center justify-center font-bold text-slate-900 bg-sky-400">
                🐄
              </div>
              <div>
                <span className="font-extrabold text-sm block tracking-tight text-white leading-tight">Agrocolina</span>
                <span className="text-[10px] text-sky-455 font-semibold text-sky-400 uppercase leading-[8px]">Gestão Leiteira</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-grow py-4 px-3 space-y-0.5 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-slate-805 text-white bg-slate-800"
                      : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="border-t border-slate-800/80 my-4 pt-4">
              <button
                onClick={() => handleNavigate("assistente")}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-black transition-all ${
                  activeTab === "assistente"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                <Bot className="w-4 h-4 shrink-0" />
                <span>Conversar com IA</span>
              </button>
            </div>
          </nav>

          {/* Footer controls & technical specification specs */}
          <div className="p-3 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => handleNavigate("documentacao")}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10.5px] font-bold ${
                activeTab === "documentacao" ? "bg-slate-800 text-white" : "text-slate-450 hover:text-slate-300 hover:bg-slate-800/30"
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-indigo-400" />
              <span>Especificação Técnica</span>
            </button>
            
            <div className="bg-slate-950/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-800/55">
              <span className="text-[10px] font-mono text-slate-500">OPERAÇÃO LOCAL</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-550 bg-emerald-500"></span>
            </div>
          </div>
        </aside>

        {/* Right Display Layout Panel (Adapts for Mobile / Desktop) */}
        <div className="flex-grow flex flex-col min-w-0">
          
          {/* Header Bar */}
          <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sticky top-0 z-40 select-none">
            
            <div className="flex items-center gap-3">
              {/* Mobile Menu Icon */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="lg:hidden flex items-center gap-2">
                <span className="text-xl">🐄</span>
                <span className="font-extrabold text-sm text-slate-800">Agrocolina</span>
              </div>

              <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-xs">
                <span>Fazenda de Clã</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="capitalize font-black text-slate-700">
                  {activeTab === "painel" ? "Painel Geral" : activeTab === "documentacao" ? "Processo e Banco SQL" : activeTab}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              
              {/* Specialized AI Assist launcher shortcut inside the Header */}
              {activeTab !== "assistente" && (
                <button
                  onClick={() => handleNavigate("assistente")}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-250/50 hover:bg-emerald-100/50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 animate-pulse" />
                  <span className="font-sans">Consultório Veterinário IA</span>
                </button>
              )}

              <div className="bg-sky-50 text-sky-850 px-2.5 py-1.5 rounded-lg text-[10.5px] font-black tracking-wide uppercase border border-sky-100 font-mono">
                Sincronia Offline Ativa
              </div>
            </div>
          </header>

          {/* Mobile Drawer Slide-out Nav */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden flex">
              <div className="bg-slate-900 w-[240px] h-full p-4 flex flex-col space-y-4 shadow-xl">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐄</span>
                    <span className="font-extrabold text-sm text-white">Agrocolina</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="flex-grow space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          isActive
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  <div className="border-t border-slate-800/80 my-3 pt-3">
                    <button
                      onClick={() => handleNavigate("assistente")}
                      className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "assistente" ? "bg-emerald-600 text-white" : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      <Bot className="w-4 h-4" />
                      <span>Conversar com IA</span>
                    </button>
                    <button
                      onClick={() => handleNavigate("documentacao")}
                      className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-bold transition-all mt-1 ${
                        activeTab === "documentacao" ? "bg-slate-800 text-white" : "text-slate-400"
                      }`}
                    >
                      <Workflow className="w-4 h-4 text-indigo-400" />
                      <span>Fichas Técnicas SQL</span>
                    </button>
                  </div>
                </nav>
              </div>
              <div className="flex-grow" onClick={() => setIsMobileMenuOpen(false)}></div>
            </div>
          )}

          {/* Active rendering view area */}
          <main className="flex-grow overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>

      </div>
    </FarmProvider>
  );
}
