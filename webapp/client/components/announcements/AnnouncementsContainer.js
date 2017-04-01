import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Announcement from './Announcement'
import * as announcementActions  from '../../actions/announcements/index';
import Header from '../Header';
import Loader from 'halogen/ScaleLoader';
import {Grid, Row, Col} from 'react-flexbox-grid';
import InfiniteScroll from 'redux-infinite-scroll';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import StickyDiv from 'react-stickydiv';
import letterAvatarColors from '../../styles/theme/letterAvatarColors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {grey500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Branding from '../Branding';
import Events from './Events';

import SubscriptionForm from '../settings/SubscriptionForm';
import {
  subscribeAnnouncementRequest,
  unsubscribeAnnouncementRequest,
  createAnnouncementCategoryRequest
} from '../../actions/users/index';
import {toggleSnackbar} from '../../actions/commons/index'
import {hashHistory} from 'react-router';

class AnnouncementsContainer extends Component {
  constructor(props) {
    super(props);
    this.colorMap = {};
    this.letterAvatarColors = [...letterAvatarColors];
    this.state = {
      timeTooltip: {
        show: false,
        label: ''
      },
      showCategorySettings: false
    };
  }

  componentWillMount() {
    const {invitation_status} = this.props.auth_user.selectedInstitute.user_institute_info[0];

    if (invitation_status === 'pending') {
      hashHistory.replace('/settings');
      this.props.actions.toggleSnackbar('Your account is pending approval from your institute.')
    }
    this.fetchEvents();
  }

  get styles() {
    return {
      chipLabel: {
        lineHeight: '28px',
        textTransform: 'capitalize',
        color: '#757575',
        fontSize: 13
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 20
      },
      selectedFilterLabel: {
        marginTop: 8,
        paddingLeft: 5,
        fontFamily: 'Roboto, sans-serif',
        fontSize: 'smaller',
        color: '#9E9E9E'
      }
    }
  }

  fetchEvents() {
    const category_guid = this.props.announcements.categories.map(function (category) {
      return category.category_guid
    }).join(',');
    const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/get_next_events`;

    this.props.actions.fetchEventsRequest(url, {category_guid});
  }

  toggleAnnouncementSettings(visibility) {
    this.setState({showCategorySettings: visibility});
  }


  getAvatarColor(category) {
    if (!(category in this.colorMap)) {
      const index = Math.floor(Math.random() * this.letterAvatarColors.length);
      this.colorMap[category] = this.letterAvatarColors[index];
      this.letterAvatarColors.splice(index, 1)
    }
    return this.colorMap[category]
  }

  loadMore() {
    if (Object.keys(this.props.auth_user.user).length !== 0) {
      const categories = this.props.announcements.filters.map(function (a) {
        return a.category_guid
      }).join(',');
      const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
      let url = `institute/${institute_guid}/category_notifications`;
      if (this.props.announcements.nextPageUrl) {
        url = this.props.announcements.nextPageUrl;
        this.props.actions.fetchAnnouncementRequest(url, {skip: this.props.announcements.skip})
      } else {
        this.props.actions.fetchAnnouncementRequest(url, {category_guid: categories})
      }
    }
  }

  handleFilterDelete(category) {
    this.props.actions.removeFilter(category);
  }

  handleFilterSelect(category) {
    this.props.actions.addFilter(category);
  }

  renderAnnouncements() {
    if (this.props.announcements.items.data.length) {
      return this.props.announcements.items.data.map((announcement, i) =>
        <Announcement key={i} parentProps={this.props} announcement={announcement}
                      avatarColor={this.getAvatarColor(announcement.category.category_type)}/>
      )
    }

    if (this.props.announcements.items.data.length === 0 && this.props.announcements.loadingMore === false) {
      return [
        <Paper className="paper-style" zDepth={0} key={0}>
          <p>There are no announcements to show.</p>
        </Paper>
      ]
    }
  }

  renderHeader() {
    const notifyingCategories = this.props.auth_user.selectedInstitute.notifying_categories;
    if (notifyingCategories.length) {
      return (
        <Header title="Activities and events happening in your college."
                type="Announcement"
                parentProps={this.props}
                hasButton={true}
                buttonLabel="Make an announcement"/>
      );
    } else {
      return (
        <Header title="Activities and events happening in your college."/>
      );
    }
  }

  renderFilterChips() {
    if (Object.keys(this.props.auth_user.user).length !== 0) {
      const categories = this.props.announcements.categories;
      if (Object.keys(this.props.auth_user.user).length !== 0) {
        return categories.map((category, i) =>
          <Chip key={i} className="chip" onTouchTap={() => this.handleFilterSelect(category)}
                labelStyle={this.styles.chipLabel}>
            {category.category_type}
          </Chip>
        );
      }
    }
  }

  renderSelectedFilters() {
    if (Object.keys(this.props.auth_user.user).length !== 0) {
      const {categories, filters} = this.props.announcements;
      if (filters.length === categories.length) {
        return (
          <label style={this.styles.selectedFilterLabel}>All Categories</label>
        )
      }
      else {
        return (
          filters.map((category, i) =>
            <Chip key={i} className="chip" onRequestDelete={() => this.handleFilterDelete(category)}
                  labelStyle={this.styles.chipLabel}>
              {category.category_type}
            </Chip>
          )
        )
      }
    }
  }

  renderSelectCategories() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={() => this.toggleAnnouncementSettings(false)}
      />,
    ];
    return (
      <Dialog
        title="Category Settings"
        actions={actions}
        modal={false}
        open={this.state.showCategorySettings}
        onRequestClose={() => this.toggleAnnouncementSettings(false)}
        autoScrollBodyContent={true}
      >
        <SubscriptionForm parentProps={this.props} showOptions={false}/>
      </Dialog>

    );
  }

  render() {
    const loader = (
      <div style={{marginTop: '70px', marginBottom: '50px'}}>
        <Row center="xs">
          <Loader color="#126B6F" size="10px" margin="5px"/>
        </Row>
      </div>
    );

    return (
      <div className="main-content">
        {this.renderHeader()}
        <div style={{marginTop: '20px'}}>
          <Grid>
            <div className="wrap">
              <Row>
                <Col xs={8}>
                  <InfiniteScroll elementIsScrollable={false} hasMore={this.props.announcements.hasMore}
                                  loadingMore={this.props.announcements.loadingMore}
                                  loadMore={() => this.loadMore()} loader={loader}>
                    {this.renderAnnouncements()}
                  </InfiniteScroll>
                </Col>
                <Col xs={4}>
                  <div className="right-content">
                    {
                      this.props.announcements.eventsLoader ?
                        loader :
                        <Events style={{marginTop: 14}}
                                events={this.props.announcements.events}
                                auth_user={this.props.auth_user}/>
                    }
                    <StickyDiv zIndex={1} offsetTop={65}>
                      <label>Currently Showing</label>
                      <Divider style={{marginTop: 2, marginBottom: 2}}/>
                      <div style={this.styles.wrapper}>
                        {this.renderSelectedFilters()}
                      </div>
                      <label>Categories</label>
                      <Divider style={{marginTop: 2, marginBottom: 2}}/>
                      <div style={this.styles.wrapper}>
                        {this.renderFilterChips()}
                        <div style={{paddingTop: 10}}>
                          <IconButton iconStyle={{color: grey500, fontSize: 20}}
                                      style={{width: 29, height: 29, padding: 0}}
                                      tooltip="Subscriptions">
                            <FontIcon className="material-icons" onTouchTap={() => this.toggleAnnouncementSettings(true)}>
                              settings
                            </FontIcon>
                          </IconButton>
                        </div>
                      </div>
                      <Branding />
                    </StickyDiv>
                  </div>
                </Col>
              </Row>
            </div>
          </Grid>
        </div>
        <div>
          {this.renderSelectCategories()}
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    announcements: state.announcements
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...announcementActions,
      subscribeAnnouncementRequest,
      unsubscribeAnnouncementRequest,
      createAnnouncementCategoryRequest,
      toggleSnackbar
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementsContainer);