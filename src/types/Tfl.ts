export interface TflStopPoint {
  $type: string;
  icsId: string;
  modes: string[];
  zone: string;
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface TflStopPointRouteSectionRaw {
  $type: string;
  destinationName: string;
  direction: string;
  isActive: boolean;
  lineId: string;
  lineString: string;
  mode: string;
  naptanId: string;
  routeSectionName: string;
  serviceType: string;
  validFrom: string;
  validTo: string;
  vehicleDestinationText: string;
}

export type Coordinate = [number, number];
