import type { MapViewState } from '@deck.gl/core';

type RgbColor = [number, number, number];

type AppConfigType = {
  mapPageConfig: {
    tileLayerDataProvider: string;
    mapInitialViewState: MapViewState;
    maxRoutesPerStopPoint: number;
    routeRgbColorListByIndex: RgbColor[];
    markerIconConfig: {
      atlasUrl: string;
      mappingUrl: string;
    }
  };
  mapSearchEndpointBasePath: string;
};

const TILE_LAYER_PROVIDER = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP_SEARCH_ENDPOINT_BASE_PATH = 'https://api.tfl.gov.uk';
export const DEFAULT_COLORS: RgbColor[] = [
  [102, 0, 102],
  [204, 81, 81],
  [0, 204, 0],
  [81, 204, 81],
  [0, 0, 204],
  [81, 81, 204],
  [204, 0, 204],
  [204, 81, 204],
  [0, 204, 204],
  [81, 204, 204]
];

export const AppConfig: AppConfigType = {
  mapPageConfig: {
    tileLayerDataProvider: TILE_LAYER_PROVIDER,
    mapInitialViewState: {
      latitude: 51.5,
      longitude: -0.1,
      zoom: 11,
      maxZoom: 20,
    },
    maxRoutesPerStopPoint: 10,
    routeRgbColorListByIndex: DEFAULT_COLORS,
    markerIconConfig: {
      atlasUrl: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      mappingUrl: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json'
    }
  },
  mapSearchEndpointBasePath: MAP_SEARCH_ENDPOINT_BASE_PATH
};

export const getTflApiBasePath = (route: string) => {
  return `${AppConfig.mapSearchEndpointBasePath}${route}`
}
