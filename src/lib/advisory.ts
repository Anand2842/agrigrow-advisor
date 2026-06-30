import { useMemo } from "react";
import { useWizard, type StateCode, type AdvisoryOverrides } from "./wizard-store";
import { useQuery } from "@tanstack/react-query";
import {
  districtClimateQuery,
  cropsAllQuery,
  structuresForCropsQuery,
  allStructuresQuery,
  materialsForStructureQuery,
  subsidiesByStateQuery,
} from "./queries";
import { rankCrops, rankStructures, type RankedCrop, type RankedStructure } from "./ranking";
import { calculateBOM, type BOMResult, type MaterialRow, type DistrictClimateLite } from "./bom";
import { evaluateSubsidies, type SubsidyResult, type SubsidyScheme } from "./subsidy";

export interface AdvisoryResult {
  // Site
  state: StateCode | null;
  districtId: string | null;
  districtName: string | null;

  // Climate
  climate: any | null;

  // Rankings
  rankedCrops: RankedCrop[];
  rankedStructures: RankedStructure[];

  // Selections
  selectedCrops: any[];
  selectedStructure: any | null;

  // BOM
  bom: BOMResult | null;

  // Subsidy
  subsidyResults: SubsidyResult[];
  totalSubsidy: number;
  projectCost: number;
  farmerShare: number;

  // Warnings
  allWarnings: string[];

  // Loading
  isLoading: boolean;
}

function deriveWarnings(
  site: any,
  climate: any,
  bom: BOMResult | null,
): string[] {
  const warnings: string[] = [];

  if (site?.slope != null && site.slope > 10) {
    warnings.push(`Steep slope (${site.slope}%) — some structures may need modification`);
  } else if (site?.slope != null && site.slope > 5) {
    warnings.push(`Moderate slope (${site.slope}%) — enhanced foundation recommended`);
  }

  if (site?.elevation != null && site.elevation > 2000) {
    warnings.push(`High altitude (${site.elevation}m) — cold-hardy crops and insulated structures recommended`);
  } else if (site?.elevation != null && site.elevation > 1500) {
    warnings.push(`Elevated site (${site.elevation}m) — consider insulated film`);
  }

  const infra = site?.infrastructure as any;
  const roadDist = infra?.roads?.nearest?.distance_m;
  const waterDist = infra?.water?.nearest?.distance_m;

  if (roadDist != null && roadDist > 1000) {
    warnings.push(`Road ${roadDist}m away — transport costs increased`);
  } else if (roadDist != null && roadDist > 500) {
    warnings.push(`Road ${roadDist}m away — moderate transport distance`);
  }

  if (waterDist != null && waterDist > 1000) {
    warnings.push(`Water source ${waterDist}m away — irrigation pipe costs higher`);
  }

  if (climate?.fog_days_jan != null && climate.fog_days_jan > 10) {
    warnings.push(`${climate.fog_days_jan} fog days in January — anti-drip film mandatory`);
  }

  if (climate?.coastal_corrosion_factor != null && climate.coastal_corrosion_factor > 1.5) {
    warnings.push("High coastal corrosion — HDG pipes recommended (+30% pipe cost)");
  }

  if (bom?.warnings) {
    warnings.push(...bom.warnings);
  }

  return [...new Set(warnings)];
}

export function useAdvisory(): AdvisoryResult {
  const { site, overrides } = useWizard();

  const state = site?.stateCode ?? null;
  const districtId = site?.districtId ?? null;

  const climate = useQuery(districtClimateQuery(districtId));
  const crops = useQuery(cropsAllQuery());
  const allStructures = useQuery(allStructuresQuery());
  const fromCrops = useQuery(structuresForCropsQuery(overrides.cropIds));
  const materials = useQuery(materialsForStructureQuery(overrides.structureId));
  const schemes = useQuery(subsidiesByStateQuery(state));

  const isLoading =
    crops.isLoading ||
    allStructures.isLoading ||
    (overrides.cropIds.length > 0 && fromCrops.isLoading) ||
    (overrides.structureId != null && materials.isLoading) ||
    (state != null && schemes.isLoading);

  // Rank crops by climate fit
  const rankedCrops = useMemo(() => {
    if (!crops.data) return [];
    return rankCrops(crops.data, climate.data ?? null, site?.elevation ?? null);
  }, [crops.data, climate.data, site?.elevation]);

  // Rank structures by crop suitability
  const rankedStructures = useMemo(() => {
    const structureList = (overrides.cropIds.length > 0 && fromCrops.data)
      ? fromCrops.data.map((d) => d.structure)
      : allStructures.data ?? [];

    const matches = (overrides.cropIds.length > 0 && fromCrops.data)
      ? fromCrops.data.flatMap((d) =>
          (d.notes ?? []).map((n: string) => ({
            structure_id: d.structure.structure_id,
            suitability_score: d.avgScore,
            notes: n,
          }))
        )
      : [];

    return rankStructures(structureList, matches);
  }, [fromCrops.data, allStructures.data, overrides.cropIds]);

  // Auto-select top structure if none selected
  const effectiveStructureId = useMemo(() => {
    if (overrides.structureId) return overrides.structureId;
    if (rankedStructures.length > 0) return rankedStructures[0].structure.structure_id;
    return null;
  }, [overrides.structureId, rankedStructures]);

  // Selected items
  const selectedCrops = useMemo(() => {
    if (!crops.data) return [];
    if (overrides.cropIds.length === 0) {
      // Auto-select top 3 by rank
      return rankedCrops.slice(0, 3).map((r) => r.crop);
    }
    return crops.data.filter((c) => overrides.cropIds.includes(c.crop_id));
  }, [crops.data, overrides.cropIds, rankedCrops]);

  const selectedStructure = useMemo(() => {
    if (!effectiveStructureId) return null;
    return rankedStructures.find((r) => r.structure.structure_id === effectiveStructureId)?.structure
      ?? allStructures.data?.find((s) => s.structure_id === effectiveStructureId)
      ?? null;
  }, [effectiveStructureId, rankedStructures, allStructures.data]);

  // BOM
  const bom = useMemo(() => {
    if (!materials.data || !state || !effectiveStructureId) return null;
    return calculateBOM(
      materials.data as unknown as MaterialRow[],
      overrides.areaSqm,
      state,
      overrides.tier,
      climate.data as DistrictClimateLite | null,
      {
        slope_percent: site?.slope,
        road_distance_m: (site?.infrastructure as any)?.roads?.nearest?.distance_m,
        water_distance_m: (site?.infrastructure as any)?.water?.nearest?.distance_m,
      },
    );
  }, [materials.data, state, effectiveStructureId, overrides.areaSqm, overrides.tier, climate.data, site]);

  // Subsidies
  const subsidyResults = useMemo(() => {
    if (!schemes.data || !state) return [];
    return evaluateSubsidies(schemes.data as unknown as SubsidyScheme[], {
      state,
      structureId: effectiveStructureId,
      areaSqm: overrides.areaSqm,
      farmerCategory: overrides.farmerCategory,
      landHolding: overrides.landHolding,
      isFirstTime: overrides.isFirstTime,
      estimatedProjectCost: bom?.totalCost ?? 0,
    });
  }, [schemes.data, state, effectiveStructureId, overrides, bom?.totalCost]);

  const totalSubsidy = subsidyResults
    .filter((r) => r.eligible)
    .reduce((s, r) => s + r.estimatedAmount, 0);

  const projectCost = bom?.totalCost ?? 0;
  const farmerShare = Math.max(projectCost - totalSubsidy, 0);

  const allWarnings = useMemo(
    () => deriveWarnings(site, climate.data, bom),
    [site, climate.data, bom],
  );

  return {
    state,
    districtId,
    districtName: site?.districtName ?? null,
    climate: climate.data ?? null,
    rankedCrops,
    rankedStructures,
    selectedCrops,
    selectedStructure,
    bom,
    subsidyResults,
    totalSubsidy,
    projectCost,
    farmerShare,
    allWarnings,
    isLoading,
  };
}
