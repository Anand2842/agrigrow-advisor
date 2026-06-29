import { reverseGeocode, type NominatimResult } from "./nominatim";
import { getElevation, type ElevationResult } from "./elevation";
import { getNearbyInfrastructure, type InfrastructureResult } from "./overpass";

export interface SiteIntelligence {
  location: NominatimResult;
  terrain: ElevationResult;
  infrastructure: InfrastructureResult;
  area_sqm: number | null;
  perimeter_m: number | null;
  confidence: "high" | "medium" | "low";
  warnings: string[];
  raw: { lat: number; lon: number; polygon: [number, number][] | null };
}

function computePolygonArea(polygon: [number, number][]): number {
  if (polygon.length < 3) return 0;
  let area = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const latI = (polygon[i][0] * Math.PI) / 180;
    const latJ = (polygon[j][0] * Math.PI) / 180;
    const lonI = (polygon[i][1] * Math.PI) / 180;
    const lonJ = (polygon[j][1] * Math.PI) / 180;
    area += (lonJ - lonI) * (2 + Math.sin(latI) + Math.sin(latJ));
  }
  area = Math.abs((area * 6378137 * 6378137) / 2);
  return Math.round(area);
}

function computePolygonPerimeter(polygon: [number, number][]): number {
  if (polygon.length < 2) return 0;
  let perimeter = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const R = 6371000;
    const dLat = ((polygon[j][0] - polygon[i][0]) * Math.PI) / 180;
    const dLon = ((polygon[j][1] - polygon[i][1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((polygon[i][0] * Math.PI) / 180) *
        Math.cos((polygon[j][0] * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    perimeter += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return Math.round(perimeter);
}

export async function analyzeSite(
  lat: number,
  lon: number,
  polygon?: [number, number][] | null,
): Promise<SiteIntelligence> {
  const [location, terrain, infrastructure] = await Promise.all([
    reverseGeocode(lat, lon),
    getElevation(lat, lon),
    getNearbyInfrastructure(lat, lon, 500),
  ]);

  const warnings: string[] = [];
  let confidence: "high" | "medium" | "low" = "high";

  if (!location?.districtId) {
    confidence = "low";
    warnings.push("Could not auto-detect district. Please select manually.");
  } else if (!location?.stateCode) {
    confidence = "medium";
    warnings.push("Could not auto-detect state. Please verify.");
  }

  if (terrain.elevation_m == null) {
    confidence = confidence === "high" ? "medium" : "low";
    warnings.push("Elevation data unavailable. Slope analysis skipped.");
  }

  if (terrain.slope_percent != null && terrain.slope_percent > 5) {
    warnings.push(`Field slope is ${terrain.slope_percent}%. Consider terracing or leveled foundation.`);
  }
  if (terrain.slope_percent != null && terrain.slope_percent > 10) {
    warnings.push("Steep slope detected. Some structure types may not be suitable.");
  }

  if (infrastructure.roads.nearest && infrastructure.roads.nearest.distance_m > 500) {
    warnings.push(
      `Nearest road is ${infrastructure.roads.nearest.distance_m}m away. Material transport costs may increase.`,
    );
  }

  if (infrastructure.water.nearest && infrastructure.water.nearest.distance_m > 1000) {
    warnings.push(
      `Nearest water source is ${infrastructure.water.nearest.distance_m}m away. Irrigation pipe costs will be higher.`,
    );
  }

  if (infrastructure.buildings.count > 10) {
    warnings.push("Multiple buildings nearby. Consider noise and access constraints.");
  }

  let area_sqm: number | null = null;
  let perimeter_m: number | null = null;

  if (polygon && polygon.length >= 3) {
    area_sqm = computePolygonArea(polygon);
    perimeter_m = computePolygonPerimeter(polygon);
  }

  return {
    location: location || {
      district: null,
      districtId: null,
      state: null,
      stateCode: null,
      village: null,
      display_name: "",
      raw_address: {},
    },
    terrain,
    infrastructure,
    area_sqm,
    perimeter_m,
    confidence,
    warnings,
    raw: { lat, lon, polygon: polygon || null },
  };
}
