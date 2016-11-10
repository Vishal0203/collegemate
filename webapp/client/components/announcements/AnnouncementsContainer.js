import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Announcement from './Announcement'
import * as announcementActions  from '../../actions/announcements';
import Header from '../Header';
import Loader from 'halogen/BeatLoader';
import {Grid, Row, Col} from 'react-flexbox-grid';
import InfiniteScroll from 'redux-infinite-scroll';
import letterAvatarColors from '../../styles/theme/letterAvatarColors';

class AnnouncementsContainer extends Component {
  constructor(props) {
    super(props);
    this.colorMap = {};
    this.letterAvatarColors = [...letterAvatarColors];
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
    if(Object.keys(this.props.auth_user.user).length != 0) {
      const categories = this.props.auth_user.user.default_institute.categories.map(function (a) {
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

  renderAnnouncements() {
    return this.props.announcements.items.data.map((announcement, i) =>
      <Announcement key={i} announcement={announcement} avatarColor={this.getAvatarColor(announcement.category.category_type)} />
    )
  }

  render() {
    const loader = (
      <div style={{marginTop: '70px', marginBottom: '50px'}}>
        <Row center="xs">
          <Loader color="#126B6F" size="12px" margin="5px"/>
        </Row>
      </div>
    );

    return (
      <div className="main-content">
        <Header title="Activities and events happening in your college."
                type="Announcement"
                parentProps={this.props}
                hasButton={true}
                buttonLabel="Make an Announcement" />
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
                </Col>
              </Row>
            </div>
          </Grid>
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
    actions: bindActionCreators(announcementActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementsContainer);


