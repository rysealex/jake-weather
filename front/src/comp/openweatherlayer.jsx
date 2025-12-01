import { useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const TILE_SIZE = 256;

// pass in the layer type as a prop
const Openweatherlayer = ({ layer }) => {
  const map = useMap();
	const mapsLibrary = useMapsLibrary('maps');
	const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // get the openweather api key from env variables

  useEffect(() => {
    if (!map || !apiKey || !layer || !mapsLibrary || !window.google || !window.google.maps) return;

		const { ImageMapType, Size } = window.google.maps;

    // 1. define the tile URL template
    const tileUrl = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`;

    // 2. create the custom ImageMapType
    const weatherMapType = new ImageMapType({
      getTileUrl: function (coord, zoom) {
        return tileUrl
          .replace('{z}', zoom.toString())
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString());
      },
      tileSize: new Size(TILE_SIZE, TILE_SIZE),
      name: layer,
      maxZoom: 19,
    });

    // 3. add the layer to the map's overlay list
    map.overlayMapTypes.setAt(0, weatherMapType);

    // 4. cleanup function to remove the layer when the component unmounts
    return () => {
      // find the index of the added layer (if it was added multiple times or if its position shifted)
      let index = -1;
      for (let i = 0; i < map.overlayMapTypes.getLength(); i++) {
        const type = map.overlayMapTypes.getAt(i);
        if (type && type.name === layer) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        map.overlayMapTypes.removeAt(index);
      }
    };
  }, [map, apiKey, layer, mapsLibrary]);

  return null;
};

export default Openweatherlayer;