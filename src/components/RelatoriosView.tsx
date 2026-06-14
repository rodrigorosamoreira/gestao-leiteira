/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FileDown, FileText, FileSpreadsheet, ShieldAlert, BadgeInfo, Layers } from "lucide-react";
import { useFarm } from "../context/FarmContext";

export default function RelatoriosView() {
  const { animals, leiteRecords, financialTransactions, sanitaryRecords, clearAllData, confirmAction } = useFarm();

  // CSV Exporter generator engines
  const downloadCSV = (filename: string, csvContent: string) => {
    // Add BOM for Microsoft Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAnimals = () => {
    const headers = "ID;Brinco;Nome;Sexo;Raca;Sangue;DataNascimento;Peso;Categoria;GestaStatus;EscoreECC;StatusOcorr\n";
    const body = animals
      .map((a) => {
        return `${a.id};${a.number};${a.name};${a.sex};${a.breed};${a.bloodGrade};${a.birthDate};${a.weight};${a.category};${a.gestationStatus};${a.escoreEcc || "3.5"};${a.status}`;
      })
      .join("\n");
    downloadCSV("rebanho_agrocolina_export.csv", headers + body);
  };

  const exportLeite = () => {
    const headers = "ID;Data;Brinco;Fame;Lote;ManhaL;TardeL;NoiteL;TotalDiarioL\n";
    const body = leiteRecords
      .map((r) => {
        return `${r.id};${r.date};${r.animalNumber};${r.animalName};${r.batch};${r.morningValue};${r.afternoonValue};${r.nightValue};${r.totalValue}`;
      })
      .join("\n");
    downloadCSV("controle_leiteiro_agrocolina_export.csv", headers + body);
  };

  const exportFinanceiro = () => {
    const headers = "ID;Data;Operacao;CentroCustos;Descritivo;ValorR\n";
    const body = financialTransactions
      .map((t) => {
        return `${t.id};${t.date};${t.type};${t.category};${t.description};${t.amount}`;
      })
      .join("\n");
    downloadCSV("fluxo_caixa_agrocolina_export.csv", headers + body);
  };

  const exportSanidade = () => {
    const headers = "ID;Data;Brinco;Fame;Ocorrencia;Medicamento;CarenciaDias;Veterinario\n";
    const body = sanitaryRecords
      .map((s) => {
        return `${s.id};${s.date};${s.animalNumber};${s.animalName};${s.type};${s.treatmentMedicine};${s.withdrawalDays};${s.veterinarian}`;
      })
      .join("\n");
    downloadCSV("diagnosticos_sanitarios_agrocolina_export.csv", headers + body);
  };

  return (
    <div id="relatorios-panel" className="bg-slate-50 min-h-screen p-4 md:p-6 space-y-6">
      
      {/* Header operations */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Exportações & Relatórios Fiscais</h1>
        <p className="text-xs text-slate-500 font-medium">Extração direta de dados unificados das fichas em formato padrão de planilhas CSV compatíveis com Excel.</p>
      </div>

      {/* Grid export card options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Rebanho export */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-650">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-800">Censo e Registro do Rebanho</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Base cadastral contendo a listagem ativa e histórica de matrizes, bezerras de aleitamento, machos de coberturas e animais dados de descarte completo. Ideal para controle zootécnico e declarações municipais.
            </p>
          </div>
          <button
            onClick={exportAnimals}
            className="w-full bg-slate-800 hover:bg-slate-705 text-white font-bold py-2.5 rounded-lg text-xs flex justify-center items-center gap-2 shadow-sm transition"
          >
            <FileDown className="w-4 h-4" /> Baixar Planilha Rebanho (.CSV)
          </button>
        </div>

        {/* Card 2: Leite scale logs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-600">
              <FileSpreadsheet className="w-5 h-5 text-sky-505" />
              <h3 className="font-bold text-sm text-slate-800">Controle Leiteiro & Ordenhas</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Planilha detalhada de cada pesagem periódica realizada (ordenhas de manhã, tarde e noite) por cada vaca individualmente. Essencial para analisar produtividade de pico e selecionar as melhores matrizes para descarte reprodutivo.
            </p>
          </div>
          <button
            onClick={exportLeite}
            className="w-full bg-slate-800 hover:bg-slate-705 text-white font-bold py-2.5 rounded-lg text-xs flex justify-center items-center gap-2 shadow-sm transition"
          >
            <FileDown className="w-4 h-4" /> Baixar Planilha Ordenhas (.CSV)
          </button>
        </div>

        {/* Card 3: Finance ledger */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <FileText className="w-5 h-5 text-emerald-505" />
              <h3 className="font-bold text-sm text-slate-800">Livro de Caixa & Custos</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Histórico financeiro completo mapeando as despesas alimentares, custos com tratamentos imunológicos, receitas de venda de leite coletivo líquido e venda de matrizes excedentes no mercado leiteiro nacional.
            </p>
          </div>
          <button
            onClick={exportFinanceiro}
            className="w-full bg-slate-800 hover:bg-slate-705 text-white font-bold py-2.5 rounded-lg text-xs flex justify-center items-center gap-2 shadow-sm transition"
          >
            <FileDown className="w-4 h-4" /> Baixar Planilha Financeira (.CSV)
          </button>
        </div>

        {/* Card 4: Medical logs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-sm text-slate-800">Sanidade, Casco & Carências</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Relatório de tratamentos hormonais e aplicações de antibióticos sistêmicos. Fornece prova de auditoria sanitária com as vacinas aplicadas e confirmação de períodos de carência cumpridos para fins de vigilância sanitária.
            </p>
          </div>
          <button
            onClick={exportSanidade}
            className="w-full bg-slate-800 hover:bg-slate-705 text-white font-bold py-2.5 rounded-lg text-xs flex justify-center items-center gap-2 shadow-sm transition"
          >
            <FileDown className="w-4 h-4" /> Baixar Planilha Sanitária (.CSV)
          </button>
        </div>

        {/* Card 5: Database reset */}
        <div className="col-span-1 md:col-span-2 bg-rose-50/50 border border-rose-250 p-5 rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">Limpeza Geral de Dados (Reset de Fábrica)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
              Atenção: Ao executar o reset, <strong>todos os registros exemplos serão permanentemente excluídos</strong> (animais cadastrados, diário de ordenha, receitas dietéticas, equipe de campo, histórico sanitário e fluxo de caixa). Os piquetes do pastejo rotacionado serão redefinidos para o estado inicial de repouso. Use esta ação para apagar a demonstração do sistema e começar a lançar os dados reais da sua propriedade rural.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                confirmAction({
                  title: "REDEFINIÇÃO DE FÁBRICA DO BANCO DE DADOS",
                  message: "Você tem certeza absoluta de que deseja EXCLUIR permanentemente TODOS os dados configurados e redefinir o sistema ao estado original do Agrocolina? Esta ação não possui retorno.",
                  onConfirm: () => {
                    clearAllData();
                    window.location.reload();
                  }
                });
              }}
              className="bg-rose-600 hover:bg-rose-750 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex justify-center items-center gap-2 shadow transition"
            >
              <ShieldAlert className="w-4 h-4" /> Apagar Todos os Lançamentos e Recomeçar do Zero
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
