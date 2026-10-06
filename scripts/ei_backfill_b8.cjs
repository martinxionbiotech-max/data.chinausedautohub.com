// Batch 8 EI backfill — verify export intelligence for next-tier high-value export models
// Data repo: shared/data/models.json. Fills only evidence-backed fields; no guessing.
// Covers: Wey (Blue Mountain / Coffee 01), Ora Ballet Cat, Geely Galaxy (L7 / E5),
// Exeed (TXL / LX), Voyah Dreamer, Leapmotor C11, Deepal SL03, Avatr 12,
// Wuling Hongguang Mini EV, Aion S, Neta L.
const fs = require("fs");

const updates = {
  // ---- Wey (GWM premium) ----
  "wey-blue-mountain": {
    export_relevance: "Wey Blue Mountain (Lanshan) plug-in hybrid 6-seat SUV, sold primarily in China; overseas availability is via parallel/grey-market export channels rather than a confirmed official programme.",
    common_export_regions: null,
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Full-size PHEV 6-seat SUV (Hi4 1.5T); export presence limited to parallel/grey-market channels.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Wey Lanshan export listings + Wikipedia Wey Lanshan (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Wey_Lanshan",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "wey-coffee-01": {
    export_relevance: "Wey Coffee 01 (Mocha) plug-in hybrid SUV, marketed in Europe as the Coffee 01 (UK launch announced) and sold in Russia and the Middle East.",
    common_export_regions: ["Europe", "Russia", "Middle East"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — European/Russian/Middle-East export markets are left-hand drive; confirm RHD availability with the exporter (UK launch was announced but RHD production not confirmed).",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mid-size PHEV SUV (GWM Wey); export focus on Europe (as Coffee 01), Russia and the Middle East.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Wey Mocha/Coffee 01 Europe & MENA export (Wikipedia + Autocar UK, reputable media)",
    source_url: "https://en.wikipedia.org/wiki/WEY_Mocha",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Ora (GWM) ----
  "ora-ballet-cat": {
    export_relevance: "Ora Ballet Cat retro-styled battery-electric hatchback, part of GWM's Ora EV export lineup (Ora Good Cat is the brand's flagship export model).",
    common_export_regions: null,
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations (Ora produces RHD Good Cat for some ASEAN markets).",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Compact retro-styled EV hatchback; export availability via GWM Ora export channels.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "ORA Ballet Cat specifications + Wikipedia (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/ORA_Ballet_Cat",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Geely Galaxy ----
  "galaxy-l7": {
    export_relevance: "Geely Galaxy L7 plug-in hybrid compact SUV, offered for export through Geely's NEV export channels (China-origin FOB listings).",
    common_export_regions: null,
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Compact PHEV SUV (Geely Galaxy); export availability via Geely NEV export channels.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Geely Galaxy L7 export listings (industry exporter)",
    source_url: "https://chinaevexport.net/models/geely-galaxy-galaxyl7",
    source_type: "industry",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "galaxy-e5": {
    export_relevance: "Geely Galaxy E5 (export name EX5) battery-electric compact SUV; the right-hand-drive EX5 launched in Thailand (Thonburi-Geely, 2024) with a Proton eMas 7 twin in Malaysia.",
    common_export_regions: ["Thailand", "Malaysia"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — RHD EX5 launched in Thailand (Thonburi-Geely); Proton eMas 7 twin sold in Malaysia.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Geely's regional export production.",
    market_considerations: "Compact battery-electric SUV; RHD entry into Thailand and Malaysia via the EX5 / Proton eMas 7.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility; regional units may carry other inlets.",
    homologation_notes: null,
    source_name: "Geely EX5 RHD Thailand launch (Bangkok Post + Wikipedia Geely EX5, reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Geely_EX5",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Exeed (Chery premium) ----
  "exeed-txl": {
    export_relevance: "Exeed TXL (Lingyun) mid-size combustion SUV (Chery's premium Exeed brand), sold internationally via Exeed International across Russia and the Middle East.",
    common_export_regions: ["Russia", "Middle East"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — confirmed export markets (Russia, Middle East) are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mid-size ICE SUV (Exeed TXL/Lingyun); export focus on Russia and the Middle East via Exeed International.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Exeed International TXL global page (manufacturer) + reputable media",
    source_url: "https://www.exlantix.com/global/txl/",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "exeed-lx": {
    export_relevance: "Exeed LX (Zhuifeng) compact combustion SUV (Chery's premium Exeed brand), sold internationally via Exeed International across Russia and the Middle East.",
    common_export_regions: ["Russia", "Middle East"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — confirmed export markets (Russia, Middle East) are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Compact ICE SUV (Exeed LX/Zhuifeng); export focus on Russia and the Middle East via Exeed International.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Exeed International LX global page (manufacturer) + reputable media",
    source_url: "https://www.exeedinternational.com/global/",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Voyah (Dongfeng premium) ----
  "voyah-dreamer": {
    export_relevance: "Voyah Dreamer plug-in hybrid MPV (Dongfeng's premium EV brand), granted EU vehicle type approval (EWVTA) for export to Europe, with launch announced for Norway and other European markets.",
    common_export_regions: ["Norway", "Europe"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — European export markets are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Full-size PHEV MPV; EU type approval (EWVTA) with distribution announced for Norway and other European markets.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: "EU vehicle type approval (EWVTA) obtained — destination certification to be confirmed per market.",
    source_name: "Voyah Dreamer EWVTA Europe export (industry + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Voyah_Dreamer",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Leapmotor ----
  "leapmotor-c11": {
    export_relevance: "Leapmotor C11 battery-electric mid-size SUV, exported to Europe through the Leapmotor–Stellantis partnership (European market entries and dealer network announced).",
    common_export_regions: ["Europe"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — European export markets are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mid-size battery-electric SUV; European distribution via the Leapmotor–Stellantis partnership.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility; European units may use CCS2.",
    homologation_notes: null,
    source_name: "Leapmotor C11 Europe export (Stellantis media + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Leapmotor_C11",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Deepal (Changan) ----
  "deepal-sl03": {
    export_relevance: "Deepal SL03 battery-electric mid-size sedan (Changan's NEV unit), sold in right-hand drive in Thailand (Deepal began selling two EV models in Thailand from late 2023).",
    common_export_regions: ["Thailand"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Deepal began selling the SL03 and S07 in Thailand (RHD) from late 2023.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Deepal's regional export production.",
    market_considerations: "Mid-size battery-electric sedan; RHD entry into Thailand (alongside the Deepal S07).",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Deepal SL03 Thailand RHD launch (CnEVPost + Wikipedia Deepal SL03, reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Deepal_SL03",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Avatr (Changan/Huawei/CATL) ----
  "avatr-12": {
    export_relevance: "Avatr 12 battery-electric grand coupe (Changan/Huawei/CATL), with right-hand-drive production planned for the Thailand market (following the RHD Avatr 11 launch in Bangkok).",
    common_export_regions: ["Thailand"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production planned for Thailand — Avatr announced RHD Avatr 12 production for the Thai market (RHD Avatr 11 already launched in Bangkok).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Avatr's export production.",
    market_considerations: "Full-size battery-electric grand coupe; RHD expansion into Thailand following the Avatr 11.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Avatr 12 RHD Thailand plans (reputable media + Wikipedia Avatr 12)",
    source_url: "https://en.wikipedia.org/wiki/Avatr_12",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Wuling (SAIC-GM-Wuling) ----
  "wuling-hongguang-mini": {
    export_relevance: "Wuling Hongguang Mini EV battery-electric micro hatchback; the RHD derivative (Wuling Air EV) is built in Indonesia, while the Hongguang Mini itself is exported from China via parallel/grey-market channels.",
    common_export_regions: ["Indonesia"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available via the related Wuling Air EV built in Indonesia (RHD); confirm RHD availability for the Hongguang Mini nameplate with the exporter.",
    left_hand_drive_relevance: "Standard — China domestic-market production of the Hongguang Mini is left-hand drive.",
    market_considerations: "Micro battery-electric hatchback; RHD coverage via the Indonesia-built Wuling Air EV derivative.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Wuling Hongguang Mini EV + Air EV Indonesia RHD (manufacturer + Wikipedia)",
    source_url: "https://en.wikipedia.org/wiki/Wuling_Hongguang_Mini_EV",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Aion (GAC) ----
  "aion-s": {
    export_relevance: "GAC Aion S battery-electric mid-size sedan; GAC Aion opened its first overseas plant in Thailand and exports the Aion S to Thailand and other ASEAN markets.",
    common_export_regions: ["Thailand"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — GAC Aion builds and sells the Aion S in Thailand (RHD, first overseas plant).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Aion's Thailand plant.",
    market_considerations: "Mid-size battery-electric sedan; RHD production and distribution in Thailand via GAC Aion's first overseas plant.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "GAC Aion S Thailand plant + export (CnEVPost + Wikipedia GAC Aion, reputable media)",
    source_url: "https://en.wikipedia.org/wiki/GAC_Aion",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Neta (Hozon) ----
  "neta-l": {
    export_relevance: "Neta L electric / range-extended SUV (Hozon's Neta brand), exported to Thailand where Neta operates its first overseas factory (ASEAN expansion into Thailand, Indonesia and Malaysia).",
    common_export_regions: ["Thailand"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Neta operates a Thailand factory and exports RHD units for Thailand, Indonesia and Malaysia.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Neta's Thailand plant.",
    market_considerations: "Mid-size EV/EREV SUV; RHD production and ASEAN distribution via Neta's Thailand factory.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Neta L Thailand factory + ASEAN expansion (reputable media)",
    source_url: "https://ievchina.com/brands/hozon-neta-asean-thailand-indonesia-malaysia-2026/",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
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
  m.last_verified = "2026-10-06";
  applied++;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("applied EI backfill to", applied, "models");
console.log("keys:", Object.keys(updates).length);
