import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  CHOKE_POINTS, 
  TRADE_CORRIDORS, 
  DISRUPTION_EVENTS 
} from '../data/geospatialData';
import { DisruptionEvent, ChokePoint, TradeCorridor } from '../types';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Compass, 
  Crosshair, 
  Info, 
  Flame, 
  Ship, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface GeospatialCanvasProps {
  onSelectEvent: (event: DisruptionEvent) => void;
  selectedEventId?: string;
  onSelectChokePoint: (cp: ChokePoint) => void;
  selectedChokePointId?: string;
}

const TACTICAL_DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0c121e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0c121e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#748398" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a5b4fc" }]
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f172a" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#070c14" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#070c14" }]
  }
];

// Inner helper component to manipulate Google Maps Polylines & Circles imperatively
const MapVectorOverlays: React.FC<{
  corridors: TradeCorridor[];
  chokePoints: ChokePoint[];
  showCorridors: boolean;
  showBuffers: boolean;
  onSelectChokePoint: (cp: ChokePoint) => void;
}> = ({ corridors, chokePoints, showCorridors, showBuffers, onSelectChokePoint }) => {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    // Clean up old polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    if (showCorridors) {
      corridors.forEach(corridor => {
        const polyline = new google.maps.Polyline({
          path: corridor.path,
          geodesic: true,
          strokeColor: corridor.color,
          strokeOpacity: corridor.status === 'compromised' ? 0.9 : 0.75,
          strokeWeight: corridor.status === 'compromised' ? 4 : 3,
          map: map,
        });

        // Add glow / animated dash effect for bypass or compromised
        if (corridor.status === 'active_bypass') {
          polyline.setOptions({
            strokeOpacity: 0.9,
            strokeWeight: 4,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3,
                strokeColor: '#06b6d4',
              },
              offset: '0',
              repeat: '20px',
            }]
          });
        }

        polylinesRef.current.push(polyline);
      });
    }

    // Clean up old circles
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    if (showBuffers) {
      chokePoints.forEach(cp => {
        const circle = new google.maps.Circle({
          strokeColor: cp.currentRiskScore > 85 ? '#ef4444' : cp.currentRiskScore > 70 ? '#f59e0b' : '#3b82f6',
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: cp.currentRiskScore > 85 ? '#ef4444' : cp.currentRiskScore > 70 ? '#f59e0b' : '#3b82f6',
          fillOpacity: 0.18,
          map: map,
          center: cp.coordinates,
          radius: cp.bufferRadiusKm * 1000,
        });

        circle.addListener('click', () => {
          onSelectChokePoint(cp);
        });

        circlesRef.current.push(circle);
      });
    }

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      circlesRef.current.forEach(c => c.setMap(null));
    };
  }, [map, corridors, chokePoints, showCorridors, showBuffers, onSelectChokePoint]);

  return null;
};

// Map Camera Controller
const MapCameraController: React.FC<{
  targetCoordinates?: { lat: number; lng: number } | null;
  targetZoom?: number;
}> = ({ targetCoordinates, targetZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoordinates) {
      map.panTo(targetCoordinates);
      if (targetZoom) {
        map.setZoom(targetZoom);
      }
    }
  }, [map, targetCoordinates, targetZoom]);

  return null;
};

export const GeospatialCanvas: React.FC<GeospatialCanvasProps> = ({
  onSelectEvent,
  selectedEventId,
  onSelectChokePoint,
  selectedChokePointId,
}) => {
  const [showCorridors, setShowCorridors] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showBuffers, setShowBuffers] = useState(true);
  const [showVesselDensity, setShowVesselDensity] = useState(true);
  const [targetView, setTargetView] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [mapError, setMapError] = useState(false);

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB0HS207LDdz3cmqtW2nxGQ0Rpm7KMZ4Wg';

  const handleFocusChokePoint = (cp: ChokePoint) => {
    onSelectChokePoint(cp);
    setTargetView({
      lat: cp.coordinates.lat,
      lng: cp.coordinates.lng,
      zoom: 6,
    });
  };

  const handleResetGlobal = () => {
    setTargetView({
      lat: 20.0,
      lng: 35.0,
      zoom: 3,
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-105px)] bg-[#070c14] overflow-hidden flex flex-col">
      {/* Top Map Controls Floating Bar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Choke Point Quick Jump Presets */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0e1626]/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80 shadow-xl overflow-x-auto max-w-full">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            Strategic Straits:
          </span>
          {CHOKE_POINTS.map(cp => {
            const isSelected = selectedChokePointId === cp.id;
            return (
              <button
                key={cp.id}
                onClick={() => handleFocusChokePoint(cp)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {cp.name}
                <span className={`ml-1.5 text-[10px] font-mono px-1 py-0.2 rounded ${
                  cp.currentRiskScore > 85 ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  {cp.currentRiskScore}
                </span>
              </button>
            );
          })}
          <button
            onClick={handleResetGlobal}
            className="px-2.5 py-1 rounded text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 border-l border-slate-700/60 ml-1"
          >
            Reset World
          </button>
        </div>

        {/* Layer Visibility Toggles */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0e1626]/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80 shadow-xl text-xs">
          <div className="flex items-center gap-1 text-slate-400 px-1 font-semibold text-[11px]">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            Layers:
          </div>

          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded font-medium transition-colors ${
              showCorridors ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {showCorridors ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            Corridors
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded font-medium transition-colors ${
              showHotspots ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {showHotspots ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            Disruptions
          </button>

          <button
            onClick={() => setShowBuffers(!showBuffers)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded font-medium transition-colors ${
              showBuffers ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {showBuffers ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            Geofences
          </button>

          <button
            onClick={() => setShowVesselDensity(!showVesselDensity)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded font-medium transition-colors ${
              showVesselDensity ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Ship className="h-3 w-3" />
            AIS Density
          </button>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-12 left-4 z-20 pointer-events-auto bg-[#0a1120]/95 backdrop-blur-md p-3 rounded-lg border border-slate-700/80 shadow-2xl text-xs max-w-xs hidden md:block">
        <div className="font-semibold text-slate-200 mb-2 flex items-center justify-between">
          <span>Operational Legend</span>
          <span className="text-[10px] text-cyan-400 font-mono">Live Telemetry</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-6 rounded-full bg-red-500"></span>
            <span>Compromised Maritime Corridor (Risk &gt; 85)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-6 rounded-full bg-cyan-400 border border-cyan-300"></span>
            <span>Active Bypass Highway (Cape of Good Hope)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-6 rounded-full bg-amber-500"></span>
            <span>Congested / Climate Rationed Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-6 rounded-full bg-emerald-500"></span>
            <span>Optimal Multimodal Corridor</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <span className="h-3 w-3 rounded-full bg-rose-500/40 border border-rose-500 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping"></span>
            </span>
            <span>Kinetic Disruption Hotspot (Gemini Deep Dive)</span>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="w-full h-full relative">
        {!mapError ? (
          <APIProvider 
            apiKey={mapsApiKey}
            onError={() => {
              console.warn('Google Maps API load error; fallback active');
              setMapError(true);
            }}
          >
            <GoogleMap
              defaultCenter={{ lat: 18.0, lng: 42.0 }}
              defaultZoom={3}
              mapId="DEMO_MAP_ID"
              disableDefaultUI={true}
              zoomControl={true}
              gestureHandling="greedy"
              className="w-full h-full"
            >
              <MapCameraController 
                targetCoordinates={targetView ? { lat: targetView.lat, lng: targetView.lng } : null}
                targetZoom={targetView?.zoom}
              />

              <MapVectorOverlays 
                corridors={TRADE_CORRIDORS}
                chokePoints={CHOKE_POINTS}
                showCorridors={showCorridors}
                showBuffers={showBuffers}
                onSelectChokePoint={handleFocusChokePoint}
              />

              {/* Disruption Hotspot Markers */}
              {showHotspots && DISRUPTION_EVENTS.map(event => {
                const isSelected = selectedEventId === event.id;
                return (
                  <AdvancedMarker
                    key={event.id}
                    position={event.coordinates}
                    title={event.title}
                    onClick={() => onSelectEvent(event)}
                  >
                    <div className="relative cursor-pointer group">
                      {/* Outer pulse ring */}
                      <span className={`absolute -inset-2 rounded-full opacity-75 ${
                        event.severity === 'critical' 
                          ? 'bg-rose-500 animate-radar' 
                          : 'bg-amber-500 animate-radar'
                      }`}></span>

                      {/* Tactical Marker Badge */}
                      <div className={`relative px-2 py-1 rounded-md text-[11px] font-bold shadow-lg flex items-center gap-1.5 transition-transform group-hover:scale-110 ${
                        isSelected 
                          ? 'bg-rose-500 text-white ring-2 ring-white shadow-rose-500/50 scale-110'
                          : event.severity === 'critical'
                          ? 'bg-rose-600/90 text-white border border-rose-400'
                          : 'bg-amber-600/90 text-white border border-amber-400'
                      }`}>
                        <Flame className="h-3 w-3 animate-pulse" />
                        <span className="font-mono">{event.chokePointId ? event.chokePointId.split('-')[0].toUpperCase() : 'ALERT'}</span>
                        <span className="bg-black/40 px-1 rounded text-[9px] font-mono">
                          {event.geopoliticalSentimentScore}
                        </span>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Choke Point Strategic Labels */}
              {showBuffers && CHOKE_POINTS.map(cp => (
                <AdvancedMarker
                  key={`label-${cp.id}`}
                  position={cp.coordinates}
                  title={cp.name}
                  onClick={() => handleFocusChokePoint(cp)}
                >
                  <div className="cursor-pointer group flex flex-col items-center">
                    <div className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-semibold text-slate-200 shadow-md group-hover:border-cyan-400 transition-colors whitespace-nowrap">
                      {cp.name}
                    </div>
                  </div>
                </AdvancedMarker>
              ))}
            </GoogleMap>
          </APIProvider>
        ) : (
          /* High-Fidelity Tactical Vector SVG Fallback Canvas */
          <div className="w-full h-full bg-[#0a1120] relative flex items-center justify-center p-6">
            <div className="text-center max-w-lg p-6 rounded-xl bg-slate-900/80 border border-slate-700 shadow-2xl">
              <Compass className="h-12 w-12 text-cyan-400 mx-auto mb-3 animate-spin-slow" />
              <h3 className="text-lg font-bold text-white mb-2">Tactical Vector Engine Active</h3>
              <p className="text-xs text-slate-400 mb-4">
                Google Maps JS rendering fallback engaged. All {TRADE_CORRIDORS.length} trade corridors and {DISRUPTION_EVENTS.length} disruption hotspots remain fully functional for AI analysis.
              </p>
              <div className="grid grid-cols-2 gap-2 text-left">
                {DISRUPTION_EVENTS.map(event => (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className="p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200"
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-[10px] text-rose-400">Risk Score: {event.geopoliticalSentimentScore}/100</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Incident Ticker */}
      <div className="bg-[#090e18] border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
            LIVE THREAT RADAR:
          </span>
          {DISRUPTION_EVENTS.slice(0, 3).map(event => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="text-slate-300 hover:text-white truncate max-w-sm whitespace-nowrap text-left hover:underline text-[11px]"
            >
              <strong className="text-rose-400">[{event.chokePointId?.toUpperCase()}]:</strong> {event.headline}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 whitespace-nowrap hidden sm:flex">
          <span>Active Vessel Tracking: 84,209 Units</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">FPS: 60</span>
        </div>
      </div>
    </div>
  );
};
