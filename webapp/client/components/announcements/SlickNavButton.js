import React, {Component} from 'react';

class SlickNavButton extends Component {
  render() {
    const {className, style, onClick, onTouchTap} = this.props;

    if (this.props.className === 'slick-arrow slick-prev') {
      return <button className={className}
                     onClick={onClick}
                     onTouchTap={onTouchTap}
                     style={{...style, zIndex: 1}}>Prev</button>
    } else if (this.props.className === 'slick-arrow slick-next') {
      return <button className={className}
                     onClick={onClick}
                     onTouchTap={onTouchTap}
                     style={{...style, zIndex: 1}}>Next</button>
    }
    return null;
  }
}

export default SlickNavButton;