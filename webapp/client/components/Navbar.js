import React from 'react';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {browserHistory} from 'react-router';
import {userLogout} from '../actions/users/index'
import {toggleSnackbar} from '../actions/snackbar/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Navbar extends React.Component {

  constructor(props) {
    super(props);
  }

  get styles() {
    return {
      title: {
        fontWeight: 200,
        paddingRight: 1,
        color: 'white'
      },

      username: {
        fontSize: 14,
        fontWeight: 300,
        color: 'rgba(255, 255, 255, 0.85)',
        cursor: 'default',
        paddingRight: 0,
        position: 'absolute',
        right: '48px',
        minHeight: '28px',
        lineHeight: '28px',
        top: '5px'
      },

      instituteName: {
        fontSize: 12,
        fontWeight: 100,
        color: 'rgba(255, 255, 255, 0.85)',
        cursor: 'default',
        paddingRight: 0,
        position: 'absolute',
        right: '48px',
        minHeight: '28px',
        lineHeight: '28px',
        bottom: '5px'
      }
    }
  }

  handleActive(tab) {
    browserHistory.push(tab.props['data-route']);
  }

  logoutUser() {
    this.props.actions.userLogout()
  };

  renderUserNav() {
    const {parentProps} = this.props;
    if(Object.keys(this.props.auth_user.user).length != 0) {
      const username = `${parentProps.auth_user.user.first_name} ${parentProps.auth_user.user.last_name}`;
      const instituteName = parentProps.auth_user.selectedInstitute.institute_name;

      return (
        <ToolbarGroup >
          <ToolbarTitle style={this.styles.username} text={username}/>
          <ToolbarTitle style={this.styles.instituteName} text={instituteName}/>
          <IconMenu desktop={true}
                    iconButtonElement={
                      <IconButton style={{height: '61px'}}>
                        <Avatar src={parentProps.auth_user.user.user_profile.user_avatar} size={37}/>
                      </IconButton>
                    }
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}} >

            <MenuItem primaryText="Refresh"/>
            <MenuItem primaryText="Send feedback"/>
            <MenuItem primaryText="Settings"/>
            <MenuItem primaryText="Help"/>
            <Divider />
            <MenuItem primaryText="Sign out" onClick={() => this.logoutUser()}/>
          </IconMenu>
        </ToolbarGroup>
      )
    }
  }

  getTabIndex(pathname) {
    const INTERACTION_REGEX = /^\/interactions(\/.*)?/i;

    if (pathname == '/') {
      return 0
    }

    if (INTERACTION_REGEX.test(pathname)) {
      return 1
    }
  }

  render() {
    const {currentLocation} = this.props;
    const tabIndex = this.getTabIndex(currentLocation);

    return (
      <Paper className="fixed-top">
        <Toolbar className="navbar">
          <ToolbarGroup>
            <Link to="/" style={{textDecoration: 'none'}}>
              <ToolbarTitle style={this.styles.title} text="College"/>
              <ToolbarTitle style={{color: 'white', fontWeight: 400, paddingLeft: 1}} text="Mate"/>
            </Link>
          </ToolbarGroup>
          <ToolbarGroup className="tab-container">
            <Tabs className="tabs" inkBarStyle={{ position: 'absolute', bottom: 0 }} initialSelectedIndex={tabIndex}>
              <Tab data-route="/" onActive={(tab) => this.handleActive(tab)} className="tab" label="Announcements"/>
              <Tab data-route="/interactions" onActive={(tab) => this.handleActive(tab)} className="tab"
                   label="Interactions"/>
              {/* To be enabled in next release */}
              {/*<Tab data-route="/career" onActive={(tab) => this.handleActive(tab)} className="tab" label="Career"/>*/}
            </Tabs>
          </ToolbarGroup>

          {this.renderUserNav()}

        </Toolbar>
      </Paper>
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
    actions: bindActionCreators({userLogout, toggleSnackbar}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
