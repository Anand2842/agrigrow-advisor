import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StateCode } from "./wizard-store";

const STATE_NAMES: Record<StateCode, string> = {
  UP: "Uttar Pradesh",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  UK: "Uttarakhand",
  HP: "Himachal Pradesh",
};

export function stateFullName(code: StateCode) {
  return STATE_NAMES[code];
}

export const districtsByStateQuery = (state: StateCode | null) =>
  queryOptions({
    queryKey: ["districts", state],
    enabled: !!state,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("district_climate")
        .select("district_id, district_name, agro_climatic_zone, division_name")
        .eq("state", state!)
        .order("district_name");
      if (error) throw error;
      return data ?? [];
    },
  });

export const districtClimateQuery = (districtId: string | null) =>
  queryOptions({
    queryKey: ["district-climate", districtId],
    enabled: !!districtId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("district_climate")
        .select("*")
        .eq("district_id", districtId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const cropsAllQuery = () =>
  queryOptions({
    queryKey: ["crops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crop_data")
        .select(
          "crop_id, crop_name_common, crop_name_botanical, crop_category, crop_sub_category, temp_day_optimal_min, temp_day_optimal_max, planting_season_up, planting_season_mp, planting_season_mh, msp_or_market_rate_up, msp_or_market_rate_mp, msp_or_market_rate_mh, yield_protected_avg, total_crop_duration",
        )
        .order("crop_name_common");
      if (error) throw error;
      return data ?? [];
    },
  });

export const structuresForCropsQuery = (cropIds: string[]) =>
  queryOptions({
    queryKey: ["structures", cropIds.slice().sort()],
    enabled: cropIds.length > 0,
    queryFn: async () => {
      // The crop_structure_match table has inconsistent IDs:
      // some rows use C001-C011, others use short codes (BG, CP, CA, etc.)
      // Fetch all matches and normalize client-side
      const [{ data: allMatches, error: e1 }, { data: structures, error: e2 }, { data: crops, error: e3 }] =
        await Promise.all([
          supabase
            .from("crop_structure_match")
            .select("crop_id, structure_id, suitability_score, notes"),
          supabase.from("structure_data").select("*"),
          supabase.from("crop_data").select("crop_id, crop_name_common"),
        ]);
      if (e1) throw e1;
      if (e2) throw e2;

      // Build reverse mapping: short_code -> C-prefix ID
      // From crop_data we know C004=Bitter Gourd, and from crop_structure_match we see BG=Bitter Gourd
      // We infer the mapping from shared short codes
      const cropIdToName = new Map<string, string>();
      for (const c of crops ?? []) {
        if (c.crop_id && c.crop_name_common) cropIdToName.set(c.crop_id, c.crop_name_common);
      }

      // Known short code mappings (from crop_structure_match data)
      const SHORT_CODE_MAP: Record<string, string> = {
        BG: "C004", CP: "C002", CA: "C010", CU: "C003",
        GB: "C009", GL: "C007", MG: "C006", RO: "C008",
        SB: "C011", TM: "C001", CH: "C005",
      };

      // Normalize a crop_id from crop_structure_match to a C-prefix ID
      function normalizeMatchCropId(raw: string): string | null {
        if (raw.startsWith("C") && cropIdToName.has(raw)) return raw;
        const mapped = SHORT_CODE_MAP[raw];
        if (mapped && cropIdToName.has(mapped)) return mapped;
        return null;
      }

      // Build a set of normalized crop IDs the user selected
      const selectedNormalized = new Set(cropIds);

      // Filter matches to only rows that correspond to selected crops
      const matches = (allMatches ?? []).filter((row) => {
        if (!row.crop_id) return false;
        const normalized = normalizeMatchCropId(row.crop_id);
        return normalized !== null && selectedNormalized.has(normalized);
      });

      const byId = new Map((structures ?? []).map((s) => [s.structure_id, s]));
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
    },
  });

export const allStructuresQuery = () =>
  queryOptions({
    queryKey: ["structures-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("structure_data").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

export const materialsForStructureQuery = (structureId: string | null) =>
  queryOptions({
    queryKey: ["materials", structureId],
    enabled: !!structureId,
    queryFn: async () => {
      const [{ data: materials, error: materialsError }, { data: categories, error: categoriesError }] =
        await Promise.all([
          supabase.from("materials").select("*").eq("item_type", "essential"),
          supabase.from("material_categories").select("category_id, category_name"),
        ]);

      if (materialsError) throw materialsError;
      if (categoriesError) throw categoriesError;

      const categoriesById = new Map(
        (categories ?? []).map((c) => [c.category_id, { category_name: c.category_name }]),
      );

      return (materials ?? []).filter((m: { needed_for_structures: string | null }) => {
        const n = m.needed_for_structures ?? "";
        return n === "ALL" || n.includes(structureId!);
      }).map((m) => ({
        ...m,
        material_categories: m.category_id ? (categoriesById.get(m.category_id) ?? null) : null,
      }));
    },
  });

export const subsidiesByStateQuery = (state: StateCode | null) =>
  queryOptions({
    queryKey: ["subsidies", state],
    enabled: !!state,
    queryFn: async () => {
      const fullName = STATE_NAMES[state!];
      // Match either full state name (e.g. "Uttar Pradesh"), the short code,
      // or pan-India schemes ("All India").
      const { data, error } = await supabase
        .from("subsidy_schemes")
        .select("*")
        .or(
          `applicable_states.ilike.%${fullName}%,applicable_states.ilike.%${state}%,applicable_states.ilike.%All India%`,
        );
      if (error) throw error;
      return data ?? [];
    },
  });

export const monthlyPricesQuery = (cropId: string | null, state: StateCode | null) =>
  queryOptions({
    queryKey: ["prices", cropId, state],
    enabled: !!cropId && !!state,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_market_prices")
        .select("month, avg_price_per_quintal, min_price_per_quintal, max_price_per_quintal")
        .eq("crop_id", cropId!)
        .eq("state", state!)
        .order("month");
      if (error) throw error;
      return data ?? [];
    },
  });
