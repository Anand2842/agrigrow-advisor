const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

const STATE_MAP: Record<string, string> = {
  "UTTAR PRADESH": "UP",
  "MADHYA PRADESH": "MP",
  "MAHARASHTRA": "MH",
  "UTTARAKHAND": "UK",
  "HIMACHAL PRADESH": "HP",
};

// Maps Nominatim district names to actual database IDs
// Generated from district_climate table (188 districts, 5 states)
const DISTRICT_DB_MAP: Record<string, Record<string, string>> = {
  UP: {
    "AGRA": "UP01", "ALIGARH": "UP02", "AMBEDKAR NAGAR": "UP03", "AMETHI": "UP04",
    "AMROHA": "UP05", "AURAIYA": "UP06", "AYODHYA": "UP07", "AZAMGARH": "UP08",
    "BADAUN": "UP09", "BAGHPAT": "UP10", "BAHRAICH": "UP11", "BALRAMPUR": "UP12",
    "BALLIA": "UP13", "BANDA": "UP14", "BARABANKI": "UP15", "BAREILLY": "UP16",
    "BASTI": "UP17", "BHADOHI": "UP18", "BIJNOR": "UP19", "BULANDSHAHR": "UP20",
    "CHANDAULI": "UP21", "CHITRAKOOT": "UP22", "DEORIA": "UP23", "ETAH": "UP24",
    "ETAWAH": "UP25", "FARRUKHABAD": "UP26", "FATEHPUR": "UP27", "FIROZABAD": "UP28",
    "GAUTAM BUDDHA NAGAR": "UP29", "GHAZIABAD": "UP30", "GHAZIPUR": "UP31",
    "GONDA": "UP32", "GORAKHPUR": "UP33", "HAMIRPUR": "UP34", "HAPUR": "UP35",
    "HARDOI": "UP36", "HATHRAS": "UP37", "JALAUN": "UP38", "JAUNPUR": "UP39",
    "JHANSI": "UP40", "KANNAUJ": "UP41", "KANPUR DEHAT": "UP42", "KANPUR NAGAR": "UP43",
    "KASGANJ": "UP44", "KAUSHAMBI": "UP45", "KUSHINAGAR": "UP46", "LAKHIMPUR KHERI": "UP47",
    "LALITPUR": "UP48", "LUCKNOW": "UP49", "MAHARAJGANJ": "UP50", "MAHOBA": "UP51",
    "MAINPURI": "UP52", "MATHURA": "UP53", "MAU": "UP54", "MEERUT": "UP55",
    "MIRZAPUR": "UP56", "MORADABAD": "UP57", "MUZAFFARNAGAR": "UP58", "PILIBHIT": "UP59",
    "PRATAPGARH": "UP60", "PRAYAGRAJ": "UP61", "RAEBARELI": "UP62", "RAMPUR": "UP63",
    "SAHARANPUR": "UP64", "SAMBHAL": "UP65", "SANT KABIR NAGAR": "UP66",
    "SHAHJAHANPUR": "UP67", "SHAMLI": "UP68", "SHRAVASTI": "UP69",
    "SIDDHARTHNAGAR": "UP70", "SITAPUR": "UP71", "SONBHADRA": "UP72",
    "SULTANPUR": "UP73", "UNNAO": "UP74", "VARANASI": "UP75",
    // Nominatim aliases
    "NOIDA": "UP29", "GREATER NOIDA": "UP29", "Ghaziabad": "UP30",
    "ALLAHABAD": "UP61",
  },
  MP: {
    "AGAR MALWA": "MP01", "ALIRAJPUR": "MP02", "ANUPPUR": "MP03", "ASHOKNAGAR": "MP04",
    "BALAGHAT": "MP05", "BARWANI": "MP06", "BETUL": "MP07", "BHIND": "MP08",
    "BHOPAL": "MP09", "BURHANPUR": "MP10", "CHHATARPUR": "MP11", "CHHINDWARA": "MP12",
    "DAMOH": "MP13", "DATIA": "MP14", "DEWAS": "MP15", "DHAR": "MP16",
    "DINDORI": "MP17", "GUNA": "MP18", "GWALIOR": "MP19", "HARDA": "MP20",
    "NARMADAPURAM": "MP21", "INDORE": "MP22", "JABALPUR": "MP23", "JHABUA": "MP24",
    "KATNI": "MP25", "KHANDWA": "MP26", "KHARGONE": "MP27", "MANDLA": "MP28",
    "MANDSAUR": "MP29", "MORENA": "MP30", "NARSINGHPUR": "MP31", "NEEMUCH": "MP32",
    "NIWARI": "MP33", "PANNA": "MP34", "RAISEN": "MP35", "RAJGARH": "MP36",
    "RATLAM": "MP37", "REWA": "MP38", "SAGAR": "MP39", "SATNA": "MP40",
    "SEHORE": "MP41", "SEONI": "MP42", "SHAHDOL": "MP43", "SHAJAPUR": "MP44",
    "SHEOPUR": "MP45", "SHIVPURI": "MP46", "SIDHI": "MP47", "SINGRAULI": "MP48",
    "TIKAMGARH": "MP49", "UJJAIN": "MP50", "UMARIA": "MP51", "VIDISHA": "MP52",
  },
  MH: {
    "AHMEDNAGAR": "MH01", "AKOLA": "MH02", "AMRAVATI": "MH03", "BEED": "MH04",
    "BHANDARA": "MH05", "BULDHANA": "MH06", "CHANDRAPUR": "MH07", "DHULE": "MH08",
    "GADCHIROLI": "MH09", "GONDIA": "MH10", "HINGOLI": "MH11", "JALGAON": "MH12",
    "JALNA": "MH13", "KOLHAPUR": "MH14", "LATUR": "MH15", "MUMBAI CITY": "MH16",
    "MUMBAI SUBURBAN": "MH17", "MUMBAI": "MH17", "NAGPUR": "MH18", "NANDED": "MH19",
    "NANDURBAR": "MH20", "NASHIK": "MH21", "OSMANABAD": "MH22", "PALGHAR": "MH23",
    "PARBHANI": "MH24", "PUNE": "MH25", "RAIGAD": "MH26", "RATNAGIRI": "MH27",
    "SANGLI": "MH28", "SATARA": "MH29", "SINDHUDURG": "MH30", "SOLAPUR": "MH31",
    "THANE": "MH32", "WARDHA": "MH33", "WASHIM": "MH34", "YAVATMAL": "MH35",
    "AURANGABAD": "MH36",
  },
  UK: {
    "ALMORA": "UK01", "BAGESHWAR": "UK02", "CHAMOLI": "UK03", "CHAMPAWAT": "UK04",
    "DEHRADUN": "UK05", "HARIDWAR": "UK06", "NAINITAL": "UK07", "PAURI GARHWAL": "UK08",
    "PITHORAGARH": "UK09", "RUDRAPRAYAG": "UK10", "TEHRI GARHWAL": "UK11",
    "UDHAM SINGH NAGAR": "UK12", "UTTARKASHI": "UK13",
  },
  HP: {
    "BILASPUR": "HP01", "CHAMBA": "HP02", "HAMIRPUR": "HP03", "KANGRA": "HP04",
    "KINNAUR": "HP05", "KULLU": "HP06", "LAHAUL SPITI": "HP07", "LAHAUL-SPITI": "HP07",
    "MANDI": "HP08", "SHIMLA": "HP09", "SIRMAUR": "HP10", "SOLAN": "HP11", "UNA": "HP12",
  },
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

function resolveDistrictId(name: string, stateCode: string | null): { display: string; id: string | null } {
  const upper = name.toUpperCase().trim();

  // Try with state context first (handles ambiguous names like Hamirpur)
  if (stateCode && DISTRICT_DB_MAP[stateCode]?.[upper]) {
    return { display: name, id: DISTRICT_DB_MAP[stateCode][upper] };
  }

  // Fallback: search all states
  for (const state of Object.keys(DISTRICT_DB_MAP)) {
    if (DISTRICT_DB_MAP[state][upper]) {
      return { display: name, id: DISTRICT_DB_MAP[state][upper] };
    }
  }

  // Try fuzzy: strip common suffixes/prefixes
  const cleaned = upper
    .replace(/\bDISTRICT\b/g, "")
    .replace(/\b Nagar\b/g, "")
    .trim();

  if (stateCode && DISTRICT_DB_MAP[stateCode]?.[cleaned]) {
    return { display: name, id: DISTRICT_DB_MAP[stateCode][cleaned] };
  }

  return { display: name, id: null };
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

    const state = stateName ? normalizeState(stateName) : null;
    const district = districtName ? resolveDistrictId(districtName, state?.code ?? null) : null;

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

function normalizeState(name: string): { display: string; code: string | null } {
  const upper = name.toUpperCase().trim();
  const code = STATE_MAP[upper] || null;
  return { display: name, code };
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
