// Shared data-access + presentation helpers for the DATA site.
// Read-only over shared/data/*.json (owned by this site per the data contract).
import brandsData from "../../shared/data/brands.json";
import modelsData from "../../shared/data/models.json";

export interface Brand {
  brand_id: string;
  name: string;
  name_zh: string;
  origin_country: string;
  founded: number | null;
  powertrains: string[];
  vehicle_types: string[];
  status?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  checked_date?: string | null;
  confidence?: string | null;
  last_verified?: string | null;
}

export interface Trim {
  trim_id: string;
  name: string;
  powertrain: string;
  production_years?: number[];
  specs?: Record<string, string | number | null>;
  source_name?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  checked_date?: string | null;
  confidence?: string | null;
  last_verified?: string | null;
}

export interface Generation {
  generation_id: string;
  name: string;
  production_years?: number[];
  platform?: string | null;
  platform_source?: {
    source_name?: string | null;
    source_url?: string | null;
    source_type?: string | null;
    checked_date?: string | null;
    confidence?: string | null;
  } | null;
  facelift?: boolean | null;
  trims?: Trim[];
  source_name?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  checked_date?: string | null;
  confidence?: string | null;
  last_verified?: string | null;
}

/**
 * A single evidence-backed analysis note (PHASE 2 deepening).
 * Text is written only when a source exists; otherwise the field is null
 * and renders as "Not available" / "Not yet verified".
 */
export interface AnalysisNote {
  text: string;
  source_name: string;
  source_url: string | null;
  source_type: string;
  checked_date: string;
  confidence: string;
}

export interface Model {
  model_id: string;
  brand_id: string;
  name: string;
  name_zh: string;
  aliases?: string[] | null;
  vehicle_type?: string | null;
  body_type: string;
  powertrain_types?: string[];
  production_status?: string | null;
  china_market_status?: string | null;
  export_relevance?: string | null;
  common_export_regions?: string[] | null;
  powertrain_export_relevance?: string | null;
  right_hand_drive_relevance?: string | null;
  left_hand_drive_relevance?: string | null;
  market_considerations?: string | null;
  parts_availability_notes?: string | null;
  charging_standard_notes?: string | null;
  homologation_notes?: string | null;
  used_market_considerations?: AnalysisNote | null;
  destination_market_considerations?: AnalysisNote | null;
  parts_service_considerations?: AnalysisNote | null;
  known_limitations?: AnalysisNote | null;
  generations?: Generation[];
  source_name?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  checked_date?: string | null;
  confidence?: string | null;
  last_verified?: string | null;
}

export const brands = brandsData.brands as Brand[];
export const models = modelsData.models as Model[];

export const POWERTRAIN_LABELS: Record<string, string> = {
  ev: "EV",
  phev: "PHEV",
  hev: "HEV",
  ice: "ICE",
  erev: "EREV",
};

export const POWERTRAIN_ORDER = ["ev", "phev", "erev", "hev", "ice"];

// §5 provenance source_type ten-value enum → display labels.
export const SOURCE_TYPE_LABELS: Record<string, string> = {
  official: "Official",
  manufacturer: "Manufacturer",
  government: "Government",
  regulatory: "Regulatory",
  industry: "Industry",
  reputable_media: "Reputable media",
  database: "Database",
  market_observation: "Market observation",
  calculated: "Calculated",
  estimated: "Estimated",
};

// DATA-site confidence display labels. Manufacturer-published specifications are
// a citable source, not an independent verification, so the highest level shown is
// "Source-backed" — never "Verified" (which would claim we independently confirmed
// the figure against a held document; see docs/trust-terminology.md §2/§4).
export const CONFIDENCE_LEVELS: Record<string, string> = {
  high: "Source-backed",
  medium: "Reported",
  low: "Estimated",
};

export function confidenceLevel(confidence?: string | null): string {
  const c = (confidence ?? "").toLowerCase();
  return CONFIDENCE_LEVELS[c] ?? "Unknown";
}

export function sourceTypeLabel(sourceType?: string | null): string {
  const t = (sourceType ?? "").toLowerCase();
  return SOURCE_TYPE_LABELS[t] ?? sourceType ?? "Unknown";
}

export const BODY_TYPE_LABELS: Record<string, string> = {
  suv: "SUV",
  sedan: "Sedan",
  mpv: "MPV",
  hatchback: "Hatchback",
  pickup: "Pickup",
};

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  passenger_car: "Passenger car",
};

export const PRODUCTION_STATUS_LABELS: Record<string, string> = {
  active: "In production",
  discontinued: "Discontinued",
};

export const DRIVE_LABELS: Record<string, string> = {
  fwd: "Front-wheel drive (FWD)",
  rwd: "Rear-wheel drive (RWD)",
  awd: "All-wheel drive (AWD)",
};

export const COUNTRY_LABELS: Record<string, string> = {
  CN: "China",
  JP: "Japan",
  DE: "Germany",
  KR: "South Korea",
  US: "United States",
  GB: "United Kingdom",
};

export const SPEC_LABELS: Record<string, string> = {
  length_mm: "Length (mm)",
  width_mm: "Width (mm)",
  height_mm: "Height (mm)",
  wheelbase_mm: "Wheelbase (mm)",
  curb_weight_kg: "Curb weight (kg)",
  engine: "Engine",
  engine_displacement_cc: "Engine displacement (cc)",
  motor_power_kw: "Motor power (kW)",
  battery_capacity_kwh: "Battery capacity (kWh)",
  range_km: "Range (km)",
  fuel_consumption_l100km: "Fuel consumption (L/100 km)",
  transmission: "Transmission",
  drive_type: "Drive type",
  seats: "Seats",
  cargo_l: "Cargo volume (L)",
  max_speed_kmh: "Top speed (km/h)",
  acceleration_0_100_s: "0–100 km/h (s)",
  charging: "Charging",
};

const SPEC_ORDER = [
  "length_mm",
  "width_mm",
  "height_mm",
  "wheelbase_mm",
  "curb_weight_kg",
  "engine",
  "engine_displacement_cc",
  "motor_power_kw",
  "battery_capacity_kwh",
  "range_km",
  "fuel_consumption_l100km",
  "transmission",
  "drive_type",
  "seats",
  "cargo_l",
  "max_speed_kmh",
  "acceleration_0_100_s",
  "charging",
];

export function getBrand(brandId: string): Brand | undefined {
  return brands.find((b) => b.brand_id === brandId);
}

export function getModelsByBrand(brandId: string): Model[] {
  return models.filter((m) => m.brand_id === brandId);
}

export function countTrims(model: Model): number {
  return (model.generations ?? []).reduce((a, g) => a + (g.trims?.length ?? 0), 0);
}

export function countGenerations(model: Model): number {
  return (model.generations ?? []).length;
}

export function formatYears(years?: number[] | null): string {
  if (!years || years.length === 0) return "Not available";
  if (years.length === 1) return String(years[0]);
  return `${years[0]}–${years[years.length - 1]}`;
}

export function modelPowertrains(model: Model): string[] {
  if (model.powertrain_types && model.powertrain_types.length > 0) {
    return [...model.powertrain_types].sort(
      (a, b) => POWERTRAIN_ORDER.indexOf(a) - POWERTRAIN_ORDER.indexOf(b)
    );
  }
  // Fallback: derive from trims.
  const set = new Set<string>();
  for (const g of model.generations ?? []) {
    for (const t of g.trims ?? []) {
      if (t.powertrain) set.add(t.powertrain);
    }
  }
  return Array.from(set).sort(
    (a, b) => POWERTRAIN_ORDER.indexOf(a) - POWERTRAIN_ORDER.indexOf(b)
  );
}

export function hasPowertrain(model: Model, types: string[]): boolean {
  const pws = modelPowertrains(model);
  return pws.some((p) => types.includes(p));
}

// Aggregate models by a single powertrain or body type for the Phase 2 index pages.
export function modelsByPowertrain(powertrain: string): Model[] {
  return models.filter((m) => hasPowertrain(m, [powertrain]));
}

export function modelsByBodyType(bodyType: string): Model[] {
  return models.filter((m) => m.body_type === bodyType);
}

export function specRows(
  specs?: Record<string, string | number | null> | null
): { label: string; value: string | number | null }[] {
  const s = specs ?? {};
  const rows: { label: string; value: string | number | null }[] = [];
  const seen = new Set<string>();
  // Emit the full known schema so omitted fields render as "Not available".
  for (const key of SPEC_ORDER) {
    seen.add(key);
    let value = s[key] ?? null;
    const label = SPEC_LABELS[key] ?? key;
    if (key === "drive_type" && typeof value === "string") {
      value = DRIVE_LABELS[value] ?? value;
    }
    rows.push({ label, value });
  }
  // Include any fields not covered by the known schema.
  for (const key of Object.keys(s)) {
    if (seen.has(key)) continue;
    rows.push({ label: SPEC_LABELS[key] ?? key, value: s[key] ?? null });
  }
  return rows;
}

export function confidenceLow(confidence?: string | null): boolean {
  const c = (confidence ?? "").toLowerCase();
  return c === "low" || c === "";
}

export const VEHICLE_TYPES: Record<
  string,
  { title: string; desc: string; note?: string; filter: (m: Model) => boolean }
> = {
  ev: {
    title: "Electric Vehicles",
    desc: "Battery-electric models in the database, listed by powertrain and body type.",
    filter: (m) => hasPowertrain(m, ["ev"]),
  },
  hybrid: {
    title: "Hybrid Vehicles",
    desc: "Hybrid models (HEV, PHEV and EREV) in the database, listed by powertrain and body type.",
    filter: (m) => hasPowertrain(m, ["hev", "phev", "erev"]),
  },
  suv: {
    title: "SUVs",
    desc: "SUV models in the database, across powertrains.",
    note: "A knowledge-hub listing of SUV models in the database — for how each specification field is defined, see the specification fields reference.",
    filter: (m) => m.body_type === "suv",
  },
  sedan: {
    title: "Sedans",
    desc: "Sedan models in the database, across powertrains.",
    note: "A knowledge-hub listing of sedan models in the database — for how each specification field is defined, see the specification fields reference.",
    filter: (m) => m.body_type === "sedan",
  },
};

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: baseUrl + it.url,
    })),
  };
}
