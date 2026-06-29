import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import type { SiteIntelligence } from "../lib/api/site-intelligence";

interface ConfirmationCardsProps {
  siteData: SiteIntelligence;
  onConfirm: () => void;
  onEditLocation: () => void;
}

function WarnIcon() {
  return (
    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

function InfoRow({ label, value, edit }: { label: string; value: string | number | null; edit?: () => void }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value ?? "—"}</span>
        {edit && (
          <button onClick={edit} className="text-xs text-blue-600 hover:underline">
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export function ConfirmationCards({ siteData, onConfirm, onEditLocation }: ConfirmationCardsProps) {
  const { location, terrain, infrastructure, area_sqm, perimeter_m, warnings } = siteData;

  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <WarnIcon />
              <span className="text-sm text-amber-800">{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow label="District" value={location.district || "Unknown"} edit={onEditLocation} />
            <InfoRow label="State" value={location.state || "Unknown"} />
            <InfoRow label="Village" value={location.village || "—"} />
            <InfoRow
              label="Coordinates"
              value={`${siteData.raw.lat.toFixed(4)}, ${siteData.raw.lon.toFixed(4)}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Terrain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow label="Elevation" value={terrain.elevation_m != null ? `${terrain.elevation_m}m` : "—"} />
            <InfoRow label="Slope" value={terrain.slope_percent != null ? `${terrain.slope_percent}%` : "—"} />
            <InfoRow label="Aspect" value={terrain.aspect || "—"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              label="Nearest road"
              value={
                infrastructure.roads.nearest
                  ? `${infrastructure.roads.nearest.name || infrastructure.roads.nearest.type} (${infrastructure.roads.nearest.distance_m}m)`
                  : "—"
              }
            />
            <InfoRow
              label="Water source"
              value={
                infrastructure.water.nearest
                  ? `${infrastructure.water.nearest.name || infrastructure.water.nearest.type} (${infrastructure.water.nearest.distance_m}m)`
                  : "—"
              }
            />
            <InfoRow label="Buildings nearby" value={infrastructure.buildings.count} />
            <InfoRow
              label="Settlement"
              value={
                infrastructure.settlements.nearest
                  ? `${infrastructure.settlements.nearest.name} (${infrastructure.settlements.nearest.distance_m}m)`
                  : "—"
              }
            />
          </CardContent>
        </Card>

        {area_sqm != null && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                </svg>
                Field Area
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <InfoRow label="Calculated area" value={`${area_sqm.toLocaleString()} sqm`} />
              <InfoRow label="Perimeter" value={perimeter_m != null ? `${perimeter_m.toLocaleString()}m` : "—"} />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={onConfirm} size="lg" className="px-8">
          Confirm & Continue
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
