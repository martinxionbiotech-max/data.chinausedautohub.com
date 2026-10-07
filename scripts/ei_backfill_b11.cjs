// Batch 11 EI backfill — final 20 models (foreign-brand China-built + remaining EV brands).
// Fills only evidence-backed fields; keeps null where no reliable export evidence (无据不填).
const fs = require("fs");

const updates = {
  // ---- SAIC-VW (foreign brand, China export program) ----
  "volkswagen-tiguan-l": {
    export_relevance: "SAIC-VW began exporting China-developed Tiguan L Pro overseas in 2025 — Tiguan L Pro, Passat Pro and Teramont Pro arrived in Uzbekistan (June 2025), and China-built VW gasoline models were exported to North America (Mexico) for the first time.",
    common_export_regions: ["Uzbekistan", "Mexico"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — China domestic production is left-hand drive; no right-hand-drive export documented.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "SAIC-VW export programme (since September 2025) targets Central Asia and North America to offset slowing China demand.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "SAIC-VW China export coverage (Gasgoo / Automotive News)",
    source_url: "https://autonews.gasgoo.com/articles/market-industry/saic-volkswagen-vehicle-exports-enter-north-america-for-first-time-2105199450351165441",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- Arcfox (BAIC premium EV, GCC entry) ----
  "arcfox-alpha-s": {
    export_relevance: "Arcfox (BAIC's premium EV brand) entered the UAE in February 2025 via Next Generation Mobility (Al Khoory Group) — the brand's first GCC presence — with BAIC INTL as the sole overseas operator and a Saudi Arabia brand refresh in Jeddah (August 2026).",
    common_export_regions: ["United Arab Emirates", "Saudi Arabia"],
    powertrain_export_relevance: "Battery-electric (EV) — may qualify for import-duty relief in some markets; confirm per destination.",
    right_hand_drive_relevance: "No right-hand-drive production documented — Arcfox models are left-hand drive.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "Official GCC market entry via local distributor (Next Generation Mobility / Al Khoory Group in the UAE; BAIC INTL for Saudi Arabia).",
    parts_availability_notes: null,
    charging_standard_notes: "China-market GB/T charging standard — confirm destination connector compatibility (GCC uses CCS2 / Type 2).",
    homologation_notes: null,
    source_name: "Arcfox UAE entry (Next Generation Mobility / arcfoxuae.com)",
    source_url: "https://ngmuae.com/2025/02/27/next-generation-mobility-introduces-arcfoxs-advanced-evs-to-the-uae-market/",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },
  "arcfox-alpha-t": {
    export_relevance: "Arcfox Alpha T (BAIC's premium EV SUV) — the Arcfox brand entered the UAE via Next Generation Mobility (Al Khoory Group) in 2025, its first GCC presence, with BAIC INTL expanding Arcfox in Saudi Arabia (Jeddah brand refresh, August 2026).",
    common_export_regions: ["United Arab Emirates", "Saudi Arabia"],
    powertrain_export_relevance: "Battery-electric (EV) — may qualify for import-duty relief in some markets; confirm per destination.",
    right_hand_drive_relevance: "No right-hand-drive production documented — Arcfox models are left-hand drive.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "Official GCC market entry via local distributor (Next Generation Mobility / Al Khoory Group in the UAE; BAIC INTL for Saudi Arabia).",
    parts_availability_notes: null,
    charging_standard_notes: "China-market GB/T charging standard — confirm destination connector compatibility (GCC uses CCS2 / Type 2).",
    homologation_notes: null,
    source_name: "Arcfox UAE entry (Next Generation Mobility / arcfoxuae.com)",
    source_url: "https://ngmuae.com/2025/02/27/next-generation-mobility-introduces-arcfoxs-advanced-evs-to-the-uae-market/",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- IM Motors (SAIC premium EV) ----
  "im-motors-l6": {
    export_relevance: "IM Motors (SAIC's premium EV brand) sells the L6 through a global sales channel (immotors.com/global); export demand is noted for Africa, the Middle East and Southeast Asia.",
    common_export_regions: ["Middle East", "Southeast Asia", "Africa"],
    powertrain_export_relevance: "Battery-electric (EV) — may qualify for import-duty relief in some markets; confirm per destination.",
    right_hand_drive_relevance: "No right-hand-drive production documented — IM Motors models are left-hand drive.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "Premium EV positioning (SAIC); overseas sales through the brand's global channel, with emerging export presence.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market GB/T charging standard — confirm destination connector compatibility.",
    homologation_notes: null,
    source_name: "IM Motors global sales channel (immotors.com/global)",
    source_url: "https://www.immotors.com/global/en/vehicle_config/l6",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- Lynk & Co (Geely) ----
  "lynk-co-03": {
    export_relevance: "Lynk & Co (Geely) accelerated exports in H1 2026 — Lynk & Co and Zeekr drove a 158% export surge; the 03 sedan is sold in left-hand-drive export markets (Europe, Middle East).",
    common_export_regions: ["Europe", "Middle East"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Left-hand-drive only — Lynk & Co has ruled out right-hand-drive markets until at least 2028.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "Geely's multi-brand global push; the 03 is a China-centric sedan exported to LHD markets.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Lynk & Co export coverage (AutoNewGen)",
    source_url: "https://www.autonewgen.com/news/geelys-global-push-accelerates-as-lynk-co-and-zeekr-drive-a-158-export-surge.html",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- FAW Bestune ----
  "faw-bestune-t90": {
    export_relevance: "FAW Bestune T90 is exported to CIS (Russia) and the Middle East; FAW plans to assemble Bestune models locally in Russia from 2026 (T90, B70, T77).",
    common_export_regions: ["Russia", "Middle East"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — China domestic production is left-hand drive; no right-hand-drive export documented for the T90.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "FAW localizing Bestune assembly in Russia (2026) signals a CIS-focused export strategy.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "FAW Bestune Russia/ME export (Izvestia / Rossiyskaya Gazeta)",
    source_url: "https://iz.ru/en/2027671/2026-01-20/faw-decided-start-assembling-bestune-cars-russia",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- Changan Ford ----
  "ford-mondeo": {
    export_relevance: "Changan Ford exports China-built vehicles to the Middle East and Southeast Asia (about 20,000 units to absorb capacity); the Mondeo has been China-exclusive since 2022 after Ford discontinued it elsewhere.",
    common_export_regions: ["Middle East", "Southeast Asia"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — China domestic production is left-hand drive; no right-hand-drive export documented.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "China is the sole Mondeo production base since 2022; Changan Ford export programme covers Middle East and Southeast Asia.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Changan Ford export coverage (Baidu Baike / MarkLines)",
    source_url: "https://www.marklines.com/en/report/rep2465_20230413",
    source_type: "industry",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- JMC Ford ----
  "ford-territory": {
    export_relevance: "JMC-Ford Territory is a China-built compact SUV exported to 80+ markets, notably Latin America (JMC deepening its regional presence).",
    common_export_regions: ["Latin America", "Middle East", "Southeast Asia"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Left-hand-drive only — right-hand-drive China-built Territory is not documented (regional Ford RHD units come from other plants).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "One of Ford's rare China-built export successes; 80+ export markets led by Latin America.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "JMC-Ford Territory export coverage (Caixin / Ford Authority)",
    source_url: "https://www.caixinglobal.com/2026-03-23/chinese-carmaker-jmc-deepens-its-roots-in-latin-america-102426460.html",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- SAIC-GM Buick ----
  "buick-envision": {
    export_relevance: "SAIC-GM builds the Buick Envision in China and exports it to North America (United States); GM plans to shift US-bound Envision production back to the US by 2028 while China production may continue for other markets.",
    common_export_regions: ["United States"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — China-built Envision is left-hand drive (US and China are LHD markets).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "China-to-US export under SAIC-GM; high US tariffs on China-built vehicles are prompting a production shift back to the US by 2028.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Buick Envision China-to-US export (Reuters / CNBC / WardsAuto)",
    source_url: "https://www.reuters.com/business/autos-transportation/gm-bring-china-built-buick-us-2026-01-22/",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },

  // ---- Yueda Kia ----
  "kia-sportage": {
    export_relevance: "Yueda Kia's Yancheng plant is a global export hub serving ~90 countries; the Sportage X-Pro is in Yueda Kia's six-model export portfolio.",
    common_export_regions: ["Latin America", "Asia-Pacific", "Middle East"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "China-built Sportage is left-hand drive; Yueda Kia's RHD production at Yancheng is EV5-specific (Thailand/Australia/NZ) — confirm RHD Sportage availability with the exporter.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "Yancheng plant converted into a Kia global export hub (90 countries); export portfolio includes the Sportage X-Pro.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Yueda Kia export hub coverage (Korea JoongAng Daily / KedGlobal)",
    source_url: "https://www.koreajoongangdaily.com/korea/kia-turned-its-struggling-china-plant-into-a-profitable-export-hub-for-90-countries-this-is-how-they-did-it/12760531",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  },
  "kia-k5": {
    export_relevance: "Yueda Kia exports the K5 from China; K5 and Seltos are named key export models, with plans to expand export countries to about 80.",
    common_export_regions: ["Middle East", "Latin America"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — China-built K5 is left-hand drive; no right-hand-drive export documented.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive.",
    market_considerations: "K5 is a key Yueda Kia export model alongside the Seltos; export base expanding to ~80 countries.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Yueda Kia K5 export coverage (Gasgoo)",
    source_url: "https://autonews.gasgoo.com/articles/market-industry/70025882",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-07"
  }
};

const path = "shared/data/models.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const models = data.models;
let applied = 0;
for (const m of models) {
  const u = updates[m.model_id];
  if (!u) continue;
  for (const [k, v] of Object.entries(u)) {
    if (k === "source_name") m.source_name = v;
    else if (k === "source_url") m.source_url = v;
    else if (k === "source_type") m.source_type = v;
    else if (k === "confidence") m.confidence = v;
    else if (k === "checked_date") m.checked_date = v;
    else m[k] = v;
  }
  // last_verified stays at spec-verification date (matches b10 pattern)
  applied++;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("applied EI backfill to", applied, "models (expected 11)");

// Report remaining null export_relevance (无据不填 list)
const stillNull = models.filter(x => !x.export_relevance).map(x => x.model_id);
console.log("remaining null export_relevance:", stillNull.length);
console.log(stillNull.join("\n"));
