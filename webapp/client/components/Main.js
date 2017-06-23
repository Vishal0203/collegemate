import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../actions/users';
import * as categoryActions from '../actions/categories';
import initGapi from '../store/configureGapi';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './Navbar';
import muiTheme from '../styles/theme/collegemate.theme';
import {toggleSnackbar, toggleErrorDialog} from '../actions/commons/index';
import {hashHistory} from 'react-router';
import {Row} from 'react-flexbox-grid';
import Loader from 'halogenium/ScaleLoader';
import {Dialog, Snackbar, FlatButton} from 'material-ui';
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
            } else {
              hashHistory.push('/login');
            }
          });
      });
    })
  }

  renderQuote() {
    const quotes = [
      'You look amazing today.',
      'How\'s the day going?',
      'Starting our engines, hold tight!',
      'You\'re the best human alive!',
      'Bad days don\'t stay for long.',
      'Improvise, Adapt, Overcome.',
      'Have a great day ahead.',
      'Make someone smile today.'
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  renderMainContent() {
    if (Object.keys(this.props.auth_user.user).length !== 0) {
      const actions = [
        <FlatButton label="Okay" primary={true} onTouchTap={this.props.actions.toggleErrorDialog}/>
      ];

      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <Navbar currentLocation={this.props.location.pathname} parentProps={this.props}/>
            {React.cloneElement(this.props.children, this.props)}
            <Snackbar
              open={this.props.snackbar.open}
              message={this.props.snackbar.text}
              autoHideDuration={4000}
              onRequestClose={() => this.props.actions.toggleSnackbar()}
            />
            <Dialog
              modal={true}
              actions={actions}
              open={this.props.errorDialog.open}
              onRequestClose={() => this.props.actions.toggleErrorDialog()}>
              Oops, something went wrong. We will have a look at it!
            </Dialog>
          </div>
        </MuiThemeProvider>
      )
    } else {
      return (
        <div style={{display: 'table', width: '100vw', height: '100vh'}}>
          <Row center="xs" className="initial-loader">
            <Loader color="#126B6F" size="16px" margin="5px"/>
            <h3 style={{marginTop: 20}}>{this.renderQuote()}</h3>
          </Row>
        </div>
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
    category: state.category,
    errorDialog: state.errorDialog,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...userActions, ...categoryActions, toggleSnackbar, toggleErrorDialog}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);