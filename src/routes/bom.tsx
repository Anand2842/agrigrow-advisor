import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useWizard, type Tier } from "@/lib/wizard-store";
import {
  materialsForStructureQuery,
  districtClimateQuery,
  allStructuresQuery,
} from "@/lib/queries";
import { WizardSteps } from "@/components/wizard-steps";
import { calculateBOM, formatINR, type MaterialRow, type DistrictClimateLite } from "@/lib/bom";
import { AlertTriangle, Printer, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/bom")({
  head: () => ({
    meta: [
      { title: "BOM Calculator — PCA" },
      { name: "description", content: "Bill of materials with district-aware adjustments." },
    ],
  }),
  component: BOMPage,
});

function BOMPage() {
  const {
    state,
    structureId,
    districtId,
    districtName,
    areaSqm,
    tier,
    setArea,
    setTier,
    setStructure,
  } = useWizard();

  const materials = useQuery(materialsForStructureQuery(structureId));
  const climate = useQuery(districtClimateQuery(districtId));
  const structures = useQuery(allStructuresQuery());

  const selectedStructure = structures.data?.find((s) => s.structure_id === structureId);

  const bom = useMemo(() => {
    if (!materials.data || !state) return null;
    return calculateBOM(
      materials.data as unknown as MaterialRow[],
      areaSqm,
      state,
      tier,
      climate.data as DistrictClimateLite | null,
    );
  }, [materials.data, state, areaSqm, tier, climate.data]);

  return (
    <>
      <WizardSteps />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3 no-print">
          <div>
            <h1 className="text-3xl font-bold">Bill of Materials</h1>
            <p className="mt-1 text-muted-foreground">
              Adjusted for district climate. Tier picks vendor quality (A = premium, C = basic).
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Printer className="h-4 w-4" /> Print / Save PDF
          </button>
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-4 no-print">
          <Field label="Structure">
            <select
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={structureId ?? ""}
              onChange={(e) => setStructure(e.target.value || null)}
            >
              <option value="">Pick a structure</option>
              {(structures.data ?? []).map((s) => (
                <option key={s.structure_id} value={s.structure_id}>
                  {s.structure_name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Area (sqm)">
            <input
              type="number"
              min={50}
              step={50}
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={areaSqm}
              onChange={(e) => setArea(Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Tier">
            <select
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier)}
            >
              <option value="A">A — Premium</option>
              <option value="B">B — Standard</option>
              <option value="C">C — Basic</option>
            </select>
          </Field>
          <Field label="State / District">
            <div className="flex h-9 items-center rounded-md border bg-background px-2 text-sm text-muted-foreground">
              {state ?? "—"} {districtName ? `· ${districtName}` : ""}
            </div>
          </Field>
        </div>

        <div className="print-area mt-6">
          <div className="mb-3 print:block">
            <h2 className="text-lg font-semibold">
              {selectedStructure?.structure_name ?? "Structure"} · {areaSqm} sqm · Tier {tier}
            </h2>
            <p className="text-sm text-muted-foreground">
              {districtName ? `${districtName}, ${state}` : state ?? ""}
            </p>
          </div>

          {!bom && (
            <p className="text-muted-foreground">
              {!state
                ? "Pick a state on the District page first."
                : !structureId
                  ? "Pick a structure."
                  : "Loading materials…"}
            </p>
          )}

          {bom && bom.warnings.length > 0 && (
            <div className="mb-4 rounded-lg border border-accent bg-accent/10 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
                <AlertTriangle className="h-4 w-4 text-accent" /> Warnings
              </div>
              <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm">
                {bom.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {bom && (
            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Material</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2 text-right">Rate</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bom.lines.map((l) => (
                    <tr key={l.material_id} className="border-t">
                      <td className="px-3 py-2">
                        <div className="font-medium">{l.material_name}</div>
                        {l.spec && (
                          <div className="text-xs text-muted-foreground">{l.spec}</div>
                        )}
                        {l.is_code && (
                          <div className="text-xs font-mono text-muted-foreground">IS: {l.is_code}</div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{l.category}</td>
                      <td className="px-3 py-2 text-right font-mono">{l.quantity}</td>
                      <td className="px-3 py-2 text-muted-foreground">{l.unit}</td>
                      <td className="px-3 py-2 text-right font-mono">{formatINR(l.unit_price)}</td>
                      <td className="px-3 py-2 text-right font-mono font-semibold">
                        {formatINR(l.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-muted/30">
                    <td colSpan={5} className="px-3 py-3 text-right font-semibold">
                      Total materials cost
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-lg font-bold text-primary">
                      {formatINR(bom.totalCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {bom && bom.byCategory.length > 0 && (
            <div className="mt-6 rounded-xl border bg-card p-4 shadow-sm">
              <h3 className="font-semibold">Cost breakdown by category</h3>
              <ul className="mt-3 space-y-2">
                {bom.byCategory.map((c) => {
                  const pct = (c.total / bom.totalCost) * 100;
                  return (
                    <li key={c.category}>
                      <div className="flex justify-between text-sm">
                        <span>{c.category}</span>
                        <span className="font-mono font-medium">
                          {formatINR(c.total)} · {pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end no-print">
          <Link
            to="/subsidy"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Next: Subsidies <ArrowRight className="h-4 w-4" />
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
