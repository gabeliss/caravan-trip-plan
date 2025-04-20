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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      setError('Mapbox token is missing');
      return;
    }

    try {
      mapboxgl.accessToken = token;

      // Validate token before initializing map
      fetch(`https://api.mapbox.com/tokens/v2/validate?access_token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (!data.valid) {
            setError('Invalid Mapbox token');
            return;
          }

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
            markersRef.current = [];

            // Add destination marker
            const destinationMarker = new mapboxgl.Marker({ color: '#194027' })
              .setLngLat(destination.coordinates)
              .addTo(map.current);
            markersRef.current.push(destinationMarker);

            // Filter out any undefined campgrounds and their coordinates
            const validCampgrounds = selectedCampgrounds.filter(
              (campground): campground is Campground => 
                Boolean(campground && campground.coordinates && 
                Array.isArray(campground.coordinates) && 
                campground.coordinates.length === 2)
            );

            if (validCampgrounds.length > 0) {
              // Add markers for each valid campground
              validCampgrounds.forEach((campground, index) => {
                const marker = new mapboxgl.Marker({ color: '#194027' })
                  .setLngLat(campground.coordinates)
                  .setPopup(new mapboxgl.Popup().setHTML(`
                    <div class="p-2">
                      <h3 class="font-bold">${campground.name}</h3>
                      <p class="text-sm">Night ${index + 1}</p>
                    </div>
                  `))
                  .addTo(map.current!);
                markersRef.current.push(marker);
              });

              // Create route between campgrounds if there are at least 2
              if (validCampgrounds.length > 1) {
                const coordinates = validCampgrounds.map(c => c.coordinates);
                const points = coordinates.map(coord => coord.join(',')).join(';');

                // Only fetch route if we have valid coordinates
                if (points) {
                  fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${points}?geometries=geojson&access_token=${token}`)
                    .then(response => response.json())
                    .then(data => {
                      if (!map.current || !data.routes?.[0]?.geometry) {
                        console.error('No route data received or map not available');
                        return;
                      }

                      // Remove existing route layer if it exists
                      if (map.current.getLayer('route')) {
                        map.current.removeLayer('route');
                      }
                      if (map.current.getSource('route')) {
                        map.current.removeSource('route');
                      }

                      // Add new route
                      map.current.addSource('route', {
                        type: 'geojson',
                        data: {
                          type: 'Feature',
                          properties: {},
                          geometry: data.routes[0].geometry
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

                      // Fit map to show all markers and route
                      const bounds = new mapboxgl.LngLatBounds();
                      coordinates.forEach(coord => bounds.extend(coord as [number, number]));
                      map.current.fitBounds(bounds, { padding: 50 });
                    })
                    .catch(error => {
                      console.error('Error fetching route:', error);
                      setError('Error loading route data');
                    });
                }
              }
            }
          });
        })
        .catch(error => {
          console.error('Error validating Mapbox token:', error);
          setError('Error validating Mapbox token');
        });
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Error initializing map');
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
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
    <div ref={mapContainer} className="h-[400px] rounded-xl overflow-hidden shadow-md" />
  );
};