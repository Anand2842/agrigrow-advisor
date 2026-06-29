import type { FarmerCategory, StateCode } from "./wizard-store";

export interface SubsidyScheme {
  scheme_id: string;
  scheme_name: string;
  scheme_type: string | null;
  implementing_agency: string | null;
  applicable_states: string | null;
  min_land_holding: number | null;
  max_land_holding: number | null;
  min_area_sqm: number | null;
  max_area_sqm: number | null;
  first_time_only: string | null;
  structures_eligible: string | null;
  subsidy_percent_general: number | null;
  subsidy_percent_sc_st: number | null;
  subsidy_percent_women: number | null;
  subsidy_ceiling_per_unit: number | null;
  subsidy_ceiling_total: number | null;
  subsidy_release_mode: string | null;
  own_contribution_min: number | null;
  valid_until: string | null;
  documentation_required: string | null;
  source_url: string | null;
}

export interface SubsidyResult {
  scheme: SubsidyScheme;
  eligible: boolean;
  reasons: string[];
  percent: number;
  estimatedAmount: number;
  ceiling: number;
}

export function evaluateSubsidies(
  schemes: SubsidyScheme[],
  opts: {
    state: StateCode;
    structureId: string | null;
    areaSqm: number;
    farmerCategory: FarmerCategory;
    landHolding: number;
    isFirstTime: boolean;
    estimatedProjectCost: number;
  },
): SubsidyResult[] {
  return schemes.map((s) => {
    const reasons: string[] = [];
    let eligible = true;

    if (s.min_land_holding != null && opts.landHolding < s.min_land_holding) {
      eligible = false;
      reasons.push(`Minimum land holding ${s.min_land_holding} acres not met`);
    }
    if (s.max_land_holding != null && opts.landHolding > s.max_land_holding) {
      eligible = false;
      reasons.push(`Above max land holding of ${s.max_land_holding} acres`);
    }
    if (s.min_area_sqm != null && opts.areaSqm < s.min_area_sqm) {
      eligible = false;
      reasons.push(`Minimum project area ${s.min_area_sqm} sqm not met`);
    }
    if (s.max_area_sqm != null && opts.areaSqm > s.max_area_sqm) {
      eligible = false;
      reasons.push(`Project area exceeds max ${s.max_area_sqm} sqm`);
    }
    if ((s.first_time_only ?? "").toLowerCase() === "yes" && !opts.isFirstTime) {
      eligible = false;
      reasons.push("First-time beneficiary only");
    }
    if (
      s.structures_eligible &&
      s.structures_eligible !== "All" &&
      opts.structureId &&
      !s.structures_eligible.toLowerCase().includes(opts.structureId.toLowerCase())
    ) {
      eligible = false;
      reasons.push("Structure not eligible for this scheme");
    }

    const percent =
      (opts.farmerCategory === "sc_st"
        ? s.subsidy_percent_sc_st
        : opts.farmerCategory === "women"
          ? s.subsidy_percent_women
          : s.subsidy_percent_general) ?? s.subsidy_percent_general ?? 0;

    const ceiling = s.subsidy_ceiling_per_unit ?? s.subsidy_ceiling_total ?? 0;

    const fromPercent = (opts.estimatedProjectCost * percent) / 100;
    const estimatedAmount = eligible
      ? ceiling > 0
        ? Math.min(fromPercent, ceiling)
        : fromPercent
      : 0;

    return {
      scheme: s,
      eligible,
      reasons,
      percent,
      estimatedAmount: Math.round(estimatedAmount),
      ceiling,
    };
  });
}
