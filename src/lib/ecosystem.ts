// Cross-site entity-graph links from DATA brand pages to MARKET pages.
// Only links to MARKET pages that actually exist are included. The mapping is
// derived from the MARKET site's published popular-model data (market content
// per country), so each link is grounded in a real, existing market guide.

import { MARKET_SITE_URL } from "../../shared/config/config";

export interface MarketLink {
  label: string;
  url: string;
}

const LINKS: Record<string, MarketLink[]> = {
  byd: [
    { label: "Kenya EV import guide", url: `${MARKET_SITE_URL}/countries/kenya/ev/` },
    { label: "BYD Song Plus in Kenya", url: `${MARKET_SITE_URL}/countries/kenya/byd-song-plus/` },
    { label: "UAE market guide", url: `${MARKET_SITE_URL}/countries/uae/` },
  ],
  geely: [
    { label: "Saudi Arabia market guide", url: `${MARKET_SITE_URL}/countries/saudi-arabia/` },
    { label: "Kazakhstan market guide", url: `${MARKET_SITE_URL}/countries/kazakhstan/` },
    { label: "Uzbekistan market guide", url: `${MARKET_SITE_URL}/countries/uzbekistan/` },
  ],
  chery: [
    { label: "Kenya market guide", url: `${MARKET_SITE_URL}/countries/kenya/` },
    { label: "Nigeria market guide", url: `${MARKET_SITE_URL}/countries/nigeria/` },
    { label: "Tanzania market guide", url: `${MARKET_SITE_URL}/countries/tanzania/` },
  ],
  "great-wall": [
    { label: "Saudi Arabia market guide", url: `${MARKET_SITE_URL}/countries/saudi-arabia/` },
    { label: "Kazakhstan market guide", url: `${MARKET_SITE_URL}/countries/kazakhstan/` },
  ],
  changan: [
    { label: "Saudi Arabia market guide", url: `${MARKET_SITE_URL}/countries/saudi-arabia/` },
  ],
  gac: [
    { label: "Tanzania market guide", url: `${MARKET_SITE_URL}/countries/tanzania/` },
    { label: "Nigeria market guide", url: `${MARKET_SITE_URL}/countries/nigeria/` },
  ],
  "li-auto": [
    { label: "UAE market guide", url: `${MARKET_SITE_URL}/countries/uae/` },
  ],
  nio: [
    { label: "UAE market guide", url: `${MARKET_SITE_URL}/countries/uae/` },
  ],
};

export function brandMarketLinks(brandId: string): MarketLink[] {
  return LINKS[brandId] ?? [];
}
