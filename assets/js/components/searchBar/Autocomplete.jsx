import React from 'react';
import { connect } from 'react-redux';
import { showMarker } from './../../actions/Search';

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Map from 'material-ui/svg-icons/maps/map';
import Explore from 'material-ui/svg-icons/action/explore';
import muiThemeable from 'material-ui/styles/muiThemeable';
import SearchIcon from 'material-ui/svg-icons/action/search';
import I18n from 'react-ghost-i18n';

//TODO: get grotto icons to a font
// import SvgIcon from 'material-ui/SvgIcon';
// const HomeIcon = (props) => (
//   <SvgIcon {...props}>
//     <rect x="0.5" y="0.5" fill="#FFFFFF" stroke="#1D1D1B" width="79.3" height="49"/>
//   </SvgIcon>
// );

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  onNewRequest(chosenRequest, index) {
    if ( chosenRequest.isMappable ) {
        this.props.dispatch(showMarker(chosenRequest));
    }
    if ( chosenRequest.id ) {
      window.open('http://www.grottocenter.org/html/file_En.php?lang=En&check_lang_auto=false&category='+chosenRequest.category+'&id='+chosenRequest.id,'GrottoV2Window');
    }
  }

  isMappable(obj) { // TODO : move to models
    return obj.latitude && obj.longitude?true:false;
  }

  isCave(obj) {  // TODO : move to models
    return obj.entries?true:false;
  }

  isEntry(obj) { // TODO : move to models
    return obj.caves?true:false;
  }

  foundDataToMenuItemMapping(item, i) {
    var primaryText = item.name;
    if (this.isEntry(item)) {
      primaryText+=' (' + item.region + ')';
    }
    var category = this.isEntry(item)?'entry':'cave';

    return {
      id: item.id,
      text: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: item.altitude,
      author: item.author,
      category:category,
      isMappable:this.isMappable(item),
      value: (
        <MenuItem
          primaryText={primaryText}
          leftIcon={this.isEntry(item)?<Explore />:<Map />}
        />
      )
    };
  }
  onUpdateInput(searchText) {
    if (searchText.length < 3) {
      this.setState({
        dataSource: []
      });
      return;
    }
    $.ajax({
      url: '/search/findAll?name=' +searchText,//TODO: optimize this service for autocomplete
      dataType: 'json',
      success: function(data) {
        this.setState({
          dataSource: data.map(this.foundDataToMenuItemMapping.bind(this))
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <div>
        <span className="searchIcon" style={{backgroundColor: this.props.muiTheme.palette.primary3Color}}>
          <SearchIcon color={this.props.muiTheme.palette.primary1Color} hoverColor={this.props.muiTheme.palette.accent1Color}/>
        </span>
        <AutoComplete
          style={{backgroundColor: this.props.muiTheme.palette.primary3Color, fontFamily: this.props.muiTheme.fontFamily, width: 'calc(100% - 50px)', marginLeft: '50px'}}
          textFieldStyle={{padding: '0 10px', width: 'calc(100% - 40px)'}}
          floatingLabelText={<I18n>Search for a cave or an organization</I18n>}
          dataSource={this.state.dataSource}
          onUpdateInput={this.onUpdateInput.bind(this)}
          onNewRequest={this.onNewRequest.bind(this)}
          listStyle={{color: 'green'}}
          hintStyle={{color: 'white'}}
          fullWidth={true}
          maxSearchResults={40}
          filter={AutoComplete.noFilter}
          popoverProps={{style: {height: '200px'}}}
        />
      </div>
    );
  }
}

Autocomplete = connect()(Autocomplete);

export default muiThemeable()(Autocomplete);
