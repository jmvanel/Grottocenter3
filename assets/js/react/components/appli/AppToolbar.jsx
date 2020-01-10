import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/icons/Menu';
import { withStyles, withTheme } from '@material-ui/core';
import styled from 'styled-components';
import { isMobile, isBrowser } from 'react-device-detect';
import HeaderTitle from './HeaderTitle';
import SideMenuBurgerConnector from '../../containers/SideMenuBurgerConnector';
import { sideMenuWidth } from '../../conf/Config';
import Translate from '../common/Translate';
import QuickSearch from './QuickSearch'

//
//
// S T Y L I N G - C O M P O N E N T S
//
//

const StyledToolbar = withStyles((theme) => ({
  root: {
    width: '100%',
    padding: '0px',
    backgroundColor: theme.palette.primary2Color,
    height: '60px',
    display: 'inline-flex',
    justifyContent: 'space-between',
  },
}), { withTheme: true })(Toolbar);

// Center in the parent div using absolute because the Grottocenter logo is taking some place on the left.
const StyledPageTitle = withTheme()(styled.span`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  @media (max-width: 500px) {
    position: initial;
  }
`);

const StyledPageTitleText = withTheme()(styled.span`
  color: ${(props) => props.theme.palette.primary3Color};
  font-size: 4rem;
`);

const TitleGroup = withStyles(() => ({
  root: {
    width: sideMenuWidth,
    padding: '0px',
    alignItems: 'center',
    height: '60px',
    marginRight: 'auto',
    marginLeft: '30px',
  },
}), { withTheme: true })(Toolbar);

const WhiteMenu = withStyles(() => ({
  root: {
    color: '#fff',
    marginLeft:'10px',
  },
}), { withTheme: true })(Menu);




//
//
// M A I N - C O M P O N E N T
//
//



const AppToolbar = (props) => {
  const { pageTitle } = props;
  const PageTitleComponent = pageTitle ? (
    <StyledPageTitle>
      <StyledPageTitleText>
        <Translate>{pageTitle}</Translate>
      </StyledPageTitleText>
    </StyledPageTitle>
  ) : '';


  return (
    <StyledToolbar>
      {isMobile && (
          <WhiteMenu />
      )
      }

      {isBrowser && (
        <TitleGroup>
          <HeaderTitle title="GrottoCenter" subtitle="Achere - 2018" />
          <SideMenuBurgerConnector />
        </TitleGroup>
      )}
      {PageTitleComponent}
      
      {isMobile && (
        <QuickSearch />
      )
      }
    </StyledToolbar>
  );

};

AppToolbar.propTypes = {
  pageTitle: PropTypes.string,
};
AppToolbar.defaultProps = {
  pageTitle: '',
};

export default AppToolbar;
