#!/usr/bin/env node
// §3 26-field completeness audit over shared/data/models.json.
// Outputs: (1) summary counts per field, (2) a 120x26 CSV matrix.
// 26 fields = §3's 25 canonical model-page fields + production_status.
// Model-level fields are read directly; trim-level spec fields (engine/battery/
// battery capacity/range/dimensions/drive/transmission/charging) are aggregated
// across all generations→trims.
import { readFileSync, writeFileSync } from "node:fs";

const models = JSON.parse(readFileSync("shared/data/models.json", "utf8")).models;
const brands = JSON.parse(readFileSync("shared/data/brands.json", "utf8")).brands;
const brandIds = new Set(brands.map((b) => b.brand_id));

const allTrims = (m) => (m.generations ?? []).flatMap((g) => g.trims ?? []);
const anySpec = (m, key) => {
  for (const t of allTrims(m)) {
    const v = t.specs?.[key];
    if (v !== null && v !== undefined && v !== "") return true;
  }
  return false;
};
const anyTrimHas = (m, fn) => allTrims(m).some(fn);

// 26 field checks (name -> boolean function)
const FIELDS = [
  { id: "brand", name: "Brand", fn: (m) => brandIds.has(m.brand_id) },
  { id: "model", name: "Model", fn: (m) => !!m.name },
  { id: "generation", name: "Generation", fn: (m) => (m.generations ?? []).length > 0 },
  { id: "trim", name: "Trim", fn: (m) => allTrims(m).length > 0 },
  { id: "production_years", name: "Production years", fn: (m) => (m.generations ?? []).some((g) => (g.production_years ?? []).length > 0) },
  { id: "body_type", name: "Body type", fn: (m) => !!m.body_type },
  { id: "powertrain", name: "Powertrain", fn: (m) => (m.powertrain_types ?? []).length > 0 },
  { id: "engine", name: "Engine", fn: (m) => anySpec(m, "engine") || anySpec(m, "engine_displacement_cc") },
  { id: "battery", name: "Battery", fn: (m) => anySpec(m, "battery_capacity_kwh") || anySpec(m, "motor_power_kw") },
  { id: "battery_capacity", name: "Battery capacity", fn: (m) => anySpec(m, "battery_capacity_kwh") },
  { id: "range", name: "Range", fn: (m) => anySpec(m, "range_km") },
  { id: "dimensions", name: "Dimensions", fn: (m) => anySpec(m, "length_mm") && anySpec(m, "width_mm") },
  { id: "drive_type", name: "Drive type", fn: (m) => anySpec(m, "drive_type") },
  { id: "transmission", name: "Transmission", fn: (m) => anySpec(m, "transmission") },
  { id: "charging", name: "Charging", fn: (m) => anySpec(m, "charging") || !!m.charging_standard_notes },
  { id: "lhd_rhd", name: "LHD/RHD", fn: (m) => !!m.left_hand_drive_relevance || !!m.right_hand_drive_relevance },
  { id: "china_market_status", name: "China-market status", fn: (m) => !!m.china_market_status },
  { id: "export_relevance", name: "Export relevance", fn: (m) => !!m.export_relevance },
  { id: "used_market", name: "Used-market considerations", fn: (m) => !!(m.used_market_considerations ?? null) },
  { id: "destination_market", name: "Destination-market considerations", fn: (m) => !!(m.destination_market_considerations ?? null) },
  { id: "parts_service", name: "Parts/service considerations", fn: (m) => !!(m.parts_service_considerations ?? null) },
  { id: "known_limitations", name: "Known limitations", fn: (m) => !!(m.known_limitations ?? null) },
  { id: "sources", name: "Sources", fn: (m) => !!m.source_name && !!m.source_url },
  { id: "confidence", name: "Confidence", fn: (m) => !!m.confidence },
  { id: "last_checked", name: "Last checked", fn: (m) => !!m.checked_date },
  { id: "production_status", name: "Production status", fn: (m) => !!m.production_status },
];

const counts = {};
for (const f of FIELDS) counts[f.id] = 0;

const csvRows = [];
csvRows.push("model_id,brand_id," + FIELDS.map((f) => f.id).join(","));
for (const m of models) {
  const row = [];
  for (const f of FIELDS) {
    const ok = f.fn(m);
    if (ok) counts[f.id]++;
    row.push(ok ? "1" : "0");
  }
  csvRows.push(`${m.model_id},${m.brand_id},${row.join(",")}`);
}

// Summary
console.log(`== 26-field audit: ${models.length} models x ${FIELDS.length} fields ==`);
console.log("");
console.log("field,coverage");
for (const f of FIELDS) {
  const n = counts[f.id];
  console.log(`${f.name},${n}/${models.length}`);
}
console.log("");
const missing = FIELDS.filter((f) => counts[f.id] < models.length).sort((a, b) => counts[a.id] - counts[b.id]);
console.log(`== Fields with gaps (${missing.length}/${FIELDS.length}) ==`);
for (const f of missing) console.log(`  ${f.name}: ${counts[f.id]}/${models.length} (missing ${models.length - counts[f.id]})`);

writeFileSync("docs/audit-26fields-matrix.csv", csvRows.join("\n") + "\n");
console.log("");
console.log("Wrote docs/audit-26fields-matrix.csv");
