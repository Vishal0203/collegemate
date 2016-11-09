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

export default class Navbar extends React.Component {

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
        paddingRight: 0,
        position: 'absolute',
        lineHeight: '42px',
        right: '48px'
      },

      instituteName: {
        fontSize: 12,
        fontWeight: 100,
        color: 'rgba(255, 255, 255, 0.85)',
        paddingRight: 0,
        position: 'inherit',
        lineHeight: '77px'
      }
    }
  }

  render() {
    // ToDo: this code might change upon login page addition
    const {parentProps} = this.props;
    const username = `${parentProps.auth_user.user.first_name} ${parentProps.auth_user.user.last_name}`;
    const instituteName = parentProps.auth_user.selectedInstitute.institute_name;

    function handleActive(tab) {
      browserHistory.push(tab.props['data-route']);
    }

    return (
      <Paper className="fixed-top">
        <Toolbar className="navbar">
          <ToolbarGroup>
            <Link to="/" style={{textDecoration: 'none'}}>
              <ToolbarTitle style={this.styles.title} text="College"/>
              <ToolbarTitle style={{color: 'white', fontWeight: 400}} text="Mate"/>
            </Link>
          </ToolbarGroup>
          <ToolbarGroup className="tab-container">
            <Tabs className="tabs">
              <Tab data-route="/" onActive={handleActive} className="tab" label="Announcements"/>
              <Tab data-route="/interactions" onActive={handleActive} className="tab"
                   label="Interaction"/>
              <Tab data-route="/career" onActive={handleActive} className="tab" label="Career"/>
            </Tabs>
          </ToolbarGroup>
          <ToolbarGroup >
            <ToolbarTitle style={this.styles.username} text={username}/>
            <ToolbarTitle style={this.styles.instituteName} text={instituteName}/>
            <IconMenu desktop={true}
                      iconButtonElement={
                        <IconButton>
                          <Avatar src="https://www.prodiplive.in/images/profile_user.jpg"
                                  style={{alignSelf: 'center'}}
                                  size={35}/>
                        </IconButton>
                      }
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Refresh"/>
              <MenuItem primaryText="Send feedback"/>
              <MenuItem primaryText="Settings"/>
              <MenuItem primaryText="Help"/>
              <Divider />
              <MenuItem primaryText="Sign out"/>
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
      </Paper>
    );
  }
}