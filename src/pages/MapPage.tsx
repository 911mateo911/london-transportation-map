import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import type { MapViewState } from '@deck.gl/core';
import { AppConfig } from '../utils/configuration';

interface MapPageProps {
  initialViewState?: MapViewState;
}

/* global window */
const devicePixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

export const MapPage = ({
  initialViewState = AppConfig.mapPageConfig.mapInitialViewState
}: MapPageProps) => {
  const tileLayer = new TileLayer<ImageBitmap>({
    data: [AppConfig.mapPageConfig.tileLayerDataProvider],
    maxRequests: 20,
    pickable: true,
    highlightColor: [60, 60, 60, 40],
    minZoom: 0,
    maxZoom: 19,
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

  return (
    <DeckGL
      layers={[tileLayer]}
      views={new MapView({ repeat: true })}
      initialViewState={initialViewState}
      controller={true}
    />
  );
}
