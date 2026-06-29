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
  const { state, cropIds, toggleCrop } = useWizard();
  const crops = useQuery(cropsAllQuery());

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

        {crops.isLoading && <p className="mt-8 text-muted-foreground">Loading crops…</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(crops.data ?? []).map((c) => {
            const selected = cropIds.includes(c.crop_id);
            const seasonKey =
              state === "UP" ? "planting_season_up" : state === "MP" ? "planting_season_mp" : state === "MH" ? "planting_season_mh" : null;
            const season = seasonKey ? (c as Record<string, unknown>)[seasonKey] : null;
            const priceKey =
              state === "UP" ? "msp_or_market_rate_up" : state === "MP" ? "msp_or_market_rate_mp" : state === "MH" ? "msp_or_market_rate_mh" : null;
            const price = priceKey ? (c as Record<string, unknown>)[priceKey] : null;

            return (
              <button
                key={c.crop_id}
                type="button"
                onClick={() => toggleCrop(c.crop_id)}
                className={`relative rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary hover:shadow ${
                  selected ? "ring-2 ring-primary border-primary" : ""
                }`}
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
