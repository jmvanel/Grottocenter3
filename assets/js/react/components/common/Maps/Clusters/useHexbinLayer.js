import { useMap } from 'react-leaflet';
import { useCallback, useEffect, useState } from 'react';
import '@asymmetrik/leaflet-d3';
import { isNil } from 'ramda';
import * as L from 'leaflet';

const hexbinLayerOptions = {
  radius: 10,
  opacity: 0.5,
  duration: 600,
  colorScaleExtent: [1, undefined],
  radiusScaleExtent: [1, undefined],
  colorDomain: null,
  radiusDomain: null,
  colorRange: ['white', 'blue'],
  radiusRange: [5, 12],
  pointerEvents: 'all',
};

const useHexbinLayer = (data = [], options = hexbinLayerOptions) => {
  const map = useMap();
  const [hexLayer, setHexLayer] = useState();

  const updateData = useCallback(
    (newData) => {
      if (!isNil(hexLayer)) {
        hexLayer.data(newData);
      }
    },
    [hexLayer],
  );
  useEffect(() => {
    // Add hex layer to the map
    setHexLayer(L.hexbinLayer(options).addTo(map));
  }, []);

  useEffect(() => {
    if (!isNil(hexLayer)) {
      hexLayer.colorScale();

      hexLayer
        .radiusRange([6, 11])
        .lng((d) => d[0])
        .lat((d) => d[1])
        .colorValue((d) => d.length)
        .radiusValue((d) => d.length);

      updateData(data);
    }
  }, [hexLayer]);

  return {
    updateData,
  };
};

export default useHexbinLayer;
