import express from "express";
import cors from "cors";
import compression from "compression";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Carregar dados NBS
const dataPath = resolve(__dirname, "../../data/generated/nbs.json");
let nbsData = null;

try {
  nbsData = JSON.parse(readFileSync(dataPath, "utf8"));
  console.log(`✅ Dados NBS carregados: ${nbsData.items.length} itens`);
} catch (error) {
  console.error("❌ Erro ao carregar dados NBS:", error);
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: nbsData.version,
    totalItems: nbsData.items.length,
    timestamp: new Date().toISOString(),
  });
});

// Metadados
app.get("/meta", (req, res) => {
  res.json({
    version: nbsData.version,
    importedAt: nbsData.importedAt,
    totalItems: nbsData.items.length,
  });
});

// Buscar item por código
app.get("/item/:code", (req, res) => {
  const { code } = req.params;
  const item = nbsData.items.find((i) => i.code === code);

  if (!item) {
    return res.status(404).json({ error: "Código não encontrado" });
  }

  res.json(item);
});

// Busca por texto
app.get("/search", (req, res) => {
  const { q, limit = 50, offset = 0 } = req.query;

  if (!q || q.trim() === "") {
    const results = nbsData.items.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );
    return res.json({
      query: "",
      total: nbsData.items.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      results,
    });
  }

  const query = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Busca simples por descrição e keywords
  const matches = nbsData.items
    .map((item) => {
      const desc = item.description
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const keywords = (item.keywords || []).join(" ");

      let score = 0;
      if (desc.includes(query)) score += 10;
      if (keywords.includes(query)) score += 5;
      if (item.code.includes(q)) score += 15;

      return { item, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((m) => m.item);

  const results = matches.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit)
  );

  res.json({
    query: q,
    total: matches.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
    results,
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" });
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
  console.log(`📊 ${nbsData.items.length} códigos NBS disponíveis`);
});
