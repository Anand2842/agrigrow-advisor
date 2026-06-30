const OPEN_ELEVATION_BASE = "https://api.open-elevation.com/api/v1";

export interface ElevationResult {
  elevation_m: number | null;
  slope_percent: number | null;
  aspect: string | null;
  source: string;
}

function computeSlope(
  elevCenter: number,
  elevNorth: number,
  elevEast: number,
  lat: number,
): number {
  const meterPerDegLat = 111320;
  const meterPerDegLon = 111320 * Math.cos((lat * Math.PI) / 180);

  const distNorth = 0.001 * meterPerDegLat;
  const distEast = 0.001 * meterPerDegLon;

  const slopeNS = Math.abs(elevNorth - elevCenter) / distNorth;
  const slopeEW = Math.abs(elevEast - elevCenter) / distEast;

  const slopeRad = Math.atan(Math.sqrt(slopeNS ** 2 + slopeEW ** 2));
  return Math.round((slopeRad * 180) / Math.PI * 10) / 10;
}

function computeAspect(elevCenter: number, elevNorth: number, elevEast: number): string {
  const dN = elevNorth - elevCenter;
  const dE = elevEast - elevCenter;
  const angle = (Math.atan2(dE, dN) * 180) / Math.PI;
  const normalized = (angle + 360) % 360;

  if (normalized < 22.5 || normalized >= 337.5) return "North";
  if (normalized < 67.5) return "Northeast";
  if (normalized < 112.5) return "East";
  if (normalized < 157.5) return "Southeast";
  if (normalized < 202.5) return "South";
  if (normalized < 247.5) return "Southwest";
  if (normalized < 292.5) return "West";
  return "Northwest";
}

async function fetchElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const url = `${OPEN_ELEVATION_BASE}/lookup?locations=${lat},${lon}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results?.[0]?.elevation != null) {
      return data.results[0].elevation;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getElevation(
  lat: number,
  lon: number,
): Promise<ElevationResult> {
  const elevation = await fetchElevation(lat, lon);

  if (elevation == null) {
    return { elevation_m: null, slope_percent: null, aspect: null, source: "none" };
  }

  const elevN = await fetchElevation(lat + 0.001, lon);
  const elevE = await fetchElevation(lat, lon + 0.001);

  let slopePercent: number | null = null;
  let aspect: string | null = null;

  if (elevN != null && elevE != null) {
    slopePercent = computeSlope(elevation, elevN, elevE, lat);
    aspect = computeAspect(elevation, elevN, elevE);
  }

  return {
    elevation_m: Math.round(elevation * 10) / 10,
    slope_percent: slopePercent,
    aspect,
    source: "open-elevation",
  };
}
