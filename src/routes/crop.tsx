import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useWizard } from "@/lib/wizard-store";
import { cropsAllQuery } from "@/lib/queries";
import { WizardSteps } from "@/components/wizard-steps";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/crop")({
  head: () => ({
    meta: [
      { title: "Select Crops — PCA" },
      { name: "description", content: "Pick one or more crops to plan for." },
    ],
  }),
  component: CropPage,
});

function CropPage() {
  const { state, cropIds, toggleCrop, siteElevation, siteSlope, manualAnswers } = useWizard();
  const crops = useQuery(cropsAllQuery());

  const soilType = manualAnswers.soilType;

  return (
    <>
      <WizardSteps />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">Choose your crops</h1>
            <p className="mt-1 text-muted-foreground">
              Select one or more crops you plan to grow under cover.
            </p>
          </div>
          <span className="rounded-full border bg-muted px-3 py-1 text-xs">
            {cropIds.length} selected
          </span>
        </div>

        {(siteElevation != null || soilType) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {siteElevation != null && siteElevation > 1500 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs text-blue-700">
                High altitude ({siteElevation}m) — some crops may not thrive
              </span>
            )}
            {soilType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-700">
                Soil: {soilType}
              </span>
            )}
            {siteSlope != null && siteSlope > 5 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs text-red-700">
                Slope: {siteSlope}% — consider erosion-resistant crops
              </span>
            )}
          </div>
        )}

        {crops.isLoading && <p className="mt-8 text-muted-foreground">Loading crops…</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(crops.data ?? []).map((c) => {
            const selected = cropIds.includes(c.crop_id);
            const seasonKey =
              state === "UP" ? "planting_season_up" : state === "MP" ? "planting_season_mp" : state === "MH" ? "planting_season_mh" : "planting_season_up";
            const season = seasonKey ? (c as Record<string, unknown>)[seasonKey] : null;
            const priceKey =
              state === "UP" ? "msp_or_market_rate_up" : state === "MP" ? "msp_or_market_rate_mp" : state === "MH" ? "msp_or_market_rate_mh" : "msp_or_market_rate_up";
            const price = priceKey ? (c as Record<string, unknown>)[priceKey] : null;

            const isHighAltitudeIncompatible = siteElevation != null && siteElevation > 2000 &&
              (c.crop_id === "C011" || c.crop_id === "C009");

            return (
              <button
                key={c.crop_id}
                type="button"
                onClick={() => toggleCrop(c.crop_id)}
                disabled={isHighAltitudeIncompatible}
                className={`relative rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary hover:shadow ${
                  selected ? "ring-2 ring-primary border-primary" : ""
                } ${isHighAltitudeIncompatible ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {selected && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {c.crop_category ?? "Crop"}
                </div>
                <h3 className="mt-1 text-lg font-semibold">{c.crop_name_common}</h3>
                {c.crop_name_botanical && (
                  <p className="text-xs italic text-muted-foreground">{c.crop_name_botanical}</p>
                )}
                <dl className="mt-3 space-y-1 text-sm">
                  {c.temp_day_optimal_min != null && c.temp_day_optimal_max != null && (
                    <Row k="Day temp" v={`${c.temp_day_optimal_min}–${c.temp_day_optimal_max}°C`} />
                  )}
                  {c.total_crop_duration != null && (
                    <Row k="Duration" v={`${c.total_crop_duration} days`} />
                  )}
                  {typeof season === "string" && season && <Row k="Season" v={season} />}
                  {typeof price === "number" && (
                    <Row k="Market rate" v={`₹${Math.round(price)}/qtl`} />
                  )}
                </dl>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/recommendations"
            aria-disabled={cropIds.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Next: Get Recommendations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
