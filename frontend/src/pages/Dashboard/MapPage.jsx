import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LocateFixed, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";

function FlyToFocusedIncident({ incident }) {
  const map = useMap();

  useEffect(() => {
    if (incident) {
      map.flyTo([incident.lat, incident.lng], 19, {
        duration: 1.5,
      });
    }
  }, [incident, map]);

  return null;
}

function FlyToUserLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, 16, {
        duration: 1.5,
      });
    }
  }, [location, map]);

  return null;
}

const incidentTypesConfig = [
  { key: "fire", icon: "🔥" },
  { key: "flood", icon: "🌊" },
  { key: "landslide", icon: "🚧" },
  { key: "accident", icon: "🚗" },
  { key: "garbage", icon: "🗑️" },
  { key: "relief", icon: "📦" },
  { key: "other", icon: "❓" },
];

const getIcon = (type) =>
  new L.Icon({
    iconUrl: `/icons/map-icons-red/${type}.svg`,
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const getFocusedIcon = (type) =>
  new L.DivIcon({
    className: "focused-marker-glow",
    html: `<div class='relative'>
             <img src="/icons/map-icons-red/${type}.svg" class="animate-bounce-glow w-12 h-12" />
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -40],
  });

function LocateButton({ onLocate }) {
  const map = useMap();

  const locate = () => {
    map.locate({ setView: false });
    map.once("locationfound", (e) => {
      const latlng = [e.latlng.lat, e.latlng.lng];
      map.flyTo(latlng, 16, {
        duration: 1.5,
      });
      onLocate(e.latlng);
    });
  };
  return (
    <button
      onClick={locate}
      className="absolute bottom-32 right-4 bg-white border border-gray-300 shadow-md rounded-full p-2 z-[1000] hover:scale-110 transition-transform duration-200 cursor-pointer"
      title="Locate Me"
    >
      <LocateFixed size={40} className="text-blue-600" />
    </button>
  );
}

const MapPage = () => {
  const [incidents, setIncidents] = useState([]);
  const { state } = useLocation();
  const focusedIncident = state?.focus;

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await API.get("/api/reports/locations");
        const data = response.data;
        setIncidents(data);
      } catch (error) {
        console.error("Failed to fetch incidents", error);
      }
    }
    fetchIncidents();
  }, []);

  const { t } = useTranslation();
  const [position, setPosition] = useState([27.7111, 83.4681]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(
    Object.fromEntries(incidentTypesConfig.map((i) => [i.key, true]))
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = [latitude, longitude];
        setPosition(latlng);
        setUserLocation(latlng);
      },
      (err) => console.warn("Geolocation failed:", err.message)
    );
  }, []);

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const setAll = (value) => {
    const all = Object.fromEntries(
      incidentTypesConfig.map((i) => [i.key, value])
    );
    setSelectedTypes(all);
  };

  const visibleIncidents = incidents.filter((i) => selectedTypes[i.type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full flex flex-wrap items-center justify-between px-4 py-2 gap-2 border-b dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
          <header className="text-lg font-bold text-blue-700 dark:text-blue-400">
            {t("map.title")}
          </header>
          <div className="relative w-fit">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded shadow-sm w-full justify-between"
            >
              <span>{t("map.filterLabel")}</span>
              <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 dark:text-gray-200 border dark:border-gray-700 shadow rounded p-3 space-y-2">
                {incidentTypesConfig.map((type) => (
                  <label
                    key={type.key}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes[type.key]}
                      onChange={() => toggleType(type.key)}
                    />
                    <img
                      src={`/icons/map-icons-red/${type.key}.svg`}
                      alt={type.key}
                      className="w-5 h-5"
                    />
                    {t(`incidentTypes.${type.key}`)}
                  </label>
                ))}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setAll(true)}
                    className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded"
                  >
                    <CheckCircle size={14} /> {t("map.selectAll")}
                  </button>
                  <button
                    onClick={() => setAll(false)}
                    className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded"
                  >
                    <XCircle size={14} /> {t("map.clearAll")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={true}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
          style={{ height: "calc(100vh - 120px)", width: "100%" }}
          className="z-0"
        >
          {focusedIncident && (
            <FlyToFocusedIncident incident={focusedIncident} />
          )}
          {!focusedIncident && userLocation && (
            <FlyToUserLocation location={userLocation} />
          )}

          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>{t("map.youAreHere")}</Popup>
            </Marker>
          )}

          <MarkerClusterGroup>
            <AnimatePresence>
              {visibleIncidents.length === 0 && (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 border dark:border-gray-700 rounded shadow px-4 py-2 z-[1000]"
                >
                  {t("map.noIncidents")}
                </motion.div>
              )}

              {visibleIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <Marker
                    position={[incident.lat, incident.lng]}
                    icon={
                      focusedIncident?.id === incident.id
                        ? getFocusedIcon(incident.type)
                        : getIcon(incident.type)
                    }
                  >
                    <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                      {incident.title}
                    </Tooltip>

                    <Popup>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1"
                      >
                        <strong>{incident.title}</strong>
                        <div>{incident.time}</div>
                        <button
                          onClick={() => {
                            const destination = `${incident.lat},${incident.lng}`;
                            const url = `https://www.google.com/maps/dir//${destination}`;
                            window.open(url, "_blank");
                          }}
                          className="mt-1 inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition"
                        >
                          {t("map.showPath")}
                        </button>
                      </motion.div>
                    </Popup>
                  </Marker>
                </motion.div>
              ))}
            </AnimatePresence>
          </MarkerClusterGroup>

          <LocateButton
            onLocate={(pos) => setUserLocation([pos.lat, pos.lng])}
          />
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default MapPage;
