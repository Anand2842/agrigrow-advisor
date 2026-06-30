import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StateCode = "UP" | "MP" | "MH" | "UK" | "HP";
export type Tier = "A" | "B" | "C";
export type FarmerCategory = "general" | "sc_st" | "women";

export interface ManualAnswers {
  soilType: string | null;
  waterSource: string | null;
  waterQuality: string | null;
  windbreak: string | null;
  nearbyStructures: string | null;
  frostPocket: string | null;
  floodRisk: string | null;
}

export interface WizardState {
  state: StateCode | null;
  districtId: string | null;
  districtName: string | null;
  cropIds: string[];
  structureId: string | null;
  areaSqm: number;
  tier: Tier;
  farmerCategory: FarmerCategory;
  landHolding: number;
  isFirstTime: boolean;

  siteLat: number | null;
  siteLon: number | null;
  sitePolygon: [number, number][] | null;
  siteElevation: number | null;
  siteSlope: number | null;
  siteAspect: string | null;
  siteAreaSqm: number | null;
  siteConfidence: "high" | "medium" | "low" | null;
  siteWarnings: string[];
  siteInfrastructure: Record<string, unknown> | null;
  manualAnswers: ManualAnswers;
  siteIntelligenceComplete: boolean;

  setState: (s: StateCode | null) => void;
  setDistrict: (id: string | null, name: string | null) => void;
  toggleCrop: (id: string) => void;
  setCrops: (ids: string[]) => void;
  setStructure: (id: string | null) => void;
  setArea: (n: number) => void;
  setTier: (t: Tier) => void;
  setFarmerCategory: (c: FarmerCategory) => void;
  setLandHolding: (n: number) => void;
  setIsFirstTime: (b: boolean) => void;
  setSiteLocation: (lat: number, lon: number) => void;
  setSitePolygon: (polygon: [number, number][] | null) => void;
  setSiteTerrain: (elevation: number | null, slope: number | null, aspect: string | null) => void;
  setSiteInfrastructure: (infra: Record<string, unknown>) => void;
  setSiteAreaSqm: (area: number | null) => void;
  setSiteConfidence: (c: "high" | "medium" | "low") => void;
  setSiteWarnings: (warnings: string[]) => void;
  setManualAnswers: (answers: Partial<ManualAnswers>) => void;
  markSiteComplete: () => void;
  resetSite: () => void;
  reset: () => void;
}

const DEFAULT_MANUAL: ManualAnswers = {
  soilType: null,
  waterSource: null,
  waterQuality: null,
  windbreak: null,
  nearbyStructures: null,
  frostPocket: null,
  floodRisk: null,
};

export const useWizard = create<WizardState>()(
  persist(
    (set) => ({
      state: null,
      districtId: null,
      districtName: null,
      cropIds: [],
      structureId: null,
      areaSqm: 1000,
      tier: "B",
      farmerCategory: "general",
      landHolding: 1,
      isFirstTime: true,

      siteLat: null,
      siteLon: null,
      sitePolygon: null,
      siteElevation: null,
      siteSlope: null,
      siteAspect: null,
      siteAreaSqm: null,
      siteConfidence: null,
      siteWarnings: [],
      siteInfrastructure: null,
      manualAnswers: DEFAULT_MANUAL,
      siteIntelligenceComplete: false,

      setState: (s) => set({ state: s, districtId: null, districtName: null }),
      setDistrict: (id, name) => set({ districtId: id, districtName: name }),
      toggleCrop: (id) =>
        set((st) => ({
          cropIds: st.cropIds.includes(id)
            ? st.cropIds.filter((c) => c !== id)
            : [...st.cropIds, id],
        })),
      setCrops: (ids) => set({ cropIds: ids }),
      setStructure: (id) => set({ structureId: id }),
      setArea: (n) => set({ areaSqm: n }),
      setTier: (t) => set({ tier: t }),
      setFarmerCategory: (c) => set({ farmerCategory: c }),
      setLandHolding: (n) => set({ landHolding: n }),
      setIsFirstTime: (b) => set({ isFirstTime: b }),

      setSiteLocation: (lat, lon) => set({ siteLat: lat, siteLon: lon }),
      setSitePolygon: (polygon) => set({ sitePolygon: polygon }),
      setSiteTerrain: (elevation, slope, aspect) =>
        set({ siteElevation: elevation, siteSlope: slope, siteAspect: aspect }),
      setSiteInfrastructure: (infra) => set({ siteInfrastructure: infra }),
      setSiteAreaSqm: (area) => set({ siteAreaSqm: area }),
      setSiteConfidence: (c) => set({ siteConfidence: c }),
      setSiteWarnings: (warnings) => set({ siteWarnings: warnings }),
      setManualAnswers: (answers) =>
        set((st) => ({
          manualAnswers: { ...st.manualAnswers, ...answers },
        })),
      markSiteComplete: () => set({ siteIntelligenceComplete: true }),
      resetSite: () =>
        set({
          siteLat: null,
          siteLon: null,
          sitePolygon: null,
          siteElevation: null,
          siteSlope: null,
          siteAspect: null,
          siteAreaSqm: null,
          siteConfidence: null,
          siteWarnings: [],
          siteInfrastructure: null,
          manualAnswers: DEFAULT_MANUAL,
          siteIntelligenceComplete: false,
        }),
      reset: () =>
        set({
          state: null,
          districtId: null,
          districtName: null,
          cropIds: [],
          structureId: null,
          areaSqm: 1000,
          tier: "B",
          farmerCategory: "general",
          landHolding: 1,
          isFirstTime: true,
          siteLat: null,
          siteLon: null,
          sitePolygon: null,
          siteElevation: null,
          siteSlope: null,
          siteAspect: null,
          siteAreaSqm: null,
          siteConfidence: null,
          siteWarnings: [],
          siteInfrastructure: null,
          manualAnswers: DEFAULT_MANUAL,
          siteIntelligenceComplete: false,
        }),
    }),
    {
      name: "pca-wizard",
      merge: (persisted: any, current: any) => ({
        ...current,
        ...persisted,
        manualAnswers: { ...DEFAULT_MANUAL, ...persisted?.manualAnswers },
        siteWarnings: persisted?.siteWarnings ?? [],
      }),
    },
  ),
);
