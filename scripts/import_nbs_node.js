/**
 * Importa CSV NBS 2.0 -> JSON normalizado.
 * Requisitos: npm i csv-parse iconv-lite
 * 
 * Fonte: https://www.gov.br/mdic/pt-br/assuntos/sdic/comercio-e-servicos/nbs-nomenclatura-brasileira-de-servicos
 */
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const iconv = require("iconv-lite");

const RAW_CSV = path.resolve(__dirname, "../data/raw/NBSa_2-0.csv");
const OUT_JSON = path.resolve(__dirname, "../data/generated/nbs.json");

function normalizeText(s) {
  return (s || "")
    .toString()
    .trim()
    .replace(/\s+/g, " ");
}

function tokenize(text) {
  // Token simples (pode evoluir com stemming depois)
  return normalizeText(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

function deriveLevel(code) {
  // Derivar nível pela estrutura do código (ex: "1.0101" = subitem)
  const parts = code.split('.');
  if (parts.length === 1) return 'capítulo';
  if (parts.length === 2 && parts[1].length === 2) return 'grupo';
  if (parts.length === 2 && parts[1].length === 4) return 'subgrupo';
  return 'subitem';
}

function main() {
  console.log("🔄 Importando NBS 2.0...");

  if (!fs.existsSync(RAW_CSV)) {
    console.error("❌ CSV não encontrado:", RAW_CSV);
    console.error("📥 Baixe o arquivo em: https://www.gov.br/mdic/pt-br/images/REPOSITORIO/scs/decos/NBS/NBSa_2-0.csv");
    process.exit(1);
  }

  // Ler arquivo com encoding correto (ISO-8859-1 / Windows-1252)
  const csvBuffer = fs.readFileSync(RAW_CSV);
  
  // Tentar detectar encoding e converter para UTF-8
  let csvContent;
  try {
    // Primeiro tentar ISO-8859-1
    csvContent = iconv.decode(csvBuffer, "ISO-8859-1");
    console.log("✅ Encoding detectado: ISO-8859-1");
  } catch (e) {
    try {
      // Fallback para Windows-1252
      csvContent = iconv.decode(csvBuffer, "Windows-1252");
      console.log("✅ Encoding detectado: Windows-1252");
    } catch (e2) {
      // Último recurso: UTF-8
      csvContent = csvBuffer.toString("utf8");
      console.log("⚠️  Usando UTF-8 (pode ter problemas com acentos)");
    }
  }

  // Tentar diferentes delimitadores
  let records;
  let delimiter = ";";
  
  try {
    records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ";",
      relax_column_count: true,
    });
  } catch (e) {
    console.log("⚠️  Tentando com delimitador ','...");
    delimiter = ",";
    records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
      relax_column_count: true,
    });
  }

  console.log(`✅ CSV parseado com delimitador '${delimiter}'`);
  console.log(`📊 Total de linhas: ${records.length}`);
  
  if (records.length > 0) {
    console.log(`📋 Colunas encontradas:`, Object.keys(records[0]));
  }

  // Detectar colunas automaticamente (código e descrição)
  const firstRecord = records[0] || {};
  const headers = Object.keys(firstRecord);
  
  const codeKey = headers.find((k) => /cod|codigo|code/i.test(k)) || headers[0];
  const descKey = headers.find((k) => /desc|descri|denomination|denominacao/i.test(k)) || headers[1];

  console.log(`🔍 Usando coluna código: "${codeKey}"`);
  console.log(`🔍 Usando coluna descrição: "${descKey}"`);

  const items = records
    .map((r, idx) => {
      const code = normalizeText(r[codeKey]);
      const description = normalizeText(r[descKey]);

      if (!code || !description) {
        if (idx < 5) console.warn(`⚠️  Linha ${idx + 2} ignorada (dados incompletos)`);
        return null;
      }

      return {
        code,
        description,
        level: deriveLevel(code),
        keywords: Array.from(new Set(tokenize(description))),
      };
    })
    .filter(Boolean);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify({ 
      version: "NBSa_2-0",
      importedAt: new Date().toISOString(),
      items 
    }, null, 2),
    "utf8"
  );

  console.log(`✅ Importação concluída!`);
  console.log(`📄 Arquivo gerado: ${OUT_JSON}`);
  console.log(`📊 Total de itens: ${items.length}`);
  console.log(`\n💡 Próximo passo: npm run build:index`);
}

main();
