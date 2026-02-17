import Fuse from "fuse.js";

let fuse = null;
let dataset = null;

export async function loadIndex() {
  if (fuse) return;

  const url = `${import.meta.env.BASE_URL}index.json`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Falha ao carregar index.json (${res.status}) em: ${url}`);
  }

  const contentType = res.headers.get("content-type") || "";
  const rawText = await res.text();
  const cleaned = rawText.replace(/^\uFEFF/, "");

  // Se veio HTML em vez de JSON, estoura com mensagem clara
  if (
    !contentType.includes("application/json") &&
    cleaned.trim().startsWith("<")
  ) {
    throw new Error(
      `index.json retornou HTML (provável 404/fallback). URL: ${url}. Início: ${cleaned
        .slice(0, 80)
        .replace(/\s+/g, " ")}`,
    );
  }

  dataset = JSON.parse(cleaned);

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

  if (!q) return dataset.items?.slice(0, 50) ?? [];

  const results = fuse.search(q).slice(0, 50);
  return results.map((r) => r.item);
}

export function getDatasetInfo() {
  if (!dataset) return null;
  return {
    version: dataset.version ?? null,
    totalItems: dataset.totalItems ?? dataset.items?.length ?? 0,
    generatedAt: dataset.generatedAt ?? null,
  };
}
