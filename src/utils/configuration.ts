import type { MapViewState } from '@deck.gl/core';

type RgbColor = [number, number, number];

type AppConfigType = {
  mapPageConfig: {
    tileLayerDataProvider: string;
    mapInitialViewState: MapViewState;
    maxRoutesPerStopPoint: number;
    routeRgbColorListByIndex: RgbColor[];
  };
  mapSearchEndpointBasePath: string;
};

export const AppConfig: AppConfigType = {
  mapPageConfig: {
    tileLayerDataProvider: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    mapInitialViewState: {
      latitude: 51.5,
      longitude: -0.1,
      zoom: 11,
      maxZoom: 20,
    },
    maxRoutesPerStopPoint: 10,
    routeRgbColorListByIndex: [
      [128, 0, 128],
      [255, 102, 102],
      [0, 255, 0],
      [102, 255, 102],
      [0, 0, 255],
      [102, 102, 255],
      [255, 0, 255],
      [255, 102, 255],
      [0, 255, 255],
      [102, 255, 255]
    ]
  },
  mapSearchEndpointBasePath: 'https://api.tfl.gov.uk'
};

export const getTflApiBasePath = (route: string) => {
  return `${AppConfig.mapSearchEndpointBasePath}${route}`
}
