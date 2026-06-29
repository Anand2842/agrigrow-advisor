import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useWizard, type FarmerCategory } from "@/lib/wizard-store";
import {
  subsidiesByStateQuery,
  materialsForStructureQuery,
  districtClimateQuery,
} from "@/lib/queries";
import { WizardSteps } from "@/components/wizard-steps";
import { calculateBOM, formatINR, type MaterialRow, type DistrictClimateLite } from "@/lib/bom";
import { evaluateSubsidies, type SubsidyScheme } from "@/lib/subsidy";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/subsidy")({
  head: () => ({
    meta: [
      { title: "Subsidy Calculator — PCA" },
      { name: "description", content: "Estimate eligible government subsidies." },
    ],
  }),
  component: SubsidyPage,
});

function SubsidyPage() {
  const {
    state,
    districtId,
    structureId,
    areaSqm,
    tier,
    farmerCategory,
    landHolding,
    isFirstTime,
    setFarmerCategory,
    setLandHolding,
    setIsFirstTime,
  } = useWizard();

  const schemes = useQuery(subsidiesByStateQuery(state));
  const materials = useQuery(materialsForStructureQuery(structureId));
  const climate = useQuery(districtClimateQuery(districtId));

  const projectCost = useMemo(() => {
    if (!materials.data || !state) return 0;
    return calculateBOM(
      materials.data as unknown as MaterialRow[],
      areaSqm,
      state,
      tier,
      climate.data as DistrictClimateLite | null,
    ).totalCost;
  }, [materials.data, state, areaSqm, tier, climate.data]);

  const results = useMemo(() => {
    if (!schemes.data || !state) return [];
    return evaluateSubsidies(schemes.data as unknown as SubsidyScheme[], {
      state,
      structureId,
      areaSqm,
      farmerCategory,
      landHolding,
      isFirstTime,
      estimatedProjectCost: projectCost,
    });
  }, [schemes.data, state, structureId, areaSqm, farmerCategory, landHolding, isFirstTime, projectCost]);

  const totalSubsidy = results.filter((r) => r.eligible).reduce((s, r) => s + r.estimatedAmount, 0);

  return (
    <>
      <WizardSteps />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold">Subsidy Calculator</h1>
        <p className="mt-1 text-muted-foreground">
          Estimated subsidies based on your project, farmer category, and land holding.
        </p>

        <div className="mt-6 grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-3">
          <Field label="Farmer category">
            <select
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={farmerCategory}
              onChange={(e) => setFarmerCategory(e.target.value as FarmerCategory)}
            >
              <option value="general">General</option>
              <option value="sc_st">SC / ST</option>
              <option value="women">Women</option>
            </select>
          </Field>
          <Field label="Land holding (acres)">
            <input
              type="number"
              min={0}
              step={0.1}
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={landHolding}
              onChange={(e) => setLandHolding(Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="First-time beneficiary">
            <select
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={isFirstTime ? "yes" : "no"}
              onChange={(e) => setIsFirstTime(e.target.value === "yes")}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Summary label="Project cost" value={formatINR(projectCost)} />
          <Summary label="Total estimated subsidy" value={formatINR(totalSubsidy)} accent />
          <Summary
            label="Your contribution"
            value={formatINR(Math.max(projectCost - totalSubsidy, 0))}
          />
        </div>

        <div className="mt-6 space-y-3">
          {schemes.isLoading && <p className="text-muted-foreground">Loading schemes…</p>}
          {!state && (
            <p className="text-muted-foreground">Pick a state on the District page first.</p>
          )}
          {results.map((r) => (
            <article key={r.scheme.scheme_id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {r.eligible ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold">{r.scheme.scheme_name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {r.scheme.implementing_agency} · {r.scheme.scheme_type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-primary">
                    {r.eligible ? formatINR(r.estimatedAmount) : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {r.percent ? `${r.percent}%` : ""}{" "}
                    {r.ceiling > 0 ? `· ceil ${formatINR(r.ceiling)}` : ""}
                  </div>
                </div>
              </div>
              {!r.eligible && r.reasons.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                  {r.reasons.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              )}
              {r.eligible && r.scheme.documentation_required && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold">Docs:</span> {r.scheme.documentation_required}
                </p>
              )}
              {r.scheme.valid_until && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Valid until {r.scheme.valid_until}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/report"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Generate Full Report <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function Summary({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${accent ? "bg-secondary/10 border-secondary" : "bg-card"}`}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl font-bold">{value}</div>
    </div>
  );
}
