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
      if (cached) {
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

            const matched = [butwal, tilottama, omsatiya, siddharthanagar].find(
              (gj) => turf.booleanPointInPolygon(point, gj)
            );

            const name = matched?.properties?.GaPa_NaPa || "Unknown";

            // Cache result in Zustand
            setLocalGov(name);
            setLocalGovState(name);
            setLoading(false);
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









