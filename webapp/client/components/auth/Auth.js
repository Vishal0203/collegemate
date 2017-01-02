import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../../actions/users/index';
import {gapiLoaded} from '../../actions/misc/index'
import initGapi from '../../store/configureGapi';
import {browserHistory, Link} from 'react-router';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../../styles/theme/collegemate.theme';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gapi: false
    }
  }

  get styles() {
    return {
      title: {
        fontWeight: 200,
        paddingRight: 1,
        color: 'white',
        fontSize: 35
      },
      signin: {
        position: 'relative',
        fontFamily: 'Roboto',
        fontWeight: 400,
        height: '40px',
        width: '200px',
        fontSize: '14px',
        color: 'rgba(0, 0, 0, 0.54)',
        textAlign: 'initial',
        marginTop: '40px',
        padding: 8
      }
    }
  }

  componentDidMount() {
    const _scope = this;

    initGapi(() => {
      const params = {
        client_id: process.env.GOOGLE_CLIENT_ID
      };

      window.gapi.load('auth2', function () {
        window.gapi.auth2.init(params)
          .then(() => {
            _scope.setState({gapi: true});
            const GoogleAuth = window.gapi.auth2.getAuthInstance();
            if (GoogleAuth.isSignedIn.get()) {
              browserHistory.push('/');
            }
          });
      });
    })
  }

  oAuthSignIn() {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    GoogleAuth.signIn({scope: 'profile email'})
      .then(
        (res) => {
          browserHistory.push('/');
        },
        (err) => {
          console.log(err)
        }
      )
  }

  renderAuthContent() {
    if (this.state.gapi) {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <div className="auth-background"></div>
            <Paper className="fixed-top bg-transparent">
              <Toolbar className="bg-transparent" style={{height: 120, padding: '20px 0 0 50px'}}>
                <ToolbarGroup>
                  <ToolbarTitle style={this.styles.title} text="College"/>
                  <ToolbarTitle style={{color: 'white', fontWeight: 400, paddingLeft: 1, fontSize: 35}} text="Mate"/>
                </ToolbarGroup>
              </Toolbar>
              <div className="auth-content">
                <Row>
                  <Col xs={12}>
                    <Row center="xs">
                      <Col xs={6} style={{fontSize: 47, fontWeight: 400, marginTop: 40}}>
                        <div>Your perfect college partner</div>
                        <button style={this.styles.signin} onClick={() => this.oAuthSignIn()}>
                          <div className="gsvg"></div>
                          <div style={{display: 'inline-block', paddingLeft: 42, height: 18, lineHeight: '18px', fontWeight: 500}}>
                            Sign in with Google
                          </div>
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Paper>
          </div>
        </MuiThemeProvider>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderAuthContent()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth_user: state.auth_user,
    misc: state.misc
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...userActions, gapiLoaded}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
