import React, { Component } from 'react';
import PropTypes, { checkPropTypes } from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './PartnersCarousel.css';

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
  height: 100px;
  overflow: hidden;
  position: relative;
  width: 100px;
  display: inline-block;

  :hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  @media (min-width: 550px) {
    margin-right: 1%;
    margin-left: 1%;
    margin-bottom: 2%;
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
    const rows = this.props.partners ? Array.from(Array(Math.ceil(this.props.partners.length / 5)), () => new Array()) : [];
    
    this.props.partners
      && this.props.partners.forEach((partner, index) => {
        rows[(Math.ceil((index+1)/5) - 1)].push(
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

export default PartnersCarousel;
