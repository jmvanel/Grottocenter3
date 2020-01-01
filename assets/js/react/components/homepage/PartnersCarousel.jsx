import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './PartnersCarousel.css';
import {withGetScreen} from 'react-getscreen';

//
//
// S T Y L I N G - C O M P O N E N T S
//
//

const PartnerVignette = withTheme()(styled.div`
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 2%;
  background-color: white;
  border: 1px solid ${props => props.theme.palette.primary1Color};
  border-radius: 2%;
  overflow: hidden;
  position: relative;
  display: inline-block;
  width: 90px;
  height: 90px;

  :hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  @media (min-width: 354px) and (max-width: 515px) {
    width: 85px;
    height: 85px;
  }

  @media (min-width: 354px) {
    margin-right: 1%;
    margin-left: 1%;
  }

  @media (min-width: 708px) {
    width: 100px;
    height: 100px;
  }
`);

const PartnerImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CarouselDiv = styled.div`
  text-align: center;
`;

const PartnerItem = ({ imagePath, name, onClick }) => (
  <PartnerVignette>
    <PartnerImage src={imagePath} alt={name} onClick={onClick} />
  </PartnerVignette>
);

PartnerItem.propTypes = {
  imagePath: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
};

//
//
// M A I N - C O M P O N E N T
//
//

class PartnersCarousel extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch();
  }

  render() {
    let numberOfVignettesPerSlide = 5;

    if (this.props.isMobile()) numberOfVignettesPerSlide = 3;
    else if (this.props.isTablet()) numberOfVignettesPerSlide = 4;

    const rows = this.props.partners ? Array.from(Array(Math.ceil(this.props.partners.length / numberOfVignettesPerSlide)), () => new Array()) : [];
    
    this.props.partners
      && this.props.partners.forEach((partner, index) => {
        rows[(Math.ceil((index+1)/numberOfVignettesPerSlide) - 1)].push(
          <PartnerItem
            key={`partcs-${partner.id}`}
            imagePath={`/images/partners/${partner.pictureFileName}`}
            alt={partner.name}
            onClick={() => window.open(partner.customMessage, 'grotto_partner')}
          />,
        );
      });
    
    if (this.props.isFetching) {
      return (<CircularProgress />);
    }
    if (rows.length > 0) {
      return (
        <CarouselDiv>
          <AliceCarousel 
            mouseTrackingEnabled
            buttonsDisabled={true}
            autoPlayInterval={10000}
            autoPlay={true}   
          >
            { rows.map(partnersSlide => CarouselSlide(partnersSlide)) }
          </AliceCarousel> 
        </CarouselDiv>
      );
    }
    return "";
  }
}

// represents the content of one slide of the carousel
function CarouselSlide(props) {
  return (
    <div>
      { props.map(partner => partner) }
    </div>    
  )
}

PartnersCarousel.propTypes = {
  fetch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  partners: PropTypes.any,
};

export default withGetScreen(PartnersCarousel);
