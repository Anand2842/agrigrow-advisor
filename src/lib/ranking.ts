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

function isGrowingSeason(seasonStr: string | null | undefined): boolean {
  if (!seasonStr) return false;
  const s = seasonStr.toLowerCase();
  const now = monthNow();
  // Check if current month falls in the season
  if (s.includes("rabi") && (now >= 10 && now <= 3)) return true;
  if (s.includes("kharif") && (now >= 6 && now <= 10)) return true;
  if (s.includes("year") || s.includes("all") || s.includes("round")) return true;
  if (s.includes("winter") && (now >= 11 || now <= 2)) return true;
  if (s.includes("summer") && (now >= 3 && now <= 5)) return true;
  if (s.includes("monsoon") && (now >= 6 && now <= 9)) return true;
  return false;
}

function cropClimateScore(
  crop: CropRow,
  climate: ClimateData,
  elevation: number | null,
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

  if (crop.temp_day_optimal_min != null && crop.temp_day_optimal_max != null && avgMax != null) {
    const optMid = (crop.temp_day_optimal_min + crop.temp_day_optimal_max) / 2;
    const diff = Math.abs(avgMax - optMid);
    // Score higher when district avg is closer to crop optimal
    if (diff <= 3) score += 30;
    else if (diff <= 6) score += 20;
    else if (diff <= 10) score += 10;
    else score -= 10;
  }

  // Elevation penalty for crops that don't like altitude
  if (elevation != null && elevation > 2000) {
    if (crop.crop_id === "C011" || crop.crop_id === "C009") score -= 30;
    else if (elevation > 1500) score -= 5;
  }

  // Bonus if currently in growing season
  const seasonKey = `planting_season_up` as string;
  const seasonStr = (crop as Record<string, unknown>)[seasonKey] as string | null;
  if (isGrowingSeason(seasonStr)) score += 10;

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
): RankedCrop[] {
  if (!climate) {
    // No climate data — return all crops with neutral score
    return crops.map((c) => ({ crop: c, score: 50 }));
  }

  return crops
    .map((c) => ({
      crop: c,
      score: cropClimateScore(c, climate, elevation),
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
