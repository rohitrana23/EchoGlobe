import React, { useEffect, useMemo, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./worldMap.css";

export interface Station {
  id: string;
  stationuuid?: string;
  name: string;
  urlResolved?: string;
  favicon?: string;
  tags?: string;
  country?: string;
  language?: string;
  geoLat: number;
  geoLong: number;
}
interface WorldMapProps {
  stations: Station[];
  selectedStationId?: string;
  onSelectStation: (station: Station) => void;
}
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

const isMobilePerformanceMode = () => {
  if (typeof window === "undefined") return false;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const touchDevice = navigator.maxTouchPoints > 0;
  return (coarsePointer || touchDevice) && window.innerWidth <= 900;
};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOThiMDY0ZS1lODVhLTQ0YzMtYThmNC0xMTJhZGU3YmM2MDAiLCJpZCI6NDU3MDI2LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODQxODM4NzV9.lD_gnBuo91I0wbXxm_DhJXTWpe4ml3LBDp_BHfSkOdI";
const WorldMap: React.FC<WorldMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const entitiesRef = useRef<Cesium.Entity[]>([]);
  const rotatingRef = useRef(true);
  const handlerRef = useRef<Cesium.ScreenSpaceEventHandler | null>(null);
  const onSelectRef = useLatest(onSelectStation);

  const validStations = useMemo(
    () =>
      stations.filter(
        (s) =>
          Number.isFinite(s.geoLat) &&
          Number.isFinite(s.geoLong)
      ),
    [stations]
  );
  const validStationsRef = useLatest(validStations);

  const createPurplePin = (isActive: boolean) => {
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.25" />
    </filter>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  ${
    isActive
      ? `
    <g opacity="0.8">
      <circle cx="48" cy="40" r="12" fill="none" stroke="#fbbf24" stroke-width="3">
        <animate attributeName="r" values="4;80" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="1;0" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </g>
    <g opacity="0.6">
      <circle cx="48" cy="40" r="12" fill="none" stroke="#fbbf24" stroke-width="3">
        <animate attributeName="r" values="4;80" dur="1.4s" repeatCount="indefinite" begin="0.35s" />
        <animate attributeName="stroke-opacity" values="1;0" dur="1.4s" repeatCount="indefinite" begin="0.35s" />
      </circle>
    </g>
    <g opacity="0.4">
      <circle cx="48" cy="40" r="12" fill="none" stroke="#fbbf24" stroke-width="3">
        <animate attributeName="r" values="4;80" dur="1.4s" repeatCount="indefinite" begin="0.7s" />
        <animate attributeName="stroke-opacity" values="1;0" dur="1.4s" repeatCount="indefinite" begin="0.7s" />
      </circle>
    </g>
    <circle cx="48" cy="40" r="28" fill="#fbbf24" opacity="0.25" filter="url(#glow)" />
    `
      : ""
  }
  <circle cx="48" cy="40" r="28" fill="#8b5cf6" filter="url(#shadow)" />
  <path d="M48 68 C48 68 30 54 30 40 A18 18 0 1 1 66 40 C66 54 48 68 48 68 Z" fill="#8b5cf6" />
  <circle cx="48" cy="40" r="20" fill="rgba(255,255,255,0.16)" />
</svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const getMarkerImage = (isActive: boolean) => createPurplePin(isActive);

  const rebuildEntities = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    entitiesRef.current.forEach((entity) => viewer.entities.remove(entity));
    entitiesRef.current = [];

    validStations.forEach((station) => {
      const selected = station.id === selectedStationId;

      const entity = viewer.entities.add({
        id: station.id,
        name: station.name,
        position: Cesium.Cartesian3.fromDegrees(
          station.geoLong,
          station.geoLat
        ),
        billboard: {
          image: getMarkerImage(selected),
          width: 42,
          height: 42,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(
            500000,
            1.3,
            25000000,
            0.45
          ),
        },
        label: {
          text: station.name,
          show: selected,
          font: "15px sans-serif",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -45),
        },
      });
      entitiesRef.current.push(entity);
    });
  };
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;
    let cancelled = false;
    (async()=>{
      Cesium.Ion.defaultAccessToken = TOKEN;
      const terrain = await Cesium.createWorldTerrainAsync({
        requestVertexNormals: false,
        requestWaterMask: false,
      });
      const viewer = new Cesium.Viewer(containerRef.current!, {
        terrainProvider: terrain,
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
      });
      const mobilePerformanceMode = isMobilePerformanceMode();
      viewer.resolutionScale = mobilePerformanceMode ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      viewer.scene.requestRenderMode = mobilePerformanceMode;
      (viewer.scene as Cesium.Scene & { maximumFrameRate?: number }).maximumFrameRate = mobilePerformanceMode ? 30 : 60;
      viewer.scene.fog.enabled = !mobilePerformanceMode;
      viewer.scene.globe.showGroundAtmosphere = !mobilePerformanceMode;
      viewer.scene.globe.enableLighting = false;
      viewer.scene.globe.tileCacheSize = mobilePerformanceMode ? 48 : 96;
      viewer.scene.globe.maximumScreenSpaceError = mobilePerformanceMode ? 4 : 2;
      viewer.scene.globe.preloadSiblings = !mobilePerformanceMode;
      viewer.scene.globe.depthTestAgainstTerrain = false;
      viewer.shadows = false;

      if (cancelled) {
        viewer.destroy();
        return;
      }

      viewerRef.current = viewer;
      viewer.imageryLayers.removeAll();

      const provider = await Cesium.IonImageryProvider.fromAssetId(3830183);
      viewer.imageryLayers.addImageryProvider(provider);
      viewer.scene.globe.showGroundAtmosphere = true;
      viewer.camera.flyHome(0);

      rebuildEntities();

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlerRef.current = handler;
      handler.setInputAction((click: any) => {
        const picked = viewer.scene.pick(click.position);
        const maybeId = (picked as any)?.id ?? (picked as any)?.entity?.id ?? (picked as any)?.primitive?.id;

        let pickedStationId: string | undefined;
        if (typeof maybeId === "string") {
          pickedStationId = maybeId;
        } else if (maybeId && typeof maybeId.id === "string") {
          pickedStationId = maybeId.id;
        }

        if (pickedStationId) {
          rotatingRef.current = false;
          const station = validStationsRef.current.find(
            (s) => s.id === pickedStationId
          );
          if (station) {
            onSelectRef.current(station);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      viewer.scene.canvas.addEventListener("mousedown", () => {
        rotatingRef.current = false;
      });

      viewer.clock.shouldAnimate = true;
      const rotationSpeed = mobilePerformanceMode ? -0.00003 : -0.00008;
      viewer.clock.onTick.addEventListener(() => {
        if (rotatingRef.current) {
          viewer.camera.rotate(
            Cesium.Cartesian3.UNIT_Z,
            rotationSpeed
          );
        }
      });
    })();

    return () => {
      cancelled = true;
      handlerRef.current?.destroy();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    rebuildEntities();
  }, [validStations, selectedStationId]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedStationId) return;

    const station = validStations.find(
      (s) => s.id === selectedStationId
    );
    if (!station) return;

    rotatingRef.current = false;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        station.geoLong,
        station.geoLat,
        250000
      ),
      duration: 2,
      easingFunction: Cesium.EasingFunction.QUARTIC_IN_OUT,
    });
  }, [selectedStationId, validStations]);

  // const selectedStation = validStations.find(
  //   (s) => s.id === selectedStationId
  // );

  return (
    <div className="globe-shell">
      <div ref={containerRef} className="globe-map" />

      <div className="globe-hint">
        Drag to explore • Click a marker to play a station
      </div>

      {/* {selectedStation && (
        <div className="station-card">
          <h3>{selectedStation.name}</h3>

          <p>
            <span>Country</span>
            {selectedStation.country || "Unknown"}
          </p>

          <p>
            <span>Language</span>
            {selectedStation.language || "Unknown"}
          </p>

          <button
            onClick={() => onSelectStation(selectedStation)}
          >
            ▶ Play Station
          </button>
        </div>
      )} */}
    </div>
  );
};

export default WorldMap;
