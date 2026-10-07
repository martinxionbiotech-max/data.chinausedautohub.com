#!/usr/bin/env node
// PHASE 2 merge: apply the 4 evidence-backed analysis fields (used_market /
// destination_market / parts_service / known_limitations) from the research
// batch files into shared/data/models.json for the top-50 high-value models.
// Normalisation: derive source_name from the URL host when absent; enforce
// legal source_type/confidence enums; enforce checked_date=2026-10-07.
import { readFileSync, writeFileSync } from "node:fs";

const MODELS_PATH = "shared/data/models.json";
const OUT_DIR = "scripts/research-out";

const SOURCE_TYPES = new Set([
  "official", "manufacturer", "government", "regulatory", "industry",
  "reputable_media", "database", "market_observation", "calculated", "estimated",
]);
const CONFIDENCE = new Set(["high", "medium", "low"]);
const FIELDS = ["used_market", "destination_market", "parts_service", "known_limitations"];
const FIELD_KEY = {
  used_market: "used_market_considerations",
  destination_market: "destination_market_considerations",
  parts_service: "parts_service_considerations",
  known_limitations: "known_limitations",
};

function hostLabel(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function normalize(note) {
  if (!note || !note.text) return null;
  if (!note.source_url || !/^https?:\/\//i.test(note.source_url)) return null;
  const sourceType = SOURCE_TYPES.has(note.source_type) ? note.source_type : "reputable_media";
  const confidence = CONFIDENCE.has(note.confidence) ? note.confidence : "medium";
  const source_name = note.source_name || hostLabel(note.source_url) || "Source";
  return {
    text: note.text,
    source_name,
    source_url: note.source_url,
    source_type: sourceType,
    checked_date: "2026-10-07",
    confidence,
  };
}

const models = JSON.parse(readFileSync(MODELS_PATH, "utf8"));
const modelById = new Map(models.models.map((m) => [m.model_id, m]));

const batches = ["b1", "b2", "b3", "b4", "b5"];
const stats = { applied: 0, skipped: 0, missingModel: 0, perField: {} };
for (const k of Object.values(FIELD_KEY)) stats.perField[k] = 0;

for (const b of batches) {
  const data = JSON.parse(readFileSync(`${OUT_DIR}/${b}.json`, "utf8"));
  for (const entry of data) {
    const m = modelById.get(entry.model_id);
    if (!m) {
      console.error(`  [SKIP] unknown model_id ${entry.model_id}`);
      stats.missingModel++;
      continue;
    }
    for (const f of FIELDS) {
      const note = normalize(entry[f]);
      m[FIELD_KEY[f]] = note;
      if (note) { stats.applied++; stats.perField[FIELD_KEY[f]]++; }
      else stats.skipped++;
    }
  }
}

writeFileSync(MODELS_PATH, JSON.stringify(models, null, 2) + "\n");

console.log("== PHASE 2 analysis merge ==");
console.log(`notes applied: ${stats.applied} | null/skipped: ${stats.skipped} | unknown model: ${stats.missingModel}`);
for (const [k, n] of Object.entries(stats.perField)) {
  console.log(`  ${k}: ${n}/50`);
}
