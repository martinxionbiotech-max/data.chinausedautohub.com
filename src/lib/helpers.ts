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
  source?: string | null;
  source_url?: string | null;
  source_date?: string | null;
  confidence?: string;
}

export interface Trim {
  trim_id: string;
  name: string;
  powertrain: string;
  production_years?: number[];
  specs?: Record<string, string | number | null>;
  spec_source?: string | null;
  spec_source_url?: string | null;
  spec_source_date?: string | null;
  confidence?: string;
}

export interface Generation {
  generation_id: string;
  name: string;
  production_years?: number[];
  trims?: Trim[];
}

export interface Model {
  model_id: string;
  brand_id: string;
  name: string;
  name_zh: string;
  body_type: string;
  status: string;
  generations?: Generation[];
  source?: string | null;
  source_url?: string | null;
  source_date?: string | null;
  confidence?: string;
}

export const brands = brandsData.brands as Brand[];
export const models = modelsData.models as Model[];

export const POWERTRAIN_LABELS: Record<string, string> = {
  ev: "EV",
  phev: "PHEV",
  hev: "HEV",
  ice: "ICE",
};

// Phase 2 five-level confidence semantics, mapped at the DATA page layer from the
// four-level data field (high/medium/low/unknown). The shared SourceNote component
// is left unchanged; this mapping is only for DATA-site display.
export const CONFIDENCE_LEVELS: Record<string, string> = {
  high: "Verified",
  medium: "Reported",
  low: "Estimated",
  unknown: "Unknown",
};

export function confidenceLevel(
  confidence?: string | null,
  sourceUrl?: string | null
): string {
  const c = (confidence ?? "").toLowerCase();
  if (c === "high") {
    return sourceUrl ? "Source-backed" : "Verified";
  }
  return CONFIDENCE_LEVELS[c] ?? "Unknown";
}

export const BODY_TYPE_LABELS: Record<string, string> = {
  suv: "SUV",
  sedan: "Sedan",
  mpv: "MPV",
  hatchback: "Hatchback",
  pickup: "Pickup",
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
  const set = new Set<string>();
  for (const g of model.generations ?? []) {
    for (const t of g.trims ?? []) {
      if (t.powertrain) set.add(t.powertrain);
    }
  }
  return Array.from(set);
}

export function hasPowertrain(model: Model, types: string[]): boolean {
  for (const g of model.generations ?? []) {
    for (const t of g.trims ?? []) {
      if (types.includes(t.powertrain)) return true;
    }
  }
  return false;
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
  return c === "low" || c === "unknown" || c === "";
}

export const VEHICLE_TYPES: Record<
  string,
  { title: string; desc: string; filter: (m: Model) => boolean }
> = {
  ev: {
    title: "Electric Vehicles",
    desc: "Battery-electric models in the database, listed by powertrain and body type.",
    filter: (m) => hasPowertrain(m, ["ev"]),
  },
  hybrid: {
    title: "Hybrid Vehicles",
    desc: "Hybrid models (HEV and PHEV) in the database, listed by powertrain and body type.",
    filter: (m) => hasPowertrain(m, ["hev", "phev"]),
  },
  suv: {
    title: "SUVs",
    desc: "SUV models in the database, across powertrains.",
    filter: (m) => m.body_type === "suv",
  },
  sedan: {
    title: "Sedans",
    desc: "Sedan models in the database, across powertrains.",
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
