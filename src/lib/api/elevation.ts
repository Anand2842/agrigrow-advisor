const OPENTOPO_BASE = "https://api.opentopodata.org/v1";
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

export async function getElevation(
  lat: number,
  lon: number,
): Promise<ElevationResult> {
  const tryOpentopodata = async (): Promise<number | null> => {
    try {
      const url = `${OPENTOPO_BASE}/test-profile?locations=${lat},${lon}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.results?.[0]?.elevation != null) {
        return data.results[0].elevation;
      }
      return null;
    } catch {
      return null;
    }
  };

  const tryOpenElevation = async (): Promise<number | null> => {
    try {
      const url = `${OPEN_ELEVATION_BASE}/lookup?locations=${lat},${lon}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.results?.[0]?.elevation != null) {
        return data.results[0].elevation;
      }
      return null;
    } catch {
      return null;
    }
  };

  let elevation = await tryOpentopodata();
  let source = "opentopodata";

  if (elevation == null) {
    elevation = await tryOpenElevation();
    source = "open-elevation";
  }

  if (elevation == null) {
    return { elevation_m: null, slope_percent: null, aspect: null, source: "none" };
  }

  const trySlope = async (): Promise<{ elevN: number; elevE: number } | null> => {
    try {
      const urlN = `${OPENTOPO_BASE}/test-profile?locations=${lat + 0.001},${lon}`;
      const urlE = `${OPENTOPO_BASE}/test-profile?locations=${lat},${lon + 0.001}`;
      const [resN, resE] = await Promise.all([fetch(urlN), fetch(urlE)]);
      if (!resN.ok || !resE.ok) return null;
      const [dataN, dataE] = await Promise.all([resN.json(), resE.json()]);
      return {
        elevN: dataN.results?.[0]?.elevation ?? elevation!,
        elevE: dataE.results?.[0]?.elevation ?? elevation!,
      };
    } catch {
      return null;
    }
  };

  const slopeData = await trySlope();
  let slopePercent: number | null = null;
  let aspect: string | null = null;

  if (slopeData) {
    slopePercent = computeSlope(elevation, slopeData.elevN, slopeData.elevE, lat);
    aspect = computeAspect(elevation, slopeData.elevN, slopeData.elevE);
  }

  return {
    elevation_m: Math.round(elevation * 10) / 10,
    slope_percent: slopePercent,
    aspect,
    source,
  };
}
