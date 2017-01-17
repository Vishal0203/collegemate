import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../actions/users';
import initGapi from '../store/configureGapi';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import Navbar from './Navbar';
import muiTheme from '../styles/theme/collegemate.theme';
import {toggleSnackbar} from '../actions/snackbar'
import {browserHistory} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Loader from 'halogen/ScaleLoader';
import tz from 'moment-timezone';

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {actions} = this.props;

    initGapi(() => {
      const params = {
        client_id: process.env.GOOGLE_CLIENT_ID
      };

      window.gapi.load('auth2', function () {
        window.gapi.auth2.init(params)
          .then(() => {
            const GoogleAuth = window.gapi.auth2.getAuthInstance();
            if (GoogleAuth.isSignedIn.get()) {
              const GoogleUser = GoogleAuth.currentUser.get();
              actions.oauthLogin({
                id_token: GoogleUser.getAuthResponse().id_token
              });
            }
            else {
              browserHistory.push('/login');
            }
          });
      });
    })
  }

  renderMainContent() {
    if (Object.keys(this.props.auth_user.user).length != 0) {
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
      )
    } else {
      return (
        <Row center="xs" className="initial-loader">
          <Loader color="#126B6F" size="16px" margin="5px"/>
        </Row>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderMainContent()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth_user: state.auth_user,
    snackbar: state.snackbar,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...userActions, toggleSnackbar}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);