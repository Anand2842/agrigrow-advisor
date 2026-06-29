import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StateCode } from "./wizard-store";

const STATE_NAMES: Record<StateCode, string> = {
  UP: "Uttar Pradesh",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
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
        .eq("state", STATE_NAMES[state!])
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
      const [{ data: matches, error: e1 }, { data: structures, error: e2 }] = await Promise.all([
        supabase
          .from("crop_structure_match")
          .select("crop_id, structure_id, suitability_score, notes")
          .in("crop_id", cropIds),
        supabase.from("structure_data").select("*"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      const byId = new Map((structures ?? []).map((s) => [s.structure_id, s]));
      const agg = new Map<string, { scores: number[]; notes: string[] }>();
      for (const row of matches ?? []) {
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
      const { data, error } = await supabase
        .from("materials")
        .select("*, material_categories(category_name)")
        .eq("item_type", "essential");
      if (error) throw error;
      return (data ?? []).filter((m: { needed_for_structures: string | null }) => {
        const n = m.needed_for_structures ?? "";
        return n === "ALL" || n.includes(structureId!);
      });
    },
  });

export const subsidiesByStateQuery = (state: StateCode | null) =>
  queryOptions({
    queryKey: ["subsidies", state],
    enabled: !!state,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subsidy_schemes")
        .select("*")
        .ilike("applicable_states", `%${state}%`);
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
