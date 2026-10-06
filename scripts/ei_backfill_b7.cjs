// Batch 7 EI backfill — verify export intelligence for next-tier high-value export models
// Data repo: shared/data/models.json. Fills only evidence-backed fields; no guessing.
// Covers: BYD unfilled / Hongqi / Denza / GAC / Voyah / IM / Lynk & Co / Xiaomi / Avatr.
const fs = require("fs");

const updates = {
  // ---- BYD PHEV (RHD via Thailand Rayong plant) ----
  "byd-song-pro": {
    export_relevance: "BYD Song Pro plug-in hybrid compact SUV, produced in right-hand drive at BYD's Thailand Rayong plant (RHD ASEAN export hub) and exported to Thailand and Australia.",
    common_export_regions: ["Thailand", "Australia"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — BYD's Thailand Rayong plant builds RHD units (RHD ASEAN export hub).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from BYD's Thailand Rayong plant.",
    market_considerations: "Compact PHEV SUV (DM-i); RHD availability via BYD Thailand Rayong plant.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the DM-i PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "BYD Thailand Rayong RHD production + Wikipedia BYD Song Pro (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/BYD_Song_Pro",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "byd-qin-l": {
    export_relevance: "BYD Qin L plug-in hybrid sedan, offered for export through BYD's new-energy-vehicle export channels.",
    common_export_regions: null,
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations (BYD operates a RHD plant in Thailand).",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mid-size PHEV sedan (DM-i); export availability via BYD NEV export channels.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the DM-i PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "BYD Qin L export listings + Wikipedia BYD Qin L (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/BYD_Qin_L",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "byd-frigate-07": {
    export_relevance: "BYD Frigate 07 (Corvette 07) plug-in hybrid mid-size SUV, offered for export; shown at the Thai Motor Show (RHD market).",
    common_export_regions: null,
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations (BYD operates a RHD plant in Thailand).",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mid-size PHEV SUV (DM-i); export availability via BYD NEV export channels.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the DM-i PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "BYD Frigate 07 export listings + Wikipedia BYD Frigate 07 (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/BYD_Frigate_07",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "byd-destroyer-05": {
    export_relevance: "BYD Destroyer 05 plug-in hybrid compact sedan, offered for export through BYD's NEV export channels.",
    common_export_regions: null,
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations (BYD operates a RHD plant in Thailand).",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Compact PHEV sedan (DM-i); export availability via BYD NEV export channels.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the DM-i PHEV — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "BYD Destroyer 05 export guide + Wikipedia BYD Destroyer 05 (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/BYD_Destroyer_05",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Hongqi (FAW) ----
  "hongqi-h5": {
    export_relevance: "Hongqi H5 premium mid-size sedan, exported to Africa, the Middle East and Southeast Asia.",
    common_export_regions: ["Africa", "Middle East", "Southeast Asia"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — Hongqi primarily produces left-hand drive; RHD availability is limited (confirm with exporter).",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Premium mid-size sedan (FAW Hongqi); export focus on Africa, Middle East and Southeast Asia.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Hongqi H5 export market coverage (industry exporter + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Hongqi_H5",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "hongqi-h9": {
    export_relevance: "Hongqi H9 full-size luxury sedan (Hongqi's flagship); primarily left-hand drive, with right-hand-drive development announced for ASEAN markets (limited availability).",
    common_export_regions: ["ASEAN"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "RHD development announced for specific ASEAN markets, but availability remains limited — confirm with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Full-size luxury sedan; primarily LHD production, limited announced RHD development for ASEAN.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Hongqi H9 export market analysis (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Hongqi_H9",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "hongqi-e-hs9": {
    export_relevance: "Hongqi E-HS9 full-size electric SUV; the facelifted model was introduced to right-hand-drive markets in 2026, launching in Singapore with Thailand, Indonesia and Hong Kong announced.",
    common_export_regions: ["Singapore", "Thailand", "Indonesia", "Hong Kong"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — facelifted E-HS9 introduced to RHD markets in 2026 (Singapore launch; Thailand/Indonesia/Hong Kong announced).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Hongqi's export production.",
    market_considerations: "Full-size electric luxury SUV; RHD expansion into Singapore, Thailand, Indonesia and Hong Kong.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Hongqi E-HS9 RHD market launch (Wikipedia + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Hongqi_E-HS9",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Denza (BYD premium brand) ----
  "denza-n7": {
    export_relevance: "Denza N7 (BYD premium brand) battery-electric mid-size SUV, sold in right-hand drive in Thailand (via Rêver Automotive) and Singapore.",
    common_export_regions: ["Thailand", "Singapore"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Denza N7 sold in RHD form in Thailand (Rêver Automotive) and Singapore.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Denza's regional export production.",
    market_considerations: "Battery-electric mid-size SUV; RHD distribution in Thailand and Singapore.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Denza N7 Thailand/Singapore RHD launch (manufacturer + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Denza_N7",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- GAC ----
  "gac-gs8": {
    export_relevance: "GAC GS8 three-row SUV; Russia is GAC's largest export market (20,105 sold in 2024) and the model is sold across six Middle East markets.",
    common_export_regions: ["Russia", "Middle East"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — confirmed export markets (Russia, Middle East) are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Three-row family SUV; strongest export presence in Russia and the Middle East.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "GAC GS8 Russia/Middle East export data (reputable media + GAC Global)",
    source_url: "https://en.wikipedia.org/wiki/GAC_GS8",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "gac-emkoo": {
    export_relevance: "GAC Emkoo compact SUV, sold in right-hand drive in South Africa and the Caribbean.",
    common_export_regions: ["South Africa", "Caribbean"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Right-hand-drive production available — GAC Emkoo sold in RHD form in South Africa and Caribbean RHD markets.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from GAC's export production.",
    market_considerations: "Compact SUV; RHD distribution in South Africa and the Caribbean.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "GAC Emkoo RHD South Africa/Caribbean (manufacturer + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/GAC_Emkoo",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Dongfeng Voyah ----
  "voyah-free": {
    export_relevance: "Voyah Free electric SUV (Dongfeng's premium EV brand), obtained EU vehicle type approval (EWVTA) and sold in Norway and other European markets.",
    common_export_regions: ["Norway", "Europe"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — European export markets are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mid-size electric SUV; EU type approval (EWVTA) with distribution in Norway and other European markets.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T); European units use CCS2 — confirm the inlet on the sourced unit.",
    homologation_notes: "EU vehicle type approval (EWVTA) obtained — destination certification to be confirmed per market.",
    source_name: "Voyah Free EU type approval (manufacturer + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Voyah_Free",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- IM Motors (SAIC) ----
  "im-motors-ls6": {
    export_relevance: "IM Motors LS6 electric SUV, rebranded as MG (IM6) for sale in Europe and South America.",
    common_export_regions: ["Europe", "South America"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — European/South American export markets are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Electric SUV (also offered as range-extended); rebranded as MG IM6 for Europe and South America.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility; export units may use CCS2.",
    homologation_notes: null,
    source_name: "IM Motors LS6 MG-rebrand export plans (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/IM_LS6",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Lynk & Co (Geely-Volvo) ----
  "lynk-co-01": {
    export_relevance: "Lynk & Co 01 compact SUV (Geely-Volvo CMA platform), sold in Europe via a subscription model.",
    common_export_regions: ["Europe"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — European sales are left-hand drive; confirm RHD availability with the exporter.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Compact SUV (CMA platform); European distribution via subscription model.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Lynk & Co 01 European market coverage (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Lynk_%26_Co_01",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Xiaomi ----
  "xiaomi-su7": {
    export_relevance: "Xiaomi SU7 battery-electric sedan; left-hand drive only (no RHD production) with no official export programme — overseas sales are parallel/grey-market export.",
    common_export_regions: null,
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not available — Xiaomi has not produced a right-hand-drive version; the SU7 cannot serve RHD markets as-is.",
    left_hand_drive_relevance: "Standard — LHD only; no RHD production.",
    market_considerations: "Full-size electric sedan; no official export programme — parallel/grey-market export only.",
    parts_availability_notes: "No official overseas sales or aftersales network — warranty and parts must be arranged locally for parallel-export units.",
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Xiaomi SU7 export guide (reputable media + industry exporter)",
    source_url: "https://en.wikipedia.org/wiki/Xiaomi_SU7",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- Avatr (Changan/Huawei/CATL) ----
  "avatr-11": {
    export_relevance: "Avatr 11 electric SUV (Changan/Huawei/CATL), with a right-hand-drive version launched in Thailand (September 2024).",
    common_export_regions: ["Thailand"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — RHD Avatr 11 launched in Thailand (September 2024).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Avatr's export production.",
    market_considerations: "Premium electric SUV; RHD entry into Thailand marks Avatr's Southeast Asia expansion.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Avatr 11 RHD Thailand launch (reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Avatr_11",
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
