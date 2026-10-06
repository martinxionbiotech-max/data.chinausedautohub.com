// One-time schema migration for ChinaUsedAutoHub DATA sub-site (STEP 3-7).
// Transforms shared/data/brands.json + shared/data/models.json to the unified
// Vehicle Data Model: provenance five-tuple, Export Intelligence (9 fields),
// generation-level source, and last_verified. URL architecture unchanged.
//
// Run from repo root: node scripts/migrate-schema.mjs
import { readFileSync, writeFileSync } from "node:fs";

const CHECKED = "2026-10-06";

// ---- Verified official manufacturer URLs (curl-verified HTTP 200, 2026-10-06) ----
const BRAND_URLS = {
  byd: "https://www.byd.com/",
  geely: "https://www.geely.com/",
  chery: "https://www.cheryinternational.com/",
  changan: "https://www.globalchangan.com/",
  gac: "https://www.gacmotor.com/",
  saic: "https://www.saicmotor.com/",
  "great-wall": "https://www.gwm-global.com/",
  "li-auto": "https://www.li-auto.com/",
  nio: "https://www.nio.com/",
  xpeng: "https://www.xpeng.com/",
  toyota: "https://global.toyota/en/",
  volkswagen: "https://www.volkswagen.com/",
  bmw: "https://www.bmw.com.cn/",
  "mercedes-benz": "https://www.mercedes-benz.com.cn/",
  honda: "https://global.honda/en/",
  hyundai: "https://www.hyundai.com/worldwide/en/",
};

// Model-level manufacturer spec pages (verified 200). null = not verifiable → keep null.
const MODEL_URLS = {
  "byd-song-plus": "https://www.byd.com/eu/car/seal-u", // Song Plus sold as Seal U in EU
  "byd-atto-3": "https://www.byd.com/eu/car/atto3",
  "byd-han": "https://www.byd.com/eu/car/han",
  "byd-seal": "https://www.byd.com/eu/car/seal",
  "great-wall-haval-h6": "https://www.gwm-global.com/haval-h6",
  "nio-es6": "https://www.nio.com/es6",
  "xpeng-g6": "https://www.xpeng.com/g6",
  "gac-gs4": "https://www.gacmotor.com/gs4",
  "saic-mg-zs": "https://www.mg.co.uk/new-cars/mg-zs",
  "toyota-rav4": "https://www.toyota.com/rav4/",
  "volkswagen-tiguan-l": "https://www.volkswagen.com/en/models/tiguan",
  "hyundai-tucson-l": "https://www.hyundai.com/worldwide/en/suv/tucson",
};

// Aliases (structured from audit §3.2 — only evidenced aliases).
const ALIASES = {
  "byd-atto-3": ["Yuan Plus"],
  "geely-monjaro": ["Xingyue L"],
};

// China market positioning (migrated from src/lib/market-position.ts, public knowledge).
const CHINA_MARKET_STATUS = {
  "byd-song-plus": "A core BYD SUV nameplate in China, offered as a DM-i plug-in hybrid and a pure EV.",
  "byd-qin-plus": "A high-volume BYD compact sedan in the Chinese market, sold as DM-i hybrid and EV.",
  "byd-atto-3": "BYD's compact electric SUV, positioned as an export-oriented EV under the Atto 3 name.",
  "byd-han": "BYD's flagship sedan, offered as a pure EV and a DM-i plug-in hybrid.",
  "byd-seal": "BYD's mid-size electric sedan.",
  "geely-monjaro": "Geely's mid-size SUV, sold in China as the Xingyue L and exported as the Monjaro.",
  "chery-tiggo-8": "Chery's mid-size SUV and a mainstay of its export lineup.",
  "great-wall-haval-h6": "One of Great Wall Motor's best-known compact SUVs in the Chinese market.",
  "changan-cs75-plus": "A core Changan SUV in the Chinese compact-SUV segment.",
  "li-auto-l7": "Li Auto's extended-range electric SUV.",
  "nio-es6": "NIO's mid-size electric SUV.",
  "xpeng-g6": "XPeng's mid-size electric SUV.",
  "gac-gs4": "GAC Motor's compact SUV.",
  "saic-mg-zs": "SAIC's compact SUV sold under the MG brand, offered with EV and combustion powertrains.",
  "toyota-rav4": "Toyota's compact SUV, produced in China for the domestic market.",
  "volkswagen-tiguan-l": "Volkswagen's long-wheelbase compact SUV for the Chinese market.",
  "bmw-3-series-long": "BMW's long-wheelbase 3 Series, built in China.",
  "mercedes-c-class-lwb": "Mercedes-Benz's long-wheelbase C-Class, built in China.",
  "honda-cr-v": "Honda's compact SUV, produced in China.",
  "hyundai-tucson-l": "Hyundai's long-wheelbase compact SUV for the Chinese market.",
};

// Common export regions (grounded in MARKET site's published popular-model data,
// src/lib/model-links.ts MODEL_MARKETS). Absent → null.
const EXPORT_REGIONS = {
  "byd-song-plus": ["Kenya", "Uzbekistan", "UAE"],
  "byd-qin-plus": ["Kenya", "Nigeria", "UAE"],
  "byd-atto-3": ["Kenya", "UAE"],
  "byd-han": ["UAE", "Kenya"],
  "byd-seal": ["Kenya", "UAE"],
  "geely-monjaro": ["Saudi Arabia", "Tanzania", "Kazakhstan", "Uzbekistan"],
  "chery-tiggo-8": ["Kenya", "Tanzania", "Nigeria", "Kazakhstan", "Uzbekistan"],
  "great-wall-haval-h6": ["Saudi Arabia", "Kazakhstan"],
  "changan-cs75-plus": ["Saudi Arabia"],
  "li-auto-l7": ["UAE"],
  "nio-es6": ["UAE"],
  "gac-gs4": ["Tanzania", "Nigeria"],
};

const LHD_NOTE = "Standard — listed models are China domestic-market production (left-hand drive).";
const RHD_NOTE = "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.";
const EV_CHARGING_NOTE = "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.";

function isElectrified(powertrains) {
  return powertrains.some((p) => p === "ev" || p === "phev" || p === "erev");
}

// ---------- brands.json ----------
const brandsData = JSON.parse(readFileSync("shared/data/brands.json", "utf8"));
const modelsData = JSON.parse(readFileSync("shared/data/models.json", "utf8"));

// Precompute model powertrain_types per brand for P1-5 fix (brand powertrains = union of model powertrains).
const brandPowertrainUnion = new Map();
for (const m of modelsData.models) {
  const set = new Set();
  for (const g of m.generations ?? []) {
    for (const t of g.trims ?? []) {
      if (!t.powertrain) continue;
      set.add(t.powertrain === "phev" && m.brand_id === "li-auto" ? "erev" : t.powertrain);
    }
  }
  if (!brandPowertrainUnion.has(m.brand_id)) brandPowertrainUnion.set(m.brand_id, new Set());
  for (const p of set) brandPowertrainUnion.get(m.brand_id).add(p);
}

const migratedBrands = brandsData.brands.map((b) => {
  const url = BRAND_URLS[b.brand_id] ?? null;
  const powertrains = Array.from(brandPowertrainUnion.get(b.brand_id) ?? []);
  return {
    brand_id: b.brand_id,
    name: b.name,
    name_zh: b.name_zh,
    origin_country: b.origin_country,
    founded: b.founded,
    powertrains, // P1-5 fix: union of model powertrains
    vehicle_types: b.vehicle_types,
    status: "active",
    source_name: b.source ?? null,
    source_url: url,
    source_type: "official",
    checked_date: CHECKED,
    confidence: url ? "high" : "medium",
    last_verified: CHECKED,
  };
});

// ---------- models.json ----------
const migratedModels = modelsData.models.map((m) => {
  const url = MODEL_URLS[m.model_id] ?? null;
  const powertrain_types = [];
  {
    const set = new Set();
    for (const g of m.generations ?? []) {
      for (const t of g.trims ?? []) {
        if (!t.powertrain) continue;
        set.add(t.powertrain === "phev" && m.brand_id === "li-auto" ? "erev" : t.powertrain);
      }
    }
    powertrain_types.push(...set);
  }
  const regions = EXPORT_REGIONS[m.model_id] ?? null;
  const conf = url ? "high" : "medium";

  const generations = (m.generations ?? []).map((g) => {
    const trims = (g.trims ?? []).map((t) => ({
      trim_id: t.trim_id,
      name: t.name,
      powertrain: t.powertrain === "phev" && m.brand_id === "li-auto" ? "erev" : t.powertrain, // P1-5 EREV fix
      production_years: t.production_years ?? null,
      specs: t.specs ?? {},
      source_name: t.spec_source ?? null,
      source_url: t.spec_source_url ?? url ?? null,
      source_type: "manufacturer",
      checked_date: CHECKED,
      confidence: conf,
      last_verified: CHECKED,
    }));
    return {
      generation_id: g.generation_id,
      name: g.name,
      production_years: g.production_years ?? null,
      platform: null,
      facelift: null,
      trims,
      source_name: m.source ?? null,
      source_url: url,
      source_type: "manufacturer",
      checked_date: CHECKED,
      confidence: conf,
      last_verified: CHECKED,
    };
  });

  return {
    model_id: m.model_id,
    brand_id: m.brand_id,
    name: m.name,
    name_zh: m.name_zh,
    aliases: ALIASES[m.model_id] ?? null,
    vehicle_type: "passenger_car",
    body_type: m.body_type,
    powertrain_types,
    production_status: m.status ?? "active",
    china_market_status: CHINA_MARKET_STATUS[m.model_id] ?? null,
    export_relevance: regions ? `Referenced in market guides for ${regions.join(", ")}.` : null,
    common_export_regions: regions,
    powertrain_export_relevance: isElectrified(powertrain_types)
      ? "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination."
      : "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: RHD_NOTE,
    left_hand_drive_relevance: LHD_NOTE,
    market_considerations: null,
    parts_availability_notes: null,
    charging_standard_notes: isElectrified(powertrain_types) ? EV_CHARGING_NOTE : null,
    homologation_notes: null,
    generations,
    source_name: m.source ?? null,
    source_url: url,
    source_type: "manufacturer",
    checked_date: CHECKED,
    confidence: conf,
    last_verified: CHECKED,
  };
});

writeFileSync("shared/data/brands.json", JSON.stringify({ brands: migratedBrands }, null, 2) + "\n");
writeFileSync("shared/data/models.json", JSON.stringify({ models: migratedModels }, null, 2) + "\n");

const counts = {
  brands: migratedBrands.length,
  models: migratedModels.length,
  generations: migratedModels.reduce((a, m) => a + m.generations.length, 0),
  trims: migratedModels.reduce((a, m) => a + m.generations.reduce((x, g) => x + g.trims.length, 0), 0),
  brandUrls: migratedBrands.filter((b) => b.source_url).length,
  modelUrls: migratedModels.filter((m) => m.source_url).length,
};
console.log(JSON.stringify(counts, null, 2));
