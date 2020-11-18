import React, { useEffect, useState } from 'react';
import { includes, isEmpty, pipe, map as rMap, forEach } from 'ramda';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from '@material-ui/core';
import { renderToString } from 'react-dom/server';

import { heatmapTypes } from './DataControl';
import MapGrottoMarker from '../main/MapGrottoMarker';
import MapEntranceMarker from '../main/MapEntranceMarker';
import MapCaveMarker from '../main/MapCaveMarker';

export const markerTypes = {
  ORGANIZATIONS: 'organizations',
  ...heatmapTypes,
};

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

const leafletEntranceIcon = L.divIcon({
  html: renderToString(<EntranceIconMap />),
  iconSize: new L.Point(12.5, 25),
  iconAnchor: [6.25, 25],
  className: '',
});

const Markers = ({
  visibleMarkers,
  organizations = [],
  entrances = [],
  networks = [],
}) => {
  const map = useMap();
  const [entrancesCanvas] = useState(
    L.canvas().on('update', () => {
      console.log('uuududud');
    }),
  );
  const [entrancesMarkers, setEntrancesMarkers] = useState({
    pane: 'markerPane',
  });

  const addEntranceMarkers = forEach((entrance) =>
    L.marker([entrance.latitude, entrance.longitude], {
      icon: leafletEntranceIcon,
      renderer: entrancesCanvas,
    }).addTo(map),
  );

  useEffect(() => {
    console.log(entrancesCanvas);
    if (includes(markerTypes.ENTRANCES, visibleMarkers)) {
      addEntranceMarkers(entrances);
    } else if (entrancesCanvas) {
      // map.remove(entrancesCanvas);
    }
    // return () => map.remove(entrancesCanvas);
  }, [entrances, visibleMarkers]);

  return (
    <>
      {includes(markerTypes.ORGANIZATIONS, visibleMarkers) &&
        !isEmpty(organizations) &&
        organizations.map((organization) => (
          <MapGrottoMarker grotto={organization} />
        ))}
      {/* {includes(markerTypes.ENTRANCES, visibleMarkers) && */}
      {/*  !isEmpty(entrances) && */}
      {/*  entrances.map((entrance) => ( */}
      {/*    <MapEntranceMarker key={entrance.id} entrance={entrance} /> */}
      {/*  ))} */}
      {includes(markerTypes.NETWORKS, visibleMarkers) &&
        !isEmpty(networks) &&
        networks.map((network) => <MapCaveMarker cave={network} />)}
    </>
  );
};

const MemoizedMarkers = React.memo(Markers);

Markers.propTypes = {
  visibleMarkers: PropTypes.arrayOf(PropTypes.oneOf(markerTypes)),
  organizations: PropTypes.arrayOf(PropTypes.shape({})),
  entrances: PropTypes.arrayOf(PropTypes.shape({})),
  networks: PropTypes.arrayOf(PropTypes.shape({})),
};
MemoizedMarkers.propTypes = Markers.propTypes;

export default MemoizedMarkers;
