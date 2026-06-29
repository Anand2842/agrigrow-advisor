import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StateCode = "UP" | "MP" | "MH";
export type Tier = "A" | "B" | "C";
export type FarmerCategory = "general" | "sc_st" | "women";

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
  reset: () => void;
}

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
      reset: () =>
        set({
          state: null,
          districtId: null,
          districtName: null,
          cropIds: [],
          structureId: null,
        }),
    }),
    { name: "pca-wizard" },
  ),
);
