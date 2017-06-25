import React, {Component} from 'react';
import Slider from 'react-slick'

class ImageCarousel extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const settings = {
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000
    };

    return (
      <Slider {...settings}>
        <div>
          <img src={require('../../styles/images/carousel/1.png')} style={{width: '100%'}} />
        </div>
        <div>
          <img src={require('../../styles/images/carousel/2.png')} style={{width: '100%'}} />
        </div>
        <div>
          <img src={require('../../styles/images/carousel/3.png')} style={{width: '100%'}} />
        </div>
        <div>
          <img src={require('../../styles/images/carousel/4.png')} style={{width: '100%'}} />
        </div>
      </Slider>
    )
  }
}

export default ImageCarousel
