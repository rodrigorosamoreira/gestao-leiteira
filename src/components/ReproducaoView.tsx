/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Heart,
  Plus,
  Users,
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  TrendingUp,
  Clock,
  Settings,
  X,
  FileText,
  Trash2
} from "lucide-react";
import { useFarm } from "../context/FarmContext";

export default function ReproducaoView() {
  const { animals, reproductionRecords, addReproductionRecord, deleteReproductionRecord, confirmAction } = useFarm();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    animalId: "",
    type: "Cio" as any,
    date: new Date().toISOString().split("T")[0],
    bull: "",
    semenCode: "",
    inseminator: "",
    diagnosisResult: "Vazia" as any,
    partumType: "Normal" as any,
    partumSex: "Macho" as any,
    calfName: "",
    calfNumber: "",
    observations: ""
  });

  // Calculate Key Breeding Performance Indicators (KPIs)
  // Conception rate: Positive pregnancy check audits / Total pregnancy check audits
  const pregnancyChecks = reproductionRecords.filter((r) => r.type === "Diagnóstico Gestação");
  const positiveChecks = pregnancyChecks.filter((r) => r.diagnosisResult === "Prenha");
  const calculatedConceptionRate =
    pregnancyChecks.length > 0 ? Math.round((positiveChecks.length / pregnancyChecks.length) * 100) : 72; // avg industry Girolando

  // Typical herd average calculations
  const diasEmAbertoAvg = 115; // standard open days (interval from calving to conception)
  const partosIntervalAvg = 13.2; // standard calving interval in months (Girolando/Holstein)
  const txPrenhezAvg = 23; // Pregnancy rate percent

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeCow = animals.find((a) => a.id === formData.animalId);
    if (!activeCow) return;

    // Automatic alerts offset scheduler based on breeding formulas:
    // Pregnancy check DG: +30 days from Insemination
    // Drying: Expected parturition date - 60 days
    // Delivery expected date: +283 days from insemination
    let alerts = {};
    if (formData.type === "Inseminação" || formData.type === "Monta Natural") {
      const insDate = new Date(formData.date);
      
      const dgDateObj = new Date(insDate);
      dgDateObj.setDate(dgDateObj.getDate() + 30);
      
      const partObj = new Date(insDate);
      partObj.setDate(partObj.getDate() + 283);
      
      const dryObj = new Date(partObj);
      dryObj.setDate(dryObj.getDate() - 60);

      alerts = {
        diagnosisDate: dgDateObj.toISOString().split("T")[0],
        dryingExpectedDate: dryObj.toISOString().split("T")[0],
        expectedPartumDate: partObj.toISOString().split("T")[0]
      };
    }

    addReproductionRecord({
      ...formData,
      animalNumber: activeCow.number,
      animalName: activeCow.name,
      alerts: Object.keys(alerts).length > 0 ? alerts : undefined
    });

    setIsAddOpen(false);
    // Reset Form
    setFormData({
      animalId: "",
      type: "Cio",
      date: new Date().toISOString().split("T")[0],
      bull: "",
      semenCode: "",
      inseminator: "",
      diagnosisResult: "Vazia",
      partumType: "Normal",
      partumSex: "Macho",
      calfName: "",
      calfNumber: "",
      observations: ""
    });
  };

  return (
    <div id="reproducao-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Módulo Reprodutivo & Paridade</h1>
          <p className="text-xs text-slate-500 font-medium">Controle zootécnico de inseminações, detecção de cios, diagnósticos e taxas de concepção.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Registrar Evento Reprodutivo
        </button>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-rose-500 mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Taxa de Concepção</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{calculatedConceptionRate}%</p>
          <p className="text-[10.5px] text-slate-400 mt-1">Prenhez por Inseminação</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-indigo-500 mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Taxa de Prenhez</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{txPrenhezAvg}%</p>
          <p className="text-[10.5px] text-slate-400 mt-1">Eficiência cíclica do rebanho</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-sky-500 mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Dias em Aberto (DEL)</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{diasEmAbertoAvg} <span className="text-sm font-normal text-slate-500">Dias</span></p>
          <p className="text-[10.5px] text-slate-400 mt-1">Média Calçamento-Concepção</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-amber-500 mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-medium">Intervalo Partos</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{partosIntervalAvg} <span className="text-sm font-normal text-slate-500">Meses</span></p>
          <p className="text-[10.5px] text-slate-400 mt-1">Meta de eficiência zootécnica</p>
        </div>

      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2/3: Log history list */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Histórico de Ocorrências Reprodutivas
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">{reproductionRecords.length} lançamentos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                  <th className="p-3">Data</th>
                  <th className="p-3">Animal</th>
                  <th className="p-3">Evento</th>
                  <th className="p-3">Detalhes Técnicos</th>
                  <th className="p-3">Próximos Alertas (IA)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {reproductionRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono text-slate-600">{rec.date}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">#{rec.animalNumber}</div>
                      <div className="text-[10px] text-slate-400">{rec.animalName}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.type === "Inseminação" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                        rec.type === "Cio" ? "bg-rose-50 text-rose-800 border border-rose-100" :
                        rec.type === "Diagnóstico Gestação" ? "bg-indigo-50 text-indigo-800 border border-indigo-100" :
                        rec.type === "Parto" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-slate-100 text-slate-700"
                      }`}>
                        {rec.type}
                      </span>
                    </td>
                    <td className="p-3 leading-normal">
                      {rec.bull && <div className="text-slate-700">🐂 Touro/Sêmen: {rec.bull}</div>}
                      {rec.semenCode && <div className="text-[10px] text-slate-400">Sêmen: {rec.semenCode}</div>}
                      {rec.inseminator && <div className="text-[10px] text-slate-500">Inseminador: {rec.inseminator}</div>}
                      {rec.diagnosisResult && (
                        <div className={`font-bold mt-0.5 text-[11px] ${rec.diagnosisResult === "Prenha" ? "text-emerald-600" : "text-rose-500"}`}>
                          Check DG: {rec.diagnosisResult}
                        </div>
                      )}
                      {rec.partumType && (
                        <div className="text-[11px] text-slate-600">
                          Parto {rec.partumType} ({rec.partumSex})
                        </div>
                      )}
                      {rec.calfName && (
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          👶 Bezerro(a): {rec.calfName} (Brinco: {rec.calfNumber})
                        </div>
                      )}
                      {rec.observations && <p className="text-[10px] text-slate-400 italic mt-0.5">Obs: {rec.observations}</p>}
                    </td>
                    <td className="p-3 font-mono text-[10.5px] text-slate-600 space-y-1">
                      {rec.alerts?.expectedPartumDate && (
                        <div>🍼 Parto Previsto: <span className="font-bold text-indigo-650">{rec.alerts.expectedPartumDate}</span></div>
                      )}
                      {rec.alerts?.dryingExpectedDate && (
                        <div>🥛 Secagem: <span className="font-bold text-sky-650">{rec.alerts.dryingExpectedDate}</span></div>
                      )}
                      {rec.alerts?.diagnosisDate && (
                        <div>🩺 DG: <span className="font-bold text-amber-655">{rec.alerts.diagnosisDate}</span></div>
                      )}
                      {!rec.alerts && <span className="text-slate-400 italic font-sans">-</span>}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Sincronizado
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => {
                          confirmAction({
                            title: "Excluir Lançamento Reprodutivo",
                            message: "Deseja realmente excluir este lançamento de reprodução?",
                            onConfirm: () => {
                              deleteReproductionRecord(rec.id);
                            }
                          });
                        }}
                        className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1.5 transition ml-1"
                        title="Excluir"
                        id={`del-repro-${rec.id}`}
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

        {/* Right 1/3: Quick reminders and instructions card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-slate-500" /> Notas Recomendadas de Protocolo (IATF)
          </h2>
          <div className="space-y-3 leading-relaxed text-xs text-slate-600">
            <div className="border-l-2 border-indigo-500 pl-3.5">
              <span className="font-bold block text-slate-800 text-[12px] mb-0.5">Dias em Aberto DEL</span>
              <p className="text-[11px] text-slate-500">O DEL deve se situar abaixo de 120 dias para garantir lucratividade anual das lactações. Cios repetitivos sem prenhez são indicadores para vistoriar.</p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3.5">
              <span className="font-bold block text-slate-800 text-[12px] mb-0.5">Diagnósticos Antecipados (DG)</span>
              <p className="text-[11px] text-slate-500">Agende ultrassonografias veterinárias aos 30 dias pós IATF. Descartar falsos cios diminui exponencialmente os custos com doses de sêmen.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Lançar Evento Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Lançamento Reprodutivo / Acasalamento</h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
              >
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
                  {animals.filter(a => a.sex === "F").map((a) => (
                    <option key={a.id} value={a.id}>
                      #{a.number} - {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tipo de Ocorrência *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                  >
                    <option value="Cio">Cio Detectado</option>
                    <option value="Inseminação">Inseminação Artificial (IA / IATF)</option>
                    <option value="Monta Natural">Monta Natural</option>
                    <option value="Diagnóstico Gestação">Diagnóstico Gestação (DG)</option>
                    <option value="Parto">Parto Registrado</option>
                    <option value="Aborto">Aborto Espontâneo</option>
                    <option value="Repetição de Cio">Repetição de Cio</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Data da Ocorrência *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Conditional inputs based on event type selected */}
              {(formData.type === "Inseminação" || formData.type === "Monta Natural") && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-600 mb-1">Touro Doador *</label>
                    <input
                      type="text"
                      required
                      value={formData.bull}
                      placeholder="EX: Sansão da Silvania"
                      onChange={(e) => setFormData({ ...formData, bull: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Cód. Sêmen</label>
                    <input
                      type="text"
                      placeholder="EX: H01"
                      value={formData.semenCode}
                      onChange={(e) => setFormData({ ...formData, semenCode: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {formData.type === "Inseminação" && (
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Técnico Inseminador *</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: Mateus Assis"
                    value={formData.inseminator}
                    onChange={(e) => setFormData({ ...formData, inseminator: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              )}

              {formData.type === "Diagnóstico Gestação" && (
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Resultado de Toque / DG *</label>
                    <select
                      value={formData.diagnosisResult}
                      onChange={(e) => setFormData({ ...formData, diagnosisResult: e.target.value as any })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                    >
                      <option value="Vazia">Vazia (Negativo)</option>
                      <option value="Prenha">Prenha (Positivo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Veterinário Executor *</label>
                    <input
                      type="text"
                      required
                      placeholder="EX: Dr. José"
                      value={formData.inseminator}
                      onChange={(e) => setFormData({ ...formData, inseminator: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {formData.type === "Parto" && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Tipo de Parto *</label>
                      <select
                        value={formData.partumType}
                        onChange={(e) => setFormData({ ...formData, partumType: e.target.value as any })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                      >
                        <option value="Normal">Normal (Eutócico)</option>
                        <option value="Distócico">Distócico (Com ajuda)</option>
                        <option value="Cesárea">Cesárea cirúrgica</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Sexo do Bezerro Nascido *</label>
                      <select
                        value={formData.partumSex}
                        onChange={(e) => setFormData({ ...formData, partumSex: e.target.value as any })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                      >
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Nome do Bezerro Nascido *</label>
                      <input
                        type="text"
                        required
                        placeholder="EX: Filha da Estrela"
                        value={formData.calfName}
                        onChange={(e) => setFormData({ ...formData, calfName: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Brinco do Bezerro Nascido *</label>
                      <input
                        type="text"
                        required
                        placeholder="EX: B809"
                        value={formData.calfNumber}
                        onChange={(e) => setFormData({ ...formData, calfNumber: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-600 mb-1">Notas das Condições Corporais / Obs</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="EX: Vaca apresentou bom escore de condição corporal (ECC 3.5)"
                  rows={2}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition"
                >
                  Lançar Evento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
