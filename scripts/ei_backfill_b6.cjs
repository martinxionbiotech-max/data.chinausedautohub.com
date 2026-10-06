// Batch 6 EI backfill — verify export intelligence for next-tier high-value export models
// Data repo: shared/data/models.json. Fills only evidence-backed fields; no guessing.
const fs = require("fs");

const updates = {
  // --- RHD ICE body-on-frame (GWM) ---
  "tank-500": {
    export_relevance: "GWM Tank 500 full-size body-on-frame SUV, sold in right-hand drive in Thailand (3.0T diesel launched 2026) and Australia (2026 diesel grades).",
    common_export_regions: ["Thailand", "Australia"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Right-hand-drive production available — GWM sells the Tank 500 in RHD form in Thailand and Australia.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from GWM's export production.",
    market_considerations: "Full-size body-on-frame 7-seat SUV; 3.0T petrol (China) and 3.0T diesel (Thailand/Australia 2026) powertrains.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "GWM Tank 500 Thailand/Australia launch coverage (reputable media)",
    source_url: "https://www.drive.com.au/reviews/2026-gwm-tank-500-3-0-litre-diesel-review-australian-first-drive/",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "haval-h9": {
    export_relevance: "GWM Haval H9 body-on-frame SUV, sold in right-hand drive in Australia and New Zealand.",
    common_export_regions: ["Australia", "New Zealand"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Right-hand-drive production available — sold in RHD form in Australia and New Zealand.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from GWM's export production.",
    market_considerations: "Full-size body-on-frame 4WD SUV (2.0T petrol); RHD availability via Australian/New Zealand market.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Haval H9 Australia/New Zealand RHD market listing (reputable media)",
    source_url: "https://www.carsales.com.au/cars/haval/h9/",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "jetour-dashing": {
    export_relevance: "Jetour Dashing crossover; Jetour debuted RHD models (Dashing and X70 Plus) in South Africa in September 2024.",
    common_export_regions: ["South Africa"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Right-hand-drive production available — Jetour Dashing sold in RHD form in South Africa.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from Jetour's export production.",
    market_considerations: "Compact crossover; RHD market entry via South Africa (September 2024).",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Jetour RHD South Africa launch (manufacturer PR / reputable media)",
    source_url: "https://jetour.co.za/dashing/",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  // --- RHD EV (new brands) ---
  "aion-y-plus": {
    export_relevance: "GAC Aion Y Plus electric SUV, sold in right-hand drive in Thailand (from September 2023), Malaysia and Indonesia.",
    common_export_regions: ["Thailand", "Malaysia", "Indonesia"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Aion Y Plus sold in RHD form in Thailand, Malaysia and Indonesia.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from GAC's regional production/assembly.",
    market_considerations: "Compact electric SUV (GAC's dedicated EV arm); RHD distribution in Thailand, Malaysia and Indonesia.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility; regional RHD units may use other inlet standards.",
    homologation_notes: null,
    source_name: "Aion Y Plus Thailand/Malaysia/Indonesia RHD launch (manufacturer + reputable media)",
    source_url: "https://en.wikipedia.org/wiki/Aion_Y",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "neta-x": {
    export_relevance: "Neta X electric SUV, produced in right-hand drive at Neta's Thailand factory (production began March 2024) and sold in Thailand and Malaysia.",
    common_export_regions: ["Thailand", "Malaysia"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Neta X built in RHD at Neta's Thailand plant and sold in Thailand/Malaysia.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from Neta's Thailand plant.",
    market_considerations: "Compact electric SUV; Thailand is Neta's first overseas production base, building RHD EVs for Southeast Asia.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Neta X Thailand RHD production (reputable media)",
    source_url: "https://carnewschina.com/2024/07/28/neta-announces-neta-x-to-be-produced-in-thailand-and-sold-in-thailand-and-malaysia/",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "wuling-bingo": {
    export_relevance: "SAIC-GM-Wuling Bingo (Binguo) small electric hatchback, exported in right-hand drive to Indonesia, the UK, Africa, ASEAN and the Caribbean.",
    common_export_regions: ["Indonesia", "United Kingdom", "Africa", "ASEAN", "Caribbean"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Wuling builds factory RHD Binguo (Air EV/Bingo) units for Indonesia, the UK, Africa, ASEAN and the Caribbean.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from SAIC-GM-Wuling's export production.",
    market_considerations: "Small electric hatchback; RHD export variants (Air EV / Binguo EV) produced at Wuling's Cikarang (Indonesia) plant and exported globally.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "SAIC-GM-Wuling RHD export models (manufacturer)",
    source_url: "https://www.wulingvehicles.com/services/rhd-models",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  // --- LHD EV (NIO Europe) ---
  "nio-es8": {
    export_relevance: "NIO ES8 (EL8 in Europe) electric SUV, launched in five European countries (Norway, Germany, the Netherlands, Sweden and Denmark) from June 2024.",
    common_export_regions: ["Norway", "Germany", "Netherlands", "Sweden", "Denmark"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Not standard — NIO's European EL8 is left-hand drive; confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Large electric SUV with battery-swap architecture; Europe (EL8) is the primary export region, LHD only.",
    parts_availability_notes: "NIO's overseas service network is limited outside Europe — confirm battery-swap and parts support with the exporter.",
    charging_standard_notes: "China-market charging standard (GB/T); swappable battery architecture; European units use CCS2 — confirm the inlet on the sourced unit.",
    homologation_notes: "European type approval (EL8); destination certification to be confirmed per market.",
    source_name: "NIO EL8 Europe launch coverage (reputable media)",
    source_url: "https://autonews.gasgoo.com/articles/ev/70033567",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  // --- ICE LHD export (Chery / Changan) ---
  "chery-tiggo-4": {
    export_relevance: "Chery Tiggo 4 (Tiggo 4 Pro) compact SUV, sold in right-hand drive in South Africa and exported to African markets.",
    common_export_regions: ["South Africa", "Africa"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Right-hand-drive production available — sold in RHD form in South Africa.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from Chery's export production.",
    market_considerations: "Compact SUV (Tiggo 4 Pro / Cross / Cross HEV variants); RHD distribution in South Africa.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Chery Tiggo 4 South Africa RHD range (manufacturer)",
    source_url: "https://www.chery.co.za/range/tiggo-4",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "chery-arrizo-8": {
    export_relevance: "Chery Arrizo 8 mid-size sedan (4,780 mm), offered for export with 1.6L and 2.0L turbo petrol engines through a 7-speed dual-clutch transmission.",
    common_export_regions: null,
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mid-size executive sedan (FWD, 5 seats); available through Chery's export channels.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Chery Arrizo 8 export listing (industry exporter)",
    source_url: "https://www.cheryexport.com/en/models/chery-arrizo-8",
    source_type: "industry",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "changan-cs35-plus": {
    export_relevance: "Changan CS35 Plus small SUV, exported to Africa, the Middle East and Southeast Asia (top Changan export markets include Southeast Asia, the Middle East and Africa).",
    common_export_regions: ["Southeast Asia", "Middle East", "Africa"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Gasoline small SUV; export channels cover Africa, the Middle East and Southeast Asia.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Changan export data (industry reference)",
    source_url: "https://iautoexport.com/available-vehicles/changan-cs35-plus/",
    source_type: "industry",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "changan-cs55-plus": {
    export_relevance: "Changan CS55 Plus SUV, exported to Russia, Kazakhstan and Egypt; a CS55 Plus PHEV variant is offered for LHD export markets.",
    common_export_regions: ["Russia", "Kazakhstan", "Egypt"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination (a CS55 Plus PHEV variant is offered for export).",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Mainstream family SUV; also sold as Changan UNI-S in some markets; PHEV variant available for LHD export.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the PHEV variant — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Changan CS55 Plus export guide (industry exporter)",
    source_url: "https://richingauto.com/changan-suv-export-guide-dealers-africa-middle-east/",
    source_type: "industry",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "changan-uni-t": {
    export_relevance: "Changan UNI-T crossover; Changan is a top-selling Chinese brand in Saudi Arabia (cumulative regional sales exceeding 400,000 units) and is expanding across the Middle East and Africa.",
    common_export_regions: ["Saudi Arabia", "Middle East", "Africa"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Compact crossover; Changan has long-standing Middle East distribution, strongest in Saudi Arabia.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "Changan Middle East/Africa expansion (reputable media)",
    source_url: "https://www.autocango.com/news-detail/changan-auto-middle-east-expansion-2024?page=news",
    source_type: "reputable_media",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "changan-uni-k": {
    export_relevance: "Changan UNI-K premium crossover, entered 14 new markets since 2022 across Southeast Asia, the Middle East and Latin America; a UNI-K iDD plug-in hybrid is offered.",
    common_export_regions: ["Southeast Asia", "Middle East", "Latin America"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination (a UNI-K iDD plug-in hybrid variant is offered).",
    right_hand_drive_relevance: "Not standard — confirm right-hand-drive availability with the exporter for RHD destinations.",
    left_hand_drive_relevance: "Standard — listed models are China domestic-market production (left-hand drive).",
    market_considerations: "Premium crossover; distribution concentrated in Southeast Asia and Middle East urban centers; iDD PHEV variant available.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) for the iDD PHEV variant — confirm destination charging-connector and voltage compatibility.",
    homologation_notes: null,
    source_name: "Changan UNI-K overseas markets (reputable media + industry exporter)",
    source_url: "https://richingauto.com/changan-suv-export-guide-dealers-africa-middle-east/",
    source_type: "industry",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "zeekr-x": {
    export_relevance: "Zeekr X small electric SUV, the first Zeekr model sold in Australia (right-hand drive), launched there in two variants on the SEA platform.",
    common_export_regions: ["Australia", "Europe"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Zeekr X sold in RHD form in Australia (first Zeekr model there).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units are sourced from Zeekr's export production.",
    market_considerations: "Small electric SUV (SEA platform, shared with Volvo EX30); RHD distribution in Australia.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility; export units may use CCS2.",
    homologation_notes: null,
    source_name: "Zeekr X Australia RHD launch (reputable media)",
    source_url: "https://www.whichcar.com.au/news/2026-zeekr-x-specifications-revealed-ahead-of-australian-launch",
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
  // keep model-level provenance in sync with the EI source
  m.last_verified = "2026-10-06";
  applied++;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("applied EI backfill to", applied, "models");
console.log("keys:", Object.keys(updates).length);
