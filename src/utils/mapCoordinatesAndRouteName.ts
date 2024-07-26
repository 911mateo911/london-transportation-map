import { Coordinate } from "../types/Tfl";

export const mapCoordinatesAndRouteName = (coordinates: Coordinate[][], routeName: string) => {
  const [coordinateList] = coordinates;

  return coordinateList.reduce<Array<{
    from: Coordinate;
    to: Coordinate;
    name: string;
  }>>(
    (prevCoordinates, currentCoordinate, currentIndex) => {
      const nextCoordinate = coordinateList[currentIndex + 1];

      if (!nextCoordinate) {
        return prevCoordinates;
      }

      prevCoordinates.push({
        from: currentCoordinate,
        to: nextCoordinate,
        name: routeName
      });

      return prevCoordinates;
    }, []);
}
