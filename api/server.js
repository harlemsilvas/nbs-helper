require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");

const app = express();
const PORT = process.env.PORT || 3001;

// Cache global (TTL de 1 hora por padrão)
const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL) || 3600,
  checkperiod: 600,
});

// Dataset carregado na memória
let dataset = null;
let lastUpdate = null;

// Middleware de segurança
app.use(helmet());

// CORS configurável
const corsOptions = {
  origin:
    process.env.CORS_ORIGIN === "*"
      ? "*"
      : process.env.CORS_ORIGIN?.split(",") || "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Accept"],
  credentials: false,
  maxAge: 86400, // 24 horas
};
app.use(cors(corsOptions));

// Compressão gzip
app.use(compression());

// Parse JSON
app.use(express.json());

// Rate limiting global
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requisições
  message: {
    error: "Muitas requisições deste IP, tente novamente em 15 minutos.",
    retryAfter: "15 minutos",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Muitas requisições deste IP, tente novamente em 15 minutos.",
      retryAfter: "15 minutos",
      limit: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      window: "15 minutos",
    });
  },
});

app.use("/api/", limiter);

// Função para carregar dataset
async function loadDataset() {
  try {
    const datasetUrl =
      process.env.DATASET_URL || "https://nbs-helper-web.vercel.app/index.json";
    console.log("📥 Carregando dataset de:", datasetUrl);

    const response = await fetch(datasetUrl);
    if (!response.ok) {
      throw new Error(`Erro ao carregar dataset: ${response.status}`);
    }

    const data = await response.json();
    dataset = data.items || data;
    lastUpdate = new Date();

    console.log("✅ Dataset carregado:", dataset.length, "códigos");
    console.log("🕒 Última atualização:", lastUpdate.toISOString());

    // Limpar cache ao recarregar dataset
    cache.flushAll();

    return dataset;
  } catch (error) {
    console.error("❌ Erro ao carregar dataset:", error.message);
    throw error;
  }
}

// Middleware para garantir dataset carregado
async function ensureDataset(req, res, next) {
  if (!dataset) {
    try {
      await loadDataset();
    } catch (error) {
      return res.status(503).json({
        error: "Serviço temporariamente indisponível. Dataset não carregado.",
        message: error.message,
      });
    }
  }
  next();
}

// Helper para resposta com cache
function sendCached(res, key, data, ttl = null) {
  if (ttl) {
    cache.set(key, data, ttl);
  } else {
    cache.set(key, data);
  }
  return res.json(data);
}

// ==================== ROTAS ====================

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    dataset: {
      loaded: dataset !== null,
      count: dataset?.length || 0,
      lastUpdate: lastUpdate?.toISOString() || null,
    },
    cache: {
      keys: cache.keys().length,
      stats: cache.getStats(),
    },
  });
});

// Documentação da API
app.get("/api/v1/docs", (req, res) => {
  res.json({
    version: "1.0.0",
    baseUrl: `${req.protocol}://${req.get("host")}/api/v1`,
    endpoints: [
      {
        method: "GET",
        path: "/codes",
        description: "Lista todos os códigos NBS com paginação",
        parameters: {
          page: "Número da página (padrão: 1)",
          limit: "Itens por página (padrão: 50, máx: 500)",
          level: "Filtrar por nível (1-4)",
        },
        example: "/api/v1/codes?page=1&limit=20&level=1",
      },
      {
        method: "GET",
        path: "/codes/:code",
        description: "Busca código específico (sem pontos)",
        parameters: {
          code: "Código NBS (ex: 11302000101)",
        },
        example: "/api/v1/codes/11302000101",
      },
      {
        method: "GET",
        path: "/search",
        description: "Busca por termo em código, descrição ou palavras-chave",
        parameters: {
          q: "Termo de busca (mínimo 2 caracteres)",
          limit: "Máximo de resultados (padrão: 50, máx: 200)",
        },
        example: "/api/v1/search?q=contabilidade&limit=10",
      },
      {
        method: "GET",
        path: "/categories",
        description: "Lista categorias por nível",
        parameters: {
          level: "Nível da categoria (1-4)",
        },
        example: "/api/v1/categories?level=1",
      },
      {
        method: "GET",
        path: "/health",
        description: "Status do serviço e estatísticas",
        example: "/api/v1/health",
      },
    ],
    rateLimit: {
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      window: "15 minutos",
    },
    cache: {
      ttl: "1 hora",
    },
  });
});

// GET /api/v1/codes - Lista códigos com paginação
app.get("/api/v1/codes", ensureDataset, (req, res) => {
  const cacheKey = `codes_${req.query.page || 1}_${req.query.limit || 50}_${req.query.level || "all"}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 50));
  const level = req.query.level ? parseInt(req.query.level) : null;

  let filtered = dataset;

  // Filtrar por nível se especificado
  if (level && level >= 1 && level <= 4) {
    filtered = dataset.filter((item) => item.level === level);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const items = filtered.slice(start, end);

  const response = {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    cached: false,
  };

  return sendCached(res, cacheKey, response);
});

// GET /api/v1/codes/:code - Busca código específico
app.get("/api/v1/codes/:code", ensureDataset, (req, res) => {
  const code = req.params.code.replace(/\./g, ""); // Remove pontos
  const cacheKey = `code_${code}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const item = dataset.find((d) => d.code.replace(/\./g, "") === code);

  if (!item) {
    return res.status(404).json({
      error: "Código não encontrado",
      code: code,
    });
  }

  const response = {
    data: item,
    cached: false,
  };

  return sendCached(res, cacheKey, response);
});

// GET /api/v1/search - Busca por termo
app.get("/api/v1/search", ensureDataset, (req, res) => {
  const query = req.query.q?.trim().toLowerCase();
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 50));

  if (!query || query.length < 2) {
    return res.status(400).json({
      error: 'Parâmetro "q" obrigatório (mínimo 2 caracteres)',
    });
  }

  const cacheKey = `search_${query}_${limit}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const results = dataset
    .filter((item) => {
      const searchText =
        `${item.code} ${item.description} ${item.keywords || ""}`.toLowerCase();
      return searchText.includes(query);
    })
    .slice(0, limit);

  const response = {
    data: results,
    query,
    count: results.length,
    limit,
    cached: false,
  };

  return sendCached(res, cacheKey, response);
});

// GET /api/v1/categories - Lista categorias
app.get("/api/v1/categories", ensureDataset, (req, res) => {
  const level = req.query.level ? parseInt(req.query.level) : null;

  if (level && (level < 1 || level > 4)) {
    return res.status(400).json({
      error: "Nível inválido. Use 1-4.",
    });
  }

  const cacheKey = `categories_${level || "all"}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const categories = {};

  dataset.forEach((item) => {
    if (!level || item.level === level) {
      const key = `nivel_${item.level}`;
      if (!categories[key]) {
        categories[key] = {
          level: item.level,
          name: `Nível ${item.level}`,
          count: 0,
          items: [],
        };
      }
      categories[key].count++;

      // Adicionar apenas primeiros códigos como exemplo (limite 5)
      if (categories[key].items.length < 5) {
        categories[key].items.push({
          code: item.code,
          description: item.description,
        });
      }
    }
  });

  const response = {
    data: Object.values(categories),
    cached: false,
  };

  return sendCached(res, cacheKey, response);
});

// Rota raiz - redireciona para docs
app.get("/api/v1", (req, res) => {
  res.redirect("/api/v1/docs");
});

app.get("/api", (req, res) => {
  res.redirect("/api/v1/docs");
});

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
    docs: "/api/v1/docs",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Iniciar servidor
async function start() {
  try {
    // Carregar dataset antes de iniciar
    await loadDataset();

    app.listen(PORT, () => {
      console.log("🚀 NBS Helper API rodando!");
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📖 Docs: http://localhost:${PORT}/api/v1/docs`);
      console.log(
        `🔒 Rate limit: ${process.env.RATE_LIMIT_MAX || 100} req/15min`,
      );
      console.log(`💾 Cache TTL: ${process.env.CACHE_TTL || 3600}s`);
    });

    // Recarregar dataset a cada 1 hora
    setInterval(
      async () => {
        console.log("🔄 Atualizando dataset...");
        await loadDataset();
      },
      60 * 60 * 1000,
    );
  } catch (error) {
    console.error("❌ Falha ao iniciar servidor:", error);
    process.exit(1);
  }
}

start();
