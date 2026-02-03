# 🔧 Troubleshooting - NBS Helper

## Problema: Acentos errados no CSV (CORRIGIDO!)

### Sintomas:
- "DESCRI��O" ao invés de "DESCRIÇÃO"
- "constru��o" ao invés de "construção"
- Caracteres especiais aparecem como ��

### Causa:
CSV do gov.br está em **ISO-8859-1**, mas estava sendo lido como UTF-8.

### Solução (já aplicada):
O script agora detecta automaticamente o encoding e converte para UTF-8.

```bash
# Re-importar com encoding correto
npm run prepare:data

# Copiar para webapp
cp data/generated/index.json apps/web/public/
```

**Status:** ✅ Corrigido automaticamente!

---

## Problema: Tailwind CSS não funciona

### Erro:
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

### Solução (já aplicada):
```bash
cd apps/web
npm uninstall tailwindcss
npm install -D tailwindcss@^3
npm run dev
```

**Causa:** Tailwind v4 mudou a arquitetura. Projeto está usando v3 (estável).

---

## Problema: Webapp não carrega dados

### Sintomas:
- Busca não retorna resultados
- Erro 404 para `/index.json`

### Solução:
```bash
# 1. Verificar se o índice existe
ls data/generated/index.json

# 2. Se não existir, gerar
npm run prepare:data

# 3. Copiar para public
cp data/generated/index.json apps/web/public/

# 4. Reiniciar servidor
npm run dev:web
```

---

## Problema: CSV não baixa

### Sintomas:
- Erro ao executar `npm run prepare:data`
- Arquivo `data/raw/NBSa_2-0.csv` não existe

### Solução:
```bash
# Baixar manualmente
curl -L -o data/raw/NBSa_2-0.csv \
  "https://www.gov.br/mdic/pt-br/images/REPOSITORIO/scs/decos/NBS/NBSa_2-0.csv"

# Depois processar
npm run prepare:data
```

---

## Problema: Favoritos não salvam

### Possíveis causas:

1. **LocalStorage desabilitado**
   - Verificar se o navegador permite LocalStorage
   - Testar em modo anônimo
   
2. **Cota excedida**
   - Limpar LocalStorage: F12 → Application → LocalStorage → Clear

3. **Código não está salvando**
   - Abrir console: F12 → Console
   - Procurar por erros

### Solução:
```javascript
// Testar no console do navegador:
localStorage.setItem('test', 'ok');
localStorage.getItem('test'); // deve retornar 'ok'
```

---

## Problema: Busca muito lenta

### Sintomas:
- Demora > 1s para retornar resultados

### Verificar:
1. **Tamanho do índice**
   ```bash
   ls -lh apps/web/public/index.json
   # Deve ter ~200-300KB
   ```

2. **Console do navegador**
   - F12 → Network → Verificar se `index.json` está sendo cacheado

### Solução:
- Busca já está otimizada com Fuse.js
- Se ainda lento, aumentar `threshold` em `searchLocal.js`:
  ```js
  threshold: 0.4  // Menos preciso, mais rápido
  ```

---

## Problema: API não inicia

### Erro:
```
Cannot find module 'express'
```

### Solução:
```bash
cd apps/api
npm install
npm run dev
```

---

## Problema: Porta já em uso

### Erro:
```
EADDRINUSE: address already in use :::5173
```

### Solução:
```bash
# Encontrar processo na porta
lsof -i :5173

# Matar processo
kill -9 <PID>

# Ou usar outra porta
PORT=5174 npm run dev:web
```

---

## Problema: Build falha

### Sintomas:
```bash
npm run build:web
# Erro durante build
```

### Verificar:
1. **Todas as dependências instaladas**
   ```bash
   cd apps/web
   rm -rf node_modules
   npm install
   ```

2. **Índice existe no public**
   ```bash
   ls apps/web/public/index.json
   ```

3. **Sem erros no código**
   - Verificar console do dev server

---

## Problema: Extensão não funciona (Futuro)

### Para quando implementar extensão:

1. **Manifest v3**
   - Chrome/Edge exigem MV3
   - Revisar permissões

2. **CORS**
   - Extensões têm políticas diferentes
   - Configurar corretamente

---

## Problema: Deploy falha

### Vercel (Frontend)

**Erro comum:** Build timeout

**Solução:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Render/Railway (Backend)

**Erro comum:** Porta errada

**Solução:**
```js
// server.js
const PORT = process.env.PORT || 3001;
```

---

## Logs e Debug

### Frontend
```bash
# Console do navegador
F12 → Console

# Network
F12 → Network → Filtrar por 'index.json'

# React DevTools
Instalar extensão React DevTools
```

### Backend
```bash
# Logs da API
cd apps/api
npm run dev
# Verificar output no terminal
```

### Dados
```bash
# Verificar estrutura do índice
cat data/generated/index.json | jq '.items | length'

# Ver amostra de dados
cat data/generated/index.json | jq '.items[0]'
```

---

## Reset Completo

Se nada funcionar:

```bash
# 1. Limpar tudo
cd /home/harlem/projetos/zipados/apps/microSaas
rm -rf node_modules apps/*/node_modules
rm -rf data/generated/*
rm apps/web/public/index.json

# 2. Reinstalar
npm install
cd apps/web && npm install
cd ../api && npm install

# 3. Reprocessar dados
cd ../..
npm run prepare:data
cp data/generated/index.json apps/web/public/

# 4. Testar
npm run dev:web
```

---

## Contato/Suporte

### Documentação
- [README.md](README.md) - Visão geral
- [GETTING_STARTED.md](GETTING_STARTED.md) - Como usar
- [CHECKLIST.md](CHECKLIST.md) - Testes

### Issues Conhecidos
- Tailwind v4 incompatível → Usar v3 ✅
- CSV com encoding especial → Parser detecta automaticamente ✅

---

**Última atualização:** 03/02/2026  
**Versão:** MVP 0.1.0
