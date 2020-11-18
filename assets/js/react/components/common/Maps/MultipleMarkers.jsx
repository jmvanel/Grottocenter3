import 'react-leaflet-fullscreen/dist/styles.css';
import React from 'react';
import {
  is,
  pipe,
  length,
  equals,
  all,
  allPass,
  flatten,
  isNil,
  path,
} from 'ramda';
import { renderToString } from 'react-dom/server';
import {
  MapContainer,
  Marker,
  TileLayer,
  FeatureGroup,
  useMap,
} from 'react-leaflet';
import styled, { css } from 'styled-components';
import { isMobileOnly } from 'react-device-detect';
import { Icon } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { divIcon, Point } from 'leaflet';

// C. ROIG 04/06/2020 : currently broken
// import FullscreenControl from 'react-leaflet-fullscreen';

import PropTypes from 'prop-types';

const EntranceIconMap = () => (
  <Icon
    color="inherit"
    style={{ textAlign: 'center', height: '100%', width: '100%' }}
  >
    <img
      alt="entranceIcon"
      style={{ height: '100%' }}
      src="../../../../../images/iconsV3/map/entry.svg"
    />
  </Icon>
);

const leafletEntranceIcon = divIcon({
  html: renderToString(<EntranceIconMap />),
  iconSize: new Point(25, 50),
  iconAnchor: [12.5, 50],
  className: '',
});

const mapStyle = css`
  width: auto;
  height: ${isMobileOnly ? '220' : '300'}px;
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

const Map = styled(MapContainer)`
  ${mapStyle}
`;

const MapSkeleton = styled(Skeleton)`
  ${mapStyle}
`;

const isPair = pipe(length, equals(2));
const isNumber = pipe(flatten, all(is(Number)));
export const isValidPositions = allPass([
  is(Array),
  all(is(Array)),
  all(isPair),
  isNumber,
]);

const MultipleMarkers = ({ positions, loading }) => {
  const [group, setGroup] = React.useState(null);
  const map = useMap();

  const groupRef = React.useCallback(
    (node) => {
      if (!isNil(node)) {
        setGroup(node.leafletElement);
      }
    },
    [positions],
  );

  const mapRef = React.useCallback(
    (node) => {
      if (!isNil(node) && !isNil(group)) {
        // verify if bounds is not undefined
        if (!isNil(path(['_northEast'], group.getBounds()))) {
          node.leafletElement.fitBounds(group.getBounds());
        }
      }
    },
    [group, groupRef],
  );

  return (
    <>
      {!isValidPositions(positions) || loading ? (
        <MapSkeleton variant="rect" />
      ) : (
        <Map
          ref={mapRef}
          dragging={false}
          viewport={null}
          scrollWheelZoom={false}
        >
          {/* C. ROIG 04/06/2020 : currently broken */}
          {/* <FullscreenControl /> */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <FeatureGroup ref={groupRef}>
            {positions.map((position) => (
              <Marker
                position={position}
                icon={leafletEntranceIcon}
                key={`${position[0]}${position[1]}`}
              />
            ))}
          </FeatureGroup>
        </Map>
      )}
    </>
  );
};

const HydratedMultipleMarkers = (props) => (
  <MapContainer style={mapStyle}>
    <MultipleMarkers {...props} />
  </MapContainer>
);

// eslint-disable-next-line no-multi-assign
HydratedMultipleMarkers.propTypes = MultipleMarkers.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  loading: PropTypes.bool,
};

export default HydratedMultipleMarkers;
