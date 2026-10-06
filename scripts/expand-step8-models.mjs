// STEP 8 — model expansion: append 100 new sourced models to models.json,
// then reconcile brand.powertrains/vehicle_types to match actual model union.
import { readFileSync, writeFileSync } from "node:fs";

const CHECKED = "2026-10-06";

const flat = JSON.parse(readFileSync("scripts/step8-new-models.json", "utf8"));

const SOURCE_NAMES = {
  manufacturer: "Manufacturer published specifications",
  official: "Official brand history",
  database: "Automotive specifications database",
  reputable_media: "Reputable media specifications",
};

const LHD_NOTE = "Standard — listed models are China domestic-market production (left-hand drive).";
const RHD_NOTE = "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.";
const EV_CHARGING_NOTE = "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.";

function isElectrified(powertrains) {
  return powertrains.some((p) => p === "ev" || p === "phev" || p === "erev");
}

function buildModel(r) {
  const source_type = r.source_type;
  const source_name = SOURCE_NAMES[source_type] ?? "Reputable media specifications";
  const electrified = isElectrified(r.powertrain_types);
  const production_status =
    r.production_years && r.production_years.length >= 2 && r.production_years[1] < 2025
      ? "discontinued"
      : "active";

  const specs = {
    length_mm: r.length_mm ?? null,
    width_mm: r.width_mm ?? null,
    height_mm: r.height_mm ?? null,
    wheelbase_mm: r.wheelbase_mm ?? null,
    engine: r.engine ?? null,
    engine_displacement_cc: r.engine_displacement_cc ?? null,
    motor_power_kw: r.motor_power_kw ?? null,
    battery_capacity_kwh: r.battery_capacity_kwh ?? null,
    range_km: r.range_km ?? null,
    transmission: r.transmission ?? null,
    drive_type: r.drive_type ?? null,
    seats: r.seats ?? null,
  };

  const genId = `${r.model_id}-g1`;
  const trimId = `${r.model_id}-g1-${r.trim_powertrain}`;
  const prov = {
    source_name,
    source_url: r.source_url,
    source_type,
    checked_date: CHECKED,
    confidence: r.confidence,
    last_verified: CHECKED,
  };

  const trim = {
    trim_id: trimId,
    name: r.trim_name,
    powertrain: r.trim_powertrain,
    production_years: r.production_years,
    specs,
    ...prov,
  };

  const generation = {
    generation_id: genId,
    name: "First Generation",
    production_years: r.production_years,
    platform: null,
    facelift: null,
    trims: [trim],
    ...prov,
  };

  return {
    model_id: r.model_id,
    brand_id: r.brand_id,
    name: r.name,
    name_zh: r.name_zh,
    aliases: null,
    vehicle_type: "passenger_car",
    body_type: r.body_type,
    powertrain_types: r.powertrain_types,
    production_status,
    china_market_status: r.china_market_status ?? null,
    export_relevance: null,
    common_export_regions: null,
    powertrain_export_relevance: electrified
      ? "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination."
      : "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: RHD_NOTE,
    left_hand_drive_relevance: LHD_NOTE,
    market_considerations: null,
    parts_availability_notes: null,
    charging_standard_notes: electrified ? EV_CHARGING_NOTE : null,
    homologation_notes: null,
    generations: [generation],
    ...prov,
  };
}

const modelsData = JSON.parse(readFileSync("shared/data/models.json", "utf8"));
const existing = new Set(modelsData.models.map((m) => m.model_id));
const newModels = [];
for (const r of flat) {
  if (existing.has(r.model_id)) {
    console.error("SKIP duplicate model_id:", r.model_id);
    continue;
  }
  newModels.push(buildModel(r));
}
modelsData.models.push(...newModels);
writeFileSync("shared/data/models.json", JSON.stringify(modelsData, null, 2) + "\n");

// ---- Reconcile brands: powertrains = union of model powertrains, vehicle_types = union of body_types ----
const brandsData = JSON.parse(readFileSync("shared/data/brands.json", "utf8"));
const unionPowertrain = new Map();
const unionBodyType = new Map();
for (const m of modelsData.models) {
  if (!unionPowertrain.has(m.brand_id)) unionPowertrain.set(m.brand_id, new Set());
  if (!unionBodyType.has(m.brand_id)) unionBodyType.set(m.brand_id, new Set());
  for (const p of m.powertrain_types ?? []) unionPowertrain.get(m.brand_id).add(p);
  if (m.body_type) unionBodyType.get(m.brand_id).add(m.body_type);
}
const ORDER = ["ev", "phev", "erev", "hev", "ice"];
for (const b of brandsData.brands) {
  const pt = Array.from(unionPowertrain.get(b.brand_id) ?? []).sort(
    (a, c) => ORDER.indexOf(a) - ORDER.indexOf(c)
  );
  const vt = Array.from(unionBodyType.get(b.brand_id) ?? []);
  if (pt.length) b.powertrains = pt;
  if (vt.length) b.vehicle_types = vt;
}
writeFileSync("shared/data/brands.json", JSON.stringify(brandsData, null, 2) + "\n");

console.log("models total:", modelsData.models.length, "added:", newModels.length);
console.log("brands total:", brandsData.brands.length);
