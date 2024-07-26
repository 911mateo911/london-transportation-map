import DeckGL, { DeckGLProps } from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, LineLayer } from '@deck.gl/layers';
import type { MapViewState } from '@deck.gl/core';
import { AppConfig, getTflApiBasePath } from '../utils/configuration';
import { TflStopPointAutocomplete } from '../components/TflStopPointAutocomplete';
import { useMemo, useState } from 'react';
import { IconLayer } from '@deck.gl/layers';
import { Coordinate, TflStopPoint, TflStopPointRouteSectionRaw } from '../types/Tfl';
import { useCachedFetch } from '../hooks/useCachedFetch';
import { safeJsonParse } from '../utils/safeJsonParse';
import { mapCoordinatesAndRouteName } from '../utils/mapCoordinatesAndRouteName';
import { ToastMessage } from '../components/ToastMessage';
import { Loader, CloseIcon } from '@mantine/core';

interface MapPageProps {
  initialViewState?: MapViewState;
}

/* global window */
const devicePixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

export const MapPage = ({
  initialViewState = AppConfig.mapPageConfig.mapInitialViewState
}: MapPageProps) => {
  const [selectedStopPoint, setSelectedStopPoint] = useState<TflStopPoint | null>(null);
  const [mapViewState, setMapViewState] = useState<MapViewState>(initialViewState);

  const {
    data: stopPointRoutes,
    isLoading: isStopPointRoutesEndpointLoading,
    fetchData: fetchStopPointRoutes,
    reset: resetStopPointRoutesEndpoint
  } = useCachedFetch<TflStopPointRouteSectionRaw[]>();

  const hasNoRoutesForSelectedStopPoint = selectedStopPoint && !isStopPointRoutesEndpointLoading && !stopPointRoutes?.length;

  const handleSetSelectedStopPoint = (stopPoint: TflStopPoint | null) => {
    setSelectedStopPoint(stopPoint);
    setMapViewState(currState => {
      if (stopPoint) {
        return {
          ...currState,
          latitude: stopPoint.lat,
          longitude: stopPoint.lon,
          zoom: initialViewState.zoom
        }
      } else {
        return currState;
      }
    });
    if (stopPoint) {
      fetchStopPointRoutes(getTflApiBasePath(`/StopPoint/${stopPoint.id}/Route`));
    } else {
      resetStopPointRoutesEndpoint();
    }
  };

  const handleViewStateChange: DeckGLProps['onViewStateChange'] = (params) => {
    setMapViewState(params.viewState);
  }

  const tileLayer = useMemo(() => {
    return new TileLayer<ImageBitmap>({
      data: [AppConfig.mapPageConfig.tileLayerDataProvider],
      maxRequests: 20,
      pickable: true,
      highlightColor: [60, 60, 60, 40],
      minZoom: 8,
      maxZoom: 20,
      tileSize: 256,
      zoomOffset: devicePixelRatio === 1 ? -1 : 0,
      renderSubLayers: props => {
        const [[west, south], [east, north]] = props.tile.boundingBox;
        const { data, ...otherProps } = props;

        return [
          new BitmapLayer(otherProps, {
            image: data,
            bounds: [west, south, east, north]
          }),
        ];
      }
    });
  }, []);

  const markerLayer = useMemo(() => {
    if (!selectedStopPoint) {
      return null;
    }

    return new IconLayer<TflStopPoint>({
      id: 'icon-layer',
      getIcon: () => 'marker',
      data: [selectedStopPoint],
      getPosition: (d) => [
        d.lon,
        d.lat
      ],
      getSize: 40,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
      sizeScale: 1,
      pickable: true,
      getColor: () => [255, 0, 0]
    });
  }, [selectedStopPoint]);

  const lineLayers = useMemo(() => {
    if (!stopPointRoutes?.length) {
      return [];
    }

    setMapViewState(currState => ({
      ...currState,
      zoom: 10
    }))

    return stopPointRoutes.slice(0, AppConfig.mapPageConfig.maxRoutesPerStopPoint)
      .reduce<LineLayer[]>((acc, route, currentIndex) => {
        const normalizedLines = safeJsonParse<Coordinate[][]>(route.lineString);

        if (!normalizedLines) {
          return acc;
        }

        const mappedCoordinates = mapCoordinatesAndRouteName(normalizedLines, route.routeSectionName);

        acc.push(
          new LineLayer<ReturnType<typeof mapCoordinatesAndRouteName>[number]>({
            id: `line-layer-${currentIndex}`,
            data: mappedCoordinates,
            getSourcePosition: (d) => d.from,
            getTargetPosition: (d) => d.to,
            getWidth: 4,
            pickable: true,
            getColor: () => AppConfig.mapPageConfig.routeRgbColorListByIndex[currentIndex]
          })
        );

        return acc;
      }, []);
  }, [stopPointRoutes]);

  return (
    <div
      className='relative w-screen h-screen'
    >
      {isStopPointRoutesEndpointLoading && (
        <ToastMessage
          label={`Loading routes for ${selectedStopPoint?.name}`}
          icon={<Loader size={16} />}
        />
      )}
      {hasNoRoutesForSelectedStopPoint && (
        <ToastMessage
          label={`No matching routes found for ${selectedStopPoint?.name}`}
          className='bg-red-100 text-red-600'
          icon={
            <CloseIcon
              size='16px'
              className='text-red-800'
            />
          }
        />
      )}
      <TflStopPointAutocomplete
        onSelectOption={handleSetSelectedStopPoint}
        className='absolute top-2 left-1/2 -translate-x-1/2 z-10 w-full max-w-96 bg-white rounded'
      />
      <DeckGL
        layers={[tileLayer, ...lineLayers, markerLayer]}
        views={new MapView({ repeat: true })}
        controller={true}
        getTooltip={({ object }) => object && object.name}
        viewState={mapViewState}
        onViewStateChange={handleViewStateChange}
      />
    </div>
  );
}
