import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useWizard } from "@/lib/wizard-store";
import {
  districtClimateQuery,
  cropsAllQuery,
  allStructuresQuery,
  materialsForStructureQuery,
  subsidiesByStateQuery,
  stateFullName,
} from "@/lib/queries";
import { calculateBOM, formatINR, type MaterialRow, type DistrictClimateLite } from "@/lib/bom";
import { evaluateSubsidies, type SubsidyScheme } from "@/lib/subsidy";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Advisory Report — PCA" },
      { name: "description", content: "Complete protected cultivation advisory report." },
    ],
  }),
  component: ReportPage,
});

const RISKS: Record<string, { month: string; risk: string }[]> = {
  default: [
    { month: "January", risk: "Cold wave / frost: keep side curtains down at night" },
    { month: "February", risk: "Pollination support; aphid scouting" },
    { month: "March", risk: "Temperature rise: open vents fully; whitewash if >35°C" },
    { month: "April", risk: "Heat stress; increase irrigation frequency" },
    { month: "May", risk: "Peak summer: shade nets + fogging if available" },
    { month: "June", risk: "Pre-monsoon checks: drainage, anchors, film integrity" },
    { month: "July", risk: "High humidity: fungal disease scouting" },
    { month: "August", risk: "Monsoon winds: verify guy ropes and curtain seals" },
    { month: "September", risk: "Whitefly / thrips peak; sticky traps" },
    { month: "October", risk: "Post-monsoon cleaning, film washing" },
    { month: "November", risk: "Cool nights begin; check heating readiness" },
    { month: "December", risk: "Fog & low DLI: anti-drip film mandatory" },
  ],
};

function ReportPage() {
  const w = useWizard();
  const climate = useQuery(districtClimateQuery(w.districtId));
  const crops = useQuery(cropsAllQuery());
  const structures = useQuery(allStructuresQuery());
  const materials = useQuery(materialsForStructureQuery(w.structureId));
  const schemes = useQuery(subsidiesByStateQuery(w.state));

  const selectedCrops = (crops.data ?? []).filter((c) => w.cropIds.includes(c.crop_id));
  const structure = structures.data?.find((s) => s.structure_id === w.structureId);

  const infra = w.siteInfrastructure as Record<string, unknown> | null;
  const roadNearest = (infra?.roads as { nearest?: { name?: string; distance_m?: number } } | null)?.nearest;
  const waterNearest = (infra?.water as { nearest?: { name?: string; distance_m?: number } } | null)?.nearest;
  const buildings = (infra?.buildings as { count?: number } | null)?.count ?? 0;
  const settlement = (infra?.settlements as { nearest?: { name?: string; distance_m?: number } } | null)?.nearest;

  const bom = useMemo(() => {
    if (!materials.data || !w.state) return null;
    return calculateBOM(
      materials.data as unknown as MaterialRow[],
      w.areaSqm,
      w.state,
      w.tier,
      climate.data as DistrictClimateLite | null,
      {
        slope_percent: w.siteSlope,
        road_distance_m: roadNearest?.distance_m,
        water_distance_m: waterNearest?.distance_m,
      },
    );
  }, [materials.data, w.state, w.areaSqm, w.tier, climate.data, w.siteSlope, roadNearest?.distance_m, waterNearest?.distance_m]);

  const subsidyResults = useMemo(() => {
    if (!schemes.data || !w.state) return [];
    return evaluateSubsidies(schemes.data as unknown as SubsidyScheme[], {
      state: w.state,
      structureId: w.structureId,
      areaSqm: w.areaSqm,
      farmerCategory: w.farmerCategory,
      landHolding: w.landHolding,
      isFirstTime: w.isFirstTime,
      estimatedProjectCost: bom?.totalCost ?? 0,
    });
  }, [schemes.data, w, bom?.totalCost]);

  const totalSubsidy = subsidyResults
    .filter((r) => r.eligible)
    .reduce((s, r) => s + r.estimatedAmount, 0);
  const projectCost = bom?.totalCost ?? 0;
  const farmerShare = Math.max(projectCost - totalSubsidy, 0);

  const siteArea = w.siteAreaSqm ?? w.areaSqm;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="no-print mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Full Advisory Report</h1>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <Printer className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>

      <article className="print-area space-y-8 rounded-xl border bg-card p-8 shadow-sm print:border-0 print:shadow-none">
        <header className="border-b pb-4">
          <h1 className="text-2xl font-bold">Protected Cultivation Advisory Report</h1>
          <p className="text-sm text-muted-foreground">
            {w.districtName ?? "—"}
            {w.state ? `, ${stateFullName(w.state)}` : ""} · Generated{" "}
            {new Date().toLocaleDateString("en-IN")}
          </p>
        </header>

        <Section n={1} title="Executive Summary">
          <p className="text-sm">
            For a <strong>{siteArea} sqm</strong> protected farming project
            {structure ? (
              <>
                {" "}using <strong>{structure.structure_name}</strong>
              </>
            ) : null}
            {w.districtName ? <> in <strong>{w.districtName}</strong></> : null}, the estimated
            materials cost (Tier {w.tier}) is{" "}
            <strong className="font-mono">{formatINR(projectCost)}</strong>. Eligible government
            subsidies are estimated at{" "}
            <strong className="font-mono text-secondary">{formatINR(totalSubsidy)}</strong>,
            leaving a farmer contribution of{" "}
            <strong className="font-mono">{formatINR(farmerShare)}</strong>.
          </p>
          {w.siteWarnings.length > 0 && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-semibold text-amber-800 mb-1">Site Warnings:</p>
              <ul className="list-inside list-disc space-y-0.5 text-xs text-amber-700">
                {w.siteWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {w.siteLat && w.siteLon && (
          <Section n={2} title="Site Intelligence">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Location</h4>
                <dl className="space-y-1">
                  <KV k="Coordinates" v={`${w.siteLat.toFixed(4)}, ${w.siteLon.toFixed(4)}`} />
                  <KV k="Confidence" v={w.siteConfidence === "high" ? "High" : w.siteConfidence === "medium" ? "Medium" : "Low"} />
                </dl>

                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mt-4">Terrain</h4>
                <dl className="space-y-1">
                  <KV k="Elevation" v={w.siteElevation != null ? `${w.siteElevation}m` : "—"} />
                  <KV k="Slope" v={w.siteSlope != null ? `${w.siteSlope}%` : "—"} />
                  <KV k="Aspect" v={w.siteAspect ?? "—"} />
                </dl>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Infrastructure</h4>
                <dl className="space-y-1">
                  <KV k="Nearest road" v={roadNearest ? `${roadNearest.name ?? "Road"} (${roadNearest.distance_m}m)` : "—"} />
                  <KV k="Water source" v={waterNearest ? `${waterNearest.name ?? "Source"} (${waterNearest.distance_m}m)` : "—"} />
                  <KV k="Buildings nearby" v={String(buildings)} />
                  <KV k="Settlement" v={settlement ? `${settlement.name} (${settlement.distance_m}m)` : "—"} />
                </dl>
              </div>
            </div>

            {(w.manualAnswers.soilType || w.manualAnswers.waterSource) && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Field Details (Manual)</h4>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {w.manualAnswers.soilType && <KV k="Soil type" v={w.manualAnswers.soilType} />}
                  {w.manualAnswers.waterSource && <KV k="Water source" v={w.manualAnswers.waterSource} />}
                  {w.manualAnswers.waterQuality && <KV k="Water quality" v={w.manualAnswers.waterQuality} />}
                  {w.manualAnswers.windbreak && <KV k="Windbreak" v={w.manualAnswers.windbreak} />}
                  {w.manualAnswers.nearbyStructures && <KV k="Nearby structures" v={w.manualAnswers.nearbyStructures} />}
                  {w.manualAnswers.frostPocket && <KV k="Frost pocket" v={w.manualAnswers.frostPocket} />}
                  {w.manualAnswers.floodRisk && <KV k="Flood risk" v={w.manualAnswers.floodRisk} />}
                </dl>
              </div>
            )}

            {bom && bom.adjustments.length > 0 && (
              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs font-semibold text-blue-800 mb-1">Cost Adjustments Applied:</p>
                <ul className="list-inside list-disc space-y-0.5 text-xs text-blue-700">
                  {bom.adjustments.map((a, i) => (
                    <li key={i}>{a.reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        <Section n={w.siteLat ? 3 : 2} title="District Profile">
          {climate.data ? (
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <KV k="Agro-climatic zone" v={climate.data.agro_climatic_zone ?? "—"} />
              <KV k="Annual rainfall" v={`${Math.round(climate.data.annual_rainfall_avg ?? 0)} mm`} />
              <KV k="Fog days (J/D)" v={`${climate.data.fog_days_jan ?? 0}/${climate.data.fog_days_dec ?? 0}`} />
              <KV k="Max wind" v={`${climate.data.wind_speed_max_recorded ?? "—"} km/h`} />
              <KV k="Cyclone risk" v={climate.data.cyclone_risk ?? "—"} />
              <KV k="Corrosion factor" v={String(climate.data.coastal_corrosion_factor ?? 1)} />
            </dl>
          ) : (
            <p className="text-muted-foreground">No district selected.</p>
          )}
        </Section>

        <Section n={w.siteLat ? 4 : 3} title="Crop Recommendations">
          {selectedCrops.length === 0 ? (
            <p className="text-muted-foreground">No crops selected.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {selectedCrops.map((c) => (
                <li key={c.crop_id} className="flex justify-between border-b pb-1">
                  <span className="font-medium">{c.crop_name_common}</span>
                  <span className="text-muted-foreground">
                    {c.temp_day_optimal_min}–{c.temp_day_optimal_max}°C ·{" "}
                    {c.total_crop_duration ?? "—"} days
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section n={w.siteLat ? 5 : 4} title="Structure Recommendation">
          {structure ? (
            <div className="text-sm">
              <p className="font-semibold">{structure.structure_name}</p>
              <p className="text-muted-foreground">{structure.structure_category}</p>
              {structure.description_plain_language && (
                <p className="mt-2">{structure.description_plain_language}</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No structure selected.</p>
          )}
        </Section>

        <Section n={w.siteLat ? 6 : 5} title="Bill of Materials">
          {bom ? (
            <>
              <table className="w-full text-xs">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-1">Material</th>
                    <th className="py-1 text-right">Qty</th>
                    <th className="py-1 text-right">Rate</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bom.lines.map((l) => (
                    <tr key={l.material_id} className="border-t">
                      <td className="py-1">
                        {l.material_name}
                        {l.is_code && (
                          <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                            ({l.is_code})
                          </span>
                        )}
                      </td>
                      <td className="py-1 text-right font-mono">
                        {l.quantity} {l.unit}
                      </td>
                      <td className="py-1 text-right font-mono">{formatINR(l.unit_price)}</td>
                      <td className="py-1 text-right font-mono font-semibold">
                        {formatINR(l.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td colSpan={3} className="py-2 text-right font-semibold">
                      Total
                    </td>
                    <td className="py-2 text-right font-mono font-bold">
                      {formatINR(bom.totalCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <p className="text-muted-foreground">Materials unavailable.</p>
          )}
        </Section>

        <Section n={w.siteLat ? 7 : 6} title="Contractor Verification Checklist">
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Confirm pipe gauge & galvanization (HDG g/sqm) matches Tier {w.tier} spec</li>
            <li>Verify film thickness (micron) and UV stabilization grade</li>
            <li>Insist on IS-coded materials wherever listed in the BOM</li>
            <li>Request invoice copies for every line item before final payment</li>
            <li>Inspect foundation depth & anchor bolt diameter on-site</li>
          </ul>
        </Section>

        <Section n={w.siteLat ? 8 : 7} title="Month-by-Month Risk Calendar">
          <table className="w-full text-xs">
            <tbody>
              {RISKS.default.map((r) => (
                <tr key={r.month} className="border-b">
                  <td className="py-1 pr-3 font-semibold">{r.month}</td>
                  <td className="py-1 text-muted-foreground">{r.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section n={w.siteLat ? 9 : 8} title="Subsidy Application Guide">
          {subsidyResults.length === 0 && (
            <p className="text-muted-foreground">No schemes evaluated.</p>
          )}
          <ul className="space-y-2 text-sm">
            {subsidyResults.map((r) => (
              <li
                key={r.scheme.scheme_id}
                className={`rounded border p-2 ${r.eligible ? "border-secondary/40 bg-secondary/5" : "border-border"}`}
              >
                <div className="flex justify-between">
                  <strong>{r.scheme.scheme_name}</strong>
                  <span className="font-mono">
                    {r.eligible ? formatINR(r.estimatedAmount) : "Not eligible"}
                  </span>
                </div>
                {r.scheme.documentation_required && (
                  <p className="text-xs text-muted-foreground">
                    Docs: {r.scheme.documentation_required}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section n={w.siteLat ? 10 : 9} title="ROI Summary">
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <KV k="Project cost" v={formatINR(projectCost)} />
            <KV k="Subsidy" v={formatINR(totalSubsidy)} />
            <KV k="Farmer share" v={formatINR(farmerShare)} />
            <KV k="Area" v={`${siteArea} sqm`} />
            <KV k="Cost / sqm" v={formatINR(Math.round(projectCost / Math.max(siteArea, 1)))} />
            <KV k="Tier" v={w.tier} />
          </dl>
        </Section>

        <footer className="border-t pt-4 text-xs text-muted-foreground">
          Generated by Protected Cultivation Advisory. Subsidy estimates are indicative —
          confirm with implementing agency before applying.
        </footer>
      </article>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 font-mono text-xs text-primary">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded border p-2">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd className="font-mono text-sm font-semibold">{v}</dd>
    </div>
  );
}
