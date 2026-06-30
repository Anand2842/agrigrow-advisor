const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

const STATE_MAP: Record<string, string> = {
  "UTTAR PRADESH": "UP",
  "MADHYA PRADESH": "MP",
  "MAHARASHTRA": "MH",
  "UTTARAKHAND": "UK",
  "HIMACHAL PRADESH": "HP",
};

const DISTRICT_NORMALIZE: Record<string, string> = {
  "GAUTAM BUDDHA NAGAR": "d_gautam_buddha_nagar",
  "GAUTAM BUDH NAGAR": "d_gautam_buddha_nagar",
  "NOIDA": "d_gautam_buddha_nagar",
  "GREATER NOIDA": "d_gautam_buddha_nagar",
  "LUCKNOW": "d_lucknow",
  "AGRA": "d_agra",
  "VARANASI": "d_varanasi",
  "PRAYAGRAJ": "d_prayagraj",
  "PRATAPGARH": "d_pratapgarh",
  "ALLAHABAD": "d_prayagraj",
  "INDORE": "d_indore",
  "BHOPAL": "d_bhopal",
  "NAGPUR": "d_nagpur",
  "PUNE": "d_pune",
  "MUMBAI CITY": "d_mumbai_city",
  "MUMBAI": "d_mumbai_city",
  "THANE": "d_thane",
  "NASHIK": "d_nashik",
  "AURANGABAD": "d_aurangabad",
  "NAINITAL": "d_nainital",
  "DEHRADUN": "d_dehradun",
  "SHIMLA": "d_shimla",
  "KANGRA": "d_kangra",
  "MANALI": "d_kullu",
  "KULLU": "d_kullu",
  "HAMIRPUR": "d_hamirpur_hp",
  "MANDI": "d_mandi",
  "SOLAN": "d_solan",
  "UNA": "d_una",
  "BILASPUR_HP": "d_bilaspur_hp",
  "CHAMBA": "d_chamba",
  "KINNAUR": "d_kinnaur",
  "LAHAUL SPITI": "d_lahaul_spiti",
  "SPITI": "d_lahaul_spiti",
};

export interface NominatimResult {
  district: string | null;
  districtId: string | null;
  state: string | null;
  stateCode: string | null;
  village: string | null;
  display_name: string;
  raw_address: Record<string, string>;
}

function normalizeDistrict(name: string): { display: string; id: string | null } {
  const upper = name.toUpperCase().trim();
  const id = DISTRICT_NORMALIZE[upper] || null;
  return { display: name, id };
}

function normalizeState(name: string): { display: string; code: string | null } {
  const upper = name.toUpperCase().trim();
  const code = STATE_MAP[upper] || null;
  return { display: name, code };
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<NominatimResult | null> {
  try {
    const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AgriGrow/2.0 (agrigrow-advisor)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};

    const districtName =
      addr.state_district || addr.county || addr.district || null;
    const stateName = addr.state || null;
    const villageName = addr.village || addr.hamlet || addr.town || null;

    const district = districtName ? normalizeDistrict(districtName) : null;
    const state = stateName ? normalizeState(stateName) : null;

    return {
      district: district?.display || null,
      districtId: district?.id || null,
      state: state?.display || null,
      stateCode: state?.code || null,
      village: villageName,
      display_name: data.display_name || "",
      raw_address: addr,
    };
  } catch {
    return null;
  }
}

export async function searchLocation(
  query: string,
): Promise<Array<{ name: string; lat: number; lon: number; display_name: string }>> {
  if (query.length < 2) return [];
  try {
    const url = `${NOMINATIM_BASE}/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AgriGrow/2.0 (agrigrow-advisor)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: any) => ({
      name: r.display_name.split(",")[0],
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      display_name: r.display_name,
    }));
  } catch {
    return [];
  }
}
