import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import { useWizard, type SiteData } from "@/lib/wizard-store";
import { analyzeSite } from "@/lib/api/site-intelligence";
import { MapPin, Crosshair, Trash2 } from "lucide-react";

const FieldMap = lazy(() =>
  import("@/components/FieldMap").then((m) => ({ default: m.FieldMap }))
);

export function SiteMapPanel() {
  const { site, setSite, isAnalyzing, setIsAnalyzing, analysisError, setAnalysisError, clearSite } = useWizard();
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleLocationSelect = useCallback(async (lat: number, lon: number) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setHasInteracted(true);
    try {
      const data = await analyzeSite(lat, lon);
      setSite({
        lat,
        lon,
        polygon: null,
        elevation: data.terrain.elevation_m,
        slope: data.terrain.slope_percent,
        aspect: data.terrain.aspect,
        areaSqm: data.area_sqm,
        perimeter: data.perimeter_m,
        districtId: data.location.districtId,
        districtName: data.location.district,
        stateCode: data.location.stateCode as any,
        confidence: data.confidence,
        warnings: data.warnings,
        infrastructure: data.infrastructure as unknown as Record<string, unknown>,
      });
    } catch (err) {
      setAnalysisError("Could not analyze location. Try a different pin position.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [setSite, setIsAnalyzing, setAnalysisError]);

  const handlePolygonDraw = useCallback((polygon: [number, number][]) => {
    if (site) {
      setSite({ ...site, polygon });
    }
  }, [site, setSite]);

  const handleClear = useCallback(() => {
    clearSite();
    setHasInteracted(false);
  }, [clearSite]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          Field Location
        </h3>
        {site && (
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div className="flex-1 relative min-h-[300px]">
        {isAnalyzing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3 shadow-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Analyzing site...</span>
            </div>
          </div>
        )}

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full bg-muted/30">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <FieldMap
            onLocationSelect={handleLocationSelect}
            onPolygonDraw={handlePolygonDraw}
            initialCenter={site ? [site.lat, site.lon] : undefined}
            initialZoom={site ? 14 : 5}
          />
        </Suspense>
      </div>

      {analysisError && (
        <div className="px-3 py-2 bg-destructive/10 border-t">
          <p className="text-xs text-destructive">{analysisError}</p>
        </div>
      )}

      {site && (
        <div className="px-3 py-2 border-t bg-muted/20 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <Crosshair className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono">{site.lat.toFixed(4)}, {site.lon.toFixed(4)}</span>
            <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
              site.confidence === "high" ? "bg-green-100 text-green-700" :
              site.confidence === "medium" ? "bg-amber-100 text-amber-700" :
              "bg-red-100 text-red-700"
            }`}>
              {site.confidence}
            </span>
          </div>
          {site.districtName && (
            <p className="text-xs text-muted-foreground">
              {site.districtName}{site.stateCode ? `, ${site.stateCode}` : ""}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {site.elevation != null && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{site.elevation}m</span>
            )}
            {site.slope != null && site.slope > 0 && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{site.slope}% slope</span>
            )}
            {site.areaSqm != null && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{site.areaSqm} sqm</span>
            )}
          </div>
        </div>
      )}

      {!site && !hasInteracted && (
        <div className="px-3 py-3 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Click on the map to drop a pin on your field. We'll auto-detect everything.
          </p>
        </div>
      )}
    </div>
  );
}
