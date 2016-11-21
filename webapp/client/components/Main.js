import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../actions/users';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import Navbar from './Navbar';
import muiTheme from '../styles/theme/collegemate.theme';
import {toggleSnackbar} from '../actions/snackbar'
import tz from 'moment-timezone';

class Main extends React.Component {
  constructor(props) {
    super(props);
    props.actions.userLogin()
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Navbar currentLocation={this.props.location.pathname} parentProps={this.props}/>
          { React.cloneElement(this.props.children, this.props) }
          <Snackbar
              open={this.props.snackbar.open}
              message={this.props.snackbar.text}
              autoHideDuration={4000}
              onRequestClose={() => this.props.actions.toggleSnackbar()}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth_user: state.auth_user,
    snackbar: state.snackbar
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...userActions, toggleSnackbar}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);