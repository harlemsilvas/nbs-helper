# MicroSaaS NBS Helper (NFS-e) — Plano de MVP + Arquitetura (Node/React) + Importador CSV

> **Objetivo:** Ajudar o usuário a encontrar rapidamente o **código NBS 2.0** correto (e a descrição oficial) para preencher emissão de **NFS-e**.  
> **Fonte oficial:** CSV `NBSa_2-0.csv` (gov.br) e documentação NBS 2.0.  
> **Produto:** Webapp (busca + favoritos + copiar) + base pronta para evolução (API e extensão).

---

## 1) Visão do Produto (MVP)

### Problema que resolve
- Usuário perde tempo procurando o **código NBS** correto.
- NBS é grande; busca “no olho” e “no PDF” é lenta.

### MVP (o mínimo que vende)
- Importa o CSV oficial da NBS 2.0.
- Indexa para busca rápida (full-text + ranking simples).
- Interface web simples:
  - buscar por termo (ex.: “consultoria TI”, “desenvolvimento software”)
  - listar resultados com **código + descrição + caminho/hierarquia**
  - copiar código / copiar descrição
  - favoritos + recentes

### Não fazer no MVP (para não travar)
- Autofill em portais (extensão) — só preparar base para depois.
- “Parecer” tributário/municipal — apenas sugestão e referência.

---

## 2) Entregas por Etapas

## Semana 1 — MVP Local (funcionando no seu PC)
**Meta:** Rodar `npm install && npm run dev` e buscar NBS com resultados relevantes.

### Entregas
- [ ] Projeto monorepo (web + api + scripts).
- [ ] Importador do CSV (`NBSa_2-0.csv`) para JSON normalizado.
- [ ] Índice de busca gerado (arquivo) para o frontend.
- [ ] Webapp com:
  - [ ] busca por texto
  - [ ] lista resultados com código/descrição
  - [ ] botão copiar
  - [ ] favoritos local (LocalStorage)

### Critérios de aceite
- Buscar “software” retorna múltiplos itens e mostra código.
- Copiar funciona.
- Favoritos persistem (local).

### Tarefas detalhadas (Semana 1)
**Dia 1 — Setup e repositório**
- [ ] Criar repo `nbs-helper` (ou nome que preferir).
- [ ] Monorepo com `apps/` e `packages/`.
- [ ] Config ESLint/Prettier básico.

**Dia 2 — Importador + normalização**
- [ ] Baixar CSV NBS 2.0 (colocar em `data/raw/`).
- [ ] Script parse CSV -> JSON normalizado:
  - código
  - descrição
  - nível (derivado do código)
  - path/hierarquia (se possível)
  - tokens (para busca)

**Dia 3 — Índice de busca (para frontend)**
- [ ] Gerar índice “search-ready” (ex.: `index.json`) com:
  - lista de itens + campos essenciais
  - tokens/keywords por item (para ranking)
- [ ] Garantir build reprodutível.

**Dia 4-5 — Webapp**
- [ ] UI minimalista: input + resultados.
- [ ] Busca com Fuse.js (ou lunr) carregando o índice.
- [ ] Favoritos + recentes.
- [ ] Botões de copiar.

---

## Semana 2 — MVP SaaS (API + Deploy simples)
**Meta:** Publicar em produção (Vercel/Render/Railway) e compartilhar link.

### Entregas
- [ ] Backend Node (Express/Fastify) com endpoints:
  - `GET /health`
  - `GET /search?q=...`
  - `GET /item/:code`
  - `GET /meta` (versão do dataset, data de geração)
- [ ] Frontend passa a consultar API (opcional, mas recomendado).
- [ ] Cache e paginação simples.
- [ ] Deploy:
  - Front: Vercel
  - API: Render/Railway

### Critérios de aceite
- Link público funcionando.
- Busca rápida (<= 300ms por consulta, na prática).
- API responde com paginação e sem travar.

### Tarefas detalhadas (Semana 2)
**Dia 6-7 — API**
- [ ] Implementar `/search` com ranking básico:
  - prioridade: match por descrição
  - fallback: tokens
- [ ] Limitar tamanho de resposta e paginar.

**Dia 8 — Observabilidade e estabilidade**
- [ ] Logs básicos (pino/morgan).
- [ ] Rate limit leve (evitar abuso).
- [ ] CORS configurado.

**Dia 9-10 — Deploy**
- [ ] Deploy front (Vercel).
- [ ] Deploy api (Render/Railway).
- [ ] Variáveis de ambiente para paths.

---

## 30 dias — Produto “vendável” (Pro básico)
**Meta:** Transformar em microSaaS com diferenciais reais e primeira cobrança.

### Entregas (Roadmap 30 dias)
**Semana 3**
- [ ] Login (Google OAuth) ou auth simples por magic link.
- [ ] Favoritos e “serviços padrão” salvos na nuvem (PostgreSQL).
- [ ] Exportar “catálogo de serviços” (CSV/JSON).

**Semana 4**
- [ ] “Templates” por empresa/cliente (contabilidade):
  - lista de serviços mais usados
  - observações internas
- [ ] Plano Pro:
  - limites e recursos desbloqueados
- [ ] Landing page + checkout (Stripe/PagSeguro - você decide depois)

**Extensão (opcional no 30 dias)**
- [ ] Extensão que abre popup com busca e copia código.
- [ ] Autofill apenas para portais suportados (lista controlada).

### Critérios de aceite (30 dias)
- Usuário cadastra e mantém lista de serviços.
- Dá para cobrar recorrência (mesmo que simples).
- Auditoria mínima: “última vez usado”, “favoritado”.

---

## 3) Arquitetura Sugerida (Monorepo)
```txt
nbs-helper/
├─ apps/
│ ├─ web/ # React (Vite/Next)
│ │ ├─ src/
│ │ │ ├─ pages/
│ │ │ ├─ components/
│ │ │ ├─ services/ # api client
│ │ │ ├─ store/ # favoritos/recentes
│ │ │ └─ utils/
│ │ ├─ public/
│ │ ├─ index.html
│ │ └─ package.json
│ │
│ ├─ api/ # Node (Fastify/Express)
│ │ ├─ src/
│ │ │ ├─ routes/
│ │ │ ├─ services/
│ │ │ ├─ data/ # dataset gerado (json/index)
│ │ │ ├─ utils/
│ │ │ └─ server.ts|js
│ │ └─ package.json
│ │
│ └─ extension/ # (Fase 2/30 dias)
│ ├─ src/
│ ├─ manifest.json
│ └─ package.json
│
├─ packages/
│ ├─ shared/ # tipos, utils, validações
│ │ ├─ src/
│ │ └─ package.json
│ └─ search-core/ # lógica de busca reutilizável
│ ├─ src/
│ └─ package.json
│
├─ scripts/
│ ├─ import_nbs_node.js # parse CSV -> JSON
│ ├─ import_nbs_py.py # alternativa Python
│ ├─ build_index.js # gera índice para busca
│ └─ README.md
│
├─ data/
│ ├─ raw/ # CSV oficial (não versionar se preferir)
│ └─ generated/ # JSON e índices gerados
│
├─ .gitignore
├─ package.json # workspace root
└─ README.md
```


> **Sugestão:** usar Workspaces (pnpm ou npm workspaces) para facilitar.

---

## 4) Modelo de Dados (normalizado)

### NBSItem (mínimo)
```ts
type NBSItem = {
  code: string;            // código NBS
  description: string;     // descrição oficial
  level?: string;          // capítulo/grupo/subitem (derivado)
  path?: string[];         // hierarquia (se possível derivar)
  keywords?: string[];     // tokens gerados p/ busca
};
```

# SearchIndex (para frontend rápido)

```ts
type SearchIndex = {
  version: string;         // "NBSa_2-0"
  generatedAt: string;     // ISO date
  items: Array<{
    code: string;
    description: string;
    keywords: string[];
  }>;
};
```

---

# 5) Script Node para Importar CSV e Gerar Índice (pronto para colar)

> Este exemplo:
> - lê data/raw/NBSa_2-0.csv
> - gera data/generated/nbs.json normalizado
> - gera data/generated/index.json (pronto para Fuse.js)

## 5.1 scripts/import_nbs_node.js
```js
/**
 * Importa CSV NBS 2.0 -> JSON normalizado.
 * Requisitos:
 *   npm i csv-parse
 */
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const RAW_CSV = path.resolve(__dirname, "../data/raw/NBSa_2-0.csv");
const OUT_JSON = path.resolve(__dirname, "../data/generated/nbs.json");

function normalizeText(s) {
  return (s || "")
    .toString()
    .trim()
    .replace(/\s+/g, " ");
}

function tokenize(text) {
  // Token simples (você pode evoluir com stemming depois)
  return normalizeText(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

function main() {
  if (!fs.existsSync(RAW_CSV)) {
    console.error("CSV não encontrado:", RAW_CSV);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(RAW_CSV, "utf8");

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ";", // pode ser "," dependendo do CSV - ajuste se necessário
  });

  // Heurística: tenta detectar colunas principais
  // Ajuste conforme cabeçalho real do CSV:
  // Ex: "Codigo", "Descricao" etc.
  const guessCodeKey =
    Object.keys(records[0]).find((k) => /cod/i.test(k)) || "Codigo";
  const guessDescKey =
    Object.keys(records[0]).find((k) => /desc/i.test(k)) || "Descricao";

  const items = records
    .map((r) => {
      const code = normalizeText(r[guessCodeKey]);
      const description = normalizeText(r[guessDescKey]);

      if (!code || !description) return null;

      return {
        code,
        description,
        keywords: Array.from(new Set(tokenize(description))),
      };
    })
    .filter(Boolean);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify({ items }, null, 2), "utf8");

  console.log("OK ->", OUT_JSON, "itens:", items.length);
}

main();

```
> **Nota importante:** o CSV do gov.br pode vir com separador ; ou , dependendo do arquivo/locale.
> Se quebrar a importação, troque o delimiter para "," e rode de novo.

---
## 5.2 scripts/build_index.js 
```js
/**
 * Gera index.json para busca no frontend.
 * Entrada: data/generated/nbs.json
 * Saída: data/generated/index.json
 */
const fs = require("fs");
const path = require("path");

const IN_JSON = path.resolve(__dirname, "../data/generated/nbs.json");
const OUT_INDEX = path.resolve(__dirname, "../data/generated/index.json");

function main() {
  if (!fs.existsSync(IN_JSON)) {
    console.error("Arquivo não encontrado:", IN_JSON);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
  const items = raw.items || [];

  const index = {
    version: "NBSa_2-0",
    generatedAt: new Date().toISOString(),
    items: items.map((i) => ({
      code: i.code,
      description: i.description,
      keywords: i.keywords || [],
    })),
  };

  fs.writeFileSync(OUT_INDEX, JSON.stringify(index, null, 2), "utf8");
  console.log("OK ->", OUT_INDEX, "itens:", index.items.length);
}

main();

```

---
# 6) Frontend (React) — uso do índice com Fuse.js
## Dependência

```bash
cd apps/web
npm i fuse.js
```
## **Exemplo de serviço** apps/web/src/services/searchLocal.js

```js
import Fuse from "fuse.js";

let fuse = null;
let dataset = null;

export async function loadIndex() {
  if (fuse) return;

  // Ajuste a forma de servir este arquivo (copiar para public, ou servir via API)
  const res = await fetch("/index.json");
  dataset = await res.json();

  fuse = new Fuse(dataset.items, {
    includeScore: true,
    threshold: 0.35,
    keys: ["description", "keywords", "code"],
  });
}

export async function searchNBS(query) {
  await loadIndex();
  const q = (query || "").trim();
  if (!q) return [];

  const results = fuse.search(q).slice(0, 30);
  return results.map((r) => r.item);
}

```
> **Deploy simples do índice:** copie data/generated/index.json para apps/web/public/index.json no build.

---
# 7) Scripts de execução (Root)
## package.json **(exemplo root)**
```json
{
  "name": "nbs-helper",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "import:nbs": "node scripts/import_nbs_node.js",
    "build:index": "node scripts/build_index.js",
    "prepare:data": "npm run import:nbs && npm run build:index",
    "dev:web": "npm --workspace apps/web run dev",
    "dev:api": "npm --workspace apps/api run dev"
  }
}

```

---
# 8) Próximos Diferenciais (para vender)

- Auto-sugestão por “perfil” (TI, manutenção, consultoria).
- Biblioteca de serviços do usuário (favoritos na nuvem).
- Templates por empresa/cliente (contadores).
- Extensão com popup + copiar/colar.

---

# 9) Checklist rápido do MVP (pra você marcar)

- [ ] npm run prepare:data gera data/generated/index.json
- [ ] apps/web abre e busca NBS
- [ ] Copiar código funciona
- [ ] Favoritos persistem
- [ ] Deploy do webapp (Vercel) funcionando

 ---

 Próximos passos: 
 
1) ajustar o importador **para o cabeçalho real do CSV** (pra não depender de “heurística”),  
https://www.gov.br/mdic/pt-br/images/REPOSITORIO/scs/decos/NBS/NBSa_2-0.csv
https://www.gov.br/mdic/pt-br/assuntos/sdic/comercio-e-servicos/nbs-nomenclatura-brasileira-de-servicos
2) te entregar um `README.md` inicial do repositório, e  
3) te montar o `apps/web` com uma UI Tailwind limpa (busca + lista + favoritos) já pronta pra Vercel.
