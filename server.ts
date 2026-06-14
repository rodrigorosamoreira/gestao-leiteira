import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json({ limit: "15mb" }));

  // Shared Gemini client utility
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Erro ao inicializar o Gemini SDK:", err);
    }
  }

  // API: Health probe
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", hasGeminiKey: !!apiKey });
  });

  // API: Specialized Dairy AI Assistant
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      if (!ai) {
        return res.status(400).json({
          error: "API Key do Gemini não configurada ou inválida. Por favor, ajuste a chave no painel de Secrets no AI Studio.",
        });
      }

      const { prompt, context } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "O campo 'prompt' é obrigatório." });
      }

      // Build context aware system prompt tailored for Brazilian dairy farming
      const systemInstruction = `Você é um Engenheiro Agrônomo e Veterinário especializado em Nutrição, Sanidade e Reprodução de Pecuária Leiteira Tropical Brasileira.
Você analisa relatórios de fazendas produtoras de leite de diferentes intensidades (Gir, Girolando, Holandês), identificando pontos de atenção e propondo soluções práticas e financeiramente viáveis para a realidade brasileira.

Seu público é composto por proprietários rurais (muitas vezes familiares) e técnicos de campo.
Use linguagem clara, objetiva, científica, mas acessível. Utilize terminologia correta em português de Portugal/Brasil (como piquetes, taxa de lotação, CCS, CBT, dias em aberto, período de carência, mastite, silagem, concentrado, etc.).

Abaixo estão os dados estruturais atuais da Fazenda (Contexto):
- Rebanho: ${JSON.stringify(context?.stats || {})}
- Consumo Alimentar Atual: ${JSON.stringify(context?.nutrition || {})}
- Finanças Recentes (Margem, custo/litro): ${JSON.stringify(context?.financial || {})}
- Alertas de Mastite / Sanidade recentes: ${JSON.stringify(context?.sanitary || "Nenhum")}
- Alertas de Carência de Medicamentos: ${JSON.stringify(context?.withholding || "Nenhum")}

Sempre estruture suas respostas de forma organizada, em Markdown limpo, sugerindo ações corretivas práticas de manejo, reprodução, sanidade e nutrição. Use tópicos claros e percentuais relevantes se adequar.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Desculpe, o assistente inteligente não conseguiu gerar uma resposta no momento.";
      return res.json({ text: responseText });
    } catch (error: any) {
      console.error("Erro na API do Gemini:", error);
      return res.status(500).json({
        error: "Ocorreu um erro ao processar a requisição com o assistente inteligente.",
        details: error.message || String(error),
      });
    }
  });

  // Handle Vite middleware inside Express for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of compiled files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    // Support standard Express 4 fallback if Express 5 is not pre-loaded or matches
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Server] Hospedado com sucesso na porta ${PORT}`);
  });
}

startServer();
