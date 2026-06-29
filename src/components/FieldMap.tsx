import { useEffect, useRef, useState, useCallback } from "react";

interface FieldMapProps {
  onLocationSelect: (lat: number, lon: number) => void;
  onPolygonDraw?: (polygon: [number, number][]) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export function FieldMap({
  onLocationSelect,
  onPolygonDraw,
  initialCenter = [20.5937, 78.9629],
  initialZoom = 5,
}: FieldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);
  const polygonPointsRef = useRef<any[]>([]);
  const polygonLayerRef = useRef<any | null>(null);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e: any) => {
        if (isDrawingPolygon) {
          handlePolygonClick(e.latlng, L);
        } else {
          handlePinClick(e.latlng, L);
        }
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handler = async (e: any) => {
      const L = (await import("leaflet")).default;
      if (isDrawingPolygon) {
        handlePolygonClick(e.latlng, L);
      } else {
        handlePinClick(e.latlng, L);
      }
    };

    map.off("click");
    map.on("click", handler);
  }, [isDrawingPolygon]);

  const handlePinClick = useCallback(
    async (latlng: any, L: any) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      const icon = L.divIcon({
        className: "custom-pin",
        html: `<div style="background:#2563EB;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(latlng, { icon }).addTo(map);
      marker.bindPopup(`Lat: ${latlng.lat.toFixed(4)}, Lon: ${latlng.lng.toFixed(4)}`).openPopup();
      markerRef.current = marker;

      onLocationSelect(latlng.lat, latlng.lng);
    },
    [onLocationSelect],
  );

  const handlePolygonClick = useCallback(
    async (latlng: any, L: any) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      polygonPointsRef.current.push(latlng);
      const pts: [number, number][] = polygonPointsRef.current.map((p: any) => [p.lat, p.lng]);
      setPolygonPoints(pts);

      if (polygonLayerRef.current) {
        map.removeLayer(polygonLayerRef.current);
      }

      if (pts.length >= 3) {
        polygonLayerRef.current = L.polygon(pts, {
          color: "#2563EB",
          fillColor: "#2563EB",
          fillOpacity: 0.15,
          weight: 2,
        }).addTo(map);
      } else {
        polygonLayerRef.current = L.polyline(pts, {
          color: "#2563EB",
          weight: 2,
          dashArray: "5,5",
        }).addTo(map);
      }

      L.circleMarker(latlng, {
        radius: 5,
        color: "#2563EB",
        fillColor: "#2563EB",
        fillOpacity: 1,
      }).addTo(map);
    },
    [],
  );

  const handleCompletePolygon = useCallback(() => {
    if (polygonPointsRef.current.length >= 3 && onPolygonDraw) {
      const pts: [number, number][] = polygonPointsRef.current.map((p: any) => [p.lat, p.lng]);
      onPolygonDraw(pts);
    }
    setIsDrawingPolygon(false);
  }, [onPolygonDraw]);

  const handleClearPolygon = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }
    polygonPointsRef.current = [];
    setPolygonPoints([]);
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;
        if (map) {
          map.setView([latitude, longitude], 14);
        }
        import("leaflet").then(({ default: L }) => {
          handlePinClick(L.latLng(latitude, longitude), L);
        });
      },
      () => {},
    );
  }, [handlePinClick]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full rounded-lg border border-slate-200" style={{ height: "500px" }} />

      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleUseCurrentLocation}
          className="bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-slate-50 flex items-center gap-1.5"
          title="Use current location"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          My Location
        </button>

        <button
          onClick={() => {
            setIsDrawingPolygon(!isDrawingPolygon);
            if (isDrawingPolygon) {
              handleCompletePolygon();
            }
          }}
          className={`px-3 py-2 rounded-lg shadow-md text-sm font-medium flex items-center gap-1.5 ${
            isDrawingPolygon
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-slate-50"
          }`}
          title={isDrawingPolygon ? "Finish drawing" : "Draw field boundary"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isDrawingPolygon ? "Done" : "Draw Area"}
        </button>

        {(polygonPoints.length > 0 || markerRef.current) && (
          <button
            onClick={() => {
              handleClearPolygon();
              if (markerRef.current && mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer(markerRef.current);
                markerRef.current = null;
              }
            }}
            className="bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-slate-50 flex items-center gap-1.5 text-red-600"
            title="Clear selection"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {isDrawingPolygon && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
          Click to place points. {polygonPoints.length < 3
            ? `Need ${3 - polygonPoints.length} more point${3 - polygonPoints.length !== 1 ? "s" : ""} to form polygon.`
            : "Click 'Done' when finished."}
        </div>
      )}

      <style>{`
        .custom-pin { background: transparent; border: none; }
        .leaflet-popup-content-wrapper { border-radius: 8px; }
      `}</style>
    </div>
  );
}
