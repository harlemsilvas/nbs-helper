# Problema de Encoding Resolvido

## Problema Identificado

O CSV do gov.br estava sendo importado com caracteres incorretos:
- "DESCRI��O" 
- "constru��o"
- "edifica��es"

## Causa

O arquivo CSV está em **ISO-8859-1** (encoding Latin-1), mas estava sendo lido como UTF-8.

## Solução Aplicada

Atualizei o script `scripts/import_nbs_node.js` para:

1. Detectar automaticamente o encoding (ISO-8859-1, Windows-1252 ou UTF-8)
2. Converter para UTF-8 antes de processar
3. Preservar todos os caracteres especiais (ç, ã, õ, é, á, etc)

## Resultado

Agora os dados estão corretos:
- "DESCRIÇÃO"
- "construção"
- "edificações"

## Dados Atualizados

- 1237 códigos reimportados com acentuação correta
- Índice de busca regenerado
- Webapp atualizado automaticamente

## Verificar

```bash
# Ver descrições corretas
head -30 data/generated/nbs.json

# Buscar um termo com acento
grep "construção" data/generated/nbs.json
```

## Próximos Downloads

O script agora está preparado para qualquer encoding que o gov.br usar no futuro. Apenas execute:

```bash
npm run prepare:data
```

---

**Status:** ✅ **RESOLVIDO**  
**Data:** 03/02/2026  
**Encoding usado:** ISO-8859-1 → UTF-8
