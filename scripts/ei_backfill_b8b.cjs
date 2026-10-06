// Batch 8b EI backfill — RHD-capable Maxus/JAC models (supplement to unlock relation increments)
// Data repo: shared/data/models.json. Fills only evidence-backed fields; no guessing.
const fs = require("fs");

const updates = {
  // ---- Maxus (SAIC LDV) ----
  "maxus-mifa-9": {
    export_relevance: "Maxus MIFA 9 (LDV Mifa 9) battery-electric MPV, sold in right-hand drive in the UK, Australia, New Zealand, Malaysia and Singapore.",
    common_export_regions: ["United Kingdom", "Australia", "New Zealand", "Malaysia", "Singapore"],
    powertrain_export_relevance: "EV/PHEV powertrains may qualify for import-duty relief in some markets — confirm per destination.",
    right_hand_drive_relevance: "Right-hand-drive production available — Maxus MIFA 9 sold in RHD form in the UK (SAIC Maxus UK), Australia/NZ (LDV), Malaysia and Singapore.",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from Maxus/LDV regional export production.",
    market_considerations: "Full-size battery-electric MPV; strong RHD distribution in UK, Australia, NZ and Southeast Asia.",
    parts_availability_notes: null,
    charging_standard_notes: "China-market charging standard (GB/T) — confirm destination charging-connector and voltage compatibility; regional units may carry other inlets.",
    homologation_notes: null,
    source_name: "Maxus/LDV MIFA 9 RHD market listings (manufacturer: saicmaxus.co.uk, ldvautomotive.com.au)",
    source_url: "https://www.ldvautomotive.com.au/",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-06"
  },
  "maxus-d90": {
    export_relevance: "Maxus D90 (LDV D90) combustion 7-seat SUV, sold in right-hand drive in Australia and New Zealand.",
    common_export_regions: ["Australia", "New Zealand"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Right-hand-drive production available — LDV D90 sold in RHD form in Australia and New Zealand (LDV Australia).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from LDV regional export production.",
    market_considerations: "7-seat body-on-frame ICE SUV; RHD distribution in Australia and New Zealand.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "LDV D90 RHD Australia/NZ listings (manufacturer: ldvautomotive.com.au)",
    source_url: "https://www.ldvautomotive.com.au/vehicles/ldv-my25-d90-suv/",
    source_type: "manufacturer",
    confidence: "medium",
    checked_date: "2026-10-06"
  },

  // ---- JAC ----
  "jac-t9": {
    export_relevance: "JAC T9 combustion dual-cab pickup (ute), sold in right-hand drive in Australia (JAC Motors Australia) and other RHD export markets.",
    common_export_regions: ["Australia"],
    powertrain_export_relevance: "Combustion (ICE) powertrain — subject to standard import duty; no EV-specific relief.",
    right_hand_drive_relevance: "Right-hand-drive production available — JAC T9 sold in RHD form in Australia (JAC Motors Australia).",
    left_hand_drive_relevance: "Standard — China domestic-market production is left-hand drive; RHD units sourced from JAC regional export production.",
    market_considerations: "Dual-cab ICE pickup (2.0CTI diesel); RHD distribution in Australia.",
    parts_availability_notes: null,
    charging_standard_notes: null,
    homologation_notes: null,
    source_name: "JAC T9 RHD Australia listings (manufacturer: jacute.com.au)",
    source_url: "https://jacute.com.au/models/jac-t9/",
    source_type: "manufacturer",
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
  m.last_verified = "2026-10-06";
  applied++;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("applied EI backfill to", applied, "models");
console.log("keys:", Object.keys(updates).length);
