import { createFileRoute, Link } from "@tanstack/react-router";
import { useWizard } from "@/lib/wizard-store";
import { useAdvisory } from "@/lib/advisory";
import { formatINR } from "@/lib/bom";
import { stateFullName } from "@/lib/queries";
import { Printer, ArrowLeft } from "lucide-react";

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
  const { site, overrides } = useWizard();
  const a = useAdvisory();

  const siteArea = site?.areaSqm ?? overrides.areaSqm;
  const siteNum = site ? 1 : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="no-print mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/plan"
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to plan
          </Link>
          <h1 className="text-3xl font-bold">Full Advisory Report</h1>
        </div>
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
            {site?.districtName ?? "—"}
            {site?.stateCode ? `, ${stateFullName(site.stateCode)}` : ""} · Generated{" "}
            {new Date().toLocaleDateString("en-IN")}
          </p>
        </header>

        <Section n={1} title="Executive Summary">
          <p className="text-sm">
            For a <strong>{siteArea} sqm</strong> protected farming project
            {a.selectedStructure ? (
              <>
                {" "}using <strong>{a.selectedStructure.structure_name}</strong>
              </>
            ) : null}
            {site?.districtName ? <> in <strong>{site.districtName}</strong></> : null}, the estimated
            materials cost (Tier {overrides.tier}) is{" "}
            <strong className="font-mono">{formatINR(a.projectCost)}</strong>. Eligible government
            subsidies are estimated at{" "}
            <strong className="font-mono text-secondary">{formatINR(a.totalSubsidy)}</strong>,
            leaving a farmer contribution of{" "}
            <strong className="font-mono">{formatINR(a.farmerShare)}</strong>.
          </p>
          {a.allWarnings.length > 0 && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-semibold text-amber-800 mb-1">Warnings:</p>
              <ul className="list-inside list-disc space-y-0.5 text-xs text-amber-700">
                {a.allWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {site && (
          <Section n={2} title="Site Intelligence">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Location</h4>
                <dl className="space-y-1">
                  <KV k="Coordinates" v={`${site.lat.toFixed(4)}, ${site.lon.toFixed(4)}`} />
                  <KV k="Confidence" v={site.confidence} />
                </dl>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mt-4">Terrain</h4>
                <dl className="space-y-1">
                  <KV k="Elevation" v={site.elevation != null ? `${site.elevation}m` : "—"} />
                  <KV k="Slope" v={site.slope != null ? `${site.slope}%` : "—"} />
                  <KV k="Aspect" v={site.aspect ?? "—"} />
                </dl>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Infrastructure</h4>
                <dl className="space-y-1">
                  {(() => {
                    const infra = site.infrastructure as any;
                    const road = infra?.roads?.nearest;
                    const water = infra?.water?.nearest;
                    const buildings = infra?.buildings?.count ?? 0;
                    return (
                      <>
                        <KV k="Nearest road" v={road ? `${road.name ?? "Road"} (${road.distance_m}m)` : "—"} />
                        <KV k="Water source" v={water ? `${water.name ?? "Source"} (${water.distance_m}m)` : "—"} />
                        <KV k="Buildings nearby" v={String(buildings)} />
                      </>
                    );
                  })()}
                </dl>
              </div>
            </div>
          </Section>
        )}

        <Section n={siteNum + 2} title="District Profile">
          {a.climate ? (
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <KV k="Agro-climatic zone" v={a.climate.agro_climatic_zone ?? "—"} />
              <KV k="Annual rainfall" v={`${Math.round(a.climate.annual_rainfall_avg ?? 0)} mm`} />
              <KV k="Fog days (J/D)" v={`${a.climate.fog_days_jan ?? 0}/${a.climate.fog_days_dec ?? 0}`} />
              <KV k="Max wind" v={`${a.climate.wind_speed_max_recorded ?? "—"} km/h`} />
              <KV k="Cyclone risk" v={a.climate.cyclone_risk ?? "—"} />
              <KV k="Corrosion factor" v={String(a.climate.coastal_corrosion_factor ?? 1)} />
            </dl>
          ) : (
            <p className="text-muted-foreground">No district selected.</p>
          )}
        </Section>

        <Section n={siteNum + 3} title="Crop Recommendations">
          {a.selectedCrops.length === 0 ? (
            <p className="text-muted-foreground">No crops selected.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {a.selectedCrops.map((c: any) => (
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

        <Section n={siteNum + 4} title="Structure Recommendation">
          {a.selectedStructure ? (
            <div className="text-sm">
              <p className="font-semibold">{a.selectedStructure.structure_name}</p>
              <p className="text-muted-foreground">{a.selectedStructure.structure_category}</p>
              {a.selectedStructure.description_plain_language && (
                <p className="mt-2">{a.selectedStructure.description_plain_language}</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No structure selected.</p>
          )}
        </Section>

        <Section n={siteNum + 5} title="Bill of Materials">
          {a.bom ? (
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
                {a.bom.lines.map((l) => (
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
                  <td colSpan={3} className="py-2 text-right font-semibold">Total</td>
                  <td className="py-2 text-right font-mono font-bold">{formatINR(a.bom.totalCost)}</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p className="text-muted-foreground">Materials unavailable.</p>
          )}
        </Section>

        <Section n={siteNum + 6} title="Contractor Verification Checklist">
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Confirm pipe gauge & galvanization (HDG g/sqm) matches Tier {overrides.tier} spec</li>
            <li>Verify film thickness (micron) and UV stabilization grade</li>
            <li>Insist on IS-coded materials wherever listed in the BOM</li>
            <li>Request invoice copies for every line item before final payment</li>
            <li>Inspect foundation depth & anchor bolt diameter on-site</li>
          </ul>
        </Section>

        <Section n={siteNum + 7} title="Month-by-Month Risk Calendar">
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

        <Section n={siteNum + 8} title="Subsidy Application Guide">
          {a.subsidyResults.filter((r) => r.eligible).length === 0 && (
            <p className="text-muted-foreground">No eligible schemes found.</p>
          )}
          <ul className="space-y-2 text-sm">
            {a.subsidyResults.filter((r) => r.eligible).map((r) => (
              <li key={r.scheme.scheme_id} className="rounded border border-secondary/40 bg-secondary/5 p-2">
                <div className="flex justify-between">
                  <strong>{r.scheme.scheme_name}</strong>
                  <span className="font-mono">{formatINR(r.estimatedAmount)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {r.percent}% subsidy · Ceiling: {r.ceiling > 0 ? formatINR(r.ceiling) : "None"}
                </p>
                {r.scheme.implementing_agency && (
                  <p className="text-xs text-muted-foreground">Agency: {r.scheme.implementing_agency}</p>
                )}
                {r.scheme.documentation_required && (
                  <p className="text-xs text-muted-foreground">Docs: {r.scheme.documentation_required}</p>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section n={siteNum + 9} title="ROI Summary">
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <KV k="Project cost" v={formatINR(a.projectCost)} />
            <KV k="Subsidy" v={formatINR(a.totalSubsidy)} />
            <KV k="Farmer share" v={formatINR(a.farmerShare)} />
            <KV k="Area" v={`${siteArea} sqm`} />
            <KV k="Cost / sqm" v={formatINR(Math.round(a.projectCost / Math.max(siteArea, 1)))} />
            <KV k="Tier" v={overrides.tier} />
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
