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
  console.log("🔄 Gerando índice de busca...");

  if (!fs.existsSync(IN_JSON)) {
    console.error("❌ Arquivo não encontrado:", IN_JSON);
    console.error("💡 Execute primeiro: npm run import:nbs");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
  const items = raw.items || [];

  if (items.length === 0) {
    console.error("❌ Nenhum item encontrado no arquivo!");
    process.exit(1);
  }

  const index = {
    version: raw.version || "NBSa_2-0",
    generatedAt: new Date().toISOString(),
    totalItems: items.length,
    items: items.map((i) => ({
      code: i.code,
      description: i.description,
      level: i.level,
      keywords: i.keywords || [],
    })),
  };

  fs.writeFileSync(OUT_INDEX, JSON.stringify(index, null, 2), "utf8");

  console.log(`✅ Índice gerado!`);
  console.log(`📄 Arquivo: ${OUT_INDEX}`);
  console.log(`📊 Total de itens: ${index.totalItems}`);
  console.log(`\n💡 Próximo passo: npm run dev:web`);
}

main();
