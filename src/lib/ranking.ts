import type { StateCode } from "./wizard-store";

interface CropRow {
  crop_id: string;
  crop_name_common: string;
  temp_day_optimal_min: number | null;
  temp_day_optimal_max: number | null;
  planting_season_up?: string | null;
  planting_season_mp?: string | null;
  planting_season_mh?: string | null;
  total_crop_duration?: number | null;
  [key: string]: unknown;
}

interface StructureRow {
  structure_id: string;
  structure_name: string;
  structure_category: string | null;
  [key: string]: unknown;
}

interface ClimateData {
  temp_max_avg_jan?: number | null;
  temp_max_avg_apr?: number | null;
  temp_max_avg_jul?: number | null;
  temp_max_avg_oct?: number | null;
  temp_min_avg_jan?: number | null;
  temp_min_avg_apr?: number | null;
  temp_min_avg_jul?: number | null;
  temp_min_avg_oct?: number | null;
  annual_rainfall_avg?: number | null;
  fog_days_jan?: number | null;
  fog_days_dec?: number | null;
}

function avgNum(...vals: (number | null | undefined)[]): number | null {
  const nums = vals.filter((v): v is number => typeof v === "number" && !isNaN(v));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function monthNow(): number {
  return new Date().getMonth() + 1;
}

function getSeasonForState(crop: CropRow, state: StateCode | null): string | null {
  if (!state) return (crop as Record<string, unknown>)["planting_season_up"] as string | null;
  const key = `planting_season_${state.toLowerCase()}` as string;
  return (crop as Record<string, unknown>)[key] as string | null
    ?? (crop as Record<string, unknown>)["planting_season_up"] as string | null;
}

function isGrowingSeason(seasonStr: string | null | undefined): boolean {
  if (!seasonStr) return false;
  const s = seasonStr.toLowerCase();
  const now = monthNow();
  if (s.includes("rabi") && (now >= 10 || now <= 3)) return true;
  if (s.includes("kharif") && (now >= 6 && now <= 10)) return true;
  if (s.includes("year") || s.includes("all") || s.includes("round")) return true;
  if (s.includes("winter") && (now >= 11 || now <= 2)) return true;
  if (s.includes("summer") && (now >= 3 && now <= 5)) return true;
  if (s.includes("monsoon") && (now >= 6 && now <= 9)) return true;
  // Check month names
  if (s.includes("jan") && now === 1) return true;
  if (s.includes("feb") && now === 2) return true;
  if (s.includes("mar") && now === 3) return true;
  if (s.includes("apr") && now === 4) return true;
  if (s.includes("may") && now === 5) return true;
  if (s.includes("jun") && now === 6) return true;
  if (s.includes("jul") && now === 7) return true;
  if (s.includes("aug") && now === 8) return true;
  if (s.includes("sep") && now === 9) return true;
  if (s.includes("oct") && now === 10) return true;
  if (s.includes("nov") && now === 11) return true;
  if (s.includes("dec") && now === 12) return true;
  return false;
}

function cropClimateScore(
  crop: CropRow,
  climate: ClimateData,
  elevation: number | null,
  state: StateCode | null,
): number {
  let score = 50; // baseline

  const avgMax = avgNum(
    climate.temp_max_avg_jan,
    climate.temp_max_avg_apr,
    climate.temp_max_avg_jul,
    climate.temp_max_avg_oct,
  );
  const avgMin = avgNum(
    climate.temp_min_avg_jan,
    climate.temp_min_avg_apr,
    climate.temp_min_avg_jul,
    climate.temp_min_avg_oct,
  );

  // Temperature fit scoring
  if (crop.temp_day_optimal_min != null && crop.temp_day_optimal_max != null) {
    const optMin = crop.temp_day_optimal_min;
    const optMax = crop.temp_day_optimal_max;
    const optMid = (optMin + optMax) / 2;
    const optRange = optMax - optMin;

    if (avgMax != null) {
      // How well does district max temp fit crop's optimal range?
      if (avgMax >= optMin && avgMax <= optMax) {
        score += 25; // Perfect fit
      } else {
        const diff = Math.abs(avgMax - optMid);
        const penaltyFactor = optRange > 0 ? optRange : 8;
        if (diff <= penaltyFactor) score += 15;
        else if (diff <= penaltyFactor * 2) score += 5;
        else score -= 15;
      }
    }

    // Min temp check — crop needs frost-free conditions
    if (avgMin != null) {
      if (avgMin >= 5) score += 5; // Good — frost-free
      else if (avgMin >= 0) score += 0; // OK — occasional frost
      else score -= 10; // Bad — frost risk
    }
  }

  // Elevation penalties
  if (elevation != null) {
    if (elevation > 2000) {
      if (crop.crop_id === "C011" || crop.crop_id === "C009") score -= 30;
      else score -= 10;
    } else if (elevation > 1500) {
      score -= 5;
    }
  }

  // Growing season bonus
  const seasonStr = getSeasonForState(crop, state);
  if (isGrowingSeason(seasonStr)) score += 15;

  // Market price bonus (if available)
  const priceKey = `msp_or_market_rate_${(state ?? "up").toLowerCase()}` as string;
  const price = (crop as Record<string, unknown>)[priceKey] as number | null;
  if (price != null && price > 2000) score += 5; // Higher value crops get a small boost

  return Math.max(0, Math.min(100, score));
}

export interface RankedCrop {
  crop: CropRow;
  score: number;
}

export function rankCrops(
  crops: CropRow[],
  climate: ClimateData | null,
  elevation: number | null,
  state: StateCode | null = null,
): RankedCrop[] {
  if (!climate) {
    return crops.map((c) => ({ crop: c, score: 50 }));
  }

  return crops
    .map((c) => ({
      crop: c,
      score: cropClimateScore(c, climate, elevation, state),
    }))
    .sort((a, b) => b.score - a.score);
}

export interface RankedStructure {
  structure: StructureRow;
  avgScore: number;
  notes: string[];
}

export function rankStructures(
  structures: StructureRow[],
  matches: { structure_id: string; suitability_score: number | null; notes: string | null }[],
): RankedStructure[] {
  const byId = new Map(structures.map((s) => [s.structure_id, s]));
  const agg = new Map<string, { scores: number[]; notes: string[] }>();

  for (const row of matches) {
    if (!row.structure_id) continue;
    if (!agg.has(row.structure_id)) agg.set(row.structure_id, { scores: [], notes: [] });
    const e = agg.get(row.structure_id)!;
    if (row.suitability_score != null) e.scores.push(row.suitability_score);
    if (row.notes) e.notes.push(row.notes);
  }

  return Array.from(agg.entries())
    .map(([sid, e]) => {
      const s = byId.get(sid);
      if (!s) return null;
      return {
        structure: s,
        avgScore: e.scores.length
          ? Math.round(e.scores.reduce((a, b) => a + b, 0) / e.scores.length)
          : 0,
        notes: e.notes,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.avgScore - a.avgScore);
}
