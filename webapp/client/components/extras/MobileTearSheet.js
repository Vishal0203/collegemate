import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';

class MobileTearSheet extends Component {

  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number.isRequired,
  };

  static defaultProps = {
    height: 500,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const {
      prepareStyles,
    } = this.context.muiTheme;

    const styles = {
      root: {
        marginBottom: 24,
        marginRight: 24,
        maxWidth: 360,
        width: '100%',
      },
      container: {
        padding: '0 16px',
        border: 'solid 1px #d9d9d9',
        borderBottom: 'none',
        borderRadius: 2,
        height: this.props.height,
        overflow: 'hidden',
      },
      bottomTear: {
        display: 'block',
        position: 'relative',
        marginTop: -7,
        maxWidth: 360,
      },
    };

    return (
      <div style={prepareStyles(styles.root)}>
        <Paper zDepth={0}>
          <div style={prepareStyles(styles.container)}>
            {this.props.children}
          </div>
        </Paper>
        <img style={prepareStyles(styles.bottomTear)} src={require('../../styles/images/bottom-tear.svg')} />
      </div>
    );
  }
}

export default MobileTearSheet;