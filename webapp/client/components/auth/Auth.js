import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../../actions/users/index';
import * as landingActions from '../../actions/landing/index';
import initGapi from '../../store/configureGapi';
import {hashHistory} from 'react-router';
import muiTheme from '../../styles/theme/collegemate.theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Toolbar, ToolbarGroup, ToolbarTitle, FlatButton, RaisedButton, Paper, List, Divider
} from 'material-ui';
import {Row, Col} from 'react-flexbox-grid';
import ScrollMagic from 'ScrollMagic';
import 'animation.gsap';
import 'debug.addIndicators';
import CustomListItem from './CustomListItem';
import data from './data.json';
import ImageCarousel from './ImageCarousel';
import TestimonialCarousel from './TestimonialCarousel';
import Jobs from './Jobs';
import GuestTalks from './GuestTalks';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gapi: false,
      sm_controller: new ScrollMagic.Controller(),
      sm_scene: null
    }
  }

  get styles() {
    return {
      title: {
        fontWeight: 200,
        paddingRight: 1,
        color: 'white',
        fontSize: 22
      },
      signin: {
        fontSize: 15,
        fontWeight: 200,
        color: 'white',
        textTransform: 'capitalize'
      },
      header: {
        background: null,
        position: 'relative'
      },
      headerContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        top: '35%'
      },
      companyContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        top: '80%'
      },
      heading: {
        color: 'white',
        fontSize: '6vmin',
        fontWeight: '300',
        margin: '15px 0'
      }
    }
  }

  componentDidMount() {
    const _scope = this;

    const load_sm_scene = () => {
      const scene = new ScrollMagic.Scene({
        triggerElement: ReactDOM.findDOMNode(this.refs.trigger)
      })
        .setClassToggle(ReactDOM.findDOMNode(this.refs.navbar), 'landing-nav')
        .setTween(ReactDOM.findDOMNode(this.refs.navbar), 0.5, {height: '60px'})
        .addTo(this.state.sm_controller);

      this.setState({sm_scene: scene});
    };

    initGapi(() => {
      const params = {
        client_id: process.env.GOOGLE_CLIENT_ID
      };

      window.gapi.load('auth2', function () {
        window.gapi.auth2.init(params)
          .then(() => {
            const GoogleAuth = window.gapi.auth2.getAuthInstance();
            if (GoogleAuth.isSignedIn.get()) {
              hashHistory.push('/announcements');
            } else {
              _scope.setState({gapi: true}, load_sm_scene);
            }
          });
      });
    })
  }

  componentWillUnmount() {
    this.setState({
      sm_controller: this.state.sm_controller.destroy(true),
      sm_scene: this.state.sm_scene.destroy(true)
    })
  }

  oAuthSignIn() {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    GoogleAuth.signIn({scope: 'profile email', prompt: 'select_account'})
      .then((res) => {
        hashHistory.push('/announcements');
      }, (err) => {
        console.log(err)
      })
  }

  renderAuthContent() {
    if (this.state.gapi) {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <div className="overlay">
              <div style={{position: 'relative', top: '35vh'}}>
                <Paper zDepth={0} style={this.styles.headerContainer}>
                  <div className="wrap">
                    <h1 style={{...this.styles.heading, fontSize: '4vmin'}}>
                      Helping to bridge gap between Students & Companies
                    </h1>
                    <RaisedButton
                      onClick={() => this.oAuthSignIn()}
                      label="Get Started Here"
                      labelStyle={{fontWeight: 400}}
                      style={{marginTop: 20}}
                    />
                    <div style={{marginTop: '20vh'}} ref="trigger"/>
                  </div>
                </Paper>
              </div>
              <div className="auth-background"/>
            </div>
            <div className="skew-block" style={{background: '#fafafa'}}>
              <Row className="skew-row" style={{marginRight: '0px'}}>
                <Col md={8} lg={8} xs={12}>
                  <Paper zDepth={0} className="skew-block-text-container" style={{top: '25vh'}}>
                    <div className="wrap" style={{width: '75%'}}>
                      <h1 style={this.styles.heading}>Students</h1>
                      <Divider style={{width: 85}}/>
                      <p style={{fontSize: '3vmin', color: 'white', fontWeight: 300, lineHeight: '32px'}}>
                        When you register yourself at college mate, you get access to all this, and a lot more.
                      </p>
                    </div>
                  </Paper>
                  <div className="student-content"/>
                </Col>
                <Col md={4} lg={4} xs={12}>
                  <Paper zDepth={0} className="skew-block-text-container">
                    <div className="wrap">
                      <List>
                        {data.students.map((content, i) => {
                          return <CustomListItem key={i} {...content}/>
                        })}
                      </List>
                    </div>
                  </Paper>
                  <div className="student-background"/>
                </Col>
              </Row>
            </div>
            <div className="skew-block" style={{background: '#fafafa'}}>
              <Row className="skew-row" style={{marginRight: '0px'}}>
                <Col md={8} lg={8} xs={12}>
                  <Paper zDepth={0} className="skew-block-text-container">
                    <div className="wrap" style={{width: '27rem'}}>
                      <h1 style={{
                        ...this.styles.heading,
                        fontSize: 25,
                        textAlign: 'center',
                        color: '#212121',
                        marginTop: 10
                      }}>
                        Sneak Peek
                      </h1>
                      <div style={{textAlign: 'center', marginTop: 40}}>
                        <ImageCarousel/>
                        <div style={{position: 'absolute', left: 0, right: 0, top: 60, zIndex: 999}}>
                          <img src={require('../../styles/images/imac.png')} style={{width: '29rem'}}/>
                        </div>
                      </div>
                    </div>
                  </Paper>
                  <div className="company-content"/>
                </Col>
                <Col md={4} lg={4} xs={12}>
                  <Paper zDepth={0} className="skew-block-text-container">
                    <div className="wrap">
                      <h1 style={{...this.styles.heading, fontSize: 20, textAlign: 'center', marginTop: 20}}>
                        Some recent Jobs
                      </h1>
                      <Jobs {...this.props}/>
                      <RaisedButton
                        onClick={() => this.oAuthSignIn()}
                        label="Sign In to see more"
                        fullWidth={true}
                        labelStyle={{fontWeight: 400, fontSize: 12}}
                        style={{marginTop: 20}}
                      />
                    </div>
                  </Paper>
                  <div className="company-background"/>
                </Col>
              </Row>
            </div>
            <div className="skew-block" style={{background: '#fafafa'}}>
              <Row className="skew-row" style={{marginRight: '0px'}}>
                <Col md={8} lg={8} xs={12}>
                  <Paper zDepth={0} className="skew-block-text-container" style={{top: '10vh'}}>
                    <div className="wrap" style={{width: '75%'}}>
                      <h1 style={{...this.styles.heading, fontSize: '4vmin'}}>Testimonials</h1>
                      <Divider style={{width: 85}}/>
                      <p style={{
                        fontSize: '10vmin',
                        color: 'rgba(255, 255, 255, 0.2)',
                        margin: '20px 0 0',
                        display: 'inline-block',
                        position: 'absolute'
                      }}>
                        <i className="fa fa-quote-left" aria-hidden="true"/>
                      </p>
                      <TestimonialCarousel {...this.props}/>
                    </div>
                  </Paper>
                  <div className="testimonials-content"/>
                </Col>
                <Col md={4} lg={4} xs={12}>
                  <Paper zDepth={0} className="skew-block-text-container">
                    <GuestTalks/>
                  </Paper>
                  <div className="student-background"/>
                </Col>
              </Row>
            </div>
            <div className="footer"/>
            <Paper className="fixed-top bg-transparent">
              <Toolbar style={{height: 80, backgroundColor: 'transparent'}} ref="navbar">
                <ToolbarGroup>
                  <ToolbarTitle style={this.styles.title} text="College"/>
                  <ToolbarTitle style={{color: 'white', fontWeight: 400, paddingLeft: 1, fontSize: 22}}
                                text="Mate"/>
                </ToolbarGroup>
                <ToolbarGroup>
                  <FlatButton
                    onClick={() => this.oAuthSignIn()}
                    label="Sign In"
                    labelStyle={this.styles.signin}
                    style={{margin: 0}}
                  />
                </ToolbarGroup>
              </Toolbar>
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
    landing: state.landing
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...userActions, ...landingActions}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
