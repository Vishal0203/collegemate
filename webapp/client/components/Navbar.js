import React from 'react';
import {hashHistory, Link} from 'react-router';
import {userLogout} from '../actions/users/index'
import {toggleSnackbar} from '../actions/commons/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {humanizeRoles} from './extras/utils';
import {grey500} from 'material-ui/styles/colors';
import Notifications from './Notifications';
import {
  CardText, Divider, FontIcon, MenuItem, Menu, Popover,
  IconMenu, Toolbar, ToolbarGroup, ToolbarTitle, IconButton,
  Tabs, Tab, Paper, Avatar
} from 'material-ui';


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      institutePopover: false,
      userMenu: false,
    };
  }

  onInstituteTouch = (event) => {
    event.preventDefault();

    this.setState({
      institutePopover: true,
      userMenu: false,
      anchorEl: event.currentTarget,
    });
  };

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
        textTransform: 'capitalize',
        margin: 0
      },

      instituteName: {
        fontSize: 12,
        fontWeight: 200,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'right',
        cursor: 'pointer',
        margin: '4px 0 0'
      },

      footer: {
        fontSize: 13,
        padding: 0,
        fontWeight: 400,
        textAlign: 'center'
      }
    }
  }

  logoutUser() {
    this.props.actions.userLogout()
  };

  renderBrand() {
    const {auth_user} = this.props;
    let member_id, designation;
    if (Object.keys(auth_user.selectedInstitute).length !== 0) {
      member_id = auth_user.selectedInstitute.user_institute_info[0].member_id;
      designation = auth_user.selectedInstitute.user_institute_info[0].designation;
    }

    if (Object.keys(auth_user.selectedInstitute).length !== 0 && member_id && designation) {
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
    if (Object.keys(auth_user.selectedInstitute).length !== 0) {
      const {member_id, designation, invitation_status} = auth_user.selectedInstitute.user_institute_info[0];

      if (member_id && designation && invitation_status === 'accepted') {
        return (
          <ToolbarGroup className="tab-container">
            <Tabs className="tabs" inkBarStyle={{position: 'absolute', bottom: 0}} value={tabIndex}>
              <Tab data-route="/announcements"
                   onActive={(tab) => hashHistory.push(tab.props['data-route'])}
                   className="tab"
                   label="Announcements"
                   value='announcements'/>
              <Tab data-route="/interactions"
                   onActive={(tab) => hashHistory.push(tab.props['data-route'])}
                   className="tab"
                   label="Interactions"
                   value='interactions'/>
              {/* To be enabled in next release */}
              {/*<Tab data-route="/career" onActive={(tab) => hashHistory.push(tab.props['data-route'])} className="tab" label="Career"/>*/}
            </Tabs>
          </ToolbarGroup>
        )
      }
    }
  }

  addInstitute = () => {
    this.setState({institutePopover: false});
    hashHistory.replace('/institute')
  };

  changeInstitute = (institute_guid) => {
    this.props.parentProps.actions.changeSelectedInstitute(institute_guid);
    this.setState({institutePopover: false});
  };

  renderUserNav() {
    const {parentProps} = this.props;
    const {auth_user} = this.props;
    if (Object.keys(auth_user.selectedInstitute).length !== 0 && Object.keys(this.props.auth_user.user).length !== 0) {
      const username = `${parentProps.auth_user.user.first_name} ${parentProps.auth_user.user.last_name}`;
      const instituteName = parentProps.auth_user.selectedInstitute.institute_name;

      return (
        <ToolbarGroup >
          <Notifications />
          <div style={{display: 'inline-block'}}>
            <p style={this.styles.username}>{username} </p>
            <p style={this.styles.instituteName} onClick={this.onInstituteTouch}>{instituteName}</p>
            <p style={{position: 'absolute', top: 46, right: 46, margin: 0}}>
              <FontIcon className={
                this.state.institutePopover ?
                  'material-icons arrow-up visible' :
                  'material-icons arrow-up hidden'
              }>
                arrow_drop_up
              </FontIcon>
            </p>

            <Popover
              open={this.state.institutePopover}
              className="navbar-popover"
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              onRequestClose={() => this.setState({institutePopover: false})}
            >
              <Menu width={320} maxHeight={450}>
                {auth_user.user.institutes.map((institute, index) =>
                  <div key={index}>
                    <CardText style={{padding: 8, cursor: 'pointer'}}
                              onClick={() => this.changeInstitute(institute.inst_profile_guid)}>
                      <div>
                        {institute.institute_name}
                      </div>
                      <div style={{fontSize: 12, marginTop: 5, color: grey500}}>
                        {humanizeRoles(institute.pivot.role)}
                      </div>
                    </CardText>
                    <Divider className="card-divider"/>
                  </div>
                )}
                <CardText style={this.styles.footer}>
                  <span style={{cursor: 'pointer'}} onTouchTap={this.addInstitute}>
                    Add Institute
                  </span>
                </CardText>
              </Menu>
            </Popover>
          </div>
          <div style={{display: 'inline-block'}}>
            <IconMenu desktop={true}
                      iconButtonElement={
                        <IconButton style={{height: 56, padding: 10}}>
                          <Avatar src={parentProps.auth_user.user.user_profile.user_avatar} size={38}/>
                        </IconButton>
                      }
                      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      open={this.state.userMenu}
                      onRequestChange={(open) => this.setState({userMenu: open})}>
              <MenuItem onClick={() => hashHistory.push('/institute_settings')} primaryText="Institute Settings"/>
              <MenuItem onClick={() => hashHistory.push('/settings')} primaryText="User Settings"/>
              <Divider />
              <MenuItem primaryText="Sign out" onClick={() => this.logoutUser()}/>
            </IconMenu>
          </div>
        </ToolbarGroup>
      )
    }
  }

  getTabIndex(pathname) {
    const INTERACTION_REGEX = /^\/interactions(\/.*)?/i;
    if (pathname === '/announcements') {
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
