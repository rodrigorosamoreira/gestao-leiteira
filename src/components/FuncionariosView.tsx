/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, Plus, Phone, Award, ShieldCheck, Mail, Briefcase, PlusSquare, X, Trash2 } from "lucide-react";
import { useFarm } from "../context/FarmContext";

export default function FuncionariosView() {
  const { employees, addEmployee, deleteEmployee, confirmAction } = useFarm();
  
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "Ordenhador" as any,
    contactNumber: "",
    status: "Ativo" as "Ativo" | "Férias" | "Inativo",
    salary: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      name: form.name,
      role: form.role,
      contactNumber: form.contactNumber,
      status: form.status,
      salary: Number(form.salary) || 1800
    });

    setIsOpen(false);
    setForm({
      name: "",
      role: "Ordenhador",
      contactNumber: "",
      status: "Ativo",
      salary: ""
    });
  };

  return (
    <div id="funcionarios-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Equipe & Colaboradores</h1>
          <p className="text-xs text-slate-500 font-medium font-sans">Cadastros dos trabalhadores rurais, veterinários de campo e controle de permissões de ordenhas.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Cadastrar Colaborador
        </button>
      </div>

      {/* Employeers Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-extrabold flex items-center justify-center text-sm shadow">
                  {emp.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-sm block text-slate-800">{emp.name}</span>
                  <span className="text-[10.5px] text-slate-400 block font-medium uppercase font-sans tracking-wide">{emp.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  emp.status === "Ativo" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"
                }`}>
                  {emp.status}
                </span>
                <button
                  onClick={() => {
                    confirmAction({
                      title: "Remover Funcionário",
                      message: `Deseja realmente remover este colaborador ${emp.name}?`,
                      onConfirm: () => {
                        deleteEmployee(emp.id);
                      }
                    });
                  }}
                  className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1 transition"
                  title="Remover"
                  id={`del-emp-${emp.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs text-slate-550 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{emp.contactNumber || "(35) 99881-2241"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>Salário Mensal: R$ {emp.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex gap-1.5 pt-1">
              <span className="bg-slate-50 border border-slate-200/50 text-slate-500 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                🔑 APP_REBANHO_LEITOR
              </span>
              <span className="bg-sky-50 text-sky-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                💻 LANÇAR_ORDENHA
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Cadastrar Nova Colaborador Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Ficha de Trabalho do Colaborador</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: Raimundo Neto"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Função / Cargo *</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="Ordenhador">Ordenhador profissional</option>
                    <option value="Tratorista">Tratorista / Logística</option>
                    <option value="Inseminador">Inseminador reprodutivo</option>
                    <option value="Vacinador">Vacinador clínico</option>
                    <option value="Vaqueiro">Vaqueiro de Lotes</option>
                    <option value="Gerente Operacional">Gerente Operacional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Status Atuante *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="Ativo">Registro Ativo</option>
                    <option value="Férias">Licença / Férias</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Telefone de Contato</label>
                  <input
                    type="text"
                    placeholder="EX: (35) 99824-1144"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Contrato Salário (R$) *</label>
                  <input
                    type="number"
                    required
                    placeholder="EX: 2100"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
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
                  Registrar Ficha
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
