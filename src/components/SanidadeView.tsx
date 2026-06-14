/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Activity,
  AlertTriangle,
  Flame,
  Calendar,
  Layers,
  Heart,
  Droplet,
  Settings,
  X,
  HeartPulse,
  Info,
  Trash2
} from "lucide-react";
import { useFarm } from "../context/FarmContext";

export default function SanidadeView() {
  const { animals, sanitaryRecords, addSanitaryRecord, deleteSanitaryRecord, getCurrentWithholdingAlerts, confirmAction } = useFarm();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    animalId: "",
    type: "Mastite" as any,
    date: new Date().toISOString().split("T")[0],
    diagnosis: "Grau leve - Teto anterior esquerdo",
    treatmentMedicine: "Mastidox Cobalto Susp.",
    withdrawalDays: "3", // default 3 days withholding
    veterinarian: "Dr. José Carlos",
    notes: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cow = animals.find((a) => a.id === formData.animalId);
    if (!cow) return;

    addSanitaryRecord({
      animalId: cow.id,
      animalNumber: cow.number,
      animalName: cow.name,
      type: formData.type,
      date: formData.date,
      diagnosis: formData.diagnosis,
      treatmentMedicine: formData.treatmentMedicine,
      withdrawalDays: Number(formData.withdrawalDays) || 0,
      veterinarian: formData.veterinarian,
      notes: formData.notes
    });

    setIsOpen(false);
    // Reset Form
    setFormData({
      animalId: "",
      type: "Mastite",
      date: new Date().toISOString().split("T")[0],
      diagnosis: "Grau leve - Teto anterior esquerdo",
      treatmentMedicine: "Mastidox Cobalto Susp.",
      withdrawalDays: "3",
      veterinarian: "Dr. José Carlos",
      notes: ""
    });
  };

  const activeWithholdings = getCurrentWithholdingAlerts();

  return (
    <div id="sanidade-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Massa Sanitária & Veterinária</h1>
          <p className="text-xs text-slate-500 font-medium">Controle de imunização, casco, tratamento de mastites e quentão preventivo de segurança alimentar.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Registrar Tratamento Sanitário
        </button>
      </div>

      {/* Critical active milk withdrawal warning banner */}
      {activeWithholdings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-xs text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-650 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="font-bold text-red-900">🥛 ALERTA CRÍTICO: CARÊNCIA QUÍMICA ATIVA DE LEITE (LEITE RETIDO!)</p>
            <p className="mt-1 leading-relaxed text-red-800">
              {activeWithholdings.length} vacas receberam infusões intramamárias ou antibióticos sistêmicos. O leite destas matrizes **NÃO PODE** ser ordenhado junto ao tanque do laticínio parceiro sob risco de descarte completo do lote de transporte.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeWithholdings.map((wh, idx) => (
                <div key={idx} className="bg-white border border-red-250 p-2.5 rounded-lg flex justify-between items-center shadow-sm">
                  <div>
                    <span className="font-bold font-mono text-xs block text-slate-800">Cow #{wh.number} - {wh.name}</span>
                    <span className="text-[10px] text-slate-400 font-sans block uppercase font-medium">{wh.medicine}</span>
                  </div>
                  <span className="bg-rose-500 text-white font-mono font-black rounded px-2 py-1 text-[10px] shadow-sm">
                    ATÉ: {wh.dateUntil}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sanitary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2/3: Historial treatments */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-500" /> Registro Geral de Casos e Medicinas
            </h2>
            <span className="text-[11px] font-mono text-slate-400">{sanitaryRecords.length} lançamentos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 font-bold border-b border-slate-100 text-slate-500">
                  <th className="p-3">Data Evento</th>
                  <th className="p-3">Matriz</th>
                  <th className="p-3">Tipo Ocorrência</th>
                  <th className="p-3">Diagnóstico Clínico</th>
                  <th className="p-3">Medicina Intramamária / Antibiótico</th>
                  <th className="p-3 text-center">Carência</th>
                  <th className="p-3">Veterinário</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700">
                {sanitaryRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono text-slate-650">{r.date}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">#{r.animalNumber}</div>
                      <div className="text-[10px] text-slate-400">{r.animalName}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.type === "Mastite" ? "bg-rose-50 text-rose-800 border-rose-100 border" :
                        r.type === "Vacinação" ? "bg-amber-50 text-amber-800 border-amber-100 border" :
                        r.type === "Casqueamento" ? "bg-indigo-50 text-indigo-805 border-indigo-100 border" : "bg-sky-50 text-sky-850"
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="p-3 max-w-[150px] truncate" title={r.diagnosis}>
                      {r.diagnosis}
                    </td>
                    <td className="p-3 font-medium">
                      <div>{r.treatmentMedicine}</div>
                      {r.notes && <p className="text-[10px] text-slate-400 italic">"{r.notes}"</p>}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {r.withdrawalDays > 0 ? (
                        <span className="bg-rose-50 border border-rose-200 font-bold text-rose-700 px-1.5 py-0.5 rounded text-[10px]">
                          {r.withdrawalDays} dias
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500">{r.veterinarian}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          confirmAction({
                            title: "Excluir Registro Sanitário",
                            message: "Deseja realmente excluir este lançamento de sanidade?",
                            onConfirm: () => {
                              deleteSanitaryRecord(r.id);
                            }
                          });
                        }}
                        className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1.5 transition ml-1"
                        title="Excluir"
                        id={`del-sanitary-${r.id}`}
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

        {/* Right 1/3: Guidelines on hygiene and milk health */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Info className="w-4.5 h-4.5 text-slate-500" /> Boas Práticas Linha de Ordenha
          </h2>
          <div className="space-y-4 text-xs text-slate-605 leading-relaxed">
            <div className="border-l-2 border-slate-350 pl-3.5 space-y-1">
              <span className="font-bold text-slate-800 text-[11.5px] block">Rotina de Linha Saudável</span>
              <p className="text-[10.5px] text-slate-500">Mantenha a higiene rigorosa com pré-dipping (Cloro ou lodo) e lavagem correta das teteiras entre ordenhas para reduzir taxas de CBT do leite coletivo.</p>
            </div>
            <div className="border-l-2 border-slate-350 pl-3.5 space-y-1">
              <span className="font-bold text-slate-800 text-[11.5px] block">Cura Completa e Linha de Descarte</span>
              <p className="text-[10.5px] text-slate-500">O lote sob quarentena deve ser ordenhado por último. Evite falsos positivos higienizando o balde de descarte após cada vaca bloqueada.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Cadastrar Tratamento Veterinário Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Fogo de Atendimento Veterinário (Sanidade)</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Selecione o Animal (Matriz) *</label>
                <select
                  required
                  value={formData.animalId}
                  onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                >
                  <option value="">-- Selecionar Cow --</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      #{a.number} - {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tipo de Evento *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="Mastite">Mastite Clínica</option>
                    <option value="Vacinação">Vacinação Rotina</option>
                    <option value="Casqueamento">Casqueamento Preventivo</option>
                    <option value="Vermifugação">Vermifugação / Baixo escore</option>
                    <option value="Cirurgia">Cirurgia / Aprumo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Data Veterinária *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Diagnóstico Clínico *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: Grau leve teto anterior esquerdo"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Antibiótico / Medicina</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: Mastidox Susp."
                    value={formData.treatmentMedicine}
                    onChange={(e) => setFormData({ ...formData, treatmentMedicine: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Carência Leite (Dias ex) *</label>
                  <input
                    type="number"
                    required
                    placeholder="EX: 3"
                    value={formData.withdrawalDays}
                    onChange={(e) => setFormData({ ...formData, withdrawalDays: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Médico Veterinário Executor *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: Dr. José Carlos"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Anotações Complementares</label>
                <textarea
                  placeholder="EX: Realizar aplicação pós-ordenha de tarde"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Gravar Diagnóstico
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
