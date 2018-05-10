import React, {Component, PropTypes} from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'
import DivIcon from 'react-leaflet-div-icon';
import _ from 'underscore.string';
//import {smallMarkerIcon, mainMarkerIcon} from '../../conf/Config';
import {defaultCoord, defaultZoom} from '../../conf/Config';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

export const smallMarkerIcon = L.icon({
    iconUrl: '/images/gc-map-entry.svg',
    iconSize: [
      24, 24
    ],
    iconAnchor: [
      12, 24
    ],
    popupAnchor: [
      0, -24
    ],
    // shadowUrl: '/images/gc-entry.svg',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  }),
  mainMarkerIcon = L.icon({
    iconUrl: '/images/gc-entry.svg',
    iconSize: [
      32, 32
    ],
    iconAnchor: [
      16, 32
    ],
    popupAnchor: [0, -32]
  });

const OverAllMarker = styled(Marker)`
  z-index: 99999;
`;

const GroupDivIcon = styled(DivIcon)`
  background-color: rgba(36, 96, 255, 0.6);
  height: 40px !important;
  width: 40px !important;
  border-radius: 50%;
  z-index: 99998 !important;

  & > div {
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin-left: -5px;
    margin-top: -5px;
    text-align: center;
    background-color: rgba(83, 177, 251, 0.5);;

    & > span {
      line-height: 50px;
      font-weight: 600;
    }
  }
`;

class GCMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelectedEntry: true,
      showVisibleEntries: true,
      localize: false,
      location: defaultCoord,
      zoom: defaultZoom,
      showSpinner: false
    }
  }

  componentWillMount() {
    let encodedParam = this.props.params.target;
    if (encodedParam && encodedParam.length > 0) {
      let decoded = atob(encodedParam);
      let params = decoded.split("&").reduce(function(prev, curr) {
        let p = curr.split("=");
        prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
        return prev;
      }, {});
      this.updateMapData(Number(params.lng), Number(params.lat), Number(params.zoom));
    }
  }

  componentDidMount() {
    if (!this.props.selectedEntry && !this.props.params.target) {
      this.setState({showSpinner: true});
      this.refs.map.leafletElement.locate({setView: true, maxZoom: 15});
    }
    let bounds = this.getCurrentBounds();
    if (bounds) {
      this.props.searchBounds(bounds);
    }
  }

  updateMapData(longitude, latitude, zoom) {
    this.props.setLocation({lat: latitude, lng: longitude});
    this.setState({
      location: {
        lat: latitude,
        lng: longitude
      }
    });
    if (zoom) {
      this.props.setZoom(zoom);
      this.setState({zoom: zoom});
    }
  }

  getCurrentBounds() {
    if (this.refs.map && this.refs.map.leafletElement) {
      let bounds = this.refs.map.leafletElement.getBounds()
      let queryString = {
        nw_lat: bounds._southWest.lat,
        nw_lng: bounds._southWest.lng,
        se_lat: bounds._northEast.lat,
        se_lng: bounds._northEast.lng
      };
      return queryString;
    }
    return undefined;
  }

  updateLocationUrl(coords, zoom) {
    let newUrl = window.location.pathname;
    let encodedLocation = btoa('lng=' + coords.lng + '&lat=' + coords.lat + '&zoom=' + zoom);
    if (this.props.params.target) {
      let pathname = _.strRightBack(window.location.pathname, '/');
      newUrl = _.replaceAll(window.location.pathname, pathname, encodedLocation);
    } else {
      newUrl += '/' + encodedLocation;
    }
    this.props.history.push(newUrl);
  }

  /* map events */
  handleMove() {
    let leafletMap = this.refs.map.leafletElement;
    let mapBounds = leafletMap.getBounds().getCenter();
    let zoom = leafletMap.getZoom();
    this.props.setLocation({lat: mapBounds.lat, lng: mapBounds.lng});
    this.props.setZoom(zoom);
    this.updateLocationUrl(mapBounds, zoom);

    let bounds = this.getCurrentBounds();
    if (bounds) {
      this.props.searchBounds(bounds);
    }
  }

  hideSpinner() {
    this.setState({showSpinner: false});
  }

  render() {
    let center = this.state.location;
    if (this.props.selectedEntry) {
      center = {
        lat: this.props.selectedEntry.latitude,
        lng: this.props.selectedEntry.longitude
      };
    }

    const marker = (this.props.selectedEntry)
      ? (<OverAllMarker icon={mainMarkerIcon} position={center}>
        <Popup autoPan={false}>
          <span>
            {this.props.selectedEntry.text}
            <br/>{this.props.selectedEntry.altitude}
            <br/>{this.props.selectedEntry.author}
          </span>
        </Popup>
      </OverAllMarker>)
      : null;

    let markersLayer = [];
    if (this.props.visibleEntries && this.props.visibleEntries.entries && this.props.visibleEntries.entries.length > 0) {
      this.props.visibleEntries.entries.forEach((entry) => {
        if (!this.props.selectedEntry || entry.id !== this.props.selectedEntry.id) {
          if (entry.name === "group") {
            markersLayer.push(<GroupDivIcon key={entry.objectId} position={{
                lat: entry.latitude,
                lng: entry.longitude
              }}>
              <div>
                <span>{entry.id}</span>
              </div>
            </GroupDivIcon>);
          } else {
            markersLayer.push(<Marker icon={smallMarkerIcon} key={entry.objectId} position={{
                lat: entry.latitude,
                lng: entry.longitude
              }}>
              <Popup autoPan={false}>
                <span>
                  <b>{entry.name}</b>
                  {
                    Object.keys(entry).map(key => <div key={key}>
                      <i>{key}</i>
                      {entry[key]}</div>)
                  }
                </span>
              </Popup>
            </Marker>);
          }
        }
      });
    }

    return (
      <Map
        className={this.props.className}
        ref='map'
        center={center}
        zoom={this.state.zoom}
        length={4}
        // onClick={this.handleEvent.bind(this)}
        // onFocus={this.handleEvent.bind(this)}
        // onAutoPanStart={this.handleEvent.bind(this)}
        // onZoomStart={this.handleEvent.bind(this)}
        // onDrag={this.handleEvent.bind(this)}
        // onZoomEnd={this.handleEvent.bind(this)}
        // onViewReset={this.handleEvent.bind(this)}
        onMoveEnd={() => this.handleMove()}
        onLocationFound={() => this.hideSpinner()}
        onLocationError={() => this.hideSpinner()}>
        {this.state.showSpinner && <Spinner size={100} text='Localization'/>}
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
        {marker}
        {markersLayer}
      </Map>
    );
  }
}

GCMap.propTypes = {
  className: PropTypes.string,
  selectedEntry: PropTypes.object,
  visibleEntries: PropTypes.object,
  searchBounds: PropTypes.func,
  setLocation: PropTypes.func.isRequired,
  setZoom: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  params: PropTypes.object
};

export default GCMap;