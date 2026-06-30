const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export interface RoadInfo {
  name: string | null;
  type: string;
  distance_m: number;
}

export interface WaterInfo {
  name: string | null;
  type: string;
  distance_m: number;
}

export interface InfrastructureResult {
  roads: { count: number; nearest: RoadInfo | null };
  water: { count: number; nearest: WaterInfo | null };
  buildings: { count: number };
  settlements: { count: number; nearest: { name: string; distance_m: number } | null };
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function elementCenter(el: any): { lat: number; lon: number } | null {
  if (el.lat != null && el.lon != null) {
    return { lat: el.lat, lon: el.lon };
  }
  if (el.center) {
    return { lat: el.center.lat, lon: el.center.lon };
  }
  if (el.geometry?.length > 0) {
    const lats = el.geometry.filter((g: any) => g.lat != null).map((g: any) => g.lat);
    const lons = el.geometry.filter((g: any) => g.lon != null).map((g: any) => g.lon);
    if (lats.length > 0) {
      return {
        lat: lats.reduce((a: number, b: number) => a + b, 0) / lats.length,
        lon: lons.reduce((a: number, b: number) => a + b, 0) / lons.length,
      };
    }
  }
  return null;
}

function nearestDistance(
  lat: number,
  lon: number,
  elements: any[],
): { distance_m: number; element: any } | null {
  let best: { distance_m: number; element: any } | null = null;
  for (const el of elements) {
    const center = elementCenter(el);
    if (!center) continue;
    const d = haversine(lat, lon, center.lat, center.lon);
    if (!best || d < best.distance_m) {
      best = { distance_m: Math.round(d), element: el };
    }
  }
  return best;
}

export async function getNearbyInfrastructure(
  lat: number,
  lon: number,
  radiusM: number = 500,
): Promise<InfrastructureResult> {
  const query = `
[out:json][timeout:25];
(
  way["highway"](around:${radiusM},${lat},${lon});
  way["waterway"](around:${radiusM},${lat},${lon});
  node["building"](around:${radiusM},${lat},${lon});
  node["place"~"village|town"](around:${radiusM},${lat},${lon});
);
out center;
`;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      return {
        roads: { count: 0, nearest: null },
        water: { count: 0, nearest: null },
        buildings: { count: 0 },
        settlements: { count: 0, nearest: null },
      };
    }
    const data = await res.json();
    const elements: any[] = data.elements || [];

    const roads = elements.filter((e) => e.tags?.highway);
    const waterways = elements.filter((e) => e.tags?.waterway);
    const buildings = elements.filter((e) => e.tags?.building);
    const settlements = elements.filter(
      (e) => e.tags?.place === "village" || e.tags?.place === "town",
    );

    const nearestRoad = nearestDistance(lat, lon, roads);
    const nearestWater = nearestDistance(lat, lon, waterways);
    const nearestSettlement = nearestDistance(lat, lon, settlements);

    return {
      roads: {
        count: roads.length,
        nearest: nearestRoad
          ? {
              name: nearestRoad.element.tags?.name || null,
              type: nearestRoad.element.tags?.highway || "unknown",
              distance_m: nearestRoad.distance_m,
            }
          : null,
      },
      water: {
        count: waterways.length,
        nearest: nearestWater
          ? {
              name: nearestWater.element.tags?.name || null,
              type: nearestWater.element.tags?.waterway || "unknown",
              distance_m: nearestWater.distance_m,
            }
          : null,
      },
      buildings: { count: buildings.length },
      settlements: {
        count: settlements.length,
        nearest: nearestSettlement
          ? {
              name: nearestSettlement.element.tags?.name || "Unknown",
              distance_m: nearestSettlement.distance_m,
            }
          : null,
      },
    };
  } catch {
    return {
      roads: { count: 0, nearest: null },
      water: { count: 0, nearest: null },
      buildings: { count: 0 },
      settlements: { count: 0, nearest: null },
    };
  }
}
