// Source for boundary data https://localboundries.oknp.org/

import { useEffect, useState } from "react";
import * as turf from "@turf/turf";
import { useLocalGovStore } from "../stores/localGovStore";

export const useLocalGovernment = () => {
  const [loading, setLoading] = useState(true);
  const { getLocalGov, setLocalGov } = useLocalGovStore();
  const [localGov, setLocalGovState] = useState(getLocalGov());

  useEffect(() => {
    const detectLocalGov = async () => {
      // Use cached value if available
      const cached = getLocalGov();
      if (cached && !["Unknown", "Detection Failed", "Location Access Denied"].includes(cached)) {
        setLocalGovState(cached);
        setLoading(false);
        return;
      }

      try {
        // Load all boundaries
        const [butwal, tilottama, omsatiya, siddharthanagar] =
          await Promise.all([
            fetch("/geojson/butwal.json").then((res) => res.json()),
            fetch("/geojson/tilottama.json").then((res) => res.json()),
            fetch("/geojson/omsatiya.json").then((res) => res.json()),
            fetch("/geojson/siddharthanagar.json").then((res) => res.json()),
          ]);

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const point = turf.point([
              pos.coords.longitude,
              pos.coords.latitude,
            ]);
            console.log("📍 User Coordinates:", pos.coords.longitude, pos.coords.latitude);

            const allFeatures = [butwal, tilottama, omsatiya, siddharthanagar].flatMap(
              (gj) => (gj.type === "FeatureCollection" ? gj.features : [gj])
            );

            const matched = allFeatures.find((f) => {
              if (f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon") {
                return turf.booleanPointInPolygon(point, f);
              }
              return false;
            });

            let name = matched?.properties?.GaPa_NaPa || "Unknown";
            
            // If the user's location is outside the local GeoJSON regions, use OpenStreetMap 
            // Reverse Geocoding to fetch their REAL-TIME municipality/city anywhere in the world.
            if (name === "Unknown") {
              fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`)
                .then(res => res.json())
                .then(data => {
                  const realTimeName = data?.address?.city || data?.address?.town || data?.address?.municipality || data?.address?.county || data?.address?.state || "Unknown Location";
                  console.log("📍 Real-Time Location Fetched:", realTimeName);
                  setLocalGov(realTimeName);
                  setLocalGovState(realTimeName);
                  setLoading(false);
                })
                .catch(err => {
                  console.error("OSM Reverse Geocoding Failed:", err);
                  setLocalGov("Unknown");
                  setLocalGovState("Unknown");
                  setLoading(false);
                });
            } else {
              console.log("📍 Deduced Local Government:", name);
              // Cache result in Zustand
              setLocalGov(name);
              setLocalGovState(name);
              setLoading(false);
            }
          },
          (err) => {
            console.error("Geolocation Error", err.message);
            setLocalGov("Location Access Denied");
            setLocalGovState("Location Access Denied");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Boundary fetch failed", err);
        setLocalGov("Detection Failed");
        setLocalGovState("Detection Failed");
        setLoading(false);
      }
    };

    detectLocalGov();
  }, []);

  return { localGov, loading };
};









