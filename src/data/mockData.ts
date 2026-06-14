/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Animal,
  ReproductionRecord,
  LeiteRecord,
  ControlLeiteiroRecord,
  Diet,
  StockItem,
  Medication,
  SanitaryRecord,
  FeedConsumption,
  FinancialTransaction,
  PasturePaddock,
  Employee,
  ServiceOrder
} from "../types";

export const INITIAL_ANIMALS: Animal[] = [
  {
    id: "cow_1",
    number: "1004",
    name: "Estrela Milionária",
    electronicEarring: "BR994193850",
    sex: "F",
    breed: "Girolando",
    bloodGrade: "5/8 Girolando",
    birthDate: "2019-04-12",
    weight: 580,
    category: "Vaca em lactação",
    batch: "Lote 1 - Alta Produção",
    origin: "Nascido na Fazenda",
    status: "Ativo",
    lactationCount: 2,
    lastPartumDate: "2026-03-02",
    lastInseminationDate: "2026-05-18",
    gestationStatus: "Inseminada",
    fatherName: "Teatro da Silvania (GIR)",
    motherName: "Milionaria 3/4 (Holstein)",
    paternalGrandfather: "Caju de Brasília",
    notes: "Grande campeã de bacia leiteira da região. Alta persistência de lactação."
  },
  {
    id: "cow_2",
    number: "2201",
    name: "Baronesa",
    electronicEarring: "BR39209581",
    sex: "F",
    breed: "Girolando",
    bloodGrade: "3/4 Girolando",
    birthDate: "2020-08-25",
    weight: 620,
    category: "Vaca em lactação",
    batch: "Lote 1 - Alta Produção",
    origin: "Nascido na Fazenda",
    status: "Ativo",
    lactationCount: 3,
    lastPartumDate: "2026-01-15",
    lastInseminationDate: "2026-03-10",
    gestationStatus: "Confirmada",
    motherName: "Duquesa IV",
    fatherName: "Modelo TE de Brasília",
    notes: "Diagnóstico gestacional confirmado positivo. Parto estimado para Dezembro."
  },
  {
    id: "cow_3",
    number: "3051",
    name: "Baunilha",
    electronicEarring: "BR8829581",
    sex: "F",
    breed: "Holandês",
    bloodGrade: "P.O",
    birthDate: "2021-03-10",
    weight: 640,
    category: "Vaca em lactação",
    batch: "Lote 1 - Alta Produção",
    origin: "Comprado de Terceiros",
    status: "Ativo",
    lactationCount: 1,
    lastPartumDate: "2026-04-05",
    gestationStatus: "Vazia",
    notes: "Alta produtora. Sensível ao estresse térmico. Necessita aspersão na sala de espera."
  },
  {
    id: "cow_4",
    number: "4045",
    name: "Cajuína",
    electronicEarring: "BR12495812",
    sex: "F",
    breed: "Gir Leiteiro",
    bloodGrade: "P.O",
    birthDate: "2018-05-18",
    weight: 490,
    category: "Vaca seca",
    batch: "Vacas Secas",
    origin: "Nascido na Fazenda",
    status: "Ativo",
    lactationCount: 4,
    lastPartumDate: "2025-05-20",
    lastInseminationDate: "2025-09-12",
    gestationStatus: "Confirmada",
    fatherName: "Radar dos Poções",
    motherName: "Amêndoa da Silvania",
    notes: "Afastada e seca para o pré-parto programado em Junho/Julho. Tratamento de teto preventivo realizado."
  },
  {
    id: "cow_5",
    number: "5011",
    name: "Moema",
    electronicEarring: "BR72349582",
    sex: "F",
    breed: "Girolando",
    bloodGrade: "5/8 Girolando",
    birthDate: "2023-11-01",
    weight: 380,
    category: "Novilha",
    batch: "Novilhas de Recria",
    origin: "Nascido na Fazenda",
    status: "Ativo",
    gestationStatus: "Vazia",
    notes: "Idade reprodutiva se aproximando. Iniciar protocolo de IATF no próximo mês assim que atingir 390kg."
  },
  {
    id: "cow_6",
    number: "6120",
    name: "Pipoca",
    electronicEarring: "",
    sex: "F",
    breed: "Jersey",
    bloodGrade: "P.O",
    birthDate: "2025-10-15",
    weight: 125,
    category: "Bezerra",
    batch: "Bezerrário / Aleitamento",
    origin: "Nascido na Fazenda",
    status: "Ativo",
    gestationStatus: "Vazia",
    notes: "Sendo alimentada com colostro no início, agora na dieta líquida + farelo inicial."
  },
  {
    id: "bull_1",
    number: "0001",
    name: "Rajado Shottle",
    electronicEarring: "BR00201958",
    sex: "M",
    breed: "Holandês",
    bloodGrade: "P.O",
    birthDate: "2017-02-12",
    weight: 980,
    category: "Touro",
    batch: "Touros / Reprodutores",
    origin: "Comprado de Terceiros",
    status: "Ativo",
    gestationStatus: "Vazia",
    notes: "Touro de alta linhagem genômica. Usado para monta natural controlada nas novilhas de repasse."
  }
];

export const INITIAL_REPRODUCTION_RECORDS: ReproductionRecord[] = [
  {
    id: "rep_1",
    animalId: "cow_2",
    animalNumber: "2201",
    animalName: "Baronesa",
    type: "Inseminação",
    date: "2026-03-10",
    semenCode: "GI0451",
    bull: "Urânio da Silvania",
    inseminator: "José Roberto (Veterinário)",
    observations: "Palheta de sêmen sexado de fêmea."
  },
  {
    id: "rep_2",
    animalId: "cow_2",
    animalNumber: "2201",
    animalName: "Baronesa",
    type: "Diagnóstico Gestação",
    date: "2026-04-10",
    diagnosisResult: "Prenha",
    inseminator: "José Roberto (Veterinário)",
    observations: "Ultrassonografia confirma prenhez de 30 dias. Útero saudável.",
    alerts: {
      diagnosisDate: "2026-04-10",
      dryingExpectedDate: "2026-10-15",
      prePartumExpectedDate: "2026-11-15",
      expectedPartumDate: "2026-12-15"
    }
  },
  {
    id: "rep_3",
    animalId: "cow_1",
    animalNumber: "1004",
    animalName: "Estrela Milionária",
    type: "Parto",
    date: "2026-03-02",
    partumType: "Normal",
    partumSex: "Fêmea",
    observations: "Nascimento saudável da bezerra 'Pipoca II'. Mãe limpou placenta bem."
  },
  {
    id: "rep_4",
    animalId: "cow_1",
    animalNumber: "1004",
    animalName: "Estrela Milionária",
    type: "Cio",
    date: "2026-05-15",
    observations: "Cio verificado às 06h: montando em outras vacas, inquietação e muco cristalino."
  },
  {
    id: "rep_5",
    animalId: "cow_1",
    animalNumber: "1004",
    animalName: "Estrela Milionária",
    type: "Inseminação",
    date: "2026-05-18",
    semenCode: "H0195",
    bull: "Shottle Gold",
    inseminator: "Mateus Assis",
    observations: "Inseminação artificial executada conforme protocolo do ciclo."
  },
  {
    id: "rep_6",
    animalId: "cow_4",
    animalNumber: "4045",
    animalName: "Cajuína",
    type: "Inseminação",
    date: "2025-09-12",
    semenCode: "GI1095",
    bull: "Sansão da Silvania",
    inseminator: "José Roberto (Veterinário)",
    observations: "Inseminada em estro natural."
  },
  {
    id: "rep_7",
    animalId: "cow_4",
    animalNumber: "4045",
    animalName: "Cajuína",
    type: "Diagnóstico Gestação",
    date: "2025-10-15",
    diagnosisResult: "Prenha",
    inseminator: "José Roberto (Veterinário)",
    observations: "Gravidez precoce confirmada por toque retal aos 33 dias.",
    alerts: {
      diagnosisDate: "2025-10-15",
      dryingExpectedDate: "2026-04-18",
      prePartumExpectedDate: "2026-05-18",
      expectedPartumDate: "2026-06-18"
    }
  }
];

export const INITIAL_LEITE_RECORDS: LeiteRecord[] = [
  // Cow 1 (1004) - Alta Produtora - registros recentes
  { id: "le_1", animalId: "cow_1", animalNumber: "1004", animalName: "Estrela Milionária", batch: "Lote 1 - Alta Produção", date: "2026-06-09", morningValue: 15.5, afternoonValue: 12.0, nightValue: 0.0, totalValue: 27.5 },
  { id: "le_2", animalId: "cow_1", animalNumber: "1004", animalName: "Estrela Milionária", batch: "Lote 1 - Alta Produção", date: "2026-06-10", morningValue: 16.0, afternoonValue: 13.0, nightValue: 0.0, totalValue: 29.0 },
  { id: "le_3", animalId: "cow_1", animalNumber: "1004", animalName: "Estrela Milionária", batch: "Lote 1 - Alta Produção", date: "2026-06-11", morningValue: 15.8, afternoonValue: 12.7, nightValue: 0.0, totalValue: 28.5 },

  // Cow 2 (2201) - Média
  { id: "le_4", animalId: "cow_2", animalNumber: "2201", animalName: "Baronesa", batch: "Lote 1 - Alta Produção", date: "2026-06-09", morningValue: 12.0, afternoonValue: 9.5, nightValue: 0.0, totalValue: 21.5 },
  { id: "le_5", animalId: "cow_2", animalNumber: "2201", animalName: "Baronesa", batch: "Lote 1 - Alta Produção", date: "2026-06-10", morningValue: 12.5, afternoonValue: 9.8, nightValue: 0.0, totalValue: 22.3 },
  { id: "le_6", animalId: "cow_2", animalNumber: "2201", animalName: "Baronesa", batch: "Lote 1 - Alta Produção", date: "2026-06-11", morningValue: 12.2, afternoonValue: 9.4, nightValue: 0.0, totalValue: 21.6 },

  // Cow 3 (3051) - Super alta (Holandês)
  { id: "le_7", animalId: "cow_3", animalNumber: "3051", animalName: "Baunilha", batch: "Lote 1 - Alta Produção", date: "2026-06-09", morningValue: 19.5, afternoonValue: 15.0, nightValue: 0.0, totalValue: 34.5 },
  { id: "le_8", animalId: "cow_3", animalNumber: "3051", animalName: "Baunilha", batch: "Lote 1 - Alta Produção", date: "2026-06-10", morningValue: 18.0, afternoonValue: 14.5, nightValue: 0.0, totalValue: 32.5 },
  { id: "le_9", animalId: "cow_3", animalNumber: "3051", animalName: "Baunilha", batch: "Lote 1 - Alta Produção", date: "2026-06-11", morningValue: 19.0, afternoonValue: 14.8, nightValue: 0.0, totalValue: 33.8 }
];

export const INITIAL_CONTROL_LEITEIRO: ControlLeiteiroRecord[] = [
  { id: "cl_1", date: "2026-03", ccs: 280, cbt: 12, fatPct: 3.82, proteinPct: 3.25, lactosePct: 4.60, ureaValue: 13.5, sampleCount: 15 },
  { id: "cl_2", date: "2026-04", ccs: 310, cbt: 15, fatPct: 3.75, proteinPct: 3.20, lactosePct: 4.55, ureaValue: 14.2, sampleCount: 18 },
  { id: "cl_3", date: "2026-05", ccs: 240, cbt: 9, fatPct: 3.90, proteinPct: 3.32, lactosePct: 4.65, ureaValue: 12.8, sampleCount: 20 },
  { id: "cl_4", date: "2026-06", ccs: 195, cbt: 8, fatPct: 3.95, proteinPct: 3.35, lactosePct: 4.68, ureaValue: 12.1, sampleCount: 21 }
];

export const INITIAL_DIETS: Diet[] = [
  {
    id: "dt_1",
    name: "Dieta Lactação - Alta Produção",
    lotName: "Lote 1 - Alta Produção",
    ingredients: [
      { name: "Silagem de Milho", weightKG: 32.0, dryMatterPct: 34, crudeProteinPct: 7.5, ndtPct: 68, costPerKG: 0.35 },
      { name: "Farelo de Soja 46%", weightKG: 3.2, dryMatterPct: 88, crudeProteinPct: 46.0, ndtPct: 81, costPerKG: 2.10 },
      { name: "Milho Moído (Fubá)", weightKG: 5.5, dryMatterPct: 87, crudeProteinPct: 8.5, ndtPct: 83, costPerKG: 1.25 },
      { name: "Núcleo Mineral Lactação", weightKG: 0.4, dryMatterPct: 98, crudeProteinPct: 0.0, ndtPct: 0.0, costPerKG: 4.50 },
      { name: "Bicarbonato de Sódio", weightKG: 0.15, dryMatterPct: 99, crudeProteinPct: 0.0, ndtPct: 0.0, costPerKG: 3.80 }
    ],
    msKgPrevisto: 19.8,
    pbPctPrevisto: 16.5,
    ndtPctPrevisto: 71.2,
    costPerAnimalDay: 27.25
  },
  {
    id: "dt_2",
    name: "Dieta Pré-Parto & Secura",
    lotName: "Vacas Secas",
    ingredients: [
      { name: "Silagem de Milho", weightKG: 20.0, dryMatterPct: 34, crudeProteinPct: 7.5, ndtPct: 68, costPerKG: 0.35 },
      { name: "Feno de Coastcross", weightKG: 5.0, dryMatterPct: 89, crudeProteinPct: 9.0, ndtPct: 55, costPerKG: 1.10 },
      { name: "Concentrado Pré-Parto (Aniônico)", weightKG: 2.0, dryMatterPct: 88, crudeProteinPct: 32.0, ndtPct: 73, costPerKG: 2.80 },
      { name: "Núcleo Aniônico", weightKG: 0.3, dryMatterPct: 98, crudeProteinPct: 0.0, ndtPct: 0.0, costPerKG: 6.20 }
    ],
    msKgPrevisto: 13.2,
    pbPctPrevisto: 14.1,
    ndtPctPrevisto: 62.5,
    costPerAnimalDay: 19.96
  }
];

export const INITIAL_STOCK: StockItem[] = [
  { id: "st_1", name: "Silagem de Milho Própria", type: "Rações", quantity: 45000, unit: "kg", batch: "SAFRA25", expiryDate: "2027-04-30", minLimit: 10000, location: "Trincheira Trincho-01" },
  { id: "st_2", name: "Farelo de Soja Ensacado", type: "Rações", quantity: 2400, unit: "kg", batch: "COOP_46", expiryDate: "2026-10-15", minLimit: 1000, location: "Galpão de Insumos" },
  { id: "st_3", name: "Milho Moído Fubá Granel", type: "Rações", quantity: 3200, unit: "kg", batch: "M_MOIDO", expiryDate: "2026-11-01", minLimit: 1500, location: "Silo Galpão" },
  { id: "st_4", name: "Soro de Leite Concentrado", type: "Rações", quantity: 380, unit: "kg", batch: "SR_RECEP", expiryDate: "2026-06-30", minLimit: 500, location: "Galpão de Insumos (Crítico)" },
  { id: "st_5", name: "Mastitec Seringa Mamária", type: "Medicamentos", quantity: 24, unit: "frascos", batch: "LOT_MS83", expiryDate: "2027-01-20", minLimit: 12, location: "Gabinete Veterinário" },
  { id: "st_6", name: "Borgamectina 3,5%", type: "Medicamentos", quantity: 6, unit: "frascos", batch: "BGM_0493", expiryDate: "2026-12-15", minLimit: 5, location: "Gabinete Veterinário" },
  { id: "st_7", name: "Vacina Febre Aftosa (Aftobob)", type: "Vacinas", quantity: 120, unit: "doses", batch: "AFT2026", expiryDate: "2027-05-30", minLimit: 30, location: "Geladeira Veterinária" },
  { id: "st_8", name: "Sêmen Gir da Silvania Radar", type: "Sêmen", quantity: 45, unit: "doses", batch: "RAD_095", expiryDate: "2035-12-31", minLimit: 10, location: "Botijão Criogênico A1" },
  { id: "st_9", name: "Luvas de Inseminador Descartáveis", type: "Materiais", quantity: 150, unit: "unidades", batch: "L_INS", expiryDate: "2029-12-31", minLimit: 50, location: "Armário de Ferramentas" }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  { id: "med_1", commercialName: "Mastitec Ceftiofur Seringa", activeIngredient: "Ceftiofur Sódico", batch: "LOT_MS83", expiryDate: "2027-01-20", milkWithholdingDays: 3, meatWithholdingDays: 2 },
  { id: "med_2", commercialName: "Borgamectina 3,5%", activeIngredient: "Ivermectina", batch: "BGM_0493", expiryDate: "2026-12-15", milkWithholdingDays: 45, meatWithholdingDays: 60 },
  { id: "med_3", commercialName: "Ocitocina Forte Vet", activeIngredient: "Ocitocina Sintética", batch: "OC74", expiryDate: "2027-04-12", milkWithholdingDays: 0, meatWithholdingDays: 0 },
  { id: "med_4", commercialName: "Flunex Antitoxínico", activeIngredient: "Flunixina Meglumina", batch: "FNX03", expiryDate: "2026-10-10", milkWithholdingDays: 1, meatWithholdingDays: 4 }
];

export const INITIAL_SANITARY_RECORDS: SanitaryRecord[] = [
  {
    id: "san_1",
    animalId: "cow_3",
    animalNumber: "3051",
    animalName: "Baunilha",
    date: "2026-06-10",
    type: "Mastite",
    description: "Identificado mastite clínica no teto posterior esquerdo. Teste Tamis positivo (grumos).",
    medicationId: "med_1",
    medicationName: "Mastitec Ceftiofur Seringa",
    withholdingActiveUntil: "2026-06-13",
    blockingMilkSale: true,
    operator: "Mateus Assis (Ordenhador)",
    notes: "Aplicado 1 seringa intra-mamária após esgotamento total. Animal isolado e marcado com tarja vermelha na perna."
  },
  {
    id: "san_2",
    animalId: "cow_1",
    animalNumber: "1004",
    animalName: "Estrela Milionária",
    date: "2026-05-10",
    type: "Vacinação",
    description: "Campanha nacional contra Febre Aftosa.",
    medicationName: "Aftobob",
    blockingMilkSale: false,
    operator: "Mateus Assis",
    notes: "Dose de 2ml via subcutânea. Sem reações adversas."
  },
  {
    id: "san_3",
    animalId: "cow_2",
    animalNumber: "2201",
    animalName: "Baronesa",
    date: "2026-04-22",
    type: "Casqueamento",
    description: "Casqueamento preventivo dos quatro membros.",
    blockingMilkSale: false,
    operator: "Veterinário Prestador",
    notes: "Casco em bom estado, sem laminite ou broca de sola."
  }
];

export const INITIAL_FEED_CONSUMPTION: FeedConsumption[] = [
  { id: "fc_1", date: "2026-06-09", lotName: "Lote 1 - Alta Produção", silageKG: 260, grainFeedKG: 26, concentrateKG: 45, mineralSaltKG: 3.2, cowsCount: 8 },
  { id: "fc_2", date: "2026-06-10", lotName: "Lote 1 - Alta Produção", silageKG: 265, grainFeedKG: 27, concentrateKG: 46, mineralSaltKG: 3.3, cowsCount: 8 },
  { id: "fc_3", date: "2026-06-11", lotName: "Lote 1 - Alta Produção", silageKG: 262, grainFeedKG: 26.5, concentrateKG: 45.8, mineralSaltKG: 3.2, cowsCount: 8 }
];

export const INITIAL_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  // Receitas de Leite Recentes (Maio/Junho)
  { id: "fn_1", date: "2026-05-05", type: "Receita", category: "Venda de Leite", costCenter: "Ordenha", amount: 15450.00, description: "Pagamento do Laticínio Bom Gosto - 6.180 litros entregues em Abril a R$ 2,50/L" },
  { id: "fn_2", date: "2026-06-05", type: "Receita", category: "Venda de Leite", costCenter: "Ordenha", amount: 16800.00, description: "Pagamento do Laticínio Bom Gosto - 6.460 litros entregues em Maio a R$ 2,60/L" },
  // Receitas de Animais
  { id: "fn_3", date: "2026-05-20", type: "Receita", category: "Venda de Animais", costCenter: "Reprodução", amount: 4800.00, description: "Venda de 1 novilha mestiça Girolando para recria" },
  { id: "fn_4", date: "2026-06-10", type: "Receita", category: "Venda de Esterco", costCenter: "Administração", amount: 650.00, description: "Venda de esterco curtido misto ensacado para floricultura local" },
  
  // Despesas de Nutrição
  { id: "fn_5", date: "2026-05-02", type: "Despesa", category: "Ração", costCenter: "Nutrição", amount: -4250.00, description: "Compra de 2 toneladas de concentrado comercial lactação 22%" },
  { id: "fn_6", date: "2026-05-18", type: "Despesa", category: "Ração", costCenter: "Nutrição", amount: -2800.00, description: "Aditivos minerais e núcleos comprados da Cooperativa Agropecuária" },
  { id: "fn_7", date: "2026-06-02", type: "Despesa", category: "Ração", costCenter: "Nutrição", amount: -4400.00, description: "Compra de concentrado proteico soja e fubá para dietas de Junho" },

  // Despesas Operacionais
  { id: "fn_8", date: "2026-05-30", type: "Despesa", category: "Funcionários", costCenter: "Administração", amount: -3800.00, description: "Folha de pagamento de funcionário Mateus Assis" },
  { id: "fn_9", date: "2026-05-30", type: "Despesa", category: "Energia", costCenter: "Ordenha", amount: -750.00, description: "Fatura de Energia Elétrica - Resfriador de Leite + Equipamentos de Ordenha" },
  { id: "fn_10", date: "2026-06-01", type: "Despesa", category: "Medicamentos", costCenter: "Administração", amount: -1120.00, description: "Antibióticos diversos e vermífugos para o armário sanitário da fazenda" },
  { id: "fn_11", date: "2026-06-04", type: "Despesa", category: "Combustível", costCenter: "Máquinas", amount: -850.00, description: "Óleo diesel para trator - distribuição de silagem e manejo de piquetes" },
  { id: "fn_12", date: "2026-06-06", type: "Despesa", category: "Manutenção", costCenter: "Máquinas", amount: -450.00, description: "Troca de mangueiras e manutenção preventiva do conjunto de ordenha" }
];

export const INITIAL_PASTURE_PADDOCKS: PasturePaddock[] = [
  { id: "pd_1", name: "Piquete Rotacionado 01", area: 1.5, grassType: "Capim Mombaça", stockingRate: 4.8, occupancyDays: 3, restDays: 28, status: "Ocupado", currentCowCount: 7 },
  { id: "pd_2", name: "Piquete Rotacionado 02", area: 1.5, grassType: "Capim Mombaça", stockingRate: 0.0, occupancyDays: 0, restDays: 14, status: "Descanso", currentCowCount: 0 },
  { id: "pd_3", name: "Piquete Rotacionado 03", area: 1.2, grassType: "Tifton 85", stockingRate: 3.5, occupancyDays: 1, restDays: 21, status: "Descanso", currentCowCount: 0 },
  { id: "pd_4", name: "Piquete Rotacionado 04", area: 2.0, grassType: "Capim Brachiaria Decumbens", stockingRate: 1.8, occupancyDays: 0, restDays: 35, status: "Diferido", currentCowCount: 0 },
  { id: "pd_5", name: "Piquete Rotacionado 05", area: 1.5, grassType: "Capim Mombaça", stockingRate: 0.0, occupancyDays: 0, restDays: 25, status: "Descanso", currentCowCount: 0 }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: "emp_1", name: "Mateus Assis", role: "Ordenhador & Tratorista", salary: 2800.00, schedule: "6x1 (Folgas às Quartas)", activities: ["Ordenha das 05:00", "Ordenha das 16:00", "Trato com Silagem", "Limpeza da sala de ordenha"] },
  { id: "emp_2", name: "José Roberto de Sousa", role: "Médico Veterinário (Consultor)", salary: 1800.00, schedule: "Visita semanal (Terças-feiras)", activities: ["Ultrassonografia gestacional", "Prescrições clínicas", "Protocolo IATF", "Controle sanitário geral"] },
  { id: "emp_3", name: "Edivaldo Pereira", role: "Serviços Gerais / Campeiro", salary: 2000.00, schedule: "6x1 (Folgas aos Domingos)", activities: ["Manejo rotacionado de piquetes", "Manutenção de cercas", "Limpeza de cochos", "Suplementação mineral"] }
];

export const INITIAL_SERVICE_ORDERS: ServiceOrder[] = [
  { id: "os_1", title: "Vacinação Febre Aftosa (Bezerros)", type: "Vacinação", status: "Pendente", dateLimit: "2026-06-15", assignedToEmployeeId: "emp_3", assignedToEmployeeName: "Edivaldo Pereira", description: "Aplicar dose de reforço de febre aftosa em todas as bezerras nascidas no último ciclo de recria." },
  { id: "os_2", title: "IATF - Protocolo Lote Heifer", type: "Inseminação", status: "Em Andamento", dateLimit: "2026-06-16", assignedToEmployeeId: "emp_2", assignedToEmployeeName: "José Roberto de Sousa", description: "Inserção de implante de progesterona nas novilhas aptas (Moema e semelhantes).", relatedAnimalId: "cow_5", relatedAnimalNumber: "5011" },
  { id: "os_3", title: "Manutenção do Motor do Resfriador", type: "Manutenção", status: "Concluído", dateLimit: "2026-06-08", assignedToEmployeeId: "emp_1", assignedToEmployeeName: "Mateus Assis", description: "Verificação de gás, limpeza das aletas de condensação do tanque resfriador de 2000L." },
  { id: "os_4", title: "Acompanhamento Mastite Cow Baunilha", type: "Tratamentos", status: "Em Andamento", dateLimit: "2026-06-13", assignedToEmployeeId: "emp_1", assignedToEmployeeName: "Mateus Assis", description: "Aplicar última seringa intra-mamária de Ceftiofur, colher teste de Tamis pós-tratamento.", relatedAnimalId: "cow_3", relatedAnimalNumber: "3051" }
];
