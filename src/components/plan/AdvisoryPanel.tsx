import { Link } from "@tanstack/react-router";
import { useWizard } from "@/lib/wizard-store";
import { useAdvisory } from "@/lib/advisory";
import { formatINR } from "@/lib/bom";
import { stateFullName } from "@/lib/queries";
import {
  AlertTriangle, TrendingUp, FileText, ExternalLink, CheckCircle2,
} from "lucide-react";

export function AdvisoryPanel() {
  const { site } = useWizard();
  const advisory = useAdvisory();

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground">No advisory yet</h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Drop a pin on the map to get started.
        </p>
      </div>
    );
  }

  if (advisory.isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const structure = advisory.selectedStructure;
  const topWarnings = advisory.allWarnings.slice(0, 3);
  const eligibleSubsidies = advisory.subsidyResults.filter((r) => r.eligible);
  const costPerSqm = advisory.projectCost > 0 && site.areaSqm
    ? advisory.projectCost / Math.max(site.areaSqm, 1)
    : 0;

  return (
    <div className="space-y-4">
      {/* Headline */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {site.districtName}{site.stateCode ? `, ${stateFullName(site.stateCode)}` : ""}
            </p>
            <h3 className="text-lg font-bold mt-0.5">
              {structure?.structure_name ?? "Select a structure"}
            </h3>
            {structure && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {structure.structure_category}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold font-mono text-primary">
              {formatINR(advisory.projectCost)}
            </div>
            <div className="text-[10px] text-muted-foreground">materials cost</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-muted/50 p-2">
            <div className="text-xs text-muted-foreground">Cost/sqm</div>
            <div className="font-mono text-sm font-semibold">{formatINR(Math.round(costPerSqm))}</div>
          </div>
          <div className="rounded bg-secondary/10 p-2">
            <div className="text-xs text-muted-foreground">Subsidy</div>
            <div className="font-mono text-sm font-semibold text-secondary">{formatINR(advisory.totalSubsidy)}</div>
          </div>
          <div className="rounded bg-muted/50 p-2">
            <div className="text-xs text-muted-foreground">Your share</div>
            <div className="font-mono text-sm font-semibold">{formatINR(advisory.farmerShare)}</div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {topWarnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            Warnings
          </div>
          <ul className="mt-1.5 space-y-0.5">
            {topWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-700 flex items-start gap-1">
                <span className="shrink-0 mt-0.5">·</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Crops */}
      {advisory.selectedCrops.length > 0 && (
        <div className="rounded-lg border bg-card p-3">
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Selected Crops</h4>
          <div className="flex flex-wrap gap-1">
            {advisory.selectedCrops.map((c) => (
              <span
                key={c.crop_id}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {c.crop_name_common}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subsidy Summary */}
      {eligibleSubsidies.length > 0 && (
        <div className="rounded-lg border bg-card p-3">
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Eligible Subsidies</h4>
          <div className="space-y-1.5">
            {eligibleSubsidies.slice(0, 3).map((r) => (
              <div key={r.scheme.scheme_id} className="flex items-center justify-between text-xs">
                <span className="truncate flex-1">{r.scheme.scheme_name}</span>
                <span className="shrink-0 font-mono font-medium text-secondary ml-2">
                  {formatINR(r.estimatedAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOM Preview */}
      {advisory.bom && advisory.bom.byCategory.length > 0 && (
        <div className="rounded-lg border bg-card p-3">
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Cost Breakdown</h4>
          <div className="space-y-1.5">
            {advisory.bom.byCategory.slice(0, 4).map((c) => {
              const pct = (c.total / advisory.bom!.totalCost) * 100;
              return (
                <div key={c.category}>
                  <div className="flex justify-between text-xs">
                    <span className="truncate">{c.category}</span>
                    <span className="shrink-0 font-mono ml-2">{formatINR(c.total)}</span>
                  </div>
                  <div className="mt-0.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to="/report"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition"
        >
          <FileText className="h-4 w-4" />
          Full Report
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition"
        >
          Print
        </button>
      </div>
    </div>
  );
}
