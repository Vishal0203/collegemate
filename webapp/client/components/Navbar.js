import React from 'react';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {hashHistory} from 'react-router';
import {userLogout} from '../actions/users/index'
import {toggleSnackbar} from '../actions/snackbar/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Notifications from './Notifications';

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
        textAlign: 'right',
        marginBottom: 0
      },

      instituteName: {
        fontSize: 12,
        fontWeight: 200,
        color: 'rgba(255, 255, 255, 0.85)',
        cursor: 'default',
        textAlign: 'right',
        marginTop: 4
      }
    }
  }

  handleActive(tab) {
    hashHistory.push(tab.props['data-route']);
  }

  logoutUser() {
    this.props.actions.userLogout()
  };

  renderBrand() {
    const {auth_user} = this.props;
    const member_id = auth_user.selectedInstitute.user_institute_info[0].member_id;
    const designation = auth_user.selectedInstitute.user_institute_info[0].designation;

    if (member_id && designation) {
      return (
        <Link to="/" style={{textDecoration: 'none'}}>
          <ToolbarTitle style={this.styles.title} text="College"/>
          <ToolbarTitle style={{color: 'white', fontWeight: 400, paddingLeft: 1}} text="Mate"/>
        </Link>
      )
    } else {
      return (
        <div style={{cursor: 'default'}}>
          <ToolbarTitle style={this.styles.title} text="College"/>
          <ToolbarTitle style={{color: 'white', fontWeight: 400, paddingLeft: 1}} text="Mate"/>
        </div>
      )
    }
  }

  renderTabs(tabIndex) {
    const {auth_user} = this.props;
    const member_id = auth_user.selectedInstitute.user_institute_info[0].member_id;
    const designation = auth_user.selectedInstitute.user_institute_info[0].designation;
    if(member_id && designation) {
      return (
        <ToolbarGroup className="tab-container">
          <Tabs className="tabs" inkBarStyle={{ position: 'absolute', bottom: 0 }} value={tabIndex}>
            <Tab data-route="/" onActive={(tab) => this.handleActive(tab)} className="tab" label="Announcements" value='announcements'/>
            <Tab data-route="/interactions" onActive={(tab) => this.handleActive(tab)} className="tab"
                 label="Interactions" value='interactions'/>
            {/* To be enabled in next release */}
            {/*<Tab data-route="/career" onActive={(tab) => this.handleActive(tab)} className="tab" label="Career"/>*/}
          </Tabs>
        </ToolbarGroup>
      )
    }
  }

  renderUserNav() {
    const {parentProps} = this.props;
    if(Object.keys(this.props.auth_user.user).length != 0) {
      const username = `${parentProps.auth_user.user.first_name} ${parentProps.auth_user.user.last_name}`;
      const instituteName = parentProps.auth_user.selectedInstitute.institute_name;

      return (
        <ToolbarGroup >
          <Notifications/>
          <div style={{display: 'inline-block'}}>
            <p style={this.styles.username}>{username}</p>
            <p style={this.styles.instituteName}>{instituteName}</p>
          </div>
          <div style={{display: 'inline-block'}}>
            <IconMenu desktop={true}
                      iconButtonElement={
                        <IconButton style={{height: '61px'}}>
                          <Avatar src={parentProps.auth_user.user.user_profile.user_avatar} size={37}/>
                        </IconButton>
                      }
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}} >
              <MenuItem onClick={() => hashHistory.push('/settings')} primaryText="Settings"/>
              <MenuItem primaryText="Sign out" onClick={() => this.logoutUser()}/>
            </IconMenu>
          </div>
        </ToolbarGroup>
      )
    }
  }

  getTabIndex(pathname) {
    const INTERACTION_REGEX = /^\/interactions(\/.*)?/i;
    if (pathname == '/') {
      return 'announcements'
    }
    if (INTERACTION_REGEX.test(pathname)) {
      return 'interactions'
    }
    return -1
  }

  render() {
    const {currentLocation} = this.props;
    const tabIndex = this.getTabIndex(currentLocation);

    return (
      <Paper className="fixed-top">
        <Toolbar className="navbar">
          <ToolbarGroup>
            {this.renderBrand()}
          </ToolbarGroup>
          {this.renderTabs(tabIndex)}
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
