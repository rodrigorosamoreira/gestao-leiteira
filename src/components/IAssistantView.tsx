/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, Send, Bot, AlertTriangle, Lightbulb, Play } from "lucide-react";
import { useFarm } from "../context/FarmContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function IAssistantView() {
  const {
    animals,
    leiteRecords,
    controlLeiteiro,
    diets,
    stock,
    sanitaryRecords,
    financialTransactions,
    getCurrentWithholdingAlerts
  } = useFarm();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou seu Assistente de Inteligência Artificial especializado em Pecuária Leiteira Tropical. Eu analiso os parâmetros de rebanho, sanidade, produção e finanças da sua fazenda para recomendar ajustes, detectar quedas de eficiência e estimar lucratividades. Como posso te auxiliar hoje?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Compile real context to send package to the server
  const getFarmContext = () => {
    const totalAnimals = animals.length;
    const lactatingCount = animals.filter((a) => a.category === "Vaca em lactação").length;
    const dryCount = animals.filter((a) => a.category === "Vaca seca").length;
    const heifers = animals.filter((a) => a.category === "Novilha").length;
    const calves = animals.filter((a) => a.category === "Bezerra").length;

    // Recent average production (last 3 entries)
    const recentMilkTotal = leiteRecords.slice(0, 10).reduce((acc, r) => acc + r.totalValue, 0);
    const recentMilkAvg = recentMilkTotal > 0 ? (recentMilkTotal / Math.min(10, leiteRecords.length || 1)).toFixed(1) : "0";

    // Standard high somatic cell count warners
    const latestQuality = controlLeiteiro[0] || { ccs: 0, cbt: 0, fatPct: 0, proteinPct: 0, ureaValue: 0 };
    const mastitisAlerts = sanitaryRecords.filter(r => r.type === "Mastite").length;

    // Financial margins
    const revenues = financialTransactions.filter(t => t.type === "Receita").reduce((acc, t) => acc + t.amount, 0);
    const expenses = Math.abs(financialTransactions.filter(t => t.type === "Despesa").reduce((acc, t) => acc + t.amount, 0));
    const netProfit = revenues - expenses;

    // Active drug withdrawal holdings
    const activeWithholding = getCurrentWithholdingAlerts();

    return {
      stats: {
        totalAnimals,
        lactatingCount,
        dryCount,
        heifers,
        calves,
        recentMilkAvgLiters: recentMilkAvg
      },
      nutrition: {
        dietsCount: diets.length,
        stockItemsCount: stock.length,
        itemsCritical: stock.filter(s => s.quantity <= s.minLimit).map(s => s.name)
      },
      financial: {
        lastMonthRevenues: revenues.toFixed(2),
        lastMonthExpenses: expenses.toFixed(2),
        netProfit: netProfit.toFixed(2),
        estimatedMargemPct: revenues > 0 ? ((netProfit / revenues) * 100).toFixed(1) : "0"
      },
      sanitary: `Registrados ${mastitisAlerts} casos de Mastite históricos. CCS recente: ${latestQuality.ccs} x1000/ml. CBT recente: ${latestQuality.cbt} UFC/ml.`,
      withholding: `${activeWithholding.length} vacas sob período de carência química de leite (Leite Retido!).`
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setInputValue("");
    setIsLoading(true);
    setErrorText(null);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          context: getFarmContext()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao consultar o servidor de Inteligência Artificial.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Erro desconhecido. Por favor, verifique se seu servidor do Gemini foi devidamente configurado.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-compiled prompt templates
  const assistantTemplates = [
    {
      title: "Análise de Produtividade Global",
      description: "Analise o rebanho, produção média, qualidade e CCS.",
      prompt: "Por favor, realize uma análise veterinária e de engenharia detalhada da produtividade atual da fazenda com base nos dados do contexto fornecido, apontando vulnerabilidades, estimando se a CCS está aceitável e indicando recomendações rápidas."
    },
    {
      title: "Diagnóstico Econômico & Margem",
      description: "Avaliar receitas, insumos e propor melhorias de custos.",
      prompt: "Faça uma revisão econômica das despesas e receitas enviadas. Apresente se o custo/benefício está proporcional para a pecuária leiteira tropical, identificando as categorias de despesa que mais pesam (Ração, Combustível, Veterinária) e sugira as melhores estratégias para aumentar o lucro líquido por litro."
    },
    {
      title: "Revisão Nutricional & Silagem",
      description: "Avaliar dietas de alta performance e consumo.",
      prompt: "Com base nas dietas cadastradas no estoque crítico, verifique se há risco de as vacas estarem sub-alimentadas na seca ou no pastejo rotacionado. Recomende proporções recomendadas de Matéria Seca (MS) e Proteína Bruta (PB) para bezerras mestiças e vacas em lactação."
    },
    {
      title: "Previsão & Alertas Sanitários",
      description: "Estimar partos e prevenir infecções de mastite.",
      prompt: "De acordo com os casos sanitários recentes e status de carência do rebanho, quais ações preventivas de casqueamento e higiene na ordenha (pré-dipping, pós-dipping) você sugere para reduzir a contagem de células somáticas (CCS) e afastar mastite no lote de lactação?"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6 flex flex-col justify-between">
      <div id="assistente-ia-view" className="max-w-7xl mx-auto w-full flex-grow flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Instructions and Prompt Templates */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-800 text-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-amber-300 fill-amber-300 w-5 h-5 animate-pulse" />
              <h2 className="text-lg font-bold">Assistente Inteligente</h2>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              O consultor utiliza o modelo de linguagem <strong>Gemini-3.5-flash</strong>. Ele está configurado com as doutrinas de pecuária do mercado brasileiro, ajudando a traçar rotas eficientes de produtividade.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-700 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>Sincronizado com os dados do painel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>Preserva segredos (Chaves protegidas)</span>
              </div>
            </div>
          </div>

          <div className="flex-grow bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompts Rápidos do Consultor
            </h3>
            <div className="space-y-2.5">
              {assistantTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(tpl.prompt)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group flex gap-2 items-start text-xs disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5 group-hover:text-indigo-600 transition-colors">
                      {tpl.title}
                    </span>
                    <span className="text-slate-500 text-[11px] leading-relaxed">
                      {tpl.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Chat Container */}
        <div className="w-full md:w-2/3 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm min-h-[500px]">
          {/* Header */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">Conselho Zoográfico IA</h3>
                <span className="text-[10px] text-emerald-600 font-medium">● Conectado &middot; Pronto para diagnosticar</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto max-h-[480px] space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-white"
                  }`}
                >
                  {msg.role === "user" ? "Prod" : <Bot className="w-3.5 h-3.5 text-emerald-300" />}
                </div>
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold animate-spin">
                  <Bot className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="p-3 rounded-xl bg-slate-100 text-slate-500 rounded-tl-none border border-slate-200 text-xs italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  Processando rebanho e estatísticas...
                </div>
              </div>
            )}

            {errorText && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Falha de Conexão com a Inteligência Artificial</p>
                  <p className="mt-1 text-slate-600 leading-normal">{errorText}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Pergunte sobre nutrição, previsão de partos ou custos por litro..."
              className="flex-grow border border-slate-300 rounded-lg px-3 py-2 bg-white text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-slate-800 text-white rounded-lg px-4 py-2 hover:bg-slate-700 transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
