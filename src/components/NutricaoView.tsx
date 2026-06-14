/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp,
  Plus,
  Scale,
  Activity,
  AlertTriangle,
  Flame,
  Leaf,
  Settings,
  X,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Trash2
} from "lucide-react";
import { useFarm } from "../context/FarmContext";

export default function NutricaoView() {
  const { diets, feedConsumption, addDiet, addFeedConsumption, deleteDiet, deleteFeedConsumption, confirmAction } = useFarm();

  const [isDietOpen, setIsDietOpen] = useState(false);
  const [isConsOpen, setIsConsOpen] = useState(false);

  // New Diet field
  const [dietForm, setDietForm] = useState({
    name: "",
    lotName: "Lote 1 - Alta Produção",
    milho: "5.5",
    soja: "3.2",
    silagem: "32.0",
    mineral: "0.4",
    feno: "0"
  });

  // Consumption Form
  const [consForm, setConsForm] = useState({
    date: new Date().toISOString().split("T")[0],
    lotName: "Lote 1 - Alta Produção",
    silageKG: "",
    grainFeedKG: "",
    concentrateKG: "",
    mineralSaltKG: "",
    cowsCount: "8"
  });

  const handleDietSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const milhoKG = Number(dietForm.milho) || 0;
    const sojaKG = Number(dietForm.soja) || 0;
    const silagemKG = Number(dietForm.silagem) || 0;
    const mineralKG = Number(dietForm.mineral) || 0;
    const fenoKG = Number(dietForm.feno) || 0;

    // Standard linear formulas for tropical dairy composition
    const msCalculated = (milhoKG * 0.87) + (sojaKG * 0.88) + (silagemKG * 0.34) + (mineralKG * 0.98) + (fenoKG * 0.89);
    const pbCalculated = 16.5; // standard target %
    const ndtCalculated = 71.2; // standard NDT %
    const costCalculated = (milhoKG * 1.25) + (sojaKG * 2.10) + (silagemKG * 0.35) + (mineralKG * 4.50) + (fenoKG * 1.10);

    addDiet({
      name: dietForm.name,
      lotName: dietForm.lotName,
      ingredients: [
        { name: "Silagem de Milho", weightKG: silagemKG, dryMatterPct: 34, crudeProteinPct: 7.5, ndtPct: 68, costPerKG: 0.35 },
        { name: "Farelo de Soja 46%", weightKG: sojaKG, dryMatterPct: 88, crudeProteinPct: 46.0, ndtPct: 81, costPerKG: 2.10 },
        { name: "Milho Moído (Fubá)", weightKG: milhoKG, dryMatterPct: 87, crudeProteinPct: 8.5, ndtPct: 83, costPerKG: 1.25 },
        { name: "Núcleo Mineral", weightKG: mineralKG, dryMatterPct: 98, crudeProteinPct: 0.0, ndtPct: 0.0, costPerKG: 4.50 }
      ],
      msKgPrevisto: Number(msCalculated.toFixed(1)),
      pbPctPrevisto: pbCalculated,
      ndtPctPrevisto: ndtCalculated,
      costPerAnimalDay: Number(costCalculated.toFixed(2))
    });

    setIsDietOpen(false);
    setDietForm({
      name: "",
      lotName: "Lote 1 - Alta Produção",
      milho: "5.5",
      soja: "3.2",
      silagem: "32.0",
      mineral: "0.4",
      feno: "0"
    });
  };

  const handleConsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedConsumption({
      date: consForm.date,
      lotName: consForm.lotName,
      silageKG: Number(consForm.silageKG) || 0,
      grainFeedKG: Number(consForm.grainFeedKG) || 0,
      concentrateKG: Number(consForm.concentrateKG) || 0,
      mineralSaltKG: Number(consForm.mineralSaltKG) || 0,
      cowsCount: Number(consForm.cowsCount) || 8
    });

    setIsConsOpen(false);
    setConsForm({
      date: new Date().toISOString().split("T")[0],
      lotName: "Lote 1 - Alta Produção",
      silageKG: "",
      grainFeedKG: "",
      concentrateKG: "",
      mineralSaltKG: "",
      cowsCount: "8"
    });
  };

  // Compile consumption metrics
  const latestCons = feedConsumption[0] || { silageKG: 260, grainFeedKG: 26, concentrateKG: 45, mineralSaltKG: 3.2, cowsCount: 8 };
  const silagePerCow = (latestCons.silageKG / latestCons.cowsCount).toFixed(1);
  const feedPerCow = ((latestCons.grainFeedKG + latestCons.concentrateKG) / latestCons.cowsCount).toFixed(1);

  return (
    <div id="nutricao-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Formulação Nutricional & Cocho</h1>
          <p className="text-xs text-slate-500 font-medium font-sans">Desenho de rações completas (TMR), balanço proteico e diário de consumo volumétrico.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsConsOpen(true)}
            className="border border-slate-300 bg-white hover:bg-slate-150 text-slate-705 rounded-lg px-3 py-2 text-xs font-bold shadow flex items-center gap-1.5 transition"
          >
            <Scale className="w-4 h-4 text-slate-500" /> Lançar Consumo Diário
          </button>
          <button
            onClick={() => setIsDietOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Nova Dieta
          </button>
        </div>
      </div>

      {/* Grid of Key nutritional metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Consumo Médio Volumoso</span>
            <span className="text-xl font-bold text-slate-800">{silagePerCow} kg/animal</span>
            <span className="text-[10px] text-slate-400 block">Silagem de milho fresca no cocho</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Concentrado por Vaca</span>
            <span className="text-xl font-bold text-slate-800">{feedPerCow} kg/animal</span>
            <span className="text-[10px] text-slate-400 block">Rendimento proteico otimizado</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Matéria Seca Total</span>
            <span className="text-xl font-bold text-slate-800">{diets[0]?.msKgPrevisto || "19.8"} kg/MS</span>
            <span className="text-[10px] text-slate-400 block">Meta calculada para Alta Produção</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Energia NDT Líquida</span>
            <span className="text-xl font-bold text-slate-800">{diets[0]?.ndtPctPrevisto || "71"}% NDT</span>
            <span className="text-[10px] text-slate-400 block">Digestibilidade total recomendada</span>
          </div>
        </div>

      </div>

      {/* Main Two Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Formulated diets panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FileSpreadsheet className="w-4 h-4" /> Receitas Dietéticas & Nutrição Cadastrada
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {diets.map((diet) => (
                <div key={diet.id} className="border border-slate-150 rounded-xl p-4 bg-slate-55/40 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{diet.name}</span>
                      <span className="text-[10.5px] text-slate-400 font-medium block">Destinação: {diet.lotName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Custo: R$ {diet.costPerAnimalDay}/dia
                      </span>
                      <button
                        onClick={() => {
                          confirmAction({
                            title: "Excluir Dieta",
                            message: "Deseja realmente excluir esta receita de dieta?",
                            onConfirm: () => {
                              deleteDiet(diet.id);
                            }
                          });
                        }}
                        className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1 transition"
                        title="Excluir Dieta"
                        id={`del-diet-${diet.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                    {diet.ingredients.map((ing, i) => (
                      <div key={i} className="bg-white border border-slate-250/50 rounded-lg p-2 text-center shadow-sm">
                        <span className="font-sans font-bold text-slate-700 block truncate">{ing.name}</span>
                        <span className="text-slate-500 block text-xs mt-0.5">{ing.weightKG} kg</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
                    <div className="text-slate-600">
                      <span>Matéria Seca MS:</span> <span className="font-bold text-slate-800 font-mono">{diet.msKgPrevisto} kg</span>
                    </div>
                    <div className="text-slate-600">
                      <span>Proteína Bruta PB:</span> <span className="font-bold text-slate-800 font-mono">{diet.pbPctPrevisto}%</span>
                    </div>
                    <div className="text-slate-600 text-right">
                      <span>Balanço NDT:</span> <span className="font-bold text-slate-00 font-mono">{diet.ndtPctPrevisto}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Consumption logs list */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Diário de Cocho recente
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {feedConsumption.slice(0, 5).map((fc) => (
              <div key={fc.id} className="border border-slate-150 rounded-lg p-3 bg-slate-50/60 text-xs text-slate-700 space-y-1.5">
                <div className="flex justify-between items-center border-b border-slate-150 pb-1 font-bold text-slate-800">
                  <span>Data: {fc.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-650 text-[10.5px]">{fc.lotName}</span>
                    <button
                      onClick={() => {
                        confirmAction({
                          title: "Excluir Diário de Cocho",
                          message: "Deseja realmente excluir este lançamento de cocho?",
                          onConfirm: () => {
                            deleteFeedConsumption(fc.id);
                          }
                        });
                      }}
                      className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1 transition"
                      title="Excluir Lançamento"
                      id={`del-feed-${fc.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10.5px] leading-relaxed text-slate-500">
                  <span>🌾 Ração: {fc.grainFeedKG} kg</span>
                  <span>🌽 Silagem: {fc.silageKG} kg</span>
                  <span>🧪 Concentr: {fc.concentrateKG} kg</span>
                  <span>🧂 Sal Min: {fc.mineralSaltKG} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Cadastrar Nova Dieta Modal */}
      {isDietOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Formular Nova Dieta (Ração TMR)</h2>
              <button onClick={() => setIsDietOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDietSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nome Identificador da Receita *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: TMR Alta Lactação Verão"
                  value={dietForm.name}
                  onChange={(e) => setDietForm({ ...dietForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Lote Alvo Destinatário *</label>
                <select
                  value={dietForm.lotName}
                  onChange={(e) => setDietForm({ ...dietForm, lotName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                >
                  <option value="Lote 1 - Alta Produção">Lote 1 - Alta Produção</option>
                  <option value="Lote 2 - Baixa Produção">Lote 2 - Baixa Produção</option>
                  <option value="Vacas Secas">Vacas Secas</option>
                  <option value="Novilhas de Recria">Novilhas de Recria</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Silagem Milho (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="EX: 32"
                    value={dietForm.silagem}
                    onChange={(e) => setDietForm({ ...dietForm, silagem: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Milho Moído (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="EX: 5.5"
                    value={dietForm.milho}
                    onChange={(e) => setDietForm({ ...dietForm, milho: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Farelo Soja (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="EX: 3.2"
                    value={dietForm.soja}
                    onChange={(e) => setDietForm({ ...dietForm, soja: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Núcleo Mineral (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="EX: 0.4"
                    value={dietForm.mineral}
                    onChange={(e) => setDietForm({ ...dietForm, mineral: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDietOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Calcular Alimentação
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Lançar Consumo Diário Modal */}
      {isConsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Lançar Consumo Diário Realizado</h2>
              <button onClick={() => setIsConsOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConsSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={consForm.date}
                    onChange={(e) => setConsForm({ ...consForm, date: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Animais no Cocho *</label>
                  <input
                    type="number"
                    required
                    value={consForm.cowsCount}
                    onChange={(e) => setConsForm({ ...consForm, cowsCount: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Lote Alimentado *</label>
                <select
                  value={consForm.lotName}
                  onChange={(e) => setConsForm({ ...consForm, lotName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                >
                  <option value="Lote 1 - Alta Produção">Lote 1 - Alta Produção</option>
                  <option value="Lote 2 - Baixa Produção">Lote 2 - Baixa Produção</option>
                  <option value="Vacas Secas">Vacas Secas</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Silagem de Milho (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Silagem total Real"
                    value={consForm.silageKG}
                    onChange={(e) => setConsForm({ ...consForm, silageKG: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Concentrado Proteico (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="EX: Concentrado"
                    value={consForm.concentrateKG}
                    onChange={(e) => setConsForm({ ...consForm, concentrateKG: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ração Nuticional (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ração total"
                    value={consForm.grainFeedKG}
                    onChange={(e) => setConsForm({ ...consForm, grainFeedKG: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Sal Mineral (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="EX: 3.2"
                    value={consForm.mineralSaltKG}
                    onChange={(e) => setConsForm({ ...consForm, mineralSaltKG: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsConsOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Salvar Diário
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
