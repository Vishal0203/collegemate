import React, {Component} from 'react';
import Slider from 'react-slick'
import {Avatar} from 'material-ui';

class TestimonialCarousel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.getTestimonials()
  }

  renderTestimonials() {
    const {testimonials} = this.props.landing;
    const settings = {
      dots: true,
      arrows: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    if (testimonials.length > 0) {
      return (
        <Slider {...settings}>
          {
            testimonials.map((data, i) => {
              const {institute_name} = data.creator.default_institute;
              return (
                <div key={i}>
                  <p style={{color: 'white', fontWeight: 300, margin: '50px 0 0 80px', textAlign: 'justify'}}>
                    {data.message}
                  </p>
                  <div style={{marginTop: 40, color: 'white', float: 'right'}}>
                    <div style={{display: 'inline-block', position: 'relative', top: '-3px'}}>
                      <div style={{textAlign: 'right'}}>{data.creator.first_name} {data.creator.last_name}</div>
                      <div style={{fontWeight: 200}}>{institute_name}</div>
                    </div>
                    <div style={{display: 'inline-block', marginLeft: 10, position: 'relative', top: '3px'}}>
                      <Avatar src={data.creator.user_profile.user_avatar} size={45}/>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </Slider>
      )
    } else {
      return <div/>
    }
  }

  render() {
    return this.renderTestimonials();
  }
}

export default TestimonialCarousel;
