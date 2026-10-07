#!/usr/bin/env node
// PHASE 2 generation deepening: backfill generation.platform (with a
// platform_source provenance object) for high-value models where the platform
// is named in a source the researcher actually opened. Source URLs are the
// same Wikipedia/primary pages already verified in the analysis research.
import { readFileSync, writeFileSync } from "node:fs";

const MODELS_PATH = "shared/data/models.json";

// model_id -> { platform, source_url }  (source_type=database, confidence=medium)
const PLATFORMS = {
  "xpeng-g6": { platform: "SEPA 2.0", url: "https://en.wikipedia.org/wiki/XPeng_G6" },
  "byd-dolphin": { platform: "e-Platform 3.0", url: "https://en.wikipedia.org/wiki/BYD_Dolphin" },
  "zeekr-001": { platform: "SEA1 (Sustainable Experience Architecture)", url: "https://en.wikipedia.org/wiki/Zeekr_001" },
  "byd-sealion-07": { platform: "e-Platform 3.0 (Evo for 91.3 kWh)", url: "https://en.wikipedia.org/wiki/BYD_Sealion_7" },
  "xpeng-g9": { platform: "Edward", url: "https://en.wikipedia.org/wiki/XPeng_G9" },
  "li-auto-l9": { platform: "Li Auto L-series EREV platform (shared with L7/L8)", url: "https://en.wikipedia.org/wiki/Li_Auto_L9" },
  "chery-tiggo-7": { platform: "T1X", url: "https://en.wikipedia.org/wiki/Chery_Tiggo_7" },
  "mg-4": { platform: "MSP (Modular Scalable Platform / Nebula)", url: "https://en.wikipedia.org/wiki/MG4_EV" },
  "chery-tiggo-8": { platform: "T1X", url: "https://en.wikipedia.org/wiki/Chery_Tiggo_8" },
  "chery-tiggo-5x": { platform: "T1X", url: "https://en.wikipedia.org/wiki/Chery_Tiggo_5x" },
  "wuling-bingo": { platform: "SGMW GSEV (Global Small Electric Vehicle)", url: "https://en.wikipedia.org/wiki/Wuling_Binguo" },
  "geely-coolray": { platform: "BMA", url: "https://en.wikipedia.org/wiki/Geely_Binyue" },
  "zeekr-007": { platform: "PMA2+ (SEA-derived)", url: "https://en.wikipedia.org/wiki/Zeekr_007" },
  "byd-atto-3": { platform: "e-Platform 3.0", url: "https://en.wikipedia.org/wiki/BYD_Atto_3" },
  "byd-han": { platform: "e-Platform 2.0", url: "https://en.wikipedia.org/wiki/BYD_Han" },
  "geely-monjaro": { platform: "CMA", url: "https://en.wikipedia.org/wiki/Geely_Xingyue_L" },
  "li-auto-l6": { platform: "Li Auto L-series EREV platform (shared with L7/L8/L9)", url: "https://en.wikipedia.org/wiki/Li_L6" },
  "jac-j7": { platform: "Jianghuai C platform", url: "https://en.wikipedia.org/wiki/JAC_Jiayue_A5" },
  "denza-d9": { platform: "e-Platform 3.0 (EV) / DM-i (PHEV)", url: "https://en.wikipedia.org/wiki/Denza_D9" },
  "nio-es6": { platform: "NT2.0", url: "https://en.wikipedia.org/wiki/Nio_ES6" },
  "changan-cs35-plus": { platform: "PF-C", url: "https://en.wikipedia.org/wiki/Changan_CS35_Plus" },
  "aito-m7": { platform: "Fengon ix7 (first generation)", url: "https://en.wikipedia.org/wiki/AITO_M7" },
  "haval-jolion": { platform: "L.E.M.O.N. (B30)", url: "https://en.wikipedia.org/wiki/Haval_Jolion" },
  "aion-y-plus": { platform: "GEP 3.0", url: "https://en.wikipedia.org/wiki/Aion_Y" },
  "geely-emgrand": { platform: "BMA (4th generation, SS11)", url: "https://en.wikipedia.org/wiki/Geely_Emgrand" },
  "dongfeng-aeolus-yixuan": { platform: "PSA CMP (EMP1)", url: "https://en.wikipedia.org/wiki/Aeolus_Yixuan" },
};

const models = JSON.parse(readFileSync(MODELS_PATH, "utf8"));
let applied = 0;
for (const m of models.models) {
  const p = PLATFORMS[m.model_id];
  if (!p) continue;
  for (const g of m.generations ?? []) {
    g.platform = p.platform;
    g.platform_source = {
      source_name: "Wikipedia — " + m.name,
      source_url: p.url,
      source_type: "database",
      checked_date: "2026-10-07",
      confidence: "medium",
    };
  }
  applied++;
}
writeFileSync(MODELS_PATH, JSON.stringify(models, null, 2) + "\n");
console.log(`platform backfilled for ${applied} models`);
