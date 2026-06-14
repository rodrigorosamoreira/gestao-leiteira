/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Animal,
  ReproductionRecord,
  LeiteRecord,
  ControlLeiteiroRecord,
  Diet,
  StockItem,
  StockTransaction,
  Medication,
  SanitaryRecord,
  FeedConsumption,
  FinancialTransaction,
  PasturePaddock,
  Employee,
  ServiceOrder
} from "../types";
import {
  INITIAL_ANIMALS,
  INITIAL_REPRODUCTION_RECORDS,
  INITIAL_LEITE_RECORDS,
  INITIAL_CONTROL_LEITEIRO,
  INITIAL_DIETS,
  INITIAL_STOCK,
  INITIAL_MEDICATIONS,
  INITIAL_SANITARY_RECORDS,
  INITIAL_FEED_CONSUMPTION,
  INITIAL_FINANCIAL_TRANSACTIONS,
  INITIAL_PASTURE_PADDOCKS,
  INITIAL_EMPLOYEES,
  INITIAL_SERVICE_ORDERS
} from "../data/mockData";

interface FarmContextType {
  animals: Animal[];
  reproductionRecords: ReproductionRecord[];
  leiteRecords: LeiteRecord[];
  controlLeiteiro: ControlLeiteiroRecord[];
  diets: Diet[];
  stock: StockItem[];
  medications: Medication[];
  sanitaryRecords: SanitaryRecord[];
  feedConsumption: FeedConsumption[];
  financialTransactions: FinancialTransaction[];
  pasturePaddocks: PasturePaddock[];
  employees: Employee[];
  serviceOrders: ServiceOrder[];
  stockHistory: StockTransaction[];

  // Operations
  addAnimal: (animal: Omit<Animal, "id">) => void;
  updateAnimal: (id: string, animal: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;

  addReproductionRecord: (record: Omit<ReproductionRecord, "id">) => void;
  deleteReproductionRecord: (id: string) => void;

  addLeiteRecord: (record: Omit<LeiteRecord, "id">) => void;
  deleteLeiteRecord: (id: string) => void;

  addControlLeiteiro: (record: Omit<ControlLeiteiroRecord, "id">) => void;
  deleteControlLeiteiro: (id: string) => void;
  
  addDiet: (diet: Omit<Diet, "id">) => void;
  updateDiet: (id: string, diet: Partial<Diet>) => void;
  deleteDiet: (id: string) => void;

  addStockItem: (item: Omit<StockItem, "id">) => void;
  deleteStockItem: (id: string) => void;
  transactStock: (itemId: string, qty: number, type: "Entrada" | "Saída" | "Ajuste", operator: string, notes?: string) => void;
  addStockTransaction: (
    itemId: string,
    type: "Entrada" | "Saída" | "Ajuste",
    quantity: number,
    responsible: string,
    notes?: string
  ) => void;

  addMedication: (med: Omit<Medication, "id">) => void;
  deleteMedication: (id: string) => void;

  addSanitaryRecord: (rec: Omit<SanitaryRecord, "id">) => void;
  deleteSanitaryRecord: (id: string) => void;

  addFeedConsumption: (cons: Omit<FeedConsumption, "id">) => void;
  deleteFeedConsumption: (id: string) => void;
  
  addFinancialTransaction: (tx: Omit<FinancialTransaction, "id">) => void;
  deleteFinancialTransaction: (id: string) => void;

  updatePaddock: (id: string, pad: Partial<PasturePaddock>) => void;
  updatePasturePaddock: (id: string, pad: Partial<PasturePaddock>) => void;
  
  addEmployee: (emp: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  addServiceOrder: (so: Omit<ServiceOrder, "id">) => void;
  updateServiceOrder: (id: string, so: Partial<ServiceOrder>) => void;
  deleteServiceOrder: (id: string) => void;

  clearAllData: () => void;
  confirmAction: (options: { title: string; message: string; onConfirm: () => void }) => void;

  // Utility helpers
  getCurrentWithholdingAlerts: () => { animalId: string; number: string; name: string; dateUntil: string }[];
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [reproductionRecords, setReproductionRecords] = useState<ReproductionRecord[]>([]);
  const [leiteRecords, setLeiteRecords] = useState<LeiteRecord[]>([]);
  const [controlLeiteiro, setControlLeiteiro] = useState<ControlLeiteiroRecord[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [stockHistory, setStockHistory] = useState<StockTransaction[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [sanitaryRecords, setSanitaryRecords] = useState<SanitaryRecord[]>([]);
  const [feedConsumption, setFeedConsumption] = useState<FeedConsumption[]>([]);
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [pasturePaddocks, setPasturePaddocks] = useState<PasturePaddock[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const confirmAction = (options: { title: string; message: string; onConfirm: () => void }) => {
    setConfirmState({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: () => {
        options.onConfirm();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Load from LocalStorage or Load mock on first start (Offline capabilities simulation)
  useEffect(() => {
    const localAnimals = localStorage.getItem("rumileite_animals");
    if (localAnimals) {
      setAnimals(JSON.parse(localAnimals));
      setReproductionRecords(JSON.parse(localStorage.getItem("rumileite_repro") || "[]"));
      setLeiteRecords(JSON.parse(localStorage.getItem("rumileite_leite") || "[]"));
      setControlLeiteiro(JSON.parse(localStorage.getItem("rumileite_control") || "[]"));
      setDiets(JSON.parse(localStorage.getItem("rumileite_diets") || "[]"));
      setStock(JSON.parse(localStorage.getItem("rumileite_stock") || "[]"));
      setStockHistory(JSON.parse(localStorage.getItem("rumileite_stock_history") || "[]"));
      setMedications(JSON.parse(localStorage.getItem("rumileite_meds") || "[]"));
      setSanitaryRecords(JSON.parse(localStorage.getItem("rumileite_sanitary") || "[]"));
      setFeedConsumption(JSON.parse(localStorage.getItem("rumileite_feedcons") || "[]"));
      setFinancialTransactions(JSON.parse(localStorage.getItem("rumileite_financial") || "[]"));
      setPasturePaddocks(JSON.parse(localStorage.getItem("rumileite_pastures") || "[]"));
      setEmployees(JSON.parse(localStorage.getItem("rumileite_employees") || "[]"));
      setServiceOrders(JSON.parse(localStorage.getItem("rumileite_so") || "[]"));
    } else {
      // Set Initial States
      setAnimals(INITIAL_ANIMALS);
      setReproductionRecords(INITIAL_REPRODUCTION_RECORDS);
      setLeiteRecords(INITIAL_LEITE_RECORDS);
      setControlLeiteiro(INITIAL_CONTROL_LEITEIRO);
      setDiets(INITIAL_DIETS);
      setStock(INITIAL_STOCK);
      
      const defaultHistory: StockTransaction[] = [
        {
          id: "tx_st_1",
          itemId: "st_2",
          itemName: "Farelo de Soja Ensacado",
          type: "Entrada",
          quantity: 1200,
          operator: "Mateus Assis",
          date: "2026-06-08",
          notes: "Entrega de cooperativa, lote COOP_46"
        },
        {
          id: "tx_st_2",
          itemId: "st_5",
          itemName: "Mastitec Seringa Mamária",
          type: "Saída",
          quantity: 1,
          operator: "José Roberto de Sousa",
          date: "2026-06-10",
          notes: "Aplicação de mastite vaca Baunilha"
        }
      ];
      setStockHistory(defaultHistory);

      setMedications(INITIAL_MEDICATIONS);
      setSanitaryRecords(INITIAL_SANITARY_RECORDS);
      setFeedConsumption(INITIAL_FEED_CONSUMPTION);
      setFinancialTransactions(INITIAL_FINANCIAL_TRANSACTIONS);
      setPasturePaddocks(INITIAL_PASTURE_PADDOCKS);
      setEmployees(INITIAL_EMPLOYEES);
      setServiceOrders(INITIAL_SERVICE_ORDERS);

      // Save Initial States To Storage
      localStorage.setItem("rumileite_animals", JSON.stringify(INITIAL_ANIMALS));
      localStorage.setItem("rumileite_repro", JSON.stringify(INITIAL_REPRODUCTION_RECORDS));
      localStorage.setItem("rumileite_leite", JSON.stringify(INITIAL_LEITE_RECORDS));
      localStorage.setItem("rumileite_control", JSON.stringify(INITIAL_CONTROL_LEITEIRO));
      localStorage.setItem("rumileite_diets", JSON.stringify(INITIAL_DIETS));
      localStorage.setItem("rumileite_stock", JSON.stringify(INITIAL_STOCK));
      localStorage.setItem("rumileite_stock_history", JSON.stringify(defaultHistory));
      localStorage.setItem("rumileite_meds", JSON.stringify(INITIAL_MEDICATIONS));
      localStorage.setItem("rumileite_sanitary", JSON.stringify(INITIAL_SANITARY_RECORDS));
      localStorage.setItem("rumileite_feedcons", JSON.stringify(INITIAL_FEED_CONSUMPTION));
      localStorage.setItem("rumileite_financial", JSON.stringify(INITIAL_FINANCIAL_TRANSACTIONS));
      localStorage.setItem("rumileite_pastures", JSON.stringify(INITIAL_PASTURE_PADDOCKS));
      localStorage.setItem("rumileite_employees", JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem("rumileite_so", JSON.stringify(INITIAL_SERVICE_ORDERS));
    }
  }, []);

  // Save changes wrapper helpers
  const saveState = (key: string, data: any, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    stateSetter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Animals operations
  const addAnimal = (newAnim: Omit<Animal, "id">) => {
    const item: Animal = { ...newAnim, id: "animal_" + Date.now() };
    const updated = [...animals, item];
    saveState("rumileite_animals", updated, setAnimals);
  };

  const updateAnimal = (id: string, partial: Partial<Animal>) => {
    const updated = animals.map((a) => (a.id === id ? { ...a, ...partial } : a));
    saveState("rumileite_animals", updated, setAnimals);
  };

  const deleteAnimal = (id: string) => {
    const updated = animals.filter((a) => a.id !== id);
    saveState("rumileite_animals", updated, setAnimals);
  };

  // Reproduction
  const addReproductionRecord = (newRep: Omit<ReproductionRecord, "id">) => {
    const record: ReproductionRecord = { ...newRep, id: "repro_" + Date.now() };
    const updated = [...reproductionRecords, record];
    saveState("rumileite_repro", updated, setReproductionRecords);

    // Side-effects on animal state (Gestational values)
    if (newRep.type === "Inseminação" || newRep.type === "Monta Natural" || newRep.type === "Monta canônica") {
      updateAnimal(newRep.animalId, {
        gestationStatus: "Inseminada",
        lastInseminationDate: newRep.date
      });
    } else if (newRep.type === "Diagnóstico Gestação") {
      updateAnimal(newRep.animalId, {
        gestationStatus: newRep.diagnosisResult === "Prenha" ? "Confirmada" : "Vazia"
      });
    } else if (newRep.type === "Parto") {
      const motherCow = animals.find(a => a.id === newRep.animalId);
      updateAnimal(newRep.animalId, {
        gestationStatus: "Vazia",
        lastPartumDate: newRep.date,
        category: "Vaca em lactação", // Moves Heifers or Dry Cows into Lactating state
        lactationCount: (motherCow?.lactationCount || 0) + 1
      });
      // Automatically register a calf!
      addAnimal({
        number: newRep.calfNumber || ("BEZ_" + String(Date.now()).slice(-4)),
        name: newRep.calfName || (newRep.partumSex === "Fêmea" ? "Filha de " + newRep.animalName : "Filho de " + newRep.animalName),
        sex: newRep.partumSex === "Fêmea" ? "F" : "M",
        breed: motherCow?.breed || "Girolando", // inherit breed from mother
        bloodGrade: motherCow?.bloodGrade || "Mestiço", // inherit blood grade from mother
        birthDate: newRep.date,
        weight: 35,
        category: newRep.partumSex === "Fêmea" ? "Bezerra" : "Touro",
        batch: "Bezerrário / Aleitamento",
        status: "Ativo",
        origin: "Nascido na Fazenda",
        gestationStatus: "Vazia",
        motherId: newRep.animalId,
        motherName: newRep.animalName,
        notes: "Nascimento via parto registrado em " + newRep.date
      });
    } else if (newRep.type === "Aborto") {
      updateAnimal(newRep.animalId, {
        gestationStatus: "Vazia",
        category: "Vaca em lactação" // goes back to empty lactating
      });
    }
  };

  // Milk Yields
  const addLeiteRecord = (newLeite: Omit<LeiteRecord, "id">) => {
    const record: LeiteRecord = { ...newLeite, id: "leite_" + Date.now() };
    const updated = [record, ...leiteRecords]; // latest first
    saveState("rumileite_leite", updated, setLeiteRecords);
  };

  const addControlLeiteiro = (newCtrl: Omit<ControlLeiteiroRecord, "id">) => {
    const record: ControlLeiteiroRecord = { ...newCtrl, id: "ctrl_" + Date.now() };
    const updated = [record, ...controlLeiteiro];
    saveState("rumileite_control", updated, setControlLeiteiro);
  };

  // Diets
  const addDiet = (newDiet: Omit<Diet, "id">) => {
    const record: Diet = { ...newDiet, id: "diet_" + Date.now() };
    const updated = [...diets, record];
    saveState("rumileite_diets", updated, setDiets);
  };

  const updateDiet = (id: string, partial: Partial<Diet>) => {
    const updated = diets.map((d) => (d.id === id ? { ...d, ...partial } : d));
    saveState("rumileite_diets", updated, setDiets);
  };

  // Stock
  const addStockItem = (newSt: Omit<StockItem, "id">) => {
    const record: StockItem = { ...newSt, id: "stock_" + Date.now() };
    const updated = [...stock, record];
    saveState("rumileite_stock", updated, setStock);
  };

  const transactStock = (itemId: string, qty: number, type: "Entrada" | "Saída" | "Ajuste", operator: string, notes?: string) => {
    const delta = type === "Entrada" ? qty : type === "Saída" ? -qty : qty;
    const updated = stock.map((it) => {
      if (it.id === itemId) {
        const newQty = Math.max(0, it.quantity + delta);
        return { ...it, quantity: newQty };
      }
      return it;
    });
    saveState("rumileite_stock", updated, setStock);
  };

  const addStockTransaction = (
    itemId: string,
    type: "Entrada" | "Saída" | "Ajuste",
    quantity: number,
    responsible: string,
    notes?: string
  ) => {
    const delta = type === "Entrada" ? quantity : type === "Saída" ? -quantity : quantity;
    const item = stock.find((s) => s.id === itemId);
    const itemName = item ? item.name : "Item";

    const updatedStock = stock.map((it) => {
      if (it.id === itemId) {
        const newQty = Math.max(0, it.quantity + delta);
        return { ...it, quantity: newQty };
      }
      return it;
    });
    saveState("rumileite_stock", updatedStock, setStock);

    const newTx: StockTransaction = {
      id: "tx_st_" + Date.now(),
      itemId,
      itemName,
      type,
      quantity,
      operator: responsible,
      date: new Date().toISOString().split("T")[0],
      notes
    };

    const newTxWithResp = {
      ...newTx,
      responsible
    } as any;

    const updatedHistory = [newTxWithResp, ...stockHistory];
    saveState("rumileite_stock_history", updatedHistory, setStockHistory);
  };

  // Medications and Sanitary treatments
  const addMedication = (newMed: Omit<Medication, "id">) => {
    const record: Medication = { ...newMed, id: "med_" + Date.now() };
    const updated = [...medications, record];
    saveState("rumileite_meds", updated, setMedications);
  };

  const addSanitaryRecord = (newSan: Omit<SanitaryRecord, "id">) => {
    const record: SanitaryRecord = { ...newSan, id: "san_" + Date.now() };
    const updated = [record, ...sanitaryRecords];
    saveState("rumileite_sanitary", updated, setSanitaryRecords);

    // If it is a medicine transaction, consume stock
    if (newSan.medicationId) {
      // Find matching stock item
      const med = medications.find(m => m.id === newSan.medicationId);
      if (med) {
        const matchedStock = stock.find(st => st.name.toLowerCase().includes(med.commercialName.toLowerCase()) || st.name.toLowerCase().includes(med.activeIngredient.toLowerCase()));
        if (matchedStock) {
          transactStock(matchedStock.id, 1, "Saída", newSan.operator, `Aplicação sanitária em ${newSan.animalNumber}`);
        }
      }
    }
  };

  // Consumo alimentar
  const addFeedConsumption = (newCons: Omit<FeedConsumption, "id">) => {
    const record: FeedConsumption = { ...newCons, id: "fc_" + Date.now() };
    const updated = [record, ...feedConsumption];
    saveState("rumileite_feedcons", updated, setFeedConsumption);

    // Consume silage/stock accordingly
    const matchedSilage = stock.find(s => s.name.toLowerCase().includes("silagem"));
    if (matchedSilage && newCons.silageKG) {
      transactStock(matchedSilage.id, newCons.silageKG, "Saída", "Automático Alimentação", `Dieta Lote: ${newCons.lotName}`);
    }
    const matchedRacao = stock.find(s => s.name.toLowerCase().includes("ração") || s.name.toLowerCase().includes("concentrado"));
    if (matchedRacao && newCons.grainFeedKG) {
      transactStock(matchedRacao.id, newCons.grainFeedKG, "Saída", "Automático Alimentação", `Dieta Lote: ${newCons.lotName}`);
    }
  };

  // Financial transactions
  const addFinancialTransaction = (newTx: Omit<FinancialTransaction, "id">) => {
    const record: FinancialTransaction = { ...newTx, id: "tx_" + Date.now() };
    const updated = [record, ...financialTransactions];
    saveState("rumileite_financial", updated, setFinancialTransactions);
  };

  const deleteFinancialTransaction = (id: string) => {
    const updated = financialTransactions.filter(tx => tx.id !== id);
    saveState("rumileite_financial", updated, setFinancialTransactions);
  };

  // Pastures update
  const updatePaddock = (id: string, partial: Partial<PasturePaddock>) => {
    const updated = pasturePaddocks.map((p) => (p.id === id ? { ...p, ...partial } : p));
    saveState("rumileite_pastures", updated, setPasturePaddocks);
  };

  const updatePasturePaddock = (id: string, partial: Partial<PasturePaddock>) => {
    updatePaddock(id, partial);
  };

  // Employees directory
  const addEmployee = (newEmp: Omit<Employee, "id">) => {
    const record: Employee = { ...newEmp, id: "emp_" + Date.now() };
    const updated = [...employees, record];
    saveState("rumileite_employees", updated, setEmployees);
  };

  const updateEmployee = (id: string, partial: Partial<Employee>) => {
    const updated = employees.map((e) => (e.id === id ? { ...e, ...partial } : e));
    saveState("rumileite_employees", updated, setEmployees);
  };

  // Service Orders
  const addServiceOrder = (newSO: Omit<ServiceOrder, "id">) => {
    const record: ServiceOrder = { ...newSO, id: "so_" + Date.now() };
    const updated = [record, ...serviceOrders];
    saveState("rumileite_so", updated, setServiceOrders);
  };

  const updateServiceOrder = (id: string, partial: Partial<ServiceOrder>) => {
    const updated = serviceOrders.map((so) => (so.id === id ? { ...so, ...partial } : so));
    saveState("rumileite_so", updated, setServiceOrders);
  };

  const deleteServiceOrder = (id: string) => {
    const updated = serviceOrders.filter(so => so.id !== id);
    saveState("rumileite_so", updated, setServiceOrders);
  };

  const deleteReproductionRecord = (id: string) => {
    const updated = reproductionRecords.filter(r => r.id !== id);
    saveState("rumileite_repro", updated, setReproductionRecords);
  };

  const deleteLeiteRecord = (id: string) => {
    const updated = leiteRecords.filter(r => r.id !== id);
    saveState("rumileite_leite", updated, setLeiteRecords);
  };

  const deleteControlLeiteiro = (id: string) => {
    const updated = controlLeiteiro.filter(r => r.id !== id);
    saveState("rumileite_control", updated, setControlLeiteiro);
  };

  const deleteDiet = (id: string) => {
    const updated = diets.filter(d => d.id !== id);
    saveState("rumileite_diets", updated, setDiets);
  };

  const deleteStockItem = (id: string) => {
    const updated = stock.filter(s => s.id !== id);
    saveState("rumileite_stock", updated, setStock);
    // Also remove respective stock transactions for cleanliness
    const updatedHistory = stockHistory.filter(h => h.itemId !== id);
    saveState("rumileite_stock_history", updatedHistory, setStockHistory);
  };

  const deleteMedication = (id: string) => {
    const updated = medications.filter(m => m.id !== id);
    saveState("rumileite_meds", updated, setMedications);
  };

  const deleteSanitaryRecord = (id: string) => {
    const updated = sanitaryRecords.filter(r => r.id !== id);
    saveState("rumileite_sanitary", updated, setSanitaryRecords);
  };

  const deleteFeedConsumption = (id: string) => {
    const updated = feedConsumption.filter(c => c.id !== id);
    saveState("rumileite_feedcons", updated, setFeedConsumption);
  };

  const deleteEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    saveState("rumileite_employees", updated, setEmployees);
  };

  const clearAllData = () => {
    saveState("rumileite_animals", [], setAnimals);
    saveState("rumileite_repro", [], setReproductionRecords);
    saveState("rumileite_leite", [], setLeiteRecords);
    saveState("rumileite_control", [], setControlLeiteiro);
    saveState("rumileite_diets", [], setDiets);
    saveState("rumileite_stock", [], setStock);
    saveState("rumileite_stock_history", [], setStockHistory);
    saveState("rumileite_meds", [], setMedications);
    saveState("rumileite_sanitary", [], setSanitaryRecords);
    saveState("rumileite_feedcons", [], setFeedConsumption);
    saveState("rumileite_financial", [], setFinancialTransactions);
    saveState("rumileite_employees", [], setEmployees);
    saveState("rumileite_so", [], setServiceOrders);
    
    // For pastures, let's keep the paddocks but clear current cow count and reset states for standard operational starting point
    const resetPaddocks = pasturePaddocks.map(p => ({
      ...p,
      stockingRate: 0,
      occupancyDays: 0,
      currentCowCount: 0,
      status: "Descanso" as const
    }));
    saveState("rumileite_pastures", resetPaddocks, setPasturePaddocks);
  };

  // Calculates active milk/meat withdrawal periods
  // This satisfies: "Bloqueio automático de venda de leite durante período de carência."
  const getCurrentWithholdingAlerts = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const alerts: { animalId: string; number: string; name: string; dateUntil: string }[] = [];

    sanitaryRecords.forEach((rec) => {
      if (rec.withholdingActiveUntil && rec.blockingMilkSale) {
        if (rec.withholdingActiveUntil >= todayStr) {
          alerts.push({
            animalId: rec.animalId,
            number: rec.animalNumber,
            name: rec.animalName,
            dateUntil: rec.withholdingActiveUntil
          });
        }
      }
    });
    return alerts;
  };

  return (
    <FarmContext.Provider
      value={{
        animals,
        reproductionRecords,
        leiteRecords,
        controlLeiteiro,
        diets,
        stock,
        medications,
        sanitaryRecords,
        feedConsumption,
        financialTransactions,
        pasturePaddocks,
        employees,
        serviceOrders,
        stockHistory,

        addAnimal,
        updateAnimal,
        deleteAnimal,
        addReproductionRecord,
        deleteReproductionRecord,
        addLeiteRecord,
        deleteLeiteRecord,
        addControlLeiteiro,
        deleteControlLeiteiro,
        addDiet,
        updateDiet,
        deleteDiet,
        addStockItem,
        deleteStockItem,
        transactStock,
        addStockTransaction,
        addMedication,
        deleteMedication,
        addSanitaryRecord,
        deleteSanitaryRecord,
        addFeedConsumption,
        deleteFeedConsumption,
        addFinancialTransaction,
        deleteFinancialTransaction,
        updatePaddock,
        updatePasturePaddock,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addServiceOrder,
        updateServiceOrder,
        deleteServiceOrder,
        clearAllData,
        getCurrentWithholdingAlerts,
        confirmAction
      }}
    >
      {children}
      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-lg">
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">{confirmState.title}</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium animate-none">
              {confirmState.message}
            </p>
            
            <div className="flex justify-end gap-2.5 pt-1.5">
              <button
                type="button"
                onClick={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmState.onConfirm();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error("useFarm deve ser usado com um FarmProvider");
  }
  return context;
};
