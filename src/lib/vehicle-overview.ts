// Model-level "Vehicle Overview", "Quick Facts" and "Export Intelligence"
// aggregation for DATA model pages. Pulls identification + key specification
// fields from the existing generation → trim → specs chain plus the structured
// model fields (production_status, china_market_status, export_* fields), and
// renders "Not available" / "Not yet verified" for any field the source data
// does not carry. Never fabricates a value.

import type { Model, Brand, AnalysisNote } from "./helpers";
import {
  BODY_TYPE_LABELS,
  DRIVE_LABELS,
  POWERTRAIN_LABELS,
  VEHICLE_TYPE_LABELS,
  PRODUCTION_STATUS_LABELS,
  modelPowertrains,
} from "./helpers";

export interface OverviewRow {
  label: string;
  value: string;
  available: boolean;
}

function allTrims(model: Model) {
  return (model.generations ?? []).flatMap((g) => g.trims ?? []);
}

// Collect distinct non-empty values for a spec key across all trims.
function distinct(model: Model, key: string): string[] {
  const out: string[] = [];
  for (const t of allTrims(model)) {
    const v = t.specs?.[key];
    if (v === null || v === undefined || v === "") continue;
    const s = String(v);
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

function labelOrNa(values: string[], map?: Record<string, string>, unit = ""): string {
  if (values.length === 0) return "Not available";
  const mapped = map ? values.map((v) => map[v] ?? v) : values;
  return mapped.map((v) => v + unit).join(" / ");
}

// §12 Quick Facts — ten structured rows drawn from structured fields only.
export function quickFacts(model: Model, brand?: Brand): OverviewRow[] {
  const pws = modelPowertrains(model).map((p) => POWERTRAIN_LABELS[p] ?? p);
  const battery = distinct(model, "battery_capacity_kwh");
  const range = distinct(model, "range_km");
  const drive = distinct(model, "drive_type");
  const regions = model.common_export_regions;

  return [
    { label: "Brand", value: brand?.name ?? model.brand_id, available: !!brand },
    {
      label: "Model",
      value: model.name_zh ? `${model.name} (${model.name_zh})` : model.name,
      available: true,
    },
    {
      label: "Vehicle type",
      value: VEHICLE_TYPE_LABELS[model.vehicle_type ?? ""] ?? "Not available",
      available: !!model.vehicle_type,
    },
    {
      label: "Powertrain",
      value: pws.length ? pws.join(" / ") : "Not available",
      available: pws.length > 0,
    },
    {
      label: "Production",
      value: PRODUCTION_STATUS_LABELS[model.production_status ?? ""] ?? "Not available",
      available: !!model.production_status,
    },
    {
      label: "Battery",
      value: battery.length ? battery.join(" / ") + " kWh" : "Not available",
      available: battery.length > 0,
    },
    {
      label: "Range",
      value: range.length ? range.join(" / ") + " km" : "Not available",
      available: range.length > 0,
    },
    {
      label: "Drive",
      value: labelOrNa(drive, DRIVE_LABELS),
      available: drive.length > 0,
    },
    {
      label: "China market status",
      value: model.china_market_status ?? "Not available",
      available: !!model.china_market_status,
    },
    {
      label: "Export relevance",
      value: regions && regions.length ? "Exported" : "Not yet verified",
      available: !!regions && regions.length > 0,
    },
  ];
}

// Build the full Vehicle Overview table (identification + specifications).
export function modelOverview(model: Model, brand?: Brand): OverviewRow[] {
  const pws = modelPowertrains(model).map((p) => POWERTRAIN_LABELS[p] ?? p);
  const drive = distinct(model, "drive_type");
  const engine = distinct(model, "engine");
  const displacement = distinct(model, "engine_displacement_cc");
  const motor = distinct(model, "motor_power_kw");
  const battery = distinct(model, "battery_capacity_kwh");
  const range = distinct(model, "range_km");
  const transmission = distinct(model, "transmission");
  const seats = distinct(model, "seats");
  const length = distinct(model, "length_mm");
  const width = distinct(model, "width_mm");
  const height = distinct(model, "height_mm");
  const wheelbase = distinct(model, "wheelbase_mm");
  const weight = distinct(model, "curb_weight_kg");
  const charging = distinct(model, "charging");
  const fuel = distinct(model, "fuel_consumption_l100km");

  const engineMotor =
    engine.length || motor.length
      ? [engine.map((e) => e + (displacement.length ? ` (${displacement[0]} cc)` : "")).join(" / "),
         motor.length ? motor.join(" / ") + " kW" : null]
          .filter(Boolean)
          .join(" · ")
      : "Not available";

  const rows: OverviewRow[] = [
    { label: "Brand", value: brand?.name ?? model.brand_id, available: !!brand },
    { label: "Model", value: model.name, available: true },
    {
      label: "Vehicle type",
      value: VEHICLE_TYPE_LABELS[model.vehicle_type ?? ""] ?? "Not available",
      available: !!model.vehicle_type,
    },
    { label: "Body style", value: BODY_TYPE_LABELS[model.body_type] ?? model.body_type, available: true },
    {
      label: "Powertrain",
      value: pws.length ? pws.join(" / ") : "Not available",
      available: pws.length > 0,
    },
    {
      label: "Production status",
      value: PRODUCTION_STATUS_LABELS[model.production_status ?? ""] ?? "Not available",
      available: !!model.production_status,
    },
    {
      label: "China market positioning",
      value: model.china_market_status ?? "Not available",
      available: !!model.china_market_status,
    },
    { label: "Drive configuration", value: labelOrNa(drive, DRIVE_LABELS), available: drive.length > 0 },
    { label: "Engine / motor", value: engineMotor, available: engine.length > 0 || motor.length > 0 },
    { label: "Battery", value: battery.length ? battery.join(" / ") + " kWh" : "Not available", available: battery.length > 0 },
    { label: "Range (electric)", value: range.length ? range.join(" / ") + " km" : "Not available", available: range.length > 0 },
    { label: "Transmission", value: labelOrNa(transmission), available: transmission.length > 0 },
    { label: "Fuel consumption", value: labelOrNa(fuel, undefined, " L/100 km"), available: fuel.length > 0 },
    { label: "Seating", value: labelOrNa(seats), available: seats.length > 0 },
    { label: "Length", value: labelOrNa(length, undefined, " mm"), available: length.length > 0 },
    { label: "Width", value: labelOrNa(width, undefined, " mm"), available: width.length > 0 },
    { label: "Height", value: labelOrNa(height, undefined, " mm"), available: height.length > 0 },
    { label: "Wheelbase", value: labelOrNa(wheelbase, undefined, " mm"), available: wheelbase.length > 0 },
    { label: "Curb weight", value: labelOrNa(weight, undefined, " kg"), available: weight.length > 0 },
    { label: "Charging information", value: labelOrNa(charging), available: charging.length > 0 },
  ];

  return rows;
}

export interface AnalysisRow {
  label: string;
  note: AnalysisNote | null;
}

// PHASE 2 deepening — four evidence-backed analysis fields.
// Each is a structured note with its own source/confidence/checked_date,
// or null when no verified information exists (renders "Not yet verified").
export function analysisIntelligence(model: Model): AnalysisRow[] {
  return [
    { label: "Used-market considerations", note: model.used_market_considerations ?? null },
    { label: "Destination-market considerations", note: model.destination_market_considerations ?? null },
    { label: "Parts/service considerations", note: model.parts_service_considerations ?? null },
    { label: "Known limitations", note: model.known_limitations ?? null },
  ];
}

// §9 Export Intelligence — nine structured fields. Null → "Not yet verified".
export function exportIntelligence(model: Model): OverviewRow[] {
  const regions = model.common_export_regions;
  return [
    {
      label: "Export relevance",
      value: model.export_relevance ?? "Not yet verified",
      available: !!model.export_relevance,
    },
    {
      label: "Common export regions",
      value: regions && regions.length ? regions.join(", ") : "Not yet verified",
      available: !!regions && regions.length > 0,
    },
    {
      label: "Powertrain export relevance",
      value: model.powertrain_export_relevance ?? "Not yet verified",
      available: !!model.powertrain_export_relevance,
    },
    {
      label: "Right-hand drive relevance",
      value: model.right_hand_drive_relevance ?? "Not yet verified",
      available: !!model.right_hand_drive_relevance,
    },
    {
      label: "Left-hand drive relevance",
      value: model.left_hand_drive_relevance ?? "Not yet verified",
      available: !!model.left_hand_drive_relevance,
    },
    {
      label: "Market considerations",
      value: model.market_considerations ?? "Not yet verified",
      available: !!model.market_considerations,
    },
    {
      label: "Parts availability",
      value: model.parts_availability_notes ?? "Not yet verified",
      available: !!model.parts_availability_notes,
    },
    {
      label: "Charging standard",
      value: model.charging_standard_notes ?? "Not yet verified",
      available: !!model.charging_standard_notes,
    },
    {
      label: "Homologation",
      value: model.homologation_notes ?? "Not yet verified",
      available: !!model.homologation_notes,
    },
  ];
}
