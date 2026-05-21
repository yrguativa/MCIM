import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = divIcon({
  className: "bg-transparent",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="white" stroke-width="3"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface LocationMapProps {
  value: string;
  onChange: (value: string) => void;
}

function ClickHandler({ onChange }: { onChange: (value: string) => void }) {
  useMapEvents({
    click(e) {
      const coords = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
      onChange(coords);
    },
  });
  return null;
}

function FitBoundsFromCoords({ value }: { value: string }) {
  const map = useMap();
  useEffect(() => {
    if (!value) return;
    const [latStr, lngStr] = value.split(",").map(s => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return;
    map.setView([lat, lng], map.getZoom() < 15 ? 15 : map.getZoom());
  }, [value, map]);
  return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ value, onChange }) => {
  const [latStr, lngStr] = value ? value.split(",").map(s => s.trim()) : ["", ""];
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  const hasValidCoords = !isNaN(lat) && !isNaN(lng);

  const defaultCenter: [number, number] = hasValidCoords
    ? [lat, lng]
    : [4.60971, -74.08175];

  return (
    <div className="relative z-0 rounded-lg border border-border/60 overflow-hidden shadow-sm transition-all hover:shadow-md h-[200px] md:h-[250px]" style={{ isolation: 'isolate' }}>
      <MapContainer
        center={defaultCenter}
        zoom={hasValidCoords ? 15 : 6}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution=''
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler onChange={onChange} />
        <FitBoundsFromCoords value={value} />
        {hasValidCoords && (
          <Marker position={[lat, lng]} icon={markerIcon} />
        )}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
