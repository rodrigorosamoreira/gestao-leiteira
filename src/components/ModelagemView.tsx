/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Database, FileCode, Layers, Milestone, Send } from "lucide-react";

export default function ModelagemView() {
  const [activeTab, setActiveTab] = useState<"sql" | "er" | "api" | "arch" | "roadmap">("sql");

  const sqlSchema = `-- ==========================================
-- SCHEMA DE BANCO DE DADOS POSTGRESQL (PECÚARIA LEITEIRA)
-- ==========================================

-- 1. Tabela de Animais (Rebanho)
CREATE TABLE animais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brinco VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    brinco_eletronico VARCHAR(100),
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
    raca VARCHAR(100) NOT NULL,
    grau_sangue VARCHAR(50) NOT NULL,
    data_nascimento DATE NOT NULL,
    peso_kg NUMERIC(6, 2),
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('Bezerra', 'Novilha', 'Vaca em lactação', 'Vaca seca', 'Touro', 'Descarte')),
    lote VARCHAR(100),
    origem VARCHAR(50) NOT NULL CHECK (origem IN ('Nascido na Fazenda', 'Comprado de Terceiros')),
    situacao VARCHAR(20) NOT NULL DEFAULT 'Ativo' CHECK (situacao IN ('Ativo', 'Vendido', 'Morto', 'Descartado')),
    pai_id UUID REFERENCES animais(id) ON DELETE SET NULL,
    mae_id UUID REFERENCES animais(id) ON DELETE SET NULL,
    avó_paterna VARCHAR(100),
    avô_paterno VARCHAR(100),
    avó_materna VARCHAR(100),
    avô_materno VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Reprodução (Cio, Inseminações, Diagnósticos, Partos)
CREATE TABLE reproducao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Cio', 'Inseminação', 'Monta Natural', 'Diagnóstico Gestação', 'Parto', 'Aborto', 'Repetição de Cio')),
    data_evento DATE NOT NULL,
    touro_semen VARCHAR(100),
    codigo_semen VARCHAR(50),
    inseminador VARCHAR(100),
    resultado_diagnostico VARCHAR(20) CHECK (resultado_diagnostico IN ('Vazia', 'Prenha')),
    tipo_parto VARCHAR(30),
    sexo_cria VARCHAR(20),
    observacoes TEXT,
    proximo_diagnostico_data DATE,
    secagem_prevista_data DATE,
    parto_previsto_data DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Produção de Leite Diária
CREATE TABLE producao_leite (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    ordenha_manha NUMERIC(5, 2) DEFAULT 0.00,
    ordenha_tarde NUMERIC(5, 2) DEFAULT 0.00,
    ordenha_noite NUMERIC(5, 2) DEFAULT 0.00,
    total_diario NUMERIC(5, 2) GENERATED ALWAYS AS (ordenha_manha + ordenha_tarde + ordenha_noite) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (animal_id, data)
);

-- 4. Tabela de Controle Leiteiro (Qualidade Química e CCS)
CREATE TABLE controle_leiteiro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_coleta DATE NOT NULL UNIQUE,
    ccs_k_ml INTEGER NOT NULL, -- Contagem de Células Somáticas x 1000
    cbt_ufc_ml INTEGER NOT NULL, -- Contagem Bacteriana Total UFC
    gordura_pct NUMERIC(4, 2) NOT NULL,
    proteina_pct NUMERIC(4, 2) NOT NULL,
    lactose_pct NUMERIC(4, 2) NOT NULL,
    ureia_mg_dl NUMERIC(4, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Medicamentos e Carências
CREATE TABLE medicamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_comercial VARCHAR(150) NOT NULL,
    principio_ativo VARCHAR(150) NOT NULL,
    lote VARCHAR(50) NOT NULL,
    data_validade DATE NOT NULL,
    carencia_leite_dias INTEGER NOT NULL DEFAULT 0,
    carencia_carne_dias INTEGER NOT NULL DEFAULT 0
);

-- 6. Tabela de Sanidade (Tratamentos Clínicos)
CREATE TABLE registro_sanitario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    tipo_ocorrencia VARCHAR(50) NOT NULL CHECK (tipo_ocorrencia IN ('Vacinação', 'Vermifugação', 'Mastite', 'Casqueamento', 'Tratamento', 'Cirurgia')),
    descricao TEXT NOT NULL,
    medicamento_id UUID REFERENCES medicamentos(id) ON DELETE SET NULL,
    fim_carencia_leite DATE,
    bloqueio_leite_venda BOOLEAN DEFAULT FALSE,
    fim_carencia_carne DATE,
    operador VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela de Transações Financeiras (Fluxo de Caixa)
CREATE TABLE transacoes_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data DATE NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('Receita', 'Despesa')),
    categoria VARCHAR(100) NOT NULL,
    centro_custo VARCHAR(50) NOT NULL CHECK (centro_custo IN ('Ordenha', 'Reprodução', 'Nutrição', 'Máquinas', 'Administração')),
    valor NUMERIC(10, 2) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  return (
    <div id="modelagem-panel" className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Arquitetura & Modelagem Técnica</h1>
          <p className="text-sm text-slate-500">Documentação completa dos schemas, APIs, fluxos de engenharia e roadmap do sistema.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("sql")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "sql" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            <FileCode className="w-4 h-4" />
            Modelagem PostgreSQL (DDL)
          </button>
          <button
            onClick={() => setActiveTab("er")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "er" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            <Database className="w-4 h-4" />
            Diagrama ER Lógico
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "api" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            <Send className="w-4 h-4" />
            Arquitetura REST API
          </button>
          <button
            onClick={() => setActiveTab("arch")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "arch" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            Arquitetura de Sistemas
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "roadmap" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/50"
            }`}
          >
            <Milestone className="w-4 h-4" />
            Roadmap do Produto
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {activeTab === "sql" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileCode className="text-slate-700" /> Esquemas relacionais DDL para PostgreSQL
                </h2>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">ANSI SQL / PostgreSQL 15+</span>
              </div>
              <pre className="text-xs text-slate-700 font-mono bg-slate-50 p-4 rounded-lg overflow-x-auto max-h-[500px] leading-relaxed border border-slate-200">
                {sqlSchema}
              </pre>
            </div>
          )}

          {activeTab === "er" && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Database className="text-emerald-600" /> Diagrama Entidade-Relacionamento (Relacional)
              </h2>
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  Abaixo está mapeado o fluxo das estrangeiras (Foreign Keys) e relacionamentos lógicos do coração do software pecuário:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 text-sm text-center bg-slate-200/50 rounded py-1">
                      animais
                    </div>
                    <ul className="space-y-1.5 text-slate-500">
                      <li>🔑 <span className="text-slate-900 font-bold">id</span> (UUID, PK)</li>
                      <li>🏷️ <span className="text-slate-900 font-bold">brinco</span> (VARCHAR, Unique)</li>
                      <li>🐮 campo: nome</li>
                      <li>🍼 campo: categoria</li>
                      <li>🚜 campo: lote</li>
                      <li>🧬 <span className="text-indigo-600">pai_id</span> (FK -&gt; animais.id)</li>
                      <li>🧬 <span className="text-indigo-600">mae_id</span> (FK -&gt; animais.id)</li>
                    </ul>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 text-sm text-center bg-emerald-150 rounded py-1">
                        reproducao
                      </div>
                      <ul className="space-y-1.5 text-slate-500">
                        <li>🔑 id (UUID, PK)</li>
                        <li>🧬 <span className="text-indigo-600 font-bold">animal_id</span> (FK -&gt; animais.id)</li>
                        <li>📅 data_evento (DATE)</li>
                        <li>🏷️ tipo (Cio, Inseminação, Parto...)</li>
                        <li>🧪 codigo_semen / inseminador</li>
                        <li>🩺 resultado_diagnostico (Prenha/Vazia)</li>
                      </ul>
                    </div>
                    <div className="text-[10px] text-center bg-emerald-50 text-emerald-700 py-1 px-1 rounded mt-3">
                      1 Vaca &rarr; Muitos Eventos (1:N)
                    </div>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 text-sm text-center bg-pink-150 rounded py-1">
                        producao_leite
                      </div>
                      <ul className="space-y-1.5 text-slate-500">
                        <li>🔑 id (UUID, PK)</li>
                        <li>🧬 <span className="text-indigo-600 font-bold">animal_id</span> (FK -&gt; animais.id)</li>
                        <li>📅 data (DATE)</li>
                        <li>🥛 ordenha_manha/tarde/noite</li>
                        <li>📊 total_diario (Calculado)</li>
                      </ul>
                    </div>
                    <div className="text-[10px] text-center bg-pink-50 text-pink-700 py-1 px-1 rounded mt-3">
                      Composto por Vaca + Dia (Unique index)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mt-4">
                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 text-sm text-center bg-violet-150 rounded py-1">
                      registro_sanitario
                    </div>
                    <ul className="space-y-1.5 text-slate-500">
                      <li>🔑 id (UUID, PK)</li>
                      <li>🧬 <span className="text-indigo-600 font-bold">animal_id</span> (FK -&gt; animais.id)</li>
                      <li>📅 data (DATE)</li>
                      <li>🤒 tipo_ocorrencia (Mastite, Vacina...)</li>
                      <li>🧪 <span className="text-indigo-600">medicamento_id</span> (FK -&gt; medicamentos.id)</li>
                      <li>🚫 bloqueio_leite_venda (Booleano)</li>
                    </ul>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 text-sm text-center bg-amber-150 rounded py-1">
                      medicamentos
                    </div>
                    <ul className="space-y-1.5 text-slate-500">
                      <li>🔑 id (UUID, PK)</li>
                      <li>💊 nome_comercial / principio_ativo</li>
                      <li>📦 lote / data_validade</li>
                      <li>🥛 carencia_leite_dias (Trigger Bloqueador)</li>
                      <li>🍖 carencia_carne_dias</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Send className="text-indigo-500" /> Especificação do barramento REST API
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 mb-4">
                  Endpoints de backend expostos pelo microserviço de gestão da fazenda (NestJS / Node.js):
                </p>

                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                      <span className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">POST</span>
                      <span className="font-mono text-sm font-medium text-slate-700">/api/animais</span>
                      <span className="text-xs text-slate-400 ml-auto">Cadastrar novo animal</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                      <span className="bg-sky-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">GET</span>
                      <span className="font-mono text-sm font-medium text-slate-700">/api/animais/:id/pedigree</span>
                      <span className="text-xs text-slate-400 ml-auto">Consultar genealogia ascendente e descendente</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                      <span className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">POST</span>
                      <span className="font-mono text-sm font-medium text-slate-700">/api/ordenhas</span>
                      <span className="text-xs text-slate-400 ml-auto">Lançar ordenhas individuais / lote</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                      <span className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">POST</span>
                      <span className="font-mono text-sm font-medium text-slate-700">/api/gemini/analyze</span>
                      <span className="text-xs text-slate-400 ml-auto">Diagnóstico avançado de rebanho e produção por IA</span>
                    </div>
                    <div className="p-3 bg-slate-100/40 text-xs font-mono text-slate-600 border-t border-slate-200 leading-normal">
                      <strong>Payload:</strong> <code className="text-indigo-600">{"{ prompt: string, context: { stats: object, nutrition: object } }"}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "arch" && (
            <div className="p-6 text-sm text-slate-600 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Layers className="text-violet-600" /> Topologia de Arquitetura de Sistemas
              </h2>
              <div className="p-4 bg-slate-50 hover:bg-slate-50/85 transition-colors border border-dashed border-slate-300 rounded-xl space-y-4 font-mono text-xs">
                <div className="border border-slate-300 p-2.5 bg-white rounded text-center font-bold shadow-sm">
                  🌐 Dispositivo do Campo (Web App / Mobile React Native)
                  <p className="font-normal text-[10px] text-slate-500 mt-1">Armazenamento Offline (IndexedDB / LocalStorage)</p>
                </div>
                <div className="text-center font-bold py-1">⬇️ ⬆️ (Sincronização em Lote - JSON Sincronizador)</div>
                <div className="border border-slate-300 p-2.5 bg-indigo-50 border-indigo-200 rounded text-center font-bold">
                  🚀 Load Balancer Router (AWS ECS / Cloud Run Ingress)
                </div>
                <div className="text-center font-bold py-1">⬇️</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-2.5 bg-white rounded text-center font-semibold">
                    🐳 API Node.js (NestJS)
                    <p className="font-normal text-[10px] text-slate-500 mt-0.5">Gerencia Regras, Financeiro, Auditorias</p>
                  </div>
                  <div className="border border-slate-200 p-2.5 bg-white rounded text-center font-semibold">
                    🧠 Consultor de IA (Gemini API SDK @google/genai)
                    <p className="font-normal text-[10px] text-slate-500 mt-0.5">Diagnósticos térmicos, preventivos e nutrição</p>
                  </div>
                </div>
                <div className="text-center font-bold py-1">⬇️</div>
                <div className="border border-slate-300 p-2.5 bg-slate-800 text-white rounded text-center font-bold">
                  🗄️ Banco de Dados Relacional (PostgreSQL / Cloud SQL)
                  <p className="font-normal text-[10px] text-slate-300 mt-1">Índices de CCS históricos, reprodução e movimentações financeiras</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Milestone className="text-sky-600" /> Cronograma de Execução e Roadmap de Evolução
              </h2>
              <div className="relative border-l border-slate-200 pl-6 ml-4 space-y-6">
                <div>
                  <span className="absolute -left-2.5 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
                  <h3 className="font-semibold text-slate-800 text-sm">Módulo 1: MVP - Cadastros & Controles Básicos (Mês 1)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Foco no cadastro do rebanho, controle de inseminação e diagnóstico de gestação. Lançamento da ordenha manual por lote e módulo financeiro com categorias simples de custos.
                  </p>
                </div>
                <div>
                  <span className="absolute -left-2.5 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-[10px]">2</span>
                  <h3 className="font-semibold text-indigo-700 text-sm">Módulo 2: Otimização Nutricional & Sanidade (Mês 2)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Lançamento do formulador de dietas (Cochos) e alertas de estoque crítico no galpão de medicamentos. Cálculo automático do período de carência (rejeição de leite com resíduo químico).
                  </p>
                </div>
                <div>
                  <span className="absolute -left-2.5 w-5 h-5 bg-sky-550 text-white rounded-full flex items-center justify-center font-bold text-[10px]">3</span>
                  <h3 className="font-semibold text-sky-700 text-sm font-medium">Módulo 3: Inteligência Artificial & Automação de IoT (Mês 3+)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Integração com sensores de coleiras térmicas (RFID), telemetria do tanque refrigerador de leite e ativação do assistente com análises automatizadas semanais disparadas via Telegram para o produtor.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
