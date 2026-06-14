/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Droplet,
  Plus,
  Compass,
  TrendingUp,
  Activity,
  AlertTriangle,
  Beaker,
  FilePlus2,
  Settings,
  X,
  PlusSquare,
  BarChart3,
  CalendarDays,
  Trash2
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useFarm } from "../context/FarmContext";

export default function LeiteView() {
  const { animals, leiteRecords, controlLeiteiro, addLeiteRecord, addControlLeiteiro, deleteLeiteRecord, deleteControlLeiteiro, confirmAction } = useFarm();

  const [isLogMilkOpen, setIsLogMilkOpen] = useState(false);
  const [isLogQualityOpen, setIsLogQualityOpen] = useState(false);

  // Individual yield form data
  const [milkForm, setMilkForm] = useState({
    animalId: "",
    date: new Date().toISOString().split("T")[0],
    morningValue: "",
    afternoonValue: "",
    nightValue: ""
  });

  // Milk quality form data
  const [qualityForm, setQualityForm] = useState({
    date: new Date().toISOString().substring(0, 7), // "2026-06"
    ccs: "",
    cbt: "",
    fatPct: "",
    proteinPct: "",
    lactosePct: "",
    ureaValue: "",
    sampleCount: "18"
  });

  const handleLeiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cow = animals.find((a) => a.id === milkForm.animalId);
    if (!cow) return;

    const morning = Number(milkForm.morningValue) || 0;
    const afternoon = Number(milkForm.afternoonValue) || 0;
    const night = Number(milkForm.nightValue) || 0;

    addLeiteRecord({
      animalId: cow.id,
      animalNumber: cow.number,
      animalName: cow.name,
      batch: cow.batch,
      date: milkForm.date,
      morningValue: morning,
      afternoonValue: afternoon,
      nightValue: night,
      totalValue: morning + afternoon + night
    });

    setIsLogMilkOpen(false);
    setMilkForm({
      animalId: "",
      date: new Date().toISOString().split("T")[0],
      morningValue: "",
      afternoonValue: "",
      nightValue: ""
    });
  };

  const handleQualitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addControlLeiteiro({
      date: qualityForm.date,
      ccs: Number(qualityForm.ccs) || 120,
      cbt: Number(qualityForm.cbt) || 10,
      fatPct: Number(qualityForm.fatPct) || 3.8,
      proteinPct: Number(qualityForm.proteinPct) || 3.2,
      lactosePct: Number(qualityForm.lactosePct) || 4.5,
      ureaValue: Number(qualityForm.ureaValue) || 12,
      sampleCount: Number(qualityForm.sampleCount) || 15
    });

    setIsLogQualityOpen(false);
    setQualityForm({
      date: new Date().toISOString().substring(0, 7),
      ccs: "",
      cbt: "",
      fatPct: "",
      proteinPct: "",
      lactosePct: "",
      ureaValue: "",
      sampleCount: "18"
    });
  };

  // Peak metrics
  const activeYielderLogs = leiteRecords.filter(r => r.totalValue > 0);
  const highestIndividualYield = activeYielderLogs.length > 0 
    ? Math.max(...activeYielderLogs.map(r => r.totalValue)) : 34.5;
  
  // Persitency estimation
  const meanYieldRecent = activeYielderLogs.length > 0 
    ? (activeYielderLogs.reduce((acc, r) => acc + r.totalValue, 0) / activeYielderLogs.length).toFixed(1) : "24.8";

  // Re-map quality database for charts (reverse chronologically to render left-to-right)
  const qualityChartData = [...controlLeiteiro]
    .map(c => ({
      ...c,
      Mês: c.date.substring(5, 7) + "/" + c.date.substring(2, 4)
    }))
    .reverse();

  return (
    <div id="producao-leite-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Ordenhas & Controle Leiteiro</h1>
          <p className="text-xs text-slate-500 font-medium">Lançamento de pesagens periódicas, controle químico de CCS/CBT e análises de pico de lactação.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsLogQualityOpen(true)}
            className="border border-slate-300 hover:bg-slate-150 text-slate-700 bg-white rounded-lg px-3 py-2 text-xs font-bold shadow flex items-center gap-1.5 transition"
          >
            <Beaker className="w-4 h-4 text-slate-500" /> Lançar Qualidade Quím.
          </button>
          <button
            onClick={() => setIsLogMilkOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Lançar Pesagem Diária
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pico de Lactação registrado</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">{highestIndividualYield} <span className="text-xs font-normal">Litros</span></p>
          <p className="text-[10px] text-slate-400 mt-1">Vaca: Baunilha (#3051)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Persistência Nutricional</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">94.2 <span className="text-xs font-normal">%</span></p>
          <p className="text-[10px] text-slate-400 mt-1">Estabilidade pós-pico estimada</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Média de Produção de Lote</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">{meanYieldRecent} <span className="text-xs font-normal">L/Vaca</span></p>
          <p className="text-[10px] text-slate-400 mt-1">Pesagem do Lote Alta Produção</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Sólidos do Leite (Média)</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">7.30 <span className="text-xs font-normal">%</span></p>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Gordura ({controlLeiteiro[0]?.fatPct || "3.9"}%) + Proteína ({controlLeiteiro[0]?.proteinPct || "3.3"}%)</p>
        </div>
      </div>

      {/* Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quality Chart (CCS and CBT) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Beaker className="w-4 h-4 text-slate-500" /> Qualidade Sanitária e Biológica (Evolutivo)
            </h2>
            <span className="text-[10px] text-slate-400 block">Comportamento da CCS (Células Somáticas x1000/ml) e CBT (UFC/ml). Baixa CCS indica excelente manejo sanitário pré e pós ordenhas.</span>
          </div>
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Mês" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip wrapperStyle={{ fontFamily: "monospace", fontSize: 11 }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ccs" name="CCS (x1000)" stroke="#f43f5e" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cbt" name="CBT (UFC)" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chemical Composition Chart (Fat, Protein, Lactosepct) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-500" /> Composição Físico-Química do Leite
            </h2>
            <span className="text-[10px] text-slate-400 block">Evolutivo percentual (%) de Sólidos de Gordura, Proteína Bruta e Lactose entregues ao laticínio parceiro da agroindústria.</span>
          </div>
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Mês" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip wrapperStyle={{ fontFamily: "monospace", fontSize: 11 }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="fatPct" name="Gordura (%)" stroke="#eab308" strokeWidth={2} />
                <Line type="monotone" dataKey="proteinPct" name="Proteína (%)" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="lactosePct" name="Lactose (%)" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Interactive Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2/3: Yield entries */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CalendarDays className="w-4 h-4" /> Movimentações Recentes de Ordenhas
            </h2>
            <span className="text-[11px] font-mono text-slate-400">{leiteRecords.length} lançamentos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 font-bold text-slate-500 border-b border-slate-100">
                  <th className="p-3">Data</th>
                  <th className="p-3">Matriz</th>
                  <th className="p-3">Lote Alocado</th>
                  <th className="p-3 text-center">Manhã (L)</th>
                  <th className="p-3 text-center">Tarde (L)</th>
                  <th className="p-3 text-center">Noite (L)</th>
                  <th className="p-3 text-right">Yield Diário (L)</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {leiteRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono text-slate-600">{r.date}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">#{r.animalNumber}</div>
                      <div className="text-[10px] text-slate-400">{r.animalName}</div>
                    </td>
                    <td className="p-3 text-slate-500">{r.batch}</td>
                    <td className="p-3 text-center">{r.morningValue} L</td>
                    <td className="p-3 text-center">{r.afternoonValue} L</td>
                    <td className="p-3 text-center">{r.nightValue > 0 ? `${r.nightValue} L` : "-"}</td>
                    <td className="p-3 text-right font-bold text-slate-800">{r.totalValue} Litros</td>
                    <td className="p-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => {
                          confirmAction({
                            title: "Excluir Lançamento de Leite",
                            message: "Deseja realmente excluir este lançamento de leite?",
                            onConfirm: () => {
                              deleteLeiteRecord(r.id);
                            }
                          });
                        }}
                        className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1 transition ml-1"
                        title="Excluir"
                        id={`del-leite-${r.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1/3: Quality logs catalog */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Beaker className="w-4 h-4 text-slate-500" /> Auditoria de Qualidade Coletiva
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {controlLeiteiro.map((c) => (
              <div key={c.id} className="border border-slate-150 rounded-lg p-3 bg-slate-50/60 text-xs flex justify-between items-center whitespace-nowrap">
                <div>
                  <span className="font-bold block text-slate-705 text-slate-700">Mês de Análise: {c.date}</span>
                  <p className="text-[10.5px] text-slate-400 mt-1 uppercase">Sólidos: {c.fatPct}% G / {c.proteinPct}% P</p>
                  <p className="text-[10.5px] text-slate-400">Amostragem: {c.sampleCount} mec.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-mono font-bold block text-rose-500">CCS: {c.ccs}k</span>
                    <span className="font-mono font-bold block text-indigo-505 text-indigo-500">CBT: {c.cbt} UFC</span>
                  </div>
                  <button
                    onClick={() => {
                      confirmAction({
                        title: "Excluir Análise de Qualidade",
                        message: "Deseja realmente excluir esta análise de qualidade coletiva?",
                        onConfirm: () => {
                          deleteControlLeiteiro(c.id);
                        }
                      });
                    }}
                    className="text-slate-400 hover:text-rose-650 hover:bg-rose-55 rounded p-1 transition ml-1"
                    title="Excluir"
                    id={`del-ctrl-${c.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lançar Pesagem Diária Modal */}
      {isLogMilkOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Lançamento de Pesagem Leiteira</h2>
              <button onClick={() => setIsLogMilkOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeiteSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Selecione a Matriz Lactante *</label>
                <select
                  required
                  value={milkForm.animalId}
                  onChange={(e) => setMilkForm({ ...milkForm, animalId: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                >
                  <option value="">-- Selecionar Cow --</option>
                  {animals.filter(a => a.category === "Vaca em lactação").map((a) => (
                    <option key={a.id} value={a.id}>
                      #{a.number} - {a.name} ({a.batch})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Data da Coleta *</label>
                  <input
                    type="date"
                    required
                    value={milkForm.date}
                    onChange={(e) => setMilkForm({ ...milkForm, date: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ordenha Noite (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Opcional"
                    value={milkForm.nightValue}
                    onChange={(e) => setMilkForm({ ...milkForm, nightValue: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ordenha Manhã (L) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="EX: 15.5"
                    value={milkForm.morningValue}
                    onChange={(e) => setMilkForm({ ...milkForm, morningValue: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ordenha Tarde (L) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="EX: 11.2"
                    value={milkForm.afternoonValue}
                    onChange={(e) => setMilkForm({ ...milkForm, afternoonValue: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogMilkOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Salvar Pesagens
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Lançar Qualidade Quím. Modal */}
      {isLogQualityOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Resultado de Análise de Tanque (Qualidade)</h2>
              <button onClick={() => setIsLogQualityOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQualitySubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Competência (AAAA-MM) *</label>
                  <input
                    type="month"
                    required
                    value={qualityForm.date}
                    onChange={(e) => setQualityForm({ ...qualityForm, date: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Vacas Amostradas *</label>
                  <input
                    type="number"
                    required
                    value={qualityForm.sampleCount}
                    onChange={(e) => setQualityForm({ ...qualityForm, sampleCount: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">CCS (Somaticas x1000/ml) *</label>
                  <input
                    type="number"
                    required
                    placeholder="EX: 240"
                    value={qualityForm.ccs}
                    onChange={(e) => setQualityForm({ ...qualityForm, ccs: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">CBT (Bacteriana UFC) *</label>
                  <input
                    type="number"
                    required
                    placeholder="EX: 12"
                    value={qualityForm.cbt}
                    onChange={(e) => setQualityForm({ ...qualityForm, cbt: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Gordura % *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="3.8"
                    value={qualityForm.fatPct}
                    onChange={(e) => setQualityForm({ ...qualityForm, fatPct: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Proteína % *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="3.2"
                    value={qualityForm.proteinPct}
                    onChange={(e) => setQualityForm({ ...qualityForm, proteinPct: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ureia mg/dL</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="13.2"
                    value={qualityForm.ureaValue}
                    onChange={(e) => setQualityForm({ ...qualityForm, ureaValue: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogQualityOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Salvar Resultados
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
