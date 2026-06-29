import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useWizard, type StateCode } from "@/lib/wizard-store";
import { districtsByStateQuery, districtClimateQuery, stateFullName } from "@/lib/queries";
import { analyzeSite, type SiteIntelligence } from "@/lib/api/site-intelligence";
import { WizardSteps } from "@/components/wizard-steps";
import { ConfirmationCards } from "@/components/ConfirmationCards";
import { SevenQuestions, type ManualAnswers } from "@/components/SevenQuestions";
import { ArrowRight, Cloud, Droplets, Wind, Thermometer, MapPin, ChevronDown } from "lucide-react";

const FieldMap = lazy(() =>
  import("@/components/FieldMap").then((m) => ({ default: m.FieldMap }))
);

export const Route = createFileRoute("/district")({
  head: () => ({
    meta: [
      { title: "Site Analysis — PCA" },
      { name: "description", content: "Pin your field location on the map to begin." },
    ],
  }),
  component: DistrictPage,
});

const STATES: { code: StateCode; label: string }[] = [
  { code: "UP", label: "Uttar Pradesh" },
  { code: "MP", label: "Madhya Pradesh" },
  { code: "MH", label: "Maharashtra" },
  { code: "UK", label: "Uttarakhand" },
  { code: "HP", label: "Himachal Pradesh" },
];

type Step = "map" | "confirm" | "questions" | "manual";

function avg(...vals: (number | null | undefined)[]) {
  const xs = vals.filter((v): v is number => typeof v === "number");
  if (!xs.length) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function DistrictPage() {
  const wizard = useWizard();
  const {
    state, districtId, districtName,
    siteLat, siteLon, sitePolygon, siteIntelligenceComplete,
    setState, setDistrict, setSiteLocation, setSitePolygon,
    setSiteTerrain, setSiteInfrastructure, setSiteAreaSqm,
    setSiteConfidence, setSiteWarnings, setManualAnswers, markSiteComplete,
  } = wizard;

  const [step, setStep] = useState<Step>(
    siteIntelligenceComplete ? "confirm" : "map",
  );
  const [siteData, setSiteData] = useState<SiteIntelligence | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [poly, setPoly] = useState<[number, number][] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const districts = useQuery(districtsByStateQuery(state));
  const climate = useQuery(districtClimateQuery(districtId));

  const handleLocationSelect = useCallback(async (lat: number, lon: number) => {
    setSiteLocation(lat, lon);
    setIsAnalyzing(true);
    setApiError(null);
    try {
      const data = await analyzeSite(lat, lon, poly);
      setSiteData(data);
      setSitePolygon(poly);

      if (data.location.stateCode) {
        setState(data.location.stateCode as StateCode);
      }
      if (data.location.districtId) {
        setDistrict(data.location.districtId, data.location.district);
      }

      setSiteTerrain(data.terrain.elevation_m, data.terrain.slope_percent, data.terrain.aspect);
      setSiteInfrastructure(data.infrastructure as unknown as Record<string, unknown>);
      setSiteAreaSqm(data.area_sqm);
      setSiteConfidence(data.confidence);
      setSiteWarnings(data.warnings);

      setStep("confirm");
    } catch (err) {
      setApiError("Could not analyze location. You can select your district manually below.");
      setIsAnalyzing(false);
    }
  }, [poly, setState, setDistrict, setSiteLocation, setSitePolygon, setSiteTerrain, setSiteInfrastructure, setSiteAreaSqm, setSiteConfidence, setSiteWarnings]);

  const handlePolygonDraw = useCallback((polygon: [number, number][]) => {
    setPoly(polygon);
  }, []);

  const handleConfirm = useCallback(() => {
    setStep("questions");
  }, []);

  const handleQuestionsComplete = useCallback((answers: ManualAnswers) => {
    setManualAnswers(answers);
    markSiteComplete();
    setStep("map");
  }, [setManualAnswers, markSiteComplete]);

  const handleEditLocation = useCallback(() => {
    setShowManual(true);
  }, []);

  const handleManualDistrictSelect = useCallback((id: string | null, name: string | null) => {
    setDistrict(id, name);
  }, [setDistrict]);

  return (
    <>
      <WizardSteps />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold">Pin your field location</h1>
        <p className="mt-1 text-muted-foreground">
          Click on the map to drop a pin. We'll auto-detect your district, terrain, and nearby infrastructure.
        </p>

        {!siteIntelligenceComplete && (
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center rounded-lg border bg-muted/30" style={{ height: "500px" }}>
                  <div className="text-center">
                    <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              }
            >
              <FieldMap
                onLocationSelect={handleLocationSelect}
                onPolygonDraw={handlePolygonDraw}
                initialCenter={siteLat && siteLon ? [siteLat, siteLon] : undefined}
                initialZoom={siteLat && siteLon ? 14 : 5}
              />
            </Suspense>
          </div>
        )}

        {isAnalyzing && (
          <div className="mt-6 flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">
              Analyzing location — checking elevation, infrastructure, and district...
            </span>
          </div>
        )}

        {apiError && (
          <div className="mt-6 rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{apiError}</p>
            <button
              onClick={() => setShowManual(true)}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Select manually →
            </button>
          </div>
        )}

        {step === "confirm" && siteData && (
          <div className="mt-6">
            <ConfirmationCards
              siteData={siteData}
              onConfirm={handleConfirm}
              onEditLocation={handleEditLocation}
            />
          </div>
        )}

        {step === "questions" && (
          <div className="mt-6">
            <SevenQuestions
              onComplete={handleQuestionsComplete}
              initialAnswers={wizard.manualAnswers}
            />
          </div>
        )}

        {showManual && (
          <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Select Location Manually</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">State</span>
                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={state ?? ""}
                  onChange={(e) => setState((e.target.value || null) as StateCode | null)}
                >
                  <option value="">Choose a state...</option>
                  {STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.label}</option>
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
                    handleManualDistrictSelect(id, name);
                  }}
                >
                  <option value="">
                    {state ? (districts.isLoading ? "Loading..." : "Choose a district...") : "Pick a state first"}
                  </option>
                  {(districts.data ?? []).map((d) => (
                    <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  if (districtId) {
                    markSiteComplete();
                    setShowManual(false);
                    setStep("map");
                  }
                }}
                disabled={!districtId}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

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

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <MapPin className="h-4 w-4" />
            {showManual ? "Hide manual selection" : "Enter location manually"}
            <ChevronDown className={`h-4 w-4 transition-transform ${showManual ? "rotate-180" : ""}`} />
          </button>

          <Link
            to="/crop"
            disabled={!districtId || !siteIntelligenceComplete}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={!districtId || !siteIntelligenceComplete}
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
