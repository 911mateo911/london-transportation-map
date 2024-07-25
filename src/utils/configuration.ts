import type { MapViewState } from '@deck.gl/core';

type AppConfigType = {
  mapPageConfig: {
    tileLayerDataProvider: string;
    mapInitialViewState: MapViewState;
  }
};

export const AppConfig: AppConfigType = {
  mapPageConfig: {
    tileLayerDataProvider: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    mapInitialViewState: {
      latitude: 51.5,
      longitude: -0.1,
      zoom: 11,
      maxZoom: 20,
    }
  }
}
