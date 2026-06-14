/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  X,
  FileSpreadsheet
} from "lucide-react";
import { useFarm } from "../context/FarmContext";
import { Animal } from "../types";

export default function RebanhoView() {
  const { animals, addAnimal, updateAnimal, deleteAnimal, confirmAction } = useFarm();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  
  // Form modal triggers
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Animal Form Fields
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    electronicEarring: "",
    sex: "F" as "M" | "F",
    breed: "Girolando",
    bloodGrade: "5/8 Girolando",
    birthDate: "",
    weight: 0,
    category: "Vaca em lactação" as any,
    batch: "Lote 1 - Alta Produção",
    origin: "Nascido na Fazenda" as any,
    status: "Ativo" as any,
    gestationStatus: "Vazia" as any,
    fatherName: "",
    motherName: "",
    paternalGrandfather: "",
    paternalGrandmother: "",
    maternalGrandfather: "",
    maternalGrandmother: "",
    notes: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnimal({
      ...formData,
      weight: Number(formData.weight)
    });
    setIsAddOpen(false);
    // Reset Form
    setFormData({
      number: "",
      name: "",
      electronicEarring: "",
      sex: "F",
      breed: "Girolando",
      bloodGrade: "5/8 Girolando",
      birthDate: "",
      weight: 0,
      category: "Vaca em lactação",
      batch: "Lote 1 - Alta Produção",
      origin: "Nascido na Fazenda",
      status: "Ativo",
      gestationStatus: "Vazia",
      fatherName: "",
      motherName: "",
      paternalGrandfather: "",
      paternalGrandmother: "",
      maternalGrandfather: "",
      maternalGrandmother: "",
      notes: ""
    });
  };

  // Filter rebanho
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.number.includes(searchTerm) ||
      (animal.electronicEarring && animal.electronicEarring.includes(searchTerm));

    const matchesCategory =
      categoryFilter === "Todos" || animal.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Children locator
  const getChildren = (parent: Animal) => {
    return animals.filter((a) => a.motherId === parent.id || a.fatherId === parent.id);
  };

  return (
    <div id="rebanho-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Registro de Rebanho (Animais)</h1>
          <p className="text-xs text-slate-500">Mapeamento sanitário, zootécnico e genealógico individual das matrizes.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Lançar Animal
        </button>
      </div>

      {/* Searching & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, brinco, RFID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {["Todos", "Vaca em lactação", "Vaca seca", "Novilha", "Bezerra", "Touro", "Descarte"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                categoryFilter === cat
                  ? "bg-slate-800 text-white"
                  : "bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Animal Directory vs Animal Detail-Pedigree Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Animal Table List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="p-3.5">Registro</th>
                  <th className="p-3.5">Nome / Identificação</th>
                  <th className="p-3.5">Raça / Grau de Sangue</th>
                  <th className="p-3.5">Categoria</th>
                  <th className="p-3.5">Lote / Peso</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredAnimals.length > 0 ? (
                  filteredAnimals.map((animal) => (
                    <tr
                      key={animal.id}
                      onClick={() => setSelectedAnimal(animal)}
                      className={`hover:bg-slate-50 cursor-pointer transition ${
                        selectedAnimal?.id === animal.id ? "bg-slate-50/80 font-medium" : ""
                      }`}
                    >
                      <td className="p-3.5 font-mono text-slate-700">
                        #{animal.number}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{animal.name}</div>
                        {animal.electronicEarring && (
                          <div className="text-[10px] text-slate-400 font-mono">RFID: {animal.electronicEarring}</div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div>{animal.breed}</div>
                        <div className="text-[10px] text-slate-400">{animal.bloodGrade}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          animal.category === "Vaca em lactação" ? "bg-sky-50 text-sky-800 border border-sky-100" :
                          animal.category === "Vaca seca" ? "bg-slate-100 text-slate-700" :
                          animal.category === "Novilha" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                          animal.category === "Bezerra" ? "bg-indigo-50 text-indigo-800 border-indigo-100 border" : "bg-amber-50 text-amber-800"
                        }`}>
                          {animal.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-700">{animal.batch}</div>
                        <div className="text-[10px] text-slate-400">{animal.weight} kg</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          animal.status === "Ativo" ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"
                        }`}>
                          {animal.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            confirmAction({
                              title: "Confirmar Exclusão",
                              message: `Deseja realmente excluir o animal ${animal.name} (#${animal.number})?`,
                              onConfirm: () => {
                                deleteAnimal(animal.id);
                                if (selectedAnimal?.id === animal.id) {
                                  setSelectedAnimal(null);
                                }
                              }
                            });
                          }}
                          className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1 transition"
                          title="Excluir Animal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-400 italic">
                      Nenhum animal cadastrado correspondendo aos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Drawer: Animal Genealogy and Ascestry Tree Map */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
          {selectedAnimal ? (
            <div className="space-y-6">
              
              {/* Profile Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
                    Brinco #{selectedAnimal.number}
                  </span>
                  <h2 className="text-lg font-bold text-slate-800 mt-1">{selectedAnimal.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pedigree specs summary list */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[9.5px]">Nascimento</span>
                  <span className="font-semibold text-slate-800">{selectedAnimal.birthDate}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[9.5px]">Origem</span>
                  <span className="font-semibold text-slate-800">{selectedAnimal.origin}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[9.5px]">Gestações</span>
                  <span className="font-semibold text-slate-800">{selectedAnimal.lactationCount || 0} partos</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[9.5px]">Status Gravidez</span>
                  <span className="font-semibold text-slate-800">{selectedAnimal.gestationStatus}</span>
                </div>
              </div>

              {/* GRAPHICAL GENEALOGY TREE TREE DIAGRAM */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" /> Árvore Genealógica (Zootecnia)
                </h3>
                
                {/* SVG/Box layout family pedigree tree diagram */}
                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/60 flex flex-col items-center">
                  
                  {/* Grandparents Row (3rd Gen) */}
                  <div className="grid grid-cols-4 gap-1.5 w-full text-[9px] text-center font-mono">
                    <div className="bg-sky-50 border border-sky-100 p-1 rounded shadow-sm leading-tight text-slate-600 truncate" title={selectedAnimal.paternalGrandfather || "Linha Masculina"}>
                      👴 <span className="block font-bold">Avô Pat</span>
                      {selectedAnimal.paternalGrandfather || "N/D"}
                    </div>
                    <div className="bg-pink-50 border border-pink-100 p-1 rounded shadow-sm leading-tight text-slate-600 truncate" title={selectedAnimal.paternalGrandmother || "Linha Feminina"}>
                      👵 <span className="block font-bold">Avó Pat</span>
                      {selectedAnimal.paternalGrandmother || "N/D"}
                    </div>
                    <div className="bg-sky-50 border border-sky-100 p-1 rounded shadow-sm leading-tight text-slate-600 truncate" title={selectedAnimal.maternalGrandfather || "Linha Masculina"}>
                      👴 <span className="block font-bold">Avô Mat</span>
                      {selectedAnimal.maternalGrandfather || "N/D"}
                    </div>
                    <div className="bg-pink-50 border border-pink-100 p-1 rounded shadow-sm leading-tight text-slate-600 truncate" title={selectedAnimal.maternalGrandmother || "Linha Feminina"}>
                      👵 <span className="block font-bold">Avó Mat</span>
                      {selectedAnimal.maternalGrandmother || "N/D"}
                    </div>
                  </div>

                  {/* Connecting lines */}
                  <div className="flex justify-around w-full h-3 text-slate-350">
                    <div>|</div>
                    <div>|</div>
                    <div>|</div>
                    <div>|</div>
                  </div>

                  {/* Parents row (2nd Gen) */}
                  <div className="grid grid-cols-2 gap-3.5 w-full text-[10px] text-center">
                    <div className="bg-sky-100/80 border border-sky-250 p-1.5 rounded shadow-sm font-semibold text-slate-700 truncate" title={selectedAnimal.fatherName || "Pai não documentado"}>
                      🐂 Pai: {selectedAnimal.fatherName || "Pai N/D"}
                    </div>
                    <div className="bg-pink-105/90 border border-pink-200 p-1.5 rounded shadow-sm font-semibold text-slate-700 truncate" title={selectedAnimal.motherName || "Mãe não documentadora"}>
                      🐄 Mãe: {selectedAnimal.motherName || "Mãe N/D"}
                    </div>
                  </div>

                  {/* Connecting lines */}
                  <div className="h-4 w-full flex justify-center text-slate-300">
                    <div className="w-1/2 border-l border-r border-t h-full border-slate-300"></div>
                  </div>

                  {/* Focus Subject Center Child (1st Gen) */}
                  <div className="bg-indigo-600 text-white rounded-lg p-2.5 shadow w-4/5 text-center text-xs font-bold ring-2 ring-indigo-300">
                    👑 Vaca Foco: #{selectedAnimal.number} - {selectedAnimal.name}
                  </div>

                </div>
              </div>

              {/* Dynamic Descendants (Filhos / Prole) */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Descendentes Registrados ({getChildren(selectedAnimal).length})
                </h3>
                {getChildren(selectedAnimal).length > 0 ? (
                  <div className="space-y-1.5">
                    {getChildren(selectedAnimal).map((child) => (
                      <div
                        key={child.id}
                        onClick={() => setSelectedAnimal(child)}
                        className="flex justify-between items-center bg-slate-50 border border-slate-200/60 p-2 rounded-lg text-xs hover:border-slate-300 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500">#{child.number}</span>
                          <span className="font-semibold text-slate-700">{child.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="text-[10px] font-bold">{child.category}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    Nenhum descendente documentado associado.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center py-20 text-center text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-300 mb-2.5" />
              <p className="text-xs">Selecione uma matriz ou reprodutor para visualizar detalhes genealógicos e progênie.</p>
            </div>
          )}
        </div>
      </div>

      {/* Launcher modal for Adding animal registry */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800">Nova Matriz / Reprodutor</h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Brinco / Registro *</label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="EX: 1045"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="EX: Estrela"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">RFID Brinco Eletrônico</label>
                <input
                  type="text"
                  value={formData.electronicEarring}
                  onChange={(e) => setFormData({ ...formData, electronicEarring: e.target.value })}
                  placeholder="EX: BR6519"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Sexo *</label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                >
                  <option value="F">Fêmea</option>
                  <option value="M">Macho (Touro)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Raça *</label>
                <select
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                >
                  <option value="Girolando">Girolando</option>
                  <option value="Holandês">Holandês (Holstein)</option>
                  <option value="Gir Leiteiro">Gir Leiteiro</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Pardo Suíço">Pardo Suíço</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Grau de Sangue *</label>
                <input
                  type="text"
                  required
                  value={formData.bloodGrade}
                  onChange={(e) => setFormData({ ...formData, bloodGrade: e.target.value })}
                  placeholder="EX: 5/8 Girolando, P.O"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Data de Nascimento *</label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Peso Estimado (kg) *</label>
                <input
                  type="number"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  placeholder="EX: 540"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Categoria Zootécnica *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                >
                  <option value="Bezerra">Bezerra (Aleitamento)</option>
                  <option value="Novilha">Novilha (Recria)</option>
                  <option value="Vaca em lactação">Vaca em lactação</option>
                  <option value="Vaca seca">Vaca seca</option>
                  <option value="Touro">Touro / Reprodutor</option>
                  <option value="Descarte">Descarte</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Lote Prévio *</label>
                <select
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
                >
                  <option value="Lote 1 - Alta Produção">Lote 1 - Alta Produção</option>
                  <option value="Lote 2 - Baixa Produção">Lote 2 - Baixa Produção</option>
                  <option value="Vacas Secas">Vacas Secas</option>
                  <option value="Novilhas de Recria">Novilhas de Recria</option>
                  <option value="Bezerrário / Aleitamento">Bezerrário</option>
                  <option value="Touros">Touros</option>
                </select>
              </div>

              <div className="col-span-2 border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-500 mb-2 text-[10.5px] uppercase tracking-wider">Mapeamento Genealógico (Opcional)</h4>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Nome do Pai</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Nome da Mãe</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Avô Paterno</label>
                <input
                  type="text"
                  value={formData.paternalGrandfather}
                  onChange={(e) => setFormData({ ...formData, paternalGrandfather: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Avó Materna</label>
                <input
                  type="text"
                  value={formData.maternalGrandmother}
                  onChange={(e) => setFormData({ ...formData, maternalGrandmother: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-600 mb-1">Observações Operacionais</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="EX: Alergias, histórico veterinário de aprumo, etc."
                  rows={2}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition"
                >
                  Salvar Matriz
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
