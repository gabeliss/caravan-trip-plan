import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Destination, Campground } from '../types';

interface MapProps {
  destination: Destination;
  selectedCampgrounds?: Campground[];
}

export const Map: React.FC<MapProps> = ({ destination, selectedCampgrounds = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const labelMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      setError('Mapbox token is missing');
      return;
    }

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: destination.coordinates,
        zoom: 7
      });

      map.current.on('load', () => {
        if (!map.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        labelMarkersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        labelMarkersRef.current = [];

        const validCampgrounds = selectedCampgrounds.filter(
          (campground): campground is Campground =>
            Boolean(
              campground &&
              campground.coordinates &&
              Array.isArray(campground.coordinates) &&
              campground.coordinates.length === 2
            )
        );

        if (validCampgrounds.length > 0) {
          const coordinates = validCampgrounds.map(c => c.coordinates);

          // Add campground markers
          validCampgrounds.forEach((campground, index) => {
            // Add the black pin
            const marker = new mapboxgl.Marker({ color: '#194027' })
              .setLngLat(campground.coordinates)
              .addTo(map.current!);
            markersRef.current.push(marker);
          
            // Add the floating label above it
            const city = campground.city || '';
            const labelEl = document.createElement('div');
            labelEl.className = 'camp-label';
            labelEl.innerHTML = `
              <div style="
                background: white;
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 11px;
                line-height: 1.2;
                box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                text-align: center;
                transform: translateY(-8px);
              ">
                <div style="color: #666;">${city}</div>
                <div>${campground.name}</div>
              </div>
            `;
          
            const labelMarker = new mapboxgl.Marker({
              element: labelEl,
              anchor: 'bottom',
              offset: [0, -35]
            })
              .setLngLat(campground.coordinates)
              .addTo(map.current!);
          
            markersRef.current.push(labelMarker);
          });
          
          

          if (coordinates.length > 1) {
            const points = coordinates.map(coord => coord.join(',')).join(';');

            fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${points}?geometries=geojson&access_token=${token}`
            )
              .then(response => response.json())
              .then(data => {
                if (!map.current || !data.routes?.[0]?.geometry) {
                  console.error('No route data received or map not available');
                  return;
                }

                const route = data.routes[0];
                const durationMin = Math.round(route.duration / 60);
                const hours = Math.floor(durationMin / 60);
                const mins = durationMin % 60;
                const distanceMiles = (route.distance / 1609.34).toFixed(1);
                setRouteInfo(`${hours > 0 ? `${hours} hr ` : ''}${mins} min drive • ${distanceMiles} mi`);

                if (map.current.getLayer('route')) {
                  map.current.removeLayer('route');
                }
                if (map.current.getSource('route')) {
                  map.current.removeSource('route');
                }

                map.current.addSource('route', {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry
                  }
                });

                map.current.addLayer({
                  id: 'route',
                  type: 'line',
                  source: 'route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': '#194027',
                    'line-width': 4,
                    'line-opacity': 0.75
                  }
                });

                const bounds = new mapboxgl.LngLatBounds();
                coordinates.forEach(coord =>
                  bounds.extend(coord as [number, number])
                );
                map.current.fitBounds(bounds, { padding: 50 });

                // Now fetch segment-by-segment labels
                for (let i = 0; i < coordinates.length - 1; i++) {
                  const start = coordinates[i];
                  const end = coordinates[i + 1];
                  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}?geometries=geojson&annotations=duration,distance&access_token=${token}`;

                  fetch(url)
                    .then(res => res.json())
                    .then(segmentData => {
                      const seg = segmentData.routes?.[0];
                      if (!seg || seg.distance < 10 || seg.duration < 5) return;


                      const segDurationMin = Math.round(seg.duration / 60);
                      const segHours = Math.floor(segDurationMin / 60);
                      const segMins = segDurationMin % 60;
                      const segDistance = (seg.distance / 1609.34).toFixed(1);

                      const label = `${segHours > 0 ? `${segHours} hr ` : ''}${segMins} min • ${segDistance} mi`;

                      const midpoint: [number, number] = [
                        (start[0] + end[0]) / 2,
                        (start[1] + end[1]) / 2
                      ];

                      const labelEl = document.createElement('div');
                      labelEl.className = 'route-label';
                      labelEl.innerText = label;
                      labelEl.style.cssText = `
                        background: white;
                        border-radius: 4px;
                        padding: 2px 6px;
                        font-size: 12px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                        white-space: nowrap;
                      `;

                      const labelMarker = new mapboxgl.Marker({ element: labelEl })
                        .setLngLat(midpoint)
                        .addTo(map.current!);
                      labelMarkersRef.current.push(labelMarker);
                    });
                }
              })
              .catch(error => {
                console.error('Error fetching route:', error);
                setError('Error loading route data');
              });
          }
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Error initializing map');
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      labelMarkersRef.current.forEach(marker => marker.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [destination, selectedCampgrounds]);

  if (error) {
    return (
      <div className="h-[400px] rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={mapContainer} className="h-[400px] rounded-xl overflow-hidden shadow-md" />
      {routeInfo && (
        <p className="text-sm text-gray-700 italic px-1">
          Estimated route: {routeInfo}
        </p>
      )}
    </div>
  );
};
