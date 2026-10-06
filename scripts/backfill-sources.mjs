// Backfill source_url for 8 pre-existing models that shipped with null URLs.
// Source is now Wikipedia (reputable_media / medium) — updated at all three levels.
import { readFileSync, writeFileSync } from "node:fs";

const CHECKED = "2026-10-06";

const BACKFILL = {
  "byd-qin-plus": "https://en.wikipedia.org/wiki/BYD_Qin_Plus",
  "geely-monjaro": "https://en.wikipedia.org/wiki/Geely_Xingyue_L",
  "chery-tiggo-8": "https://en.wikipedia.org/wiki/Chery_Tiggo_8",
  "changan-cs75-plus": "https://en.wikipedia.org/wiki/Changan_CS75",
  "li-auto-l7": "https://en.wikipedia.org/wiki/Li_L7",
  "bmw-3-series-long": "https://en.wikipedia.org/wiki/BMW_3_Series_(G20)",
  "mercedes-c-class-lwb": "https://en.wikipedia.org/wiki/Mercedes-Benz_C-Class_(W206)",
  "honda-cr-v": "https://en.wikipedia.org/wiki/Honda_CR-V",
};

const modelsData = JSON.parse(readFileSync("shared/data/models.json", "utf8"));
let updated = 0;
for (const m of modelsData.models) {
  const url = BACKFILL[m.model_id];
  if (!url) continue;
  updated++;
  m.source_url = url;
  m.source_name = "Reputable media specifications";
  m.source_type = "reputable_media";
  m.confidence = "medium";
  m.checked_date = CHECKED;
  m.last_verified = CHECKED;
  for (const g of m.generations ?? []) {
    g.source_url = url;
    g.source_name = "Reputable media specifications";
    g.source_type = "reputable_media";
    g.confidence = "medium";
    g.checked_date = CHECKED;
    g.last_verified = CHECKED;
    for (const t of g.trims ?? []) {
      t.source_url = url;
      t.source_name = "Reputable media specifications";
      t.source_type = "reputable_media";
      t.confidence = "medium";
      t.checked_date = CHECKED;
      t.last_verified = CHECKED;
    }
  }
}
writeFileSync("shared/data/models.json", JSON.stringify(modelsData, null, 2) + "\n");
console.log("backfilled models:", updated);
