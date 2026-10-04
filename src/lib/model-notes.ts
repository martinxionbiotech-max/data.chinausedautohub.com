// Curated buyer-facing editorial notes for DATA model pages (PHASE 4 depth).
// Qualitative, sourced-from-public-knowledge statements only — no sales figures,
// no prices, no invented specifications. Every numeric claim lives in
// shared/data/models.json under a trim spec with its own source/confidence.
//
// These notes are separate from the specification table precisely so that
// MODEL DATA (typical, trim/market-dependent) is never conflated with the
// condition of any actual vehicle in inventory. Wording discipline:
// "Typical specification" / "Trim-dependent" / "Market-dependent" /
// "Vehicle-specific information should be confirmed before purchase".

export interface ModelNote {
  /** Common specification differences across trims and markets. */
  specDifferences: string;
  /** Used-market considerations for a buyer sourcing this model. */
  usedMarket: string[];
  /** Destination-market considerations (drive side, charging, eligibility). */
  destination: string[];
}

export const MODEL_NOTES: Record<string, ModelNote> = {
  "byd-song-plus": {
    specDifferences:
      "Trim-dependent: the DM-i trims differ in battery capacity (18.3 kWh vs 26.6 kWh), electric range and motor output, while the EV trim has a larger battery, different dimensions and no combustion engine. Market-dependent: China-market and export variants may differ in equipment, charging and telematics. Typical specification only — confirm the exact trim and build before purchase.",
    usedMarket: [
      "A high-volume model in China, so used examples are relatively common and parts availability is generally broad — confirm this for your region rather than assuming.",
      "For PHEV units, assess both the battery state of health and the combustion engine; for EV units, battery health is the dominant value factor.",
      "Verify the actual odometer, service history and any repair record against the vehicle, not the model's reputation.",
    ],
    destination: [
      "Domestic units are left-hand drive; right-hand-drive destinations (for example Kenya, Tanzania, Nigeria) require RHD availability to be confirmed with the exporter.",
      "EV and PHEV units may qualify for duty relief in some markets — check the EV rules for the specific country on the Market sub-site.",
      "Vehicle age limits vary by market; production years 2020–2025 mean early units approach the eight-year threshold in some East African markets.",
    ],
  },
  "byd-qin-plus": {
    specDifferences:
      "Trim-dependent: DM-i trims differ in battery capacity and electric range (55 km vs 120 km), and the EV trim has a different battery and no engine. Market-dependent naming and equipment can vary by export region. Typical specification only.",
    usedMarket: [
      "A high-volume sedan in China; used supply is generally large, but individual condition and mileage must be verified per vehicle.",
      "PHEV battery health and engine condition are both relevant; request a battery diagnostic where available.",
    ],
    destination: [
      "Domestic units are left-hand drive; confirm RHD availability for right-hand-drive markets.",
      "Check destination age limits and EV/PHEV duty treatment on the Market sub-site before committing.",
    ],
  },
  "byd-atto-3": {
    specDifferences:
      "Trim-dependent: battery capacity and range vary by trim and market; export versions are sold under the Atto 3 name while the domestic model is the Yuan Plus. Typical specification only — confirm the specific build.",
    usedMarket: [
      "An export-oriented EV; used examples exist in China, but battery state of health is the key value factor.",
      "Confirm charging connector type and software/telematics compatibility with the destination market.",
    ],
    destination: [
      "Left-hand drive as standard; confirm RHD or LHD suitability for the destination.",
      "EV duty treatment varies by market — review country-specific EV rules on the Market sub-site.",
    ],
  },
  "byd-han": {
    specDifferences:
      "Trim-dependent: the EV and DM-i trims differ substantially in powertrain, battery and range. Market-dependent equipment differences apply. Typical specification only.",
    usedMarket: [
      "A flagship sedan; used units are less common than volume models, so verify condition and history carefully.",
      "Battery state of health dominates EV value; for DM-i units check both battery and engine.",
    ],
    destination: [
      "Left-hand drive domestic units; confirm drive-side and homologation for the destination.",
      "Premium sedans may face higher duty and age restrictions in some markets — verify on the Market sub-site.",
    ],
  },
  "byd-seal": {
    specDifferences:
      "Trim-dependent: single-motor and dual-motor configurations differ in power, range and drive type. Market-dependent equipment differences apply. Typical specification only.",
    usedMarket: [
      "A mid-size electric sedan; battery state of health is the dominant used-market factor.",
      "Confirm the charging standard and whether the vehicle's software/services function in the destination.",
    ],
    destination: [
      "Left-hand drive as standard; confirm drive-side requirements.",
      "EV duty relief varies — check country-specific EV rules on the Market sub-site.",
    ],
  },
  "geely-monjaro": {
    specDifferences:
      "Trim-dependent: engine output, transmission and drive type vary by trim (2WD vs AWD). Market-dependent: sold as the Xingyue L in China and the Monjaro for export. Typical specification only.",
    usedMarket: [
      "A petrol SUV; engine, transmission and general mechanical condition are the key checks, not battery.",
      "Confirm the equivalent export model name and regional specification for the destination.",
    ],
    destination: [
      "Left-hand drive domestic units; confirm RHD/LHD suitability.",
      "Petrol SUVs do not benefit from EV duty relief; budget import duty and VAT accordingly.",
    ],
  },
  "chery-tiggo-8": {
    specDifferences:
      "Trim-dependent: engine, transmission, drive type and seating (5 vs 7 seats) vary by trim and generation. Market-dependent export variants differ. Typical specification only.",
    usedMarket: [
      "A mainstay of Chery's export lineup; used supply in China exists but 7-seat and higher-spec units may be less common.",
      "Check engine, transmission and body condition; seating configuration must match the stated trim.",
    ],
    destination: [
      "Left-hand drive domestic units; many African markets are right-hand drive — confirm RHD availability.",
      "Verify destination age limits and any import certification (for example PVoC in East Africa) on the Market sub-site.",
    ],
  },
  "saic-mg-zs": {
    specDifferences:
      "Trim-dependent: EV and petrol (1.5L) trims differ fundamentally in powertrain and dimensions. Market-dependent: the MG brand is sold globally with regional variants. Typical specification only.",
    usedMarket: [
      "A compact SUV available as EV or petrol; choose the powertrain that matches the destination's duty and infrastructure.",
      "For EV units, battery state of health is the key check; for petrol units, engine and transmission.",
    ],
    destination: [
      "Left-hand drive domestic units; confirm drive-side for the destination.",
      "EV duty relief varies by market — review country EV rules on the Market sub-site.",
    ],
  },
  "nio-es6": {
    specDifferences:
      "Trim-dependent: battery capacity (and thus range) varies by configuration; dual-motor AWD is standard on listed trims. Market-dependent equipment applies. Typical specification only.",
    usedMarket: [
      "A premium EV with battery-swap capability; the swap/charging ecosystem is region-specific, so export units may need different charging and software support.",
      "Battery state of health and charging compatibility are the key checks.",
    ],
    destination: [
      "Left-hand drive; confirm drive-side and charging standard compatibility for the destination.",
      "Premium EVs may face higher duty and limited service support in some markets — verify before purchase.",
    ],
  },
  "xpeng-g6": {
    specDifferences:
      "Trim-dependent: range and drive type (RWD vs AWD) vary by configuration; the 800V platform is a defining feature of the model line. Market-dependent equipment applies. Typical specification only.",
    usedMarket: [
      "A mid-size EV on an 800V platform; fast-charging performance depends on destination charging infrastructure.",
      "Battery state of health and charging compatibility are the key used-market checks.",
    ],
    destination: [
      "Left-hand drive; confirm drive-side and charging standard compatibility.",
      "Verify EV duty treatment and service/parts availability for the destination on the Market sub-site.",
    ],
  },
  "great-wall-haval-h6": {
    specDifferences:
      "Trim-dependent: engine, transmission and drive type vary across generations and trims. Market-dependent export variants differ in equipment and homologation. Typical specification only.",
    usedMarket: [
      "A long-running, high-volume compact SUV; used supply in China is generally broad.",
      "Check engine and transmission condition; confirm the specific generation matches the stated production years.",
    ],
    destination: [
      "Left-hand drive domestic units; confirm RHD/LHD suitability for the destination.",
      "Petrol powertrains do not benefit from EV duty relief — budget duty and VAT accordingly.",
    ],
  },
};

export function getModelNote(modelId: string): ModelNote | undefined {
  return MODEL_NOTES[modelId];
}

/** Inventory link for a model: main-site listing filtered by brand. */
export function relatedInventoryHref(brandId: string): string {
  return `https://chinausedautohub.com/cars/?brand=${brandId}`;
}
