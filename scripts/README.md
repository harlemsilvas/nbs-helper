# Scripts de Importação NBS

## Scripts disponíveis

### import_nbs_node.js
Importa o CSV oficial da NBS 2.0 e converte para JSON normalizado.

**Uso:**
```bash
npm run import:nbs
```

**Entrada:** `data/raw/NBSa_2-0.csv`  
**Saída:** `data/generated/nbs.json`

### build_index.js
Gera índice otimizado para busca no frontend.

**Uso:**
```bash
npm run build:index
```

**Entrada:** `data/generated/nbs.json`  
**Saída:** `data/generated/index.json`

## Fluxo completo

```bash
# Executar ambos de uma vez
npm run prepare:data
```

## Download do CSV

O CSV oficial está disponível em:
https://www.gov.br/mdic/pt-br/images/REPOSITORIO/scs/decos/NBS/NBSa_2-0.csv

Salve em: `data/raw/NBSa_2-0.csv`
