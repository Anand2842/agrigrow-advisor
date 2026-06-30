import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useWizard, type StateCode } from "@/lib/wizard-store";
import { structuresForCropsQuery, allStructuresQuery } from "@/lib/queries";
import { WizardSteps } from "@/components/wizard-steps";
import { formatINR } from "@/lib/bom";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Structure Recommendations — PCA" },
      { name: "description", content: "Ranked protected structure recommendations." },
    ],
  }),
  component: RecommendationsPage,
});

function costRange(structure: Record<string, unknown>, state: StateCode | null) {
  const k = state ? (state.toLowerCase() as "up" | "mp" | "mh" | "uk" | "hp") : "up";
  const min = structure[`cost_per_sqm_${k}_min`] as number | null;
  const max = structure[`cost_per_sqm_${k}_max`] as number | null;
  // Fallback: UK/HP may not have dedicated columns, try UP
  if (min == null && max == null && (k === "uk" || k === "hp")) {
    return {
      min: structure.cost_per_sqm_up_min as number | null,
      max: structure.cost_per_sqm_up_max as number | null,
    };
  }
  return { min, max };
}

function RecommendationsPage() {
  const { cropIds, state, structureId, setStructure, siteSlope, siteElevation, siteInfrastructure } = useWizard();
  const fromCrops = useQuery(structuresForCropsQuery(cropIds));
  const all = useQuery(allStructuresQuery());

  const [minScore, setMinScore] = useState(0);
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const infra = siteInfrastructure as Record<string, unknown> | null;
  const roadNearest = (infra?.roads as { nearest?: { distance_m?: number } } | null)?.nearest;
  const waterNearest = (infra?.water as { nearest?: { distance_m?: number } } | null)?.nearest;

  const items = useMemo(() => {
    if (cropIds.length > 0 && fromCrops.data) {
      return fromCrops.data.map((d) => ({
        structure: d.structure as Record<string, unknown> & {
          structure_id: string;
          structure_name: string;
          structure_category: string | null;
          description_plain_language: string | null;
        },
        avgScore: d.avgScore,
        notes: d.notes,
      }));
    }
    if (all.data) {
      return all.data.map((s) => ({
        structure: s as Record<string, unknown> & {
          structure_id: string;
          structure_name: string;
          structure_category: string | null;
          description_plain_language: string | null;
        },
        avgScore: 0,
        notes: [] as string[],
      }));
    }
    return [];
  }, [cropIds, fromCrops.data, all.data]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    items.forEach((it) => it.structure.structure_category && s.add(it.structure.structure_category));
    return ["All", ...Array.from(s)];
  }, [items]);

  const filtered = items.filter((it) => {
    if (it.avgScore < minScore) return false;
    if (categoryFilter !== "All" && it.structure.structure_category !== categoryFilter) return false;
    if (maxBudget > 0) {
      const { min } = costRange(it.structure, state);
      if (min != null && min > maxBudget) return false;
    }
    return true;
  });

  return (
    <>
      <WizardSteps />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Recommended structures</h1>
        <p className="mt-1 text-muted-foreground">
          {cropIds.length > 0
            ? `Ranked by suitability for your ${cropIds.length} selected crop${cropIds.length === 1 ? "" : "s"}.`
            : "No crops selected — showing all structures. Pick crops for ranked suggestions."}
        </p>

        <div className="mt-6 grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Category</span>
            <select
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Min suitability: {minScore}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Max ₹/sqm {maxBudget > 0 ? `(${maxBudget})` : "(any)"}</span>
            <input
              type="number"
              min={0}
              placeholder="e.g. 1500"
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={maxBudget || ""}
              onChange={(e) => setMaxBudget(Number(e.target.value) || 0)}
            />
          </label>
        </div>

        {(siteSlope != null || roadNearest || waterNearest) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {siteSlope != null && siteSlope > 8 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs text-red-700">
                Steep slope ({siteSlope}%) — flat-ground structures may need modification
              </span>
            )}
            {siteElevation != null && siteElevation > 1500 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs text-blue-700">
                High altitude ({siteElevation}m) — insulated structures recommended
              </span>
            )}
            {roadNearest?.distance_m != null && roadNearest.distance_m > 500 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-700">
                Road {roadNearest.distance_m}m away — transport cost +5-10%
              </span>
            )}
            {waterNearest?.distance_m != null && waterNearest.distance_m > 1000 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs text-cyan-700">
                Water {waterNearest.distance_m}m away — irrigation pipe cost higher
              </span>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((it) => {
            const s = it.structure;
            const { min, max } = costRange(s, state);
            const selected = s.structure_id === structureId;
            return (
              <article
                key={s.structure_id}
                className={`flex flex-col rounded-xl border bg-card p-5 shadow-sm ${
                  selected ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {s.structure_category}
                    </span>
                    <h3 className="text-lg font-semibold">{s.structure_name}</h3>
                  </div>
                  {it.avgScore > 0 && (
                    <span className="rounded-full bg-secondary/15 px-3 py-1 text-sm font-semibold text-secondary">
                      {it.avgScore}/100
                    </span>
                  )}
                </div>

                {s.description_plain_language && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {s.description_plain_language}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-muted/50 p-2">
                    <div className="text-xs text-muted-foreground">Cost / sqm</div>
                    <div className="font-mono font-semibold">
                      {min != null && max != null
                        ? `${formatINR(min)}–${formatINR(max)}`
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-md bg-muted/50 p-2">
                    <div className="text-xs text-muted-foreground">Lifespan</div>
                    <div className="font-mono font-semibold">
                      {(s["structural_lifespan"] as number | null) ?? "—"} yrs
                    </div>
                  </div>
                </div>

                {it.notes.length > 0 && (
                  <ul className="mt-3 list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                    {it.notes.slice(0, 2).map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStructure(s.structure_id)}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check className="h-4 w-4" /> Selected
                      </>
                    ) : (
                      "Select structure"
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            No structures match these filters.
          </p>
        )}

        <div className="mt-8 flex justify-end">
          <Link
            to="/bom"
            aria-disabled={!structureId}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Next: BOM Calculator <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
