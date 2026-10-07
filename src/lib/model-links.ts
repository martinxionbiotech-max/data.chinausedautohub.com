// Cross-site entity links for DATA model pages.
// Every link points to a page that actually exists (verified against each
// sub-site's published routes). No target is invented.

import { MARKET_SITE_URL, MAIN_SITE_URL, TOOLS_SITE_URL } from "../../shared/config/config";
import { modelPowertrains } from "./helpers";
import type { Model } from "./helpers";

// Model → market country links. Grounded in the MARKET site's published
// popular-model data (countryContent.popularModelIds) plus brand-level market
// presence from src/lib/ecosystem.ts. Only canonical country pages are linked.
// Fallback: models without a curated entry derive links from their own sourced
// `common_export_regions` data, mapped to canonical country ids.
const MODEL_MARKETS: Record<string, string[]> = {
  "byd-song-plus": ["kenya", "uzbekistan", "uae"],
  "byd-qin-plus": ["kenya", "nigeria", "uae"],
  "byd-atto-3": ["kenya", "uae"],
  "byd-han": ["uae", "kenya"],
  "byd-seal": ["kenya", "uae"],
  "geely-monjaro": ["saudi-arabia", "tanzania", "kazakhstan", "uzbekistan"],
  "chery-tiggo-8": ["kenya", "tanzania", "nigeria", "kazakhstan", "uzbekistan"],
  "great-wall-haval-h6": ["saudi-arabia", "kazakhstan"],
  "changan-cs75-plus": ["saudi-arabia"],
  "li-auto-l7": ["uae"],
  "nio-es6": ["uae"],
  "gac-gs4": ["tanzania", "nigeria"],
  // P3.8 补挂：在 market 站 countryContent.popularModelIds 中列为热门、但此前缺
  // Related-market 链接的车型。国别全部来自 market 站已发布的 popularModelIds 数据。
  "byd-dolphin": ["brunei", "egypt", "ethiopia", "jamaica", "laos", "malawi", "malaysia", "mauritius", "nepal", "philippines", "rwanda", "thailand", "zambia"],
  "byd-sealion-6": ["australia", "malaysia", "mongolia", "mozambique", "philippines"],
  "chery-tiggo-7": ["kyrgyzstan"],
  "deepal-s07": ["thailand"],
  "haval-h9": ["kyrgyzstan"],
  "honda-cr-v": ["bangladesh"],
  "mg-4": ["australia", "botswana", "chile", "colombia", "fiji", "ghana", "indonesia", "malawi", "mozambique", "peru", "serbia", "zambia"],
  "mg-5": ["mexico"],
  "toyota-rav4": ["bangladesh"],
  "wuling-bingo": ["ethiopia"],
  "zeekr-001": ["belarus"],
};

export interface RelatedLink {
  label: string;
  url: string;
}

// Region display names (as written in models.json `common_export_regions`) →
// canonical market country ids. Only names that map to a real country page are
// listed; regional blocs (ASEAN, Europe, Africa, Middle East, Latin America,
// CIS, Caribbean, etc.) and countries without a published page are omitted.
const REGION_TO_COUNTRY: Record<string, string> = {
  "Australia": "australia",
  "Azerbaijan": "azerbaijan",
  "Bahrain": "bahrain",
  "Cambodia": "cambodia",
  "Egypt": "egypt",
  "Indonesia": "indonesia",
  "Kazakhstan": "kazakhstan",
  "Kenya": "kenya",
  "Malaysia": "malaysia",
  "Mexico": "mexico",
  "Myanmar": "myanmar",
  "New Zealand": "new-zealand",
  "Nigeria": "nigeria",
  "Philippines": "philippines",
  "Qatar": "qatar",
  "Russia": "russia",
  "Saudi Arabia": "saudi-arabia",
  "South Africa": "south-africa",
  "Sri Lanka": "sri-lanka",
  "Tanzania": "tanzania",
  "Thailand": "thailand",
  "UAE": "uae",
  "United Arab Emirates": "uae",
  "Uzbekistan": "uzbekistan",
};

export function modelMarketLinks(modelId: string, regions?: string[] | null): RelatedLink[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const push = (id: string) => {
    if (id && !seen.has(id)) { seen.add(id); ids.push(id); }
  };
  // 1. Curated, grounded model→market mapping.
  for (const id of MODEL_MARKETS[modelId] ?? []) push(id);
  // 2. Data-driven fallback from the model's own sourced export regions.
  for (const r of regions ?? []) {
    const id = REGION_TO_COUNTRY[r];
    if (id) push(id);
  }
  return ids.map((id) => ({
    label: id,
    url: `${MARKET_SITE_URL}/countries/${id}/`,
  }));
}

// Main-site guide slugs that exist under /guides/{slug}/.
const BASE_GUIDES: { slug: string; label: string }[] = [
  { slug: "how-to-buy-used-car-from-china", label: "How to Buy a Used Car from China" },
  { slug: "china-used-car-export-process", label: "China Used Car Export Process" },
  { slug: "vehicle-inspection", label: "Vehicle Inspection" },
  { slug: "export-documents", label: "Export Documents" },
  { slug: "shipping", label: "Shipping" },
  { slug: "landed-cost", label: "Landed Cost" },
];
const EV_GUIDES: { slug: string; label: string }[] = [
  { slug: "buying-chinese-evs-for-export", label: "Buying Chinese EVs for Export" },
];

export function modelGuideLinks(model: Model): RelatedLink[] {
  const pws = modelPowertrains(model);
  const isEv = pws.some((p) => p === "ev" || p === "phev");
  const guides = isEv ? [...BASE_GUIDES, ...EV_GUIDES] : BASE_GUIDES;
  return guides.map((g) => ({ label: g.label, url: `${MAIN_SITE_URL}/guides/${g.slug}/` }));
}

// Tool-site calculator pages that exist.
const BASE_TOOLS: { slug: string; label: string }[] = [
  { slug: "vehicle-comparison", label: "Vehicle Comparison" },
  { slug: "landed-cost-calculator", label: "Landed Cost Calculator" },
  { slug: "import-duty-calculator", label: "Import Duty Calculator" },
  { slug: "market-compatibility", label: "Market Compatibility" },
];
const EV_TOOLS: { slug: string; label: string }[] = [
  { slug: "ev-import-cost-calculator", label: "EV Import Cost Calculator" },
];

export function modelToolLinks(model: Model): RelatedLink[] {
  const pws = modelPowertrains(model);
  const isEv = pws.some((p) => p === "ev" || p === "phev");
  const tools = isEv ? [...BASE_TOOLS, ...EV_TOOLS] : BASE_TOOLS;
  return tools.map((t) => ({ label: t.label, url: `${TOOLS_SITE_URL}/${t.slug}/` }));
}
