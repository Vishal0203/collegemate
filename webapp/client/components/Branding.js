import Paper from 'material-ui/Paper';
import React, {Component, PropTypes} from 'react';
import {grey500} from 'material-ui/styles/colors';
import {Grid, Row, Col} from 'react-flexbox-grid';

class Branding extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Paper zDepth={0} className="paper-style" style={{textAlign: 'left', marginTop: 30}}>
        <div style={{fontSize: 12, color: grey500, marginLeft: 2}}>
          ToDevs &#x24B8; 2017, <a style={{color: grey500}} href="https://www.facebook.com/thetodevs/" target="_blank">Like Us</a>
        </div>
      </Paper>
    );
  }
}

export default Branding;