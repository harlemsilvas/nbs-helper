# 🚀 NBS Helper API

API REST pública para consulta de códigos NBS (Nomenclatura Brasileira de Serviços).

## 📋 Recursos

- ✅ **Lista paginada** de todos os códigos NBS
- 🔍 **Busca** por código, descrição ou palavras-chave
- 📊 **Categorias** por nível hierárquico
- 🔒 **Rate limiting** (100 req/15min por IP)
- ⚡ **Cache** em memória (TTL 1 hora)
- 🛡️ **Segurança** com Helmet.js
- 📦 **Compressão** gzip automática
- 🌐 **CORS** configurável

## 🚦 Início Rápido

### Instalação

```bash
cd api
npm install
```

### Configuração

Copie `.env.example` para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

Variáveis disponíveis:

- `PORT` - Porta do servidor (padrão: 3001)
- `DATASET_URL` - URL do JSON com códigos NBS
- `RATE_LIMIT_MAX` - Máximo de requisições por janela (padrão: 100)
- `RATE_LIMIT_WINDOW_MS` - Janela de tempo em ms (padrão: 900000 = 15 min)
- `CACHE_TTL` - Tempo de vida do cache em segundos (padrão: 3600 = 1 hora)
- `CORS_ORIGIN` - Origens permitidas no CORS (padrão: \*)

### Executar

**Desenvolvimento (com auto-reload):**

```bash
npm run dev
```

**Produção:**

```bash
npm start
```

A API estará disponível em `http://localhost:3001`

## 📖 Documentação

### Base URL

```
http://localhost:3001/api/v1
```

### Endpoints

#### 1. Health Check

```http
GET /api/v1/health
```

Retorna status do serviço, uptime, informações do dataset e estatísticas de cache.

**Exemplo de resposta:**

```json
{
  "status": "ok",
  "uptime": 3600.5,
  "timestamp": "2026-02-04T12:00:00.000Z",
  "dataset": {
    "loaded": true,
    "count": 15234,
    "lastUpdate": "2026-02-04T11:00:00.000Z"
  },
  "cache": {
    "keys": 12,
    "stats": {
      "hits": 245,
      "misses": 78,
      "keys": 12,
      "ksize": 12,
      "vsize": 245
    }
  }
}
```

---

#### 2. Listar Códigos (com paginação)

```http
GET /api/v1/codes?page=1&limit=50&level=1
```

**Parâmetros (query):**

- `page` (opcional) - Número da página (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 50, máx: 500)
- `level` (opcional) - Filtrar por nível (1-4)

**Exemplo de resposta:**

```json
{
  "data": [
    {
      "code": "1.1302.00.01.01",
      "description": "Serviços de auditoria contábil",
      "level": 1,
      "keywords": "auditoria contabilidade fiscal"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 15234,
    "totalPages": 305,
    "hasNext": true,
    "hasPrev": false
  },
  "cached": false
}
```

---

#### 3. Buscar Código Específico

```http
GET /api/v1/codes/:code
```

**Parâmetros (path):**

- `code` - Código NBS sem pontos (ex: `11302000101`)

**Exemplo de requisição:**

```bash
curl http://localhost:3001/api/v1/codes/11302000101
```

**Exemplo de resposta:**

```json
{
  "data": {
    "code": "1.1302.00.01.01",
    "description": "Serviços de auditoria contábil",
    "level": 1,
    "keywords": "auditoria contabilidade fiscal"
  },
  "cached": false
}
```

**Erro (404):**

```json
{
  "error": "Código não encontrado",
  "code": "99999999999"
}
```

---

#### 4. Buscar por Termo

```http
GET /api/v1/search?q=contabilidade&limit=10
```

**Parâmetros (query):**

- `q` (obrigatório) - Termo de busca (mínimo 2 caracteres)
- `limit` (opcional) - Máximo de resultados (padrão: 50, máx: 200)

**Exemplo de requisição:**

```bash
curl "http://localhost:3001/api/v1/search?q=contabilidade&limit=5"
```

**Exemplo de resposta:**

```json
{
  "data": [
    {
      "code": "1.1302.00.01.01",
      "description": "Serviços de auditoria contábil",
      "level": 1,
      "keywords": "auditoria contabilidade fiscal"
    },
    {
      "code": "1.1302.00.02.00",
      "description": "Serviços de escrituração contábil",
      "level": 1,
      "keywords": "escrituração contabilidade"
    }
  ],
  "query": "contabilidade",
  "count": 2,
  "limit": 5,
  "cached": false
}
```

**Erro (400):**

```json
{
  "error": "Parâmetro \"q\" obrigatório (mínimo 2 caracteres)"
}
```

---

#### 5. Listar Categorias

```http
GET /api/v1/categories?level=1
```

**Parâmetros (query):**

- `level` (opcional) - Filtrar por nível (1-4)

**Exemplo de resposta:**

```json
{
  "data": [
    {
      "level": 1,
      "name": "Nível 1",
      "count": 5234,
      "items": [
        {
          "code": "1.1302.00.01.01",
          "description": "Serviços de auditoria contábil"
        }
      ]
    }
  ],
  "cached": false
}
```

---

#### 6. Documentação Interativa

```http
GET /api/v1/docs
```

Retorna documentação completa da API em JSON com exemplos de uso.

---

## 💻 Exemplos de Uso

### JavaScript (Fetch API)

```javascript
// Buscar código específico
async function getCode(code) {
  const response = await fetch(`http://localhost:3001/api/v1/codes/${code}`);
  const data = await response.json();
  return data;
}

// Buscar por termo
async function search(term) {
  const response = await fetch(
    `http://localhost:3001/api/v1/search?q=${encodeURIComponent(term)}&limit=20`,
  );
  const data = await response.json();
  return data;
}

// Listar com paginação
async function listCodes(page = 1, limit = 50) {
  const response = await fetch(
    `http://localhost:3001/api/v1/codes?page=${page}&limit=${limit}`,
  );
  const data = await response.json();
  return data;
}

// Uso
const result = await search("contabilidade");
console.log(result.data);
```

### cURL

```bash
# Health check
curl http://localhost:3001/api/v1/health

# Listar códigos (página 1, 20 itens)
curl "http://localhost:3001/api/v1/codes?page=1&limit=20"

# Buscar código específico
curl http://localhost:3001/api/v1/codes/11302000101

# Buscar por termo
curl "http://localhost:3001/api/v1/search?q=contabilidade&limit=10"

# Listar categorias (nível 1)
curl "http://localhost:3001/api/v1/categories?level=1"
```

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:3001/api/v1"

# Buscar código
def get_code(code):
    response = requests.get(f"{BASE_URL}/codes/{code}")
    return response.json()

# Buscar por termo
def search(term, limit=50):
    response = requests.get(f"{BASE_URL}/search", params={"q": term, "limit": limit})
    return response.json()

# Listar códigos
def list_codes(page=1, limit=50, level=None):
    params = {"page": page, "limit": limit}
    if level:
        params["level"] = level
    response = requests.get(f"{BASE_URL}/codes", params=params)
    return response.json()

# Uso
result = search("contabilidade", limit=10)
print(result["data"])
```

---

## 🔒 Rate Limiting

A API possui limitação de taxa para prevenir abuso:

- **Limite:** 100 requisições por 15 minutos por IP
- **Headers:** `RateLimit-*` incluídos nas respostas
- **Resposta (429):**

```json
{
  "error": "Muitas requisições deste IP, tente novamente em 15 minutos.",
  "retryAfter": "15 minutos",
  "limit": 100,
  "window": "15 minutos"
}
```

---

## ⚡ Cache

Respostas são cacheadas em memória por 1 hora (configurável):

- **TTL padrão:** 3600 segundos (1 hora)
- **Invalidação:** Automática após recarregar dataset
- **Indicador:** Campo `"cached": true` na resposta

---

## 🚀 Deploy

### Vercel

1. Instale o Vercel CLI:

```bash
npm i -g vercel
```

2. No diretório `api/`, execute:

```bash
vercel
```

3. Configure as variáveis de ambiente no dashboard da Vercel.

### Railway

1. Crie conta em [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure `ROOT_DIRECTORY` para `api/`
4. Adicione variáveis de ambiente
5. Deploy automático!

### Render

1. Crie conta em [render.com](https://render.com)
2. New > Web Service
3. Conecte repositório
4. Configure:
   - **Root Directory:** `api/`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Adicione variáveis de ambiente

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

**Build e run:**

```bash
docker build -t nbs-helper-api .
docker run -p 3001:3001 --env-file .env nbs-helper-api
```

---

## 🛡️ Segurança

- ✅ Helmet.js para headers de segurança
- ✅ Rate limiting por IP
- ✅ CORS configurável
- ✅ Validação de parâmetros
- ✅ Apenas métodos GET permitidos
- ✅ Error handling robusto

---

## 📊 Códigos de Status

- `200` - Sucesso
- `400` - Parâmetros inválidos
- `404` - Recurso não encontrado
- `429` - Limite de taxa excedido
- `500` - Erro interno do servidor
- `503` - Serviço temporariamente indisponível

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Licença

MIT © Harlem Silvas

---

## 📞 Suporte

- **Email:** contato@nbs-helper.com
- **Issues:** [GitHub Issues](https://github.com/harlemsilvas/nbs-helper/issues)
- **Docs:** http://localhost:3001/api/v1/docs

---

## 🗺️ Roadmap

- [ ] Autenticação com API Key
- [ ] WebSocket para atualizações em tempo real
- [ ] GraphQL endpoint
- [ ] Exportação para CSV/Excel
- [ ] Webhooks para notificações
- [ ] SDK oficial (JavaScript, Python)
- [ ] Swagger/OpenAPI docs
- [ ] Métricas e analytics

---

**Feito com ❤️ por Harlem Silvas**
