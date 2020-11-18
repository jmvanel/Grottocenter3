import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useIntl } from 'react-intl';
import { includes, without } from 'ramda';
import CustomControl, { customControlProps } from '../CustomControl';

export const heatmapTypes = {
  ENTRANCES: 'entrances',
  NETWORKS: 'networks',
  NONE: 'none',
};
const markerTypes = {
  ORGANIZATIONS: 'organizations',
};

const Wrapper = styled.div`
  background: white;
`;

const IconButton = styled(MuiIconButton)`
  // override leaflet properties
  background-image: none;
`;

const DataControl = ({ updateHeatmap, updateMarkers, ...props }) => {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHeatmap, setSelectedHeatmap] = useState(
    heatmapTypes.ENTRANCES,
  );
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (type, selection) => () => {
    if (type === 'heat') {
      setSelectedHeatmap(selection);
      updateHeatmap(selection);
    }
    if (type === 'markers') {
      updateMarkers(
        includes(selection, selectedMarkers)
          ? without(selection, selectedMarkers)
          : [...selectedMarkers, selection],
      );
      setSelectedMarkers(
        includes(selection, selectedMarkers)
          ? without(selection, selectedMarkers)
          : [...selectedMarkers, selection],
      );
    }
  };

  return (
    <CustomControl {...props}>
      <Wrapper>
        <IconButton
          className="leaflet-control-layers-toggle"
          aria-label="data-control"
          onMouseOver={handleOpenMenu}
          onClick={handleOpenMenu}
          onFocus={handleOpenMenu}
        >
          <VisibilityIcon fontSize="inherit" />
        </IconButton>
      </Wrapper>
      <Menu
        id="data-menu-selection"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
        <MenuItem disabled>{formatMessage({ id: 'heat map' })}</MenuItem>
        <RadioGroup aria-label="heatmap" name="heatmap" value={selectedHeatmap}>
          <MenuItem onChange={handleChange('heat', heatmapTypes.ENTRANCES)}>
            <FormControlLabel
              value={heatmapTypes.ENTRANCES}
              control={<Radio size="small" />}
              label={formatMessage({ id: heatmapTypes.ENTRANCES })}
            />
          </MenuItem>
          <MenuItem onChange={handleChange('heat', heatmapTypes.NETWORKS)}>
            <FormControlLabel
              value={heatmapTypes.NETWORKS}
              control={<Radio size="small" />}
              label={formatMessage({ id: heatmapTypes.NETWORKS })}
            />
          </MenuItem>
          <MenuItem onClick={handleChange('heat', heatmapTypes.NONE)}>
            <FormControlLabel
              value={heatmapTypes.NONE}
              control={<Radio size="small" />}
              label={formatMessage({ id: heatmapTypes.NONE })}
            />
          </MenuItem>
        </RadioGroup>
        <MenuItem disabled>{formatMessage({ id: 'markers' })}</MenuItem>
        <FormGroup>
          <MenuItem
            onChange={handleChange('markers', markerTypes.ORGANIZATIONS)}
          >
            <FormControlLabel
              control={
                <Checkbox size="small" name={markerTypes.ORGANIZATIONS} />
              }
              label={formatMessage({ id: markerTypes.ORGANIZATIONS })}
            />
          </MenuItem>
        </FormGroup>
      </Menu>
    </CustomControl>
  );
};

const MemoizedDataControl = React.memo(DataControl);

DataControl.propTypes = {
  updateHeatmap: PropTypes.func.isRequired,
  updateMarkers: PropTypes.func.isRequired,
  position: PropTypes.oneOf([
    'topright',
    'topleft',
    'bottomright',
    'bottomleft',
  ]),
  customControlProps,
};

MemoizedDataControl.propTypes = DataControl.propTypes;

export default MemoizedDataControl;
