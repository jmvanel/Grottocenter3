import React, { useEffect, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import markers from '../../../../conf/MapMarkersConfig';

const mainMarkerIcon = L.icon({
  iconUrl: markers.find((m) => m.name === 'Organizations').url,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const NetworkMarker = ({ network }) => {
  return (
    <Marker
      icon={mainMarkerIcon}
      key={`network_${network.id}`}
      position={{
        lat: network.latitude,
        lng: network.longitude,
      }}
    >
      <Popup>{network.id}</Popup>
    </Marker>
  );
};

NetworkMarker.propTypes = {
  network: PropTypes.shape({
    id: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
};

export default NetworkMarker;
