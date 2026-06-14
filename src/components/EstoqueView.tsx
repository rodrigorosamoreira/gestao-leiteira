/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Package,
  Plus,
  Scale,
  MinusCircle,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Warehouse,
  FileCheck2,
  X,
  History,
  Trash2
} from "lucide-react";
import { useFarm } from "../context/FarmContext";

export default function EstoqueView() {
  const { stock, stockHistory, addStockItem, addStockTransaction, deleteStockItem, confirmAction } = useFarm();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  // State modals
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isTransOpen, setIsTransOpen] = useState(false);

  // New item form fields
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    category: "Alimentação" as any,
    quantity: "",
    unit: "KG",
    minLimit: "",
    location: "Silo Principal",
    supplier: ""
  });

  // Transaction form fields
  const [transForm, setTransForm] = useState({
    itemId: "",
    type: "Entrada" as any,
    quantity: "",
    responsible: "",
    notes: ""
  });

  const handleNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStockItem({
      name: newItemForm.name,
      category: newItemForm.category,
      quantity: Number(newItemForm.quantity) || 0,
      unit: newItemForm.unit,
      minLimit: Number(newItemForm.minLimit) || 10,
      location: newItemForm.location,
      supplier: newItemForm.supplier || "Distribuidor Regional"
    });

    setIsNewItemOpen(false);
    setNewItemForm({
      name: "",
      category: "Alimentação",
      quantity: "",
      unit: "KG",
      minLimit: "",
      location: "Silo Principal",
      supplier: ""
    });
  };

  const handleTransSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = stock.find((s) => s.id === transForm.itemId);
    if (!item) return;

    const amount = Number(transForm.quantity) || 0;
    addStockTransaction(
      item.id,
      transForm.type,
      amount,
      transForm.responsible || "Gerente Fazenda",
      transForm.notes || "Ajuste manual"
    );

    setIsTransOpen(false);
    setTransForm({
      itemId: "",
      type: "Entrada",
      quantity: "",
      responsible: "",
      notes: ""
    });
  };

  // Filters stock
  const filteredStock = stock.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "Todos" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const criticalItems = stock.filter((item) => item.quantity <= item.minLimit);

  return (
    <div id="estoque-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Estoque & Almoxarifado</h1>
          <p className="text-xs text-slate-500 font-medium font-sans">Administração de concentrados, silagens, doses farmacológicas e vacinas com alerta de estoque crítico.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsTransOpen(true)}
            className="border border-slate-300 bg-white hover:bg-slate-150 text-slate-800 rounded-lg px-3 py-2 text-xs font-bold shadow flex items-center gap-1.5 transition"
          >
            <MinusCircle className="w-4 h-4 text-slate-500" /> Movimentar Estoque
          </button>
          <button
            onClick={() => setIsNewItemOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Cadastrar Novo Item
          </button>
        </div>
      </div>

      {/* Critical Stock Warning Alert Box */}
      {criticalItems.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-xs text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="font-bold text-rose-900">Estoque Crítico ou Nulo Detectado!</p>
            <p className="mt-1 leading-normal text-rose-800">
              O sistema identificou {criticalItems.length} insumos de alta relevância abaixo da meta de segurança operacional. Favor programar compras:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {criticalItems.map((item) => (
                <span key={item.id} className="bg-white border border-rose-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-rose-700">
                  ⚠️ {item.name}: {item.quantity} {item.unit} (Meta: {item.minLimit})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Searching & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar rações, medicamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {["Todos", "Alimentação", "Medicamento", "Material Consonância", "Higiene"].map((cat) => (
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

      {/* Stock Cards and catalog layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2/3: Catalog list table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Insumos e Peças Armazenadas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                  <th className="p-3">Insumo / Nome</th>
                  <th className="p-3">Seção / Categoria</th>
                  <th className="p-3 text-center">Nível Mínimo</th>
                  <th className="p-3 text-center">Estoque Atual</th>
                  <th className="p-3">Localização</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{item.name}</div>
                      {item.supplier && <div className="text-[10px] text-slate-400">Forn: {item.supplier}</div>}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.category === "Alimentação" ? "bg-amber-50 text-amber-805" :
                        item.category === "Medicamento" ? "bg-rose-50 text-rose-800" : "bg-sky-50 text-sky-800"
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-650">
                      {item.minLimit} {item.unit}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-mono font-bold px-2 py-1 rounded text-xs ${
                        item.quantity <= item.minLimit ? "bg-red-50 text-red-700 font-extrabold" : "bg-slate-100 text-slate-800"
                      }`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{item.location}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        <button
                          onClick={() => {
                            setTransForm({ ...transForm, itemId: item.id });
                            setIsTransOpen(true);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-805 font-bold"
                        >
                          Lançar Lote
                        </button>
                        <button
                          onClick={() => {
                            confirmAction({
                              title: "Excluir Item de Estoque",
                              message: "Deseja realmente excluir este insumo do estoque? Isso removerá o item e seu histórico correspondente.",
                              onConfirm: () => {
                                deleteStockItem(item.id);
                              }
                            });
                          }}
                          className="text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded p-1 transition"
                          title="Excluir"
                          id={`del-stock-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1/3: Historical operations overview */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Histórico de Movimentações</h2>
          </div>
          <div className="p-4 space-y-3.5 max-h-[460px] overflow-y-auto">
            {stockHistory.map((h) => {
              const itemRef = stock.find(s => s.id === h.itemId);
              return (
                <div key={h.id} className="border-l-2 border-slate-350 pl-3 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span className="truncate">{itemRef ? itemRef.name : "Item Excluído"}</span>
                    <span className={h.type === "Entrada" ? "text-emerald-600" : "text-rose-500"}>
                      {h.type === "Entrada" ? "+" : "-"}{h.quantity} {itemRef?.unit || "KG"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10.5px] text-slate-400">
                    <span>Resp: {h.responsible}</span>
                    <span>{h.date}</span>
                  </div>
                  {h.notes && <p className="text-[10px] text-slate-500 italic">"{h.notes}"</p>}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Cadastrar Novo Item Modal */}
      {isNewItemOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Entrada Ficha Cadastral de Insumo</h2>
              <button onClick={() => setIsNewItemOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewItemSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nome do Insumo *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: Farelo de Algodão 38%"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Seção Categoria *</label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="Alimentação">Alimentação / Concentrados</option>
                    <option value="Medicamento">Medicamento / Veterinária</option>
                    <option value="Material Consonância">Material Consonância / Peças</option>
                    <option value="Higiene">Higiene / Balde Lactação</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Unidade Unitária *</label>
                  <select
                    value={newItemForm.unit}
                    onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="KG">Quilo (KG)</option>
                    <option value="Saco 40kg">Saco 40kg</option>
                    <option value="Frasco">Frasco (Dose)</option>
                    <option value="Litro">Litro (Liquid)</option>
                    <option value="Tonelada">Tonelada (Ton)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Estoque Inicial *</label>
                  <input
                    type="number"
                    required
                    placeholder="EX: 480"
                    value={newItemForm.quantity}
                    onChange={(e) => setNewItemForm({ ...newItemForm, quantity: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Estoque Mínigo Segurança *</label>
                  <input
                    type="number"
                    required
                    placeholder="EX: 100"
                    value={newItemForm.minLimit}
                    onChange={(e) => setNewItemForm({ ...newItemForm, minLimit: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Localização Física *</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: Galpão Central"
                    value={newItemForm.location}
                    onChange={(e) => setNewItemForm({ ...newItemForm, location: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Distribuidor / Fornecedor</label>
                  <input
                    type="text"
                    placeholder="EX: Cooperativa"
                    value={newItemForm.supplier}
                    onChange={(e) => setNewItemForm({ ...newItemForm, supplier: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewItemOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Cadastrar Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Registrar Transação de Estoque Modal */}
      {isTransOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Movimentar Estoque (Registros de Lotes)</h2>
              <button onClick={() => setIsTransOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Selecione o Insumo no Depósito *</label>
                <select
                  required
                  value={transForm.itemId}
                  onChange={(e) => setTransForm({ ...transForm, itemId: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                >
                  <option value="">-- Selecione o Almoxarifado --</option>
                  {stock.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity} {item.unit} restantes)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tipo Movimentação *</label>
                  <select
                    value={transForm.type}
                    onChange={(e) => setTransForm({ ...transForm, type: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="Entrada">Entrada (Compra/Reabastecimento)</option>
                    <option value="Saída">Saída (Consumo/Uso)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Quantidade *</label>
                  <input
                    type="number"
                    required
                    placeholder="Quantidade"
                    value={transForm.quantity}
                    onChange={(e) => setTransForm({ ...transForm, quantity: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Responsável Supervisor *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: Carlos Henrique"
                  value={transForm.responsible}
                  onChange={(e) => setTransForm({ ...transForm, responsible: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Notas / Justificativa</label>
                <textarea
                  placeholder="EX: NF 1404 cooperativa"
                  value={transForm.notes}
                  onChange={(e) => setTransForm({ ...transForm, notes: e.target.value })}
                  rows={2}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransOpen(false)}
                  className="border border-slate-300 rounded px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Voltar
                </button>
                <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 font-bold transition">
                  Aplicar Lote
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
