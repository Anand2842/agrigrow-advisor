import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StateCode = "UP" | "MP" | "MH" | "UK" | "HP";
export type Tier = "A" | "B" | "C";
export type FarmerCategory = "general" | "sc_st" | "women";

export interface SiteData {
  lat: number;
  lon: number;
  polygon: [number, number][] | null;
  elevation: number | null;
  slope: number | null;
  aspect: string | null;
  areaSqm: number | null;
  perimeter: number | null;
  districtId: string | null;
  districtName: string | null;
  stateCode: StateCode | null;
  confidence: "high" | "medium" | "low";
  warnings: string[];
  infrastructure: Record<string, unknown> | null;
}

export interface AdvisoryOverrides {
  cropIds: string[];
  structureId: string | null;
  areaSqm: number;
  tier: Tier;
  farmerCategory: FarmerCategory;
  landHolding: number;
  isFirstTime: boolean;
}

export interface WizardState {
  site: SiteData | null;
  overrides: AdvisoryOverrides;
  isAnalyzing: boolean;
  analysisError: string | null;

  setSite: (site: SiteData) => void;
  clearSite: () => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisError: (e: string | null) => void;

  setCropIds: (ids: string[]) => void;
  toggleCrop: (id: string) => void;
  setStructureId: (id: string | null) => void;
  setAreaSqm: (n: number) => void;
  setTier: (t: Tier) => void;
  setFarmerCategory: (c: FarmerCategory) => void;
  setLandHolding: (n: number) => void;
  setIsFirstTime: (b: boolean) => void;

  reset: () => void;
}

const DEFAULT_OVERRIDES: AdvisoryOverrides = {
  cropIds: [],
  structureId: null,
  areaSqm: 1000,
  tier: "B",
  farmerCategory: "general",
  landHolding: 1,
  isFirstTime: true,
};

export const useWizard = create<WizardState>()(
  persist(
    (set) => ({
      site: null,
      overrides: { ...DEFAULT_OVERRIDES },
      isAnalyzing: false,
      analysisError: null,

      setSite: (site) =>
        set((st) => ({
          site,
          // Auto-derive areaSqm from polygon if available
          overrides: {
            ...st.overrides,
            areaSqm: site.areaSqm ?? st.overrides.areaSqm,
          },
        })),
      clearSite: () =>
        set({
          site: null,
          overrides: { ...DEFAULT_OVERRIDES },
          analysisError: null,
        }),
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      setAnalysisError: (e) => set({ analysisError: e }),

      setCropIds: (ids) => set((st) => ({ overrides: { ...st.overrides, cropIds: ids } })),
      toggleCrop: (id) =>
        set((st) => ({
          overrides: {
            ...st.overrides,
            cropIds: st.overrides.cropIds.includes(id)
              ? st.overrides.cropIds.filter((c) => c !== id)
              : [...st.overrides.cropIds, id],
          },
        })),
      setStructureId: (id) => set((st) => ({ overrides: { ...st.overrides, structureId: id } })),
      setAreaSqm: (n) => set((st) => ({ overrides: { ...st.overrides, areaSqm: n } })),
      setTier: (t) => set((st) => ({ overrides: { ...st.overrides, tier: t } })),
      setFarmerCategory: (c) =>
        set((st) => ({ overrides: { ...st.overrides, farmerCategory: c } })),
      setLandHolding: (n) =>
        set((st) => ({ overrides: { ...st.overrides, landHolding: n } })),
      setIsFirstTime: (b) =>
        set((st) => ({ overrides: { ...st.overrides, isFirstTime: b } })),

      reset: () =>
        set({
          site: null,
          overrides: { ...DEFAULT_OVERRIDES },
          isAnalyzing: false,
          analysisError: null,
        }),
    }),
    {
      name: "pca-wizard",
      merge: (persisted: any, current: any) => ({
        ...current,
        ...persisted,
        overrides: { ...DEFAULT_OVERRIDES, ...persisted?.overrides },
      }),
    },
  ),
);
