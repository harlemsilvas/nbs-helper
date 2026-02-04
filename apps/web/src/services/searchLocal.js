import Fuse from "fuse.js";

let fuse = null;
let dataset = null;

export async function loadIndex() {
  if (fuse) return;

  const res = await fetch("/index.json");
  dataset = await res.json();

  fuse = new Fuse(dataset.items, {
    includeScore: true,
    threshold: 0.35,
    keys: [
      { name: "description", weight: 0.7 },
      { name: "keywords", weight: 0.2 },
      { name: "code", weight: 0.1 },
    ],
  });
}

export async function searchNBS(query) {
  await loadIndex();
  const q = (query || "").trim();
  
  if (!q) {
    // Retorna os primeiros 50 itens se não houver busca
    return dataset.items.slice(0, 50);
  }

  const results = fuse.search(q).slice(0, 50);
  return results.map((r) => r.item);
}

export function getDatasetInfo() {
  if (!dataset) return null;
  return {
    version: dataset.version,
    totalItems: dataset.totalItems,
    generatedAt: dataset.generatedAt,
    items: dataset.items, // Incluir items para acesso direto
  };
}
