#!/usr/bin/env node
// Data quality gate for ChinaUsedAutoHub DATA sub-site (§15).
// Five check categories over shared/data/brands.json + shared/data/models.json
// plus the built dist/ HTML (SEO):
//   1. Duplicate  — duplicate brand/model/generation/trim id + name
//   2. Missing    — missing brand/model/generation relations
//   3. Invalid    — invalid year / impossible dimensions / inconsistent powertrain / battery-range conflict
//   4. SEO        — duplicate title / missing description / missing canonical / orphan page / broken internal link (+ stale link review)
//   5. Source     — empty/stale source_url / invalid URL / illegal confidence / illegal source_type
// Run from repo root:  npm run qa   (requires `npm run build` first for the SEO section)
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

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

// Stale threshold: a checked_date older than 12 months is considered stale.
function isStale(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return true;
  const t = Date.parse(date + "T00:00:00Z");
  if (Number.isNaN(t)) return true;
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  return Date.now() - t > oneYear;
}

function checkProvenance(obj, where) {
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
  if (obj.checked_date == null) {
    warn(`${where}: checked_date is null`);
  } else if (isStale(obj.checked_date)) {
    warn(`${where}: stale checked_date "${obj.checked_date}"`);
  }
  if (obj.last_verified == null) warn(`${where}: last_verified is null`);
  // estimated/calculated must not masquerade as high confidence fact
  if (
    (obj.source_type === "estimated" || obj.source_type === "calculated") &&
    obj.confidence === "high"
  ) {
    err(`${where}: estimated/calculated source must not claim confidence=high`);
  }
}

// ---------- 1. Duplicate ----------
console.log("== 1. Duplicate ==");
console.log("Brands:", brandsData.length, "| Models:", modelsData.length);
{
  const brandIds = new Set(), brandNames = new Set();
  for (const b of brandsData) {
    if (brandIds.has(b.brand_id)) err(`Brand duplicate id: ${b.brand_id}`);
    brandIds.add(b.brand_id);
    if (brandNames.has(b.name)) err(`Brand duplicate name: ${b.name}`);
    brandNames.add(b.name);
  }
  const modelIds = new Set(), modelNames = new Set();
  const genIds = new Set(), trimIds = new Set();
  for (const m of modelsData) {
    if (modelIds.has(m.model_id)) err(`Model duplicate id: ${m.model_id}`);
    modelIds.add(m.model_id);
    if (modelNames.has(m.name)) err(`Model duplicate name: ${m.name}`);
    modelNames.add(m.name);
    for (const g of m.generations ?? []) {
      if (genIds.has(g.generation_id)) err(`Generation duplicate id: ${g.generation_id}`);
      genIds.add(g.generation_id);
      const genNames = new Set();
      if (genNames.has(g.name)) err(`Generation duplicate name in ${m.model_id}: ${g.name}`);
      genNames.add(g.name);
      for (const t of g.trims ?? []) {
        if (trimIds.has(t.trim_id)) err(`Trim duplicate id: ${t.trim_id}`);
        trimIds.add(t.trim_id);
        const trimNames = new Set();
        if (trimNames.has(t.name)) err(`Trim duplicate name in ${g.generation_id}: ${t.name}`);
        trimNames.add(t.name);
      }
    }
  }
}

// ---------- 2. Missing ----------
console.log("\n== 2. Missing ==");
const brandIds = new Set(brandsData.map((b) => b.brand_id));
{
  let miss = 0;
  for (const m of modelsData) {
    if (!brandIds.has(m.brand_id)) { err(`Model ${m.model_id}: brand_id "${m.brand_id}" not found`); miss++; }
    if (!Array.isArray(m.generations) || m.generations.length === 0) { err(`Model ${m.model_id}: missing generations`); miss++; }
  }
  for (const b of brandsData) {
    if (!modelsData.some((m) => m.brand_id === b.brand_id)) { warn(`Brand ${b.brand_id}: no models`); }
  }
  if (miss === 0) console.log("no missing relations");
}

// ---------- 3. Invalid ----------
console.log("\n== 3. Invalid ==");
{
  let inv = 0;
  for (const m of modelsData) {
    for (const g of m.generations ?? []) {
      for (const y of g.production_years ?? []) {
        if (typeof y !== "number" || y < 1900 || y > 2100) { err(`Generation ${g.generation_id}: invalid year "${y}"`); inv++; }
      }
      for (const t of g.trims ?? []) {
        if (!POWERTRAINS.has(t.powertrain)) { err(`Trim ${t.trim_id}: invalid powertrain "${t.powertrain}"`); inv++; }
        for (const y of t.production_years ?? []) {
          if (typeof y !== "number" || y < 1900 || y > 2100) { err(`Trim ${t.trim_id}: invalid year "${y}"`); inv++; }
        }
        const s = t.specs ?? {};
        if (s.length_mm != null && (s.length_mm < 2500 || s.length_mm > 7000)) { err(`Trim ${t.trim_id}: implausible length_mm ${s.length_mm}`); inv++; }
        if (s.width_mm != null && (s.width_mm < 1000 || s.width_mm > 2500)) { err(`Trim ${t.trim_id}: implausible width_mm ${s.width_mm}`); inv++; }
        if (s.height_mm != null && (s.height_mm < 1000 || s.height_mm > 2500)) { err(`Trim ${t.trim_id}: implausible height_mm ${s.height_mm}`); inv++; }
        if (s.wheelbase_mm != null && (s.wheelbase_mm < 1500 || s.wheelbase_mm > 4000)) { err(`Trim ${t.trim_id}: implausible wheelbase_mm ${s.wheelbase_mm}`); inv++; }
        if (s.range_km != null && (s.range_km < 20 || s.range_km > 1500)) { err(`Trim ${t.trim_id}: implausible range_km ${s.range_km}`); inv++; }
        if (s.battery_capacity_kwh != null && (s.battery_capacity_kwh < 5 || s.battery_capacity_kwh > 250)) { err(`Trim ${t.trim_id}: implausible battery_capacity_kwh ${s.battery_capacity_kwh}`); inv++; }
        // powertrain ↔ battery/range consistency
        if (t.powertrain === "ice" && s.battery_capacity_kwh != null) { warn(`Trim ${t.trim_id}: ICE trim has battery_capacity_kwh set`); }
        if (t.powertrain === "ev" && s.battery_capacity_kwh == null) { warn(`Trim ${t.trim_id}: EV trim missing battery_capacity_kwh`); }
      }
    }
  }
  if (inv === 0) console.log("no invalid values");
}

// ---------- 4. SEO (requires dist/) ----------
console.log("\n== 4. SEO ==");
if (!existsSync("dist")) {
  warn("dist/ not found — run `npm run build` first; SEO section skipped");
} else {
  const walk = (d) => {
    let out = [];
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) out = out.concat(walk(p));
      else if (e.endsWith(".html")) out.push(p);
    }
    return out;
  };
  const files = walk("dist");
  const titles = new Map();
  const canon = new Map();
  let noDesc = 0, noCanon = 0;
  const known = new Set();
  for (const f of files) {
    const h = readFileSync(f, "utf8");
    let rel = f.replace(/^dist/, "").replace(/index\.html$/, "");
    if (rel.endsWith(".html")) rel = rel.replace(/\.html$/, "/");
    known.add(rel);
    const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || null;
    if (!t) { err(`${f}: missing <title>`); continue; }
    if (!titles.has(t)) titles.set(t, []);
    titles.get(t).push(f);
    if (!/<meta name="description"/.test(h)) { err(`${f}: missing meta description`); noDesc++; }
    const c = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || null;
    if (!c) { err(`${f}: missing canonical`); noCanon++; }
    else { if (!canon.has(c)) canon.set(c, []); canon.get(c).push(f); }
  }
  let dupTitle = 0;
  for (const [t, fs] of titles) if (fs.length > 1) { err(`duplicate title: "${t}" (${fs.join(", ")})`); dupTitle++; }
  let dupCanon = 0;
  for (const [c, fs] of canon) if (fs.length > 1) { err(`duplicate canonical: ${c} (${fs.join(", ")})`); dupCanon++; }

  // broken internal links + orphan pages
  const internal = new Map();
  for (const f of files) {
    const h = readFileSync(f, "utf8");
    const from = f.replace(/^dist/, "");
    for (const mm of h.matchAll(/<a[^>]*href="([^"]*)"/g)) {
      let href = mm[1];
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      if (href.startsWith("#") || href === "") continue;
      href = href.split(/[?#]/)[0];
      if (!href.startsWith("/")) { err(`${from}: relative link "${mm[1]}"`); continue; }
      if (!href.endsWith("/")) href += "/";
      if (!internal.has(href)) internal.set(href, []);
      internal.get(href).push(from);
    }
  }
  let broken = 0;
  for (const [href, froms] of internal) {
    if (!known.has(href)) { err(`broken internal link: ${href} (from ${[...new Set(froms)].slice(0, 3).join(", ")})`); broken++; }
  }
  let orphan = 0;
  for (const k of known) {
    if (k === "/" || k === "/404/") continue;
    if (!internal.has(k)) { err(`orphan page: ${k}`); orphan++; }
  }

  // stale internal link review — known removed/folded routes across the ecosystem
  const STALE = [
    /\/countries\/kenya\/byd-song-plus\//,  // deleted mechanical combo page
    /\/countries\/[a-z-]+\/(ev|suv)\//,     // folded market /ev/ /suv/ subpages
    /\/(regions|import-guides|documents)\//, // folded market section pages
  ];
  let stale = 0;
  for (const f of files) {
    const h = readFileSync(f, "utf8");
    for (const mm of h.matchAll(/<a[^>]*href="([^"]*)"/g)) {
      for (const re of STALE) {
        if (re.test(mm[1])) { err(`${f}: stale link "${mm[1]}"`); stale++; }
      }
    }
  }
  console.log(`pages=${files.length} | dupTitle=${dupTitle} | noDesc=${noDesc} | noCanon=${noCanon} | brokenLinks=${broken} | orphan=${orphan} | staleLinks=${stale}`);
}

// ---------- 5. Source ----------
console.log("\n== 5. Source ==");
{
  let nullUrl = 0, staleSrc = 0;
  const walk = (o, where) => {
    checkProvenance(o, where);
    if (o.source_url == null) nullUrl++;
    if (o.checked_date != null && isStale(o.checked_date)) staleSrc++;
  };
  for (const b of brandsData) walk(b, `Brand ${b.brand_id}`);
  for (const m of modelsData) {
    walk(m, `Model ${m.model_id}`);
    for (const g of m.generations ?? []) {
      walk(g, `Generation ${g.generation_id}`);
      for (const t of g.trims ?? []) walk(t, `Trim ${t.trim_id}`);
    }
  }
  console.log(`provenance records checked | null source_url=${nullUrl} | stale source=${staleSrc}`);
}

// ---------- Cross-entity: brand.powertrains must equal union of model powertrains ----------
console.log("\n== Cross-entity ==");
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
console.log("powertrain union check complete");

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
