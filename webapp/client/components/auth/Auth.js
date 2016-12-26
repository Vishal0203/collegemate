import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../../actions/users/index';
import {gapiLoaded} from '../../actions/misc/index'
import initGapi from '../../store/configureGapi';
import {browserHistory} from 'react-router'

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gapi: false
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
        <div>
          <h1>Hello World!</h1>
          <button onClick={() => this.oAuthSignIn()}>Sign In</button>
        </div>
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
