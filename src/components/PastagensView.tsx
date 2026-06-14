/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Compass,
  Plus,
  Scale,
  Activity,
  AlertTriangle,
  Flame,
  Leaf,
  Calendar,
  Layers,
  Settings,
  X,
  Shuffle,
  CalendarDays,
  Grid
} from "lucide-react";
import { useFarm } from "../context/FarmContext";

export default function PastagensView() {
  const { pasturePaddocks, updatePasturePaddock } = useFarm();

  const [isRotateOpen, setIsRotateOpen] = useState(false);
  const [rotateForm, setRotateForm] = useState({
    fromId: "",
    toId: "",
    batchName: "Lote 1 - Alta Produção"
  });

  const handleRotateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromP = pasturePaddocks.find((p) => p.id === rotateForm.fromId);
    const toP = pasturePaddocks.find((p) => p.id === rotateForm.toId);

    if (fromP) {
      updatePasturePaddock(fromP.id, {
        status: "Em Descanso",
        occupyingBatch: undefined,
        currentRestingDays: 1
      });
    }

    if (toP) {
      updatePasturePaddock(toP.id, {
        status: "Ocupado",
        occupyingBatch: rotateForm.batchName,
        currentRestingDays: 0
      });
    }

    setIsRotateOpen(false);
    setRotateForm({
      fromId: "",
      toId: "",
      batchName: "Lote 1 - Alta Produção"
    });
  };

  return (
    <div id="pastagens-piquetes-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pastejo Rotacionado & Piquetes</h1>
          <p className="text-xs text-slate-500 font-medium font-sans">Administração de pastagens intensivas, adubação de solo, cálculo de período de descanso e rodízios de cimento.</p>
        </div>
        <button
          onClick={() => setIsRotateOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition ml-auto md:ml-0"
        >
          <Shuffle className="w-4 h-4" /> Rotacionar Lote Piquete
        </button>
      </div>

      {/* Grid statistics of pasture health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg">
            <Leaf className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-medium">Capacidade de Suporte</span>
            <span className="text-xl font-bold text-slate-800">4.5 UA / Ha</span>
            <span className="text-[10px] text-slate-400 block">Saturação ideal do solo adubado</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-medium">Período de Descanso</span>
            <span className="text-xl font-bold text-slate-800">28 Dias</span>
            <span className="text-[10px] text-slate-400 block">Meta média capim braquiária</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Piquetes Totais</span>
            <span className="text-xl font-bold text-slate-800">{pasturePaddocks.length} piquetes</span>
            <span className="text-[10px] text-slate-400 block">Organizados em carrossel rotativo</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="bg-sky-50 text-sky-650 p-2.5 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Taxa de Rebrote</span>
            <span className="text-xl font-bold text-slate-800">Excelente</span>
            <span className="text-[10px] text-slate-400 block">Aproveitamento pós-adubação nitrogenada</span>
          </div>
        </div>

      </div>

      {/* Main pasture rotation grid cards dashboard */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 matchesSelector">
          <Compass className="w-4 h-4 text-emerald-600" /> Mapa Gráfico de Rotatividade Piquetes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {pasturePaddocks.map((p) => (
            <div
              key={p.id}
              className={`border rounded-xl p-4 shadow-sm flex flex-col justify-between h-[165px] transition-all ${
                p.status === "Ocupado" ? "bg-white border-indigo-200 ring-2 ring-indigo-50" :
                p.status === "Em Descanso" ? "bg-amber-50/20 border-amber-200" :
                "bg-emerald-50/10 border-emerald-250/60"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{p.name}</span>
                  <span className="text-[10px] text-slate-400 block font-sans font-medium uppercase mt-0.5">{p.pastureType} &middot; {p.areaHA} Ha</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                  p.status === "Ocupado" ? "bg-indigo-600 text-white shadow-sm" :
                  p.status === "Em Descanso" ? "bg-amber-500 text-slate-900" :
                  "bg-emerald-600 text-white"
                }`}>
                  {p.status}
                </span>
              </div>

              {/* Status context layout details */}
              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 space-y-1">
                {p.status === "Ocupado" ? (
                  <div>
                    <span className="text-[10px] text-indigo-600 uppercase font-black block">Lote Ocupando Cocho:</span>
                    <span className="font-bold text-slate-800">{p.occupyingBatch}</span>
                  </div>
                ) : p.status === "Em Descanso" ? (
                  <div className="flex justify-between items-center bg-white border border-amber-100 p-1.5 rounded-md shadow-sm">
                    <span>Descanso de solo</span>
                    <span className="font-mono font-bold text-amber-600">{p.currentRestingDays} / {p.targetRestingDays} Dias</span>
                  </div>
                ) : (
                  <div className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pronto para pastejo de Alta</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rotation manual operations drawer */}
      {isRotateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Rotacionar Lote do Rebanho</h2>
              <button onClick={() => setIsRotateOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRotateSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Liberar Piquete Origem *</label>
                <select
                  required
                  value={rotateForm.fromId}
                  onChange={(e) => setRotateForm({ ...rotateForm, fromId: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                >
                  <option value="">-- Selecione o Piquete à liberar --</option>
                  {pasturePaddocks.filter(p => p.status === "Ocupado").map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Lote: {p.occupyingBatch})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Mudar Para Piquete Destino *</label>
                <select
                  required
                  value={rotateForm.toId}
                  onChange={(e) => setRotateForm({ ...rotateForm, toId: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                >
                  <option value="">-- Selecione Novo Piquete pronto --</option>
                  {pasturePaddocks.filter(p => p.status !== "Ocupado").map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status} - {p.pastureType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Grupo / Lote Rotacionado *</label>
                <select
                  value={rotateForm.batchName}
                  onChange={(e) => setRotateForm({ ...rotateForm, batchName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                >
                  <option value="Lote 1 - Alta Produção">Lote 1 - Alta Produção</option>
                  <option value="Lote 2 - Baixa Produção">Lote 2 - Baixa Produção</option>
                  <option value="Novilhas de Recria">Novilhas de Recria</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRotateOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Aplicar Rotação
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Compact helper icon component
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
