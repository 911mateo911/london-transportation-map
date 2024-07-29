export interface TflStopPointSearchResult {
  $type: string;
  icsId: string;
  modes: string[];
  zone: string;
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface TflStopPointData {
  $type: string;
  naptanId: string;
  modes: string[];
  icsCode: string;
  stopType: string;
  stationNaptan: string;
  lines: TflLine[];
  // And other non mapped properties
}

interface TflLine {
  $type: string;
  id: string;
  name: string;
  uri: string;
  type: string;
  crowding: TflCrowd;
  routeType: string;
  status: string;
}

interface TflCrowd {
  $type: string;
}

export interface TflRouteSequenceData {
  $type: string;
  lineId: string;
  lineName: string;
  direction: string;
  lineStrings: string[];
}

export type Coordinate = [number, number];
