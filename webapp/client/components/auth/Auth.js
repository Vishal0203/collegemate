import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../../actions/users/index';
import initGapi from '../../store/configureGapi';
import {browserHistory, Link} from 'react-router';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../../styles/theme/collegemate.theme';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';

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
        fontSize: 20,
        fontWeight: 200,
        color: 'white',
        textTransform: 'capitalize'
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
            const GoogleAuth = window.gapi.auth2.getAuthInstance();
            if (GoogleAuth.isSignedIn.get()) {
              browserHistory.push('/');
            } else {
              _scope.setState({gapi: true});
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
              <Toolbar className="bg-transparent" style={{height: 120, padding: '0 7px 0 40px'}}>
                <ToolbarGroup>
                  <ToolbarTitle style={this.styles.title} text="College"/>
                  <ToolbarTitle style={{color: 'white', fontWeight: 400, paddingLeft: 1, fontSize: 35}} text="Mate"/>
                </ToolbarGroup>
                <ToolbarGroup>
                  <FlatButton onClick={() => this.oAuthSignIn()}
                              label="Sign In"
                              labelStyle={this.styles.signin}
                              hoverColor="#00FFFFFF"
                  />
                </ToolbarGroup>
              </Toolbar>
            </Paper>

            <div className="auth-footer">
              <Grid>
                <Row center="xs">
                  <Col xs={10}>
                    <Paper style={{backgroundColor: 'rgba(225, 225, 225, 0)', boxShadow: 'none', color: 'white'}}>
                      <Row style={{cursor: 'default'}}>
                        <Col xs={6}>
                          <i className="material-icons footer-icon">announcement</i>
                          <div className="footer-heading">Announcements</div>
                          <div style={{marginTop: 10, fontSize: 13, fontWeight: 300, fontStyle: 'italic'}}>
                            Catch up on the activities your college is upto <br/>
                            from anywhere. You can also download documents <br/>
                            shared with you by your college.
                          </div>
                        </Col>
                        <Col xs={6}>
                          <i className="material-icons footer-icon">question_answer</i>
                          <div className="footer-heading" >Interactions</div>
                          <div style={{marginTop: 10, fontSize: 13, fontWeight: 300, fontStyle: 'italic'}}>
                            Have a question? Shoot it right away! <br/>
                            You can also interact with your college officials, your <br/>
                            college mates and college alumini.
                          </div>
                        </Col>
                      </Row>
                    </Paper>
                  </Col>
                </Row>
              </Grid>
            </div>
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
    auth_user: state.auth_user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...userActions}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
