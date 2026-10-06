#!/usr/bin/env node
// Data quality gate for ChinaUsedAutoHub DATA sub-site (§15).
// Checks: duplicate / missing / invalid / source / SEO basics on
// shared/data/brands.json + shared/data/models.json against the unified schema.
// Run from repo root: node scripts/qa_data.mjs
import { readFileSync } from "node:fs";

const brandsData = JSON.parse(readFileSync("shared/data/brands.json", "utf8")).brands;
const modelsData = JSON.parse(readFileSync("shared/data/models.json", "utf8")).models;

const SOURCE_TYPES = new Set([
  "official", "manufacturer", "government", "regulatory", "industry",
  "reputable_media", "database", "market_observation", "calculated", "estimated",
]);
const CONFIDENCE = new Set(["high", "medium", "low"]);
const POWERTRAINS = new Set(["ev", "phev", "hev", "ice", "erev"]);

let errors = 0;
let warnings = 0;
const err = (msg) => { errors++; console.error("  [ERROR] " + msg); };
const warn = (msg) => { warnings++; console.error("  [WARN]  " + msg); };

function checkProvenance(obj, where, requireUrl = false) {
  if (obj.source_name == null) err(`${where}: missing source_name`);
  if (obj.source_type == null) {
    err(`${where}: missing source_type`);
  } else if (!SOURCE_TYPES.has(obj.source_type)) {
    err(`${where}: invalid source_type "${obj.source_type}"`);
  }
  if (obj.confidence == null) {
    err(`${where}: missing confidence`);
  } else if (!CONFIDENCE.has(obj.confidence)) {
    err(`${where}: invalid confidence "${obj.confidence}"`);
  }
  if (obj.source_url == null) {
    warn(`${where}: source_url is null (no verified URL)`);
  } else if (!/^https?:\/\//i.test(obj.source_url)) {
    err(`${where}: source_url not a valid URL: "${obj.source_url}"`);
  }
  if (obj.checked_date == null) warn(`${where}: checked_date is null`);
  if (obj.last_verified == null) warn(`${where}: last_verified is null`);
  // estimated/calculated must not masquerade as high confidence fact
  if (
    (obj.source_type === "estimated" || obj.source_type === "calculated") &&
    obj.confidence === "high"
  ) {
    err(`${where}: estimated/calculated source must not claim confidence=high`);
  }
}

// ---------- Brands ----------
console.log("Brands:", brandsData.length);
{
  const ids = new Set();
  const names = new Set();
  for (const b of brandsData) {
    if (ids.has(b.brand_id)) err(`Brand duplicate id: ${b.brand_id}`);
    ids.add(b.brand_id);
    if (names.has(b.name)) err(`Brand duplicate name: ${b.name}`);
    names.add(b.name);
    if (!b.name) err(`Brand ${b.brand_id}: missing name`);
    if (!b.origin_country) err(`Brand ${b.brand_id}: missing origin_country`);
    if (b.founded == null) err(`Brand ${b.brand_id}: missing founded`);
    if (!Array.isArray(b.powertrains) || b.powertrains.length === 0)
      warn(`Brand ${b.brand_id}: empty powertrains[]`);
    for (const p of b.powertrains ?? []) {
      if (!POWERTRAINS.has(p)) err(`Brand ${b.brand_id}: invalid powertrain "${p}"`);
    }
    checkProvenance(b, `Brand ${b.brand_id}`);
  }
}

// ---------- Models ----------
console.log("Models:", modelsData.length);
const brandIds = new Set(brandsData.map((b) => b.brand_id));
const modelIds = new Set();
{
  for (const m of modelsData) {
    const where = `Model ${m.model_id}`;
    if (modelIds.has(m.model_id)) err(`Model duplicate id: ${m.model_id}`);
    modelIds.add(m.model_id);
    if (!m.name) err(`${where}: missing name`);
    if (!brandIds.has(m.brand_id)) err(`${where}: brand_id "${m.brand_id}" not found in brands`);
    if (!m.body_type) err(`${where}: missing body_type`);
    if (m.production_status == null) warn(`${where}: missing production_status`);
    if (!Array.isArray(m.powertrain_types) || m.powertrain_types.length === 0)
      warn(`${where}: empty powertrain_types`);
    for (const p of m.powertrain_types ?? []) {
      if (!POWERTRAINS.has(p)) err(`${where}: invalid powertrain_types "${p}"`);
    }
    if (m.export_relevance && !Array.isArray(m.common_export_regions))
      warn(`${where}: export_relevance set but common_export_regions missing`);
    checkProvenance(m, where);

    // generations
    if (!Array.isArray(m.generations) || m.generations.length === 0)
      err(`${where}: missing generations`);
    const genIds = new Set();
    for (const g of m.generations ?? []) {
      const gwhere = `${where} / Generation ${g.generation_id}`;
      if (genIds.has(g.generation_id)) err(`${gwhere}: duplicate generation_id`);
      genIds.add(g.generation_id);
      if (!g.name) err(`${gwhere}: missing name`);
      if (!Array.isArray(g.production_years) || g.production_years.length === 0)
        warn(`${gwhere}: missing production_years`);
      for (const y of g.production_years ?? []) {
        if (typeof y !== "number" || y < 1900 || y > 2100)
          err(`${gwhere}: invalid production year "${y}"`);
      }
      checkProvenance(g, gwhere);

      // trims
      const trimIds = new Set();
      if (!Array.isArray(g.trims) || g.trims.length === 0)
        warn(`${gwhere}: no trims`);
      for (const t of g.trims ?? []) {
        const twhere = `${gwhere} / Trim ${t.trim_id}`;
        if (trimIds.has(t.trim_id)) err(`${twhere}: duplicate trim_id`);
        trimIds.add(t.trim_id);
        if (!t.name) err(`${twhere}: missing name`);
        if (!POWERTRAINS.has(t.powertrain)) err(`${twhere}: invalid powertrain "${t.powertrain}"`);
        checkProvenance(t, twhere);

        // specs sanity
        const s = t.specs ?? {};
        if (s.length_mm != null && (s.length_mm < 2500 || s.length_mm > 7000))
          err(`${twhere}: implausible length_mm ${s.length_mm}`);
        if (s.wheelbase_mm != null && (s.wheelbase_mm < 1500 || s.wheelbase_mm > 4000))
          err(`${twhere}: implausible wheelbase_mm ${s.wheelbase_mm}`);
        if (s.range_km != null && (s.range_km < 20 || s.range_km > 1500))
          err(`${twhere}: implausible range_km ${s.range_km}`);
        if (s.battery_capacity_kwh != null && (s.battery_capacity_kwh < 5 || s.battery_capacity_kwh > 250))
          err(`${twhere}: implausible battery_capacity_kwh ${s.battery_capacity_kwh}`);
        // battery/range vs powertrain consistency
        if (t.powertrain === "ice" && s.battery_capacity_kwh != null)
          warn(`${twhere}: ICE trim has battery_capacity_kwh set`);
      }
    }
  }
}

// ---------- Cross-entity: brand.powertrains must equal union of model powertrains ----------
console.log("\nCross-entity checks:");
for (const b of brandsData) {
  const union = new Set();
  for (const m of modelsData) {
    if (m.brand_id !== b.brand_id) continue;
    for (const p of m.powertrain_types ?? []) union.add(p);
  }
  const expected = [...union].sort().join(",");
  const actual = [...(b.powertrains ?? [])].sort().join(",");
  if (expected !== actual)
    warn(`Brand ${b.brand_id}: powertrains [${actual}] ≠ model union [${expected}]`);
}

// ---------- Summary ----------
console.log("\n========================================");
console.log(`Errors:   ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log("========================================");
if (errors > 0) {
  console.error("QA FAILED — fix errors before build.");
  process.exit(1);
}
console.log("QA PASSED (warnings are non-blocking).");
