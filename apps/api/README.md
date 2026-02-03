# NBS Helper API

API REST para busca de códigos NBS 2.0.

## Endpoints

### `GET /health`
Health check da API.

**Resposta:**
```json
{
  "status": "ok",
  "version": "NBSa_2-0",
  "totalItems": 1237,
  "timestamp": "2026-02-03T..."
}
```

### `GET /meta`
Metadados do dataset.

**Resposta:**
```json
{
  "version": "NBSa_2-0",
  "importedAt": "2026-02-03T...",
  "totalItems": 1237
}
```

### `GET /search?q=software&limit=20&offset=0`
Busca por texto.

**Parâmetros:**
- `q` - Termo de busca (opcional)
- `limit` - Limite de resultados (padrão: 50)
- `offset` - Offset para paginação (padrão: 0)

**Resposta:**
```json
{
  "query": "software",
  "total": 45,
  "limit": 20,
  "offset": 0,
  "results": [...]
}
```

### `GET /item/:code`
Buscar item específico por código.

**Resposta:**
```json
{
  "code": "1.0101",
  "description": "...",
  "level": "subitem",
  "keywords": [...]
}
```

## Como rodar

```bash
npm install
npm run dev
```

API disponível em: `http://localhost:3001`
