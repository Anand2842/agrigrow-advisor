import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useWizard, type StateCode } from "@/lib/wizard-store";
import { districtsByStateQuery, districtClimateQuery, stateFullName } from "@/lib/queries";
import { WizardSteps } from "@/components/wizard-steps";
import { ArrowRight, Cloud, Droplets, Wind, Thermometer } from "lucide-react";

export const Route = createFileRoute("/district")({
  head: () => ({
    meta: [
      { title: "Select District — PCA" },
      { name: "description", content: "Select your state and district to begin." },
    ],
  }),
  component: DistrictPage,
});

const STATES: { code: StateCode; label: string }[] = [
  { code: "UP", label: "Uttar Pradesh" },
  { code: "MP", label: "Madhya Pradesh" },
  { code: "MH", label: "Maharashtra" },
];

function avg(...vals: (number | null | undefined)[]) {
  const xs = vals.filter((v): v is number => typeof v === "number");
  if (!xs.length) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function DistrictPage() {
  const { state, districtId, districtName, setState, setDistrict } = useWizard();
  const districts = useQuery(districtsByStateQuery(state));
  const climate = useQuery(districtClimateQuery(districtId));

  return (
    <>
      <WizardSteps />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold">Select your district</h1>
        <p className="mt-1 text-muted-foreground">
          We use district-level climate data to recommend the right structure.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">State</span>
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={state ?? ""}
              onChange={(e) => setState((e.target.value || null) as StateCode | null)}
            >
              <option value="">Choose a state…</option>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">District</span>
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm disabled:opacity-50"
              value={districtId ?? ""}
              disabled={!state || districts.isLoading}
              onChange={(e) => {
                const id = e.target.value || null;
                const name = districts.data?.find((d) => d.district_id === id)?.district_name ?? null;
                setDistrict(id, name);
              }}
            >
              <option value="">
                {state ? (districts.isLoading ? "Loading…" : "Choose a district…") : "Pick a state first"}
              </option>
              {(districts.data ?? []).map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.district_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {climate.data && (
          <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold">
                  {districtName}, {state ? stateFullName(state) : ""}
                </h2>
                {climate.data.agro_climatic_zone && (
                  <p className="text-sm text-muted-foreground">
                    Agro-climatic zone: <span className="font-medium">{climate.data.agro_climatic_zone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ClimateStat
                icon={<Thermometer className="h-4 w-4" />}
                label="Avg max temp"
                value={
                  (() => {
                    const v = avg(
                      climate.data.temp_max_avg_jan,
                      climate.data.temp_max_avg_apr,
                      climate.data.temp_max_avg_jul,
                      climate.data.temp_max_avg_oct,
                    );
                    return v == null ? "—" : `${v.toFixed(1)}°C`;
                  })()
                }
              />
              <ClimateStat
                icon={<Thermometer className="h-4 w-4" />}
                label="Avg min temp"
                value={
                  (() => {
                    const v = avg(
                      climate.data.temp_min_avg_jan,
                      climate.data.temp_min_avg_apr,
                      climate.data.temp_min_avg_jul,
                      climate.data.temp_min_avg_oct,
                    );
                    return v == null ? "—" : `${v.toFixed(1)}°C`;
                  })()
                }
              />
              <ClimateStat
                icon={<Droplets className="h-4 w-4" />}
                label="Annual rainfall"
                value={
                  climate.data.annual_rainfall_avg != null
                    ? `${Math.round(climate.data.annual_rainfall_avg)} mm`
                    : "—"
                }
              />
              <ClimateStat
                icon={<Wind className="h-4 w-4" />}
                label="Max wind"
                value={
                  climate.data.wind_speed_max_recorded != null
                    ? `${climate.data.wind_speed_max_recorded} km/h`
                    : "—"
                }
              />
              <ClimateStat
                icon={<Cloud className="h-4 w-4" />}
                label="Fog days (Jan/Dec)"
                value={`${climate.data.fog_days_jan ?? 0} / ${climate.data.fog_days_dec ?? 0}`}
              />
              <ClimateStat
                icon={<Droplets className="h-4 w-4" />}
                label="RH (morning, Jul)"
                value={
                  climate.data.rh_morning_avg_jul != null
                    ? `${Math.round(climate.data.rh_morning_avg_jul)}%`
                    : "—"
                }
              />
              {climate.data.coastal_corrosion_factor != null && (
                <ClimateStat
                  icon={<Wind className="h-4 w-4" />}
                  label="Coastal corrosion"
                  value={`${climate.data.coastal_corrosion_factor}×`}
                />
              )}
              {climate.data.cyclone_risk && (
                <ClimateStat
                  icon={<Wind className="h-4 w-4" />}
                  label="Cyclone risk"
                  value={climate.data.cyclone_risk}
                />
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Link
            to="/crop"
            disabled={!districtId}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={!districtId}
          >
            Next: Select Crop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

function ClimateStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 font-mono text-lg font-semibold">{value}</div>
    </div>
  );
}
