// Model-level "Vehicle Overview" aggregation for DATA model pages.
// Pulls identification + key specification fields from the existing
// generation → trim → specs chain, and renders "Not available" for any field
// the source data does not carry. Never fabricates a value.

import type { Model, Trim } from "./helpers";
import { BODY_TYPE_LABELS, DRIVE_LABELS, POWERTRAIN_LABELS, modelPowertrains } from "./helpers";

export interface OverviewRow {
  label: string;
  value: string;
  available: boolean;
}

function allTrims(model: Model): Trim[] {
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

// Build the overview table rows for a model. Only existing data is shown;
// absent fields are "Not available".
export function modelOverview(model: Model): OverviewRow[] {
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

  const engineMotor =
    engine.length || motor.length
      ? [engine.map((e) => e + (displacement.length ? ` (${displacement[0]} cc)` : "")).join(" / "),
         motor.length ? motor.join(" / ") + " kW" : null]
          .filter(Boolean)
          .join(" · ")
      : "Not available";

  const rows: OverviewRow[] = [
    { label: "Body type", value: labelOrNa([model.body_type], BODY_TYPE_LABELS), available: true },
    { label: "Powertrain", value: pws.length ? pws.join(" / ") : "Not available", available: pws.length > 0 },
    { label: "Drive configuration", value: labelOrNa(drive, DRIVE_LABELS), available: drive.length > 0 },
    { label: "Engine / motor", value: engineMotor, available: engine.length > 0 || motor.length > 0 },
    { label: "Battery", value: battery.length ? battery.join(" / ") + " kWh" : "Not available", available: battery.length > 0 },
    { label: "Range (electric)", value: range.length ? range.join(" / ") + " km" : "Not available", available: range.length > 0 },
    { label: "Transmission", value: labelOrNa(transmission), available: transmission.length > 0 },
    { label: "Seating", value: labelOrNa(seats), available: seats.length > 0 },
    { label: "Length", value: labelOrNa(length, undefined, " mm"), available: length.length > 0 },
    { label: "Width", value: labelOrNa(width, undefined, " mm"), available: width.length > 0 },
    { label: "Height", value: labelOrNa(height, undefined, " mm"), available: height.length > 0 },
    { label: "Wheelbase", value: labelOrNa(wheelbase, undefined, " mm"), available: wheelbase.length > 0 },
    { label: "Curb weight", value: labelOrNa(weight, undefined, " kg"), available: weight.length > 0 },
    { label: "Charging information", value: labelOrNa(charging), available: charging.length > 0 },
    { label: "Key equipment", value: "Not available", available: false },
  ];

  return rows;
}
