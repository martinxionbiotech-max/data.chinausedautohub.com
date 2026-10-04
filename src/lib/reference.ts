// Editorial/reference content for the DATA site's Phase 2 informational pages.
// Definitions are written from established automotive engineering knowledge.
// No numbers are fabricated — each entry describes a category, unit or concept.

export interface PowertrainDef {
  title: string;
  definition: string;
}

export const POWERTRAIN_DEFS: Record<string, PowertrainDef> = {
  ev: {
    title: "Battery Electric (BEV)",
    definition:
      "A battery electric vehicle is powered only by a rechargeable battery and one or more electric motors, with no internal combustion engine. It is charged from an external power source and produces no tailpipe emissions.",
  },
  phev: {
    title: "Plug-in Hybrid (PHEV)",
    definition:
      "A plug-in hybrid combines an internal combustion engine with an electric motor and a battery that can be recharged from an external source. It can run on electric power alone for a limited range before the engine takes over.",
  },
  hev: {
    title: "Hybrid (HEV)",
    definition:
      "A hybrid electric vehicle pairs an internal combustion engine with an electric motor and a small battery that is recharged by the engine and regenerative braking. It cannot be plugged in — the battery charges only while driving.",
  },
  ice: {
    title: "Internal Combustion (ICE)",
    definition:
      "An internal-combustion-engine vehicle is powered by a petrol or diesel engine only. It has no electric drive motor for propulsion.",
  },
};

export interface BodyTypeDef {
  title: string;
  definition: string;
}

export const BODY_TYPE_DEFS: Record<string, BodyTypeDef> = {
  suv: {
    title: "SUV",
    definition:
      "A sport utility vehicle combines a raised ride height and a hatch-style body, typically with available all-wheel drive and more cargo space than a sedan.",
  },
  sedan: {
    title: "Sedan",
    definition:
      "A sedan is a three-box passenger car with a separate boot and four doors.",
  },
  mpv: {
    title: "MPV",
    definition:
      "A multi-purpose vehicle (people carrier) prioritises passenger space and flexible seating, often with three rows.",
  },
  hatchback: {
    title: "Hatchback",
    definition:
      "A hatchback is a passenger car with a rear door that opens upward, integrating the cargo area with the cabin.",
  },
  pickup: {
    title: "Pickup",
    definition:
      "A pickup truck has an open cargo bed separate from the cab, built for load carrying and often available with four-wheel drive.",
  },
};

export interface SpecFieldRef {
  key: string;
  label: string;
  unit: string;
  meaning: string;
  buyerNote: string;
}

export const SPEC_FIELD_REFS: SpecFieldRef[] = [
  { key: "length_mm", label: "Length", unit: "mm", meaning: "Overall vehicle length, bumper to bumper.", buyerNote: "Affects parking and manoeuvrability; longer cars usually offer more cabin space." },
  { key: "width_mm", label: "Width", unit: "mm", meaning: "Overall body width.", buyerNote: "Affects cabin shoulder room and lane positioning." },
  { key: "height_mm", label: "Height", unit: "mm", meaning: "Overall roof height.", buyerNote: "Affects headroom and clearance in low garages." },
  { key: "wheelbase_mm", label: "Wheelbase", unit: "mm", meaning: "Distance between the front and rear axles.", buyerNote: "A longer wheelbase usually means more rear legroom and a more stable ride." },
  { key: "curb_weight_kg", label: "Curb weight", unit: "kg", meaning: "Vehicle weight without passengers or cargo.", buyerNote: "Heavier vehicles typically use more energy." },
  { key: "engine", label: "Engine", unit: "—", meaning: "Engine designation, e.g. displacement and aspiration.", buyerNote: "Indicates the combustion engine fitted to the trim." },
  { key: "engine_displacement_cc", label: "Engine displacement", unit: "cc", meaning: "Swept volume of the engine cylinders.", buyerNote: "A rough proxy for engine output and fuel consumption." },
  { key: "motor_power_kw", label: "Motor power", unit: "kW", meaning: "Peak output of the electric drive motor.", buyerNote: "Higher figures mean stronger electric acceleration." },
  { key: "battery_capacity_kwh", label: "Battery capacity", unit: "kWh", meaning: "Usable energy stored in the traction battery.", buyerNote: "Higher capacity generally means longer electric range." },
  { key: "range_km", label: "Range", unit: "km", meaning: "Electric or combined range on a test cycle.", buyerNote: "Real-world range varies with speed, load and temperature." },
  { key: "fuel_consumption_l100km", label: "Fuel consumption", unit: "L/100 km", meaning: "Fuel used per 100 km.", buyerNote: "Lower is more economical to run." },
  { key: "transmission", label: "Transmission", unit: "—", meaning: "Gearbox type, e.g. E-CVT, DCT, AT or CVT.", buyerNote: "Affects smoothness, efficiency and driving feel." },
  { key: "drive_type", label: "Drive type", unit: "—", meaning: "Which wheels are powered: FWD, RWD or AWD.", buyerNote: "AWD aids traction; FWD is common and efficient." },
  { key: "seats", label: "Seats", unit: "—", meaning: "Seating capacity.", buyerNote: "Confirms how many passengers the vehicle carries." },
  { key: "cargo_l", label: "Cargo volume", unit: "L", meaning: "Boot volume.", buyerNote: "Higher volume suits family or hauling use." },
  { key: "max_speed_kmh", label: "Top speed", unit: "km/h", meaning: "Maximum rated speed.", buyerNote: "A reference figure, not a target for legal driving." },
  { key: "acceleration_0_100_s", label: "0–100 km/h", unit: "s", meaning: "Time to accelerate from 0 to 100 km/h.", buyerNote: "Lower figures mean quicker acceleration." },
  { key: "charging", label: "Charging", unit: "—", meaning: "Charging capability, e.g. DC fast charging.", buyerNote: "Affects how quickly the battery can be recharged." },
];

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  related: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { id: "e-cvt", term: "E-CVT", definition: "An electronically controlled continuously variable transmission used in hybrids; it blends engine and motor power without fixed gear steps.", related: "/vehicle-specifications/" },
  { id: "dct", term: "DCT", definition: "Dual-clutch transmission: two clutches pre-select gears for fast, near-seamless shifts.", related: "/vehicle-specifications/" },
  { id: "at", term: "AT", definition: "Automatic transmission using a torque converter; smooth and widely used.", related: "/vehicle-specifications/" },
  { id: "cvt", term: "CVT", definition: "Continuously variable transmission; stepless ratios via a belt-and-pulley system for smooth, efficient running.", related: "/vehicle-specifications/" },
  { id: "dsg", term: "DSG", definition: "Volkswagen's brand name for a dual-clutch transmission (a type of DCT).", related: "/vehicle-specifications/" },
  { id: "rwd", term: "RWD", definition: "Rear-wheel drive: engine power is delivered to the rear wheels.", related: "/vehicle-specifications/" },
  { id: "fwd", term: "FWD", definition: "Front-wheel drive: engine power is delivered to the front wheels.", related: "/vehicle-specifications/" },
  { id: "awd", term: "AWD", definition: "All-wheel drive: power is distributed to all four wheels, improving traction.", related: "/vehicle-specifications/" },
  { id: "kwh", term: "kWh", definition: "Kilowatt-hour: the unit of battery energy capacity. Higher kWh generally means more electric range.", related: "/vehicle-specifications/" },
  { id: "cltc", term: "CLTC", definition: "China Light-duty vehicle Test Cycle: the Chinese driving-cycle standard used for range and efficiency figures.", related: "/vehicle-specifications/" },
  { id: "nedc", term: "NEDC", definition: "New European Driving Cycle: an older European test standard, often more optimistic than real-world figures.", related: "/vehicle-specifications/" },
  { id: "erev", term: "EREV", definition: "Extended-range electric vehicle: driven by an electric motor, with a small combustion engine acting only as a generator to recharge the battery.", related: "/powertrains/" },
  { id: "bev", term: "BEV", definition: "Battery electric vehicle: pure electric, no combustion engine.", related: "/powertrains/" },
  { id: "phev", term: "PHEV", definition: "Plug-in hybrid electric vehicle: an engine plus an externally rechargeable battery.", related: "/powertrains/" },
  { id: "hev", term: "HEV", definition: "Hybrid electric vehicle: an engine plus a self-charging battery, not plug-in.", related: "/powertrains/" },
  { id: "ice", term: "ICE", definition: "Internal combustion engine: petrol or diesel powered.", related: "/powertrains/" },
  { id: "dmi", term: "DM-i", definition: "BYD's plug-in hybrid system, a series-parallel architecture with a dedicated hybrid engine.", related: "/powertrains/" },
  { id: "lhd", term: "LHD", definition: "Left-hand drive: steering wheel on the left, standard in most export markets.", related: "/vehicle-specifications/" },
  { id: "rhd", term: "RHD", definition: "Right-hand drive: steering wheel on the right, required in markets such as Kenya, Tanzania and Nigeria.", related: "/vehicle-specifications/" },
  { id: "trim", term: "Trim", definition: "A specific equipment and configuration level of a model, with its own powertrain and specifications.", related: "/models/" },
];
