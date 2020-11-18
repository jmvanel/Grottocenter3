import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button as MuiButton } from '@material-ui/core';
import ConvertIcon from '@material-ui/icons/Transform';
import { useIntl } from 'react-intl';
import { isEmpty } from 'ramda';
import CustomControl, { customControlProps } from '../CustomControl';
import StandardDialog from '../../StandardDialog';
import Convert from '../main/Convert';

const Wrapper = styled.div`
  background: white;
`;

const Button = styled(MuiButton)`
  background-color: white;
`;

const ConverterControl = ({ projectionsList = [], ...props }) => {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <CustomControl position="bottomleft" {...props}>
      <Wrapper>
        <Button
          aria-label="data-control"
          onClick={handleOpenMenu}
          startIcon={<ConvertIcon fontSize="inherit" />}
          disabled={isEmpty(projectionsList)}
        >
          {formatMessage({ id: 'Converter' })}
        </Button>
      </Wrapper>
      {!isEmpty(projectionsList) && (
        <StandardDialog
          title={formatMessage({ id: 'Converter' })}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Convert list={projectionsList} />
        </StandardDialog>
      )}
    </CustomControl>
  );
};

ConverterControl.propTypes = {
  position: PropTypes.oneOf([
    'topright',
    'topleft',
    'bottomright',
    'bottomleft',
  ]),
  customControlProps,
  projectionsList: PropTypes.arrayOf(PropTypes.any),
};

export default ConverterControl;
