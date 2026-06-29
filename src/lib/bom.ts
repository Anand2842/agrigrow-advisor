import type { StateCode, Tier } from "./wizard-store";

export interface MaterialRow {
  material_id: string;
  material_name: string;
  category_id: string | null;
  material_categories?: { category_name: string | null } | null;
  unit_of_measurement: string | null;
  wastage_factor: number | null;
  quantity_formula: string | null;
  tier_a_price_up: number | null;
  tier_a_price_mp: number | null;
  tier_a_price_mh: number | null;
  tier_b_price_up: number | null;
  tier_b_price_mp: number | null;
  tier_b_price_mh: number | null;
  tier_c_price_up: number | null;
  tier_c_price_mp: number | null;
  tier_c_price_mh: number | null;
  tier_a_spec: string | null;
  tier_b_spec: string | null;
  tier_c_spec: string | null;
  standard_is_code: string | null;
}

export interface DistrictClimateLite {
  agro_climatic_zone: string | null;
  fog_days_jan?: number | null;
  fog_days_dec?: number | null;
  coastal_corrosion_factor?: number | null;
  cyclone_risk?: string | null;
}

export interface BOMLine {
  material_id: string;
  material_name: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  spec: string;
  warnings: string[];
  is_code: string | null;
}

export interface BOMResult {
  lines: BOMLine[];
  totalCost: number;
  byCategory: { category: string; total: number }[];
  warnings: string[];
}

function priceFor(m: MaterialRow, tier: Tier, state: StateCode): number {
  const key = `tier_${tier.toLowerCase()}_price_${state.toLowerCase()}` as keyof MaterialRow;
  const v = m[key] as number | null;
  return v ?? 0;
}

function specFor(m: MaterialRow, tier: Tier): string {
  return (
    (tier === "A" ? m.tier_a_spec : tier === "B" ? m.tier_b_spec : m.tier_c_spec) ?? ""
  );
}

function quantityFor(formula: string | null, areaSqm: number): number {
  const f = (formula ?? "").toLowerCase();
  if (f.includes("perimeter")) return Math.sqrt(areaSqm) * 4;
  if (f.includes("column")) return areaSqm / 25;
  if (f.includes("bay")) return areaSqm / 32;
  // default: scales with area
  return areaSqm;
}

export function calculateBOM(
  materials: MaterialRow[],
  areaSqm: number,
  state: StateCode,
  tier: Tier,
  climate?: DistrictClimateLite | null,
): BOMResult {
  const lines: BOMLine[] = [];
  const globalWarnings = new Set<string>();
  const corrosion = climate?.coastal_corrosion_factor ?? 1;
  const fogJan = climate?.fog_days_jan ?? 0;
  const fogDec = climate?.fog_days_dec ?? 0;
  const isMarathwada = (climate?.agro_climatic_zone ?? "")
    .toLowerCase()
    .includes("marathwada");

  for (const m of materials) {
    const baseQty = quantityFor(m.quantity_formula, areaSqm);
    let qty = baseQty * (m.wastage_factor ?? 1);
    let price = priceFor(m, tier, state);
    const warnings: string[] = [];
    const category = m.material_categories?.category_name ?? "Uncategorized";
    const lcName = m.material_name.toLowerCase();
    const lcCat = category.toLowerCase();

    if (corrosion > 1.5 && (lcCat.includes("pipe") || lcName.includes("pipe"))) {
      price = price * 1.3;
      const w = "HDG upgrade recommended for coastal area";
      warnings.push(w);
      globalWarnings.add(w);
    } else if (corrosion > 1.2 && (lcCat.includes("pipe") || lcName.includes("pipe"))) {
      const w = "Check pipe corrosion resistance for coastal climate";
      warnings.push(w);
      globalWarnings.add(w);
    }

    if ((fogJan > 10 || fogDec > 10) && lcName.includes("film")) {
      qty = qty * 1.15;
      const w = "Anti-drip film mandatory in fog zone";
      warnings.push(w);
      globalWarnings.add(w);
    }

    if (isMarathwada && lcName.includes("pad")) {
      const w = "Water scarcity zone: Fan & Pad needs 1,200–1,800 L/day";
      warnings.push(w);
      globalWarnings.add(w);
    }

    const total = qty * price;
    lines.push({
      material_id: m.material_id,
      material_name: m.material_name,
      category,
      quantity: Math.round(qty * 100) / 100,
      unit: m.unit_of_measurement ?? "",
      unit_price: Math.round(price * 100) / 100,
      total: Math.round(total),
      spec: specFor(m, tier),
      warnings,
      is_code: m.standard_is_code,
    });
  }

  const totalCost = lines.reduce((s, l) => s + l.total, 0);
  const catMap = new Map<string, number>();
  for (const l of lines) catMap.set(l.category, (catMap.get(l.category) ?? 0) + l.total);
  const byCategory = Array.from(catMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return { lines, totalCost, byCategory, warnings: Array.from(globalWarnings) };
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
