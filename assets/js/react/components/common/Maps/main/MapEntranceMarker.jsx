import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Marker } from 'react-leaflet';
import { divIcon, Point } from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Icon } from '@material-ui/core';
import MapEntrancePopup from './MapEntrancePopup';

//
//
// M A I N - C O M P O N E N T
//
//

const EntranceIconMap = () => (
  <Icon
    color="inherit"
    style={{ textAlign: 'center', height: '100%', width: '100%' }}
  >
    <img
      alt="entranceIcon"
      style={{ height: '100%' }}
      src="../../../../../../images/iconsV3/map/entry.svg"
    />
  </Icon>
);

const leafletEntranceIcon = divIcon({
  html: renderToString(<EntranceIconMap />),
  iconSize: new Point(12.5, 25),
  iconAnchor: [6.25, 25],
  className: '',
});

const handleClick = (e) => {
  e.target.closeTooltip();
};

const handleAdd = (e) => {
  e.target.bringToBack();
};

const MapEntranceMarker = ({ entrance }) => (
  <Marker
    icon={leafletEntranceIcon}
    key={`entrance_${entrance.id}`}
    position={[entrance.latitude, entrance.longitude]}
    // center={{
    //   lat: entrance.latitude,
    //   lng: entrance.longitude,
    // }}
    // color="white"
    // fillColor="red"
    // fillOpacity="1"
    // weight="1"
    // radius="8"
    onClick={handleClick}
    onAdd={handleAdd}
  >
    <MapEntrancePopup entrance={entrance} />
    <Tooltip direction="top">{entrance.name}</Tooltip>
  </Marker>
);

MapEntranceMarker.propTypes = {
  entrance: PropTypes.shape({
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default MapEntranceMarker;
