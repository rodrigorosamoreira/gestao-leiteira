/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Animal {
  id: string;
  number: string; // Número do animal (brinco)
  name: string;
  electronicEarring?: string; // Brinco eletrônico / RFID
  sex: "M" | "F";
  breed: string; // Raça: Girolando, Gir, Holandês, Jersey, etc.
  bloodGrade: string; // Grau de sangue: 5/8 Girolando, 3/4 Girolando, P.O, etc.
  birthDate: string;
  weight: number; // kg
  category: "Bezerra" | "Novilha" | "Vaca em lactação" | "Vaca seca" | "Touro" | "Descarte";
  batch: string; // Lote (Lote 1 - Alta, Lote 2 - Baixa, Secas, Novilhas...)
  photo?: string;
  origin: "Nascido na Fazenda" | "Comprado de Terceiros";
  status: "Ativo" | "Vendido" | "Morto" | "Descartado";
  lactationCount?: number;
  lastPartumDate?: string;
  lastInseminationDate?: string;
  gestationStatus: "Vazia" | "Confirmada" | "Inseminada";
  fatherId?: string;
  fatherName?: string;
  motherId?: string;
  motherName?: string;
  paternalGrandfather?: string;
  paternalGrandmother?: string;
  maternalGrandfather?: string;
  maternalGrandmother?: string;
  notes?: string;
}

export interface ReproductionRecord {
  id: string;
  animalId: string;
  animalNumber: string;
  animalName: string;
  type: "Cio" | "Inseminação" | "Monta canônica" | "Monta Natural" | "Diagnóstico Gestação" | "Parto" | "Aborto" | "Repetição de Cio";
  date: string;
  bull?: string; // Touro / Sêmen
  semenCode?: string; // Código do sêmen utilizado
  inseminator?: string; // Técnico inseminador
  diagnosisResult?: "Vazia" | "Prenha";
  partumType?: "Normal" | "Distócico" | "Cesárea";
  partumSex?: "Macho" | "Fêmea" | "Gêmeos";
  calfName?: string;
  calfNumber?: string;
  observations?: string;
  alerts?: {
    diagnosisDate?: string;
    dryingExpectedDate?: string;
    prePartumExpectedDate?: string;
    expectedPartumDate?: string;
  };
}

export interface LeiteRecord {
  id: string;
  animalId: string;
  animalNumber: string;
  animalName: string;
  batch: string;
  date: string;
  morningValue: number; // Litros ordenha manhã
  afternoonValue: number; // Litros ordenha tarde
  nightValue: number; // Litros ordenha noite
  totalValue: number; // Litros total diário
  daysInLactation?: number;
}

export interface ControlLeiteiroRecord {
  id: string;
  date: string;
  ccs: number; // Contagem de Células Somáticas (x1000/ml)
  cbt: number; // Contagem Bacteriana Total (UFC/ml)
  fatPct: number; // % Gordura
  proteinPct: number; // % Proteína
  lactosePct: number; // % Lactose
  ureaValue: number; // mg/dL Uréia
  sampleCount: number; // Quantidade de vacas amostradas
}

export interface Ingredient {
  name: string;
  weightKG: number;
  dryMatterPct: number; // % Matéria Seca (MS)
  crudeProteinPct: number; // % Proteína Bruta (PB)
  ndtPct: number; // % Nutrientes Digestíveis Totais (NDT)
  costPerKG: number; // R$ por KG original
}

export interface Diet {
  id: string;
  name: string;
  lotName: string;
  ingredients: Ingredient[];
  msKgPrevisto: number; // Consumo previsto MS (kg/vaca/dia)
  pbPctPrevisto: number; // % PB esperada na dieta total
  ndtPctPrevisto: number; // % NDT esperado na dieta total
  costPerAnimalDay: number; // Custo previsto por animal/dia
}

export interface StockItem {
  id: string;
  name: string;
  type: "Rações" | "Medicamentos" | "Vacinas" | "Sêmen" | "Materiais";
  quantity: number;
  unit: "kg" | "frascos" | "doses" | "unidades";
  batch: string;
  expiryDate: string;
  minLimit: number; // Alerta de estoque crítico
  location: string; // Galpão A, Geladeira, Depósito
}

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: "Entrada" | "Saída" | "Ajuste";
  quantity: number;
  date: string;
  operator: string;
  notes?: string;
}

export interface Medication {
  id: string;
  commercialName: string;
  activeIngredient: string;
  batch: string;
  expiryDate: string;
  milkWithholdingDays: number; // Dias de carência para leite
  meatWithholdingDays: number; // Dias de carência para carne
}

export interface SanitaryRecord {
  id: string;
  animalId: string;
  animalNumber: string;
  animalName: string;
  date: string;
  type: "Vacinação" | "Vermifugação" | "Mastite" | "Casqueamento" | "Tratamento" | "Cirurgia";
  description: string; // Ex: Tratamento de Mastite Clínica com Mastijet
  medicationId?: string;
  medicationName?: string;
  withholdingActiveUntil?: string; // Data fim da carência de leite
  withholdingMeatActiveUntil?: string; // Data fim da carência de carne
  blockingMilkSale: boolean; // Indica se bloqueia a venda do leite desta vaca atualmente
  operator: string;
  notes?: string;
}

export interface FeedConsumption {
  id: string;
  date: string;
  lotName: string;
  silageKG: number; // Silagem consumida real
  grainFeedKG: number; // Ração consumida real
  concentrateKG: number; // Concentrado real
  mineralSaltKG: number; // Sal mineral real
  cowsCount: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: "Receita" | "Despesa";
  category: 
    | "Venda de Leite"
    | "Venda de Animais"
    | "Venda de Esterco"
    | "Outras Receitas"
    | "Ração"
    | "Medicamentos"
    | "Funcionários"
    | "Energia"
    | "Combustível"
    | "Manutenção"
    | "Impostos"
    | "Custos Administrativos"
    | "Outros";
  costCenter: "Ordenha" | "Reprodução" | "Nutrição" | "Máquinas" | "Administração";
  amount: number;
  description: string;
}

export interface PasturePaddock {
  id: string;
  name: string; // Ex: Piquete 01, Piquete 02
  area: number; // hectares
  grassType: string; // Brachiaria, Mombaça, Tanzânia, Tifton 85
  stockingRate: number; // U.A. / ha (Unidade Animal por hectare)
  occupancyDays: number; // Dias ocupados
  restDays: number; // Dias descansados de meta
  status: "Rotacionado" | "Ocupado" | "Descanso" | "Diferido";
  currentCowCount: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string; // Ordenhador, Tratorista, Veterinário, Administrador...
  salary: number; // R$
  schedule: string; // Ex: 6x1, Escala de Ordenhas
  activities: string[];
}

export interface ServiceOrder {
  id: string;
  title: string;
  type: "Vacinação" | "Inseminação" | "Casqueamento" | "Tratamentos" | "Manutenção" | "Outros";
  status: "Pendente" | "Em Andamento" | "Concluído" | "Atrasado";
  dateLimit: string;
  assignedToEmployeeId?: string;
  assignedToEmployeeName?: string;
  description: string;
  relatedAnimalId?: string;
  relatedAnimalNumber?: string;
}
