import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../actions/users';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './Navbar';
import muiTheme from '../styles/theme/collegemate.theme';
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
          <Navbar parentProps={this.props}/>
          { React.cloneElement(this.props.children, this.props) }
        </div>
      </MuiThemeProvider>
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
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);