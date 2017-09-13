import React, {Component} from 'react';

class SlickNavButton extends Component {
  render() {      
    if (this.props.className=='slick-arrow slick-prev') {
      return <button {...this.props} style={{zIndex: 1}} >Next</button>
    }else if (this.props.className== 'slick-arrow slick-next') {
      return <button {...this.props} style={{zIndex: 1}} >Next</button>
    }
    return null;
  }
}

export default SlickNavButton;