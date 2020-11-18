import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, useMapEvent } from 'react-leaflet';
import styled from 'styled-components';
import {
  isEmpty,
  head,
  includes,
  without,
  pipe,
  append,
  uniq,
  values,
} from 'ramda';
import { isMobileOnly } from 'react-device-detect';
import LayersControl from '../LayersControl';
import DataControl, { heatmapTypes } from './DataControl';
import ConverterControl from './ConverterControl';
import useHexbinLayer from './useHexbinLayer';
import Markers, { markerTypes } from './Markers';

const Map = styled(MapContainer)`
 width: 100%;
   //height: 1000px;
  height: 100vh;
  // height: ${isMobileOnly ? 'calc(100% - 60px)' : 'calc(100% - 110px)'};
  position: fixed;
  //margin-left: -20px;
  //margin-top: -20px;
`;

const HydratedMap = ({
  entrances,
  entranceMarkers = [],
  networks,
  networkMarkers = [],
  organizations,
  projectionsList,
  zoom,
}) => {
  const [selectedHeatmap, setHeatmap] = React.useState('entrances');
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  // const { updateData } = useHexbinLayer(entrances);
  const prevZoom = useRef(zoom);

  const map = useMapEvent('zoomend', () => {
    const currentZoom = map.getZoom();
    const isZoomingIn = prevZoom.current < currentZoom;
    // When close enough we want to display disable heatmap ans show markers
    if (isZoomingIn && currentZoom >= 11) {
      setSelectedMarkers(
        pipe(append(selectedHeatmap), uniq, without('none'))(selectedMarkers),
      );
      setHeatmap('none');
    }
    // When to far we want to switch back to the heatmap
    if (!isZoomingIn && currentZoom < 11) {
      setHeatmap(
        pipe(without(markerTypes.ORGANIZATIONS), head)(selectedMarkers),
      );
      setSelectedMarkers(without(values(heatmapTypes), selectedMarkers));
    }
    prevZoom.current = currentZoom;
  });

  // useEffect(() => {
  //   switch (selectedHeatmap) {
  //     case heatmapTypes.ENTRANCES:
  //       updateData(entrances);
  //       break;
  //     case heatmapTypes.NETWORKS:
  //       updateData(networks);
  //       break;
  //     default:
  //       updateData([]);
  //   }
  // }, [selectedHeatmap]);

  return (
    <>
      <LayersControl />
      <DataControl
        updateHeatmap={setHeatmap}
        updateMarkers={setSelectedMarkers}
      />
      <ConverterControl projectionsList={projectionsList} />
      <Markers
        visibleMarkers={selectedMarkers}
        organizations={organizations}
        networks={networkMarkers}
        entrances={entranceMarkers}
      />
    </>
  );
};

const Index = ({ center, zoom, ...props }) => (
  <Map center={center} zoom={zoom} preferCanvas>
    <HydratedMap {...props} zoom={zoom} />
  </Map>
);

HydratedMap.propTypes = {
  entrances: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  entranceMarkers: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.string,
      longitude: PropTypes.string,
      id: PropTypes.number,
    }),
  ),
  networks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  networkMarkers: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.string,
      longitude: PropTypes.string,
      id: PropTypes.number,
    }),
  ),
  organizations: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  projectionsList: PropTypes.arrayOf(PropTypes.any),
  zoom: PropTypes.number.isRequired,
};

Index.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  ...HydratedMap.protoTypes,
};

export default Index;
