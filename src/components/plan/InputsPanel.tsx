import { useMemo, useState } from "react";
import { useWizard, type Tier, type FarmerCategory } from "@/lib/wizard-store";
import { useAdvisory } from "@/lib/advisory";
import { formatINR } from "@/lib/bom";
import { stateFullName } from "@/lib/queries";
import {
  ChevronDown, ChevronRight, Wheat, Building2, Layers, Users, Check,
} from "lucide-react";

export function InputsPanel() {
  const {
    site, overrides,
    setCropIds, toggleCrop, setStructureId, setAreaSqm,
    setTier, setFarmerCategory, setLandHolding, setIsFirstTime,
  } = useWizard();
  const advisory = useAdvisory();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    crops: true,
    structure: true,
    project: false,
    subsidy: false,
  });

  const toggle = (key: string) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const selectedCropIds = new Set(overrides.cropIds.length > 0 ? overrides.cropIds : advisory.selectedCrops.map((c) => c.crop_id));

  return (
    <div className="space-y-0 divide-y">
      {/* Crops */}
      <Section
        title="Crops"
        icon={<Wheat className="h-4 w-4" />}
        open={openSections.crops}
        onToggle={() => toggle("crops")}
        badge={`${selectedCropIds.size} selected`}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {advisory.rankedCrops.map(({ crop, score }) => {
            const selected = selectedCropIds.has(crop.crop_id);
            return (
              <button
                key={crop.crop_id}
                onClick={() => {
                  if (overrides.cropIds.length === 0) {
                    // First interaction: start with this crop
                    setCropIds([crop.crop_id]);
                  } else {
                    toggleCrop(crop.crop_id);
                  }
                }}
                className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                  selected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                }`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                }`}>
                  {selected && <Check className="h-2.5 w-2.5" />}
                </span>
                <span className="truncate flex-1">{crop.crop_name_common}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{score}</span>
              </button>
            );
          })}
        </div>
        {overrides.cropIds.length === 0 && (
          <p className="mt-1 text-[10px] text-muted-foreground">
            Auto-selected top {advisory.rankedCrops.slice(0, 3).length} by climate fit. Tap to customize.
          </p>
        )}
      </Section>

      {/* Structure */}
      <Section
        title="Structure"
        icon={<Building2 className="h-4 w-4" />}
        open={openSections.structure}
        onToggle={() => toggle("structure")}
        badge={advisory.selectedStructure?.structure_name ?? "Auto"}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {advisory.rankedStructures.map(({ structure, avgScore }) => {
            const effectiveId = overrides.structureId ?? advisory.rankedStructures[0]?.structure.structure_id;
            const selected = structure.structure_id === effectiveId;
            return (
              <button
                key={structure.structure_id}
                onClick={() => setStructureId(structure.structure_id)}
                className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                  selected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                }`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                }`}>
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                </span>
                <span className="truncate flex-1">{structure.structure_name}</span>
                {avgScore > 0 && (
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{avgScore}</span>
                )}
              </button>
            );
          })}
        </div>
        {advisory.rankedStructures.length === 0 && (
          <p className="text-xs text-muted-foreground">Select crops to see structure recommendations.</p>
        )}
      </Section>

      {/* Project Details */}
      <Section
        title="Project"
        icon={<Layers className="h-4 w-4" />}
        open={openSections.project}
        onToggle={() => toggle("project")}
      >
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Area (sqm)</span>
            <input
              type="number"
              min={50}
              step={50}
              value={overrides.areaSqm}
              onChange={(e) => setAreaSqm(Number(e.target.value) || 50)}
              className="h-8 rounded-md border bg-background px-2 text-xs"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Tier</span>
            <div className="flex rounded-md border overflow-hidden">
              {(["A", "B", "C"] as Tier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`flex-1 py-1.5 text-xs font-medium transition ${
                    overrides.tier === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {t === "A" ? "Premium" : t === "B" ? "Standard" : "Basic"}
                </button>
              ))}
            </div>
          </label>
        </div>
      </Section>

      {/* Subsidy Inputs */}
      <Section
        title="Subsidy"
        icon={<Users className="h-4 w-4" />}
        open={openSections.subsidy}
        onToggle={() => toggle("subsidy")}
      >
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Farmer category</span>
            <select
              value={overrides.farmerCategory}
              onChange={(e) => setFarmerCategory(e.target.value as FarmerCategory)}
              className="h-8 rounded-md border bg-background px-2 text-xs"
            >
              <option value="general">General</option>
              <option value="sc_st">SC / ST</option>
              <option value="women">Women</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Land holding (acres)</span>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={overrides.landHolding}
              onChange={(e) => setLandHolding(Number(e.target.value) || 0.5)}
              className="h-8 rounded-md border bg-background px-2 text-xs"
            />
          </label>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={overrides.isFirstTime}
              onChange={(e) => setIsFirstTime(e.target.checked)}
              className="rounded border-muted-foreground/30"
            />
            <span className="text-muted-foreground">First-time beneficiary</span>
          </label>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  icon,
  open,
  onToggle,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/50 transition"
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium flex-1">{title}</span>
        {badge && (
          <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 mr-1">
            {badge}
          </span>
        )}
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
