import { useEffect, useRef, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import L, { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./StaysMap.module.scss";

interface Stay {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  location: string;
  price: number;
}

interface StaysMapProps {
  stays: Stay[];
  selectedStayId?: string;
  onMarkerClick?: (stayId: string) => void;
}

export const StaysMap = ({
  stays,
  selectedStayId,
  onMarkerClick,
}: StaysMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const createMarkerIcon = useCallback((isSelected: boolean) => {
    const size = isSelected ? 40 : 32;
    const markerClassName = isSelected
      ? `${styles.mapMarker} ${styles.mapMarkerSelected}`
      : styles.mapMarker;

    return L.divIcon({
      html: `<div class="${markerClassName}">📍</div>`,
      iconSize: [size, size],
      className: styles.markerWrapper,
    });
  }, []);

  const createPopupContent = useCallback(
    (stay: Stay) => `
    <div class="${styles.popupContent}">
      <strong class="${styles.popupTitle}">${stay.name}</strong>
      <span class="${styles.popupLocation}">${stay.location}</span>
      <span class="${styles.popupPrice}">$${stay.price}/night</span>
    </div>
  `,
    [],
  );

  useEffect(() => {
    // Initialize map only once
    if (!map.current && mapContainer.current) {
      map.current = L.map(mapContainer.current, { minZoom: 3 }).setView(
        [20, 0],
        2,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map.current);
    }

    return () => {
      // Don't destroy map on unmount
    };
  }, []);

  // Add/update markers
  useEffect(() => {
    if (!map.current || stays.length === 0) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add markers for all stays
    stays.forEach((stay) => {
      const marker = L.marker([stay.latitude, stay.longitude], {
        icon: createMarkerIcon(stay.id === selectedStayId),
      })
        .bindPopup(createPopupContent(stay))
        .addTo(map.current!);

      marker.on("click", () => {
        onMarkerClick?.(stay.id);
      });

      markersRef.current[stay.id] = marker;
    });

    // Fit map to show all markers
    if (stays.length > 0) {
      const bounds = new LatLngBounds(
        stays.map((stay) => [stay.latitude, stay.longitude]),
      );
      map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 2 });
    }
  }, [
    createMarkerIcon,
    createPopupContent,
    stays,
    selectedStayId,
    onMarkerClick,
  ]);

  // Update marker style when selection changes
  useEffect(() => {
    if (!map.current) return;

    Object.entries(markersRef.current).forEach(([stayId, marker]) => {
      const isSelected = stayId === selectedStayId;
      const newIcon = createMarkerIcon(isSelected);

      marker.setIcon(newIcon);

      // Center map on selected marker
      if (isSelected) {
        const selectedStay = stays.find((stay) => stay.id === stayId);

        if (selectedStay) {
          map.current!.flyTo(
            [selectedStay.latitude, selectedStay.longitude],
            10,
            {
              duration: 0.5,
            },
          );
        }
      }
    });
  }, [createMarkerIcon, selectedStayId, stays]);

  if (stays.length === 0) {
    return (
      <Paper className={styles.emptyStatePaper}>
        <Typography color="text.secondary" className={styles.emptyStateText}>
          No stays to display on map
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      ref={mapContainer}
      className={styles.mapContainer}
      role="application"
      aria-label="Map showing stay locations"
    />
  );
};
