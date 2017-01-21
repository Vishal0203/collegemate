import React, {Component, PropTypes} from 'react';
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
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class AnnouncementsContainer extends Component {
  constructor(props) {
    super(props);
    this.colorMap = {};
    this.letterAvatarColors = [...letterAvatarColors];
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


  getAvatarColor(category) {
    if (!(category in this.colorMap)) {
      const index = Math.floor(Math.random() * this.letterAvatarColors.length);
      this.colorMap[category] = this.letterAvatarColors[index];
      this.letterAvatarColors.splice(index, 1)
    }
    return this.colorMap[category]
  }

  loadMore() {
    if (Object.keys(this.props.auth_user.user).length != 0) {
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
    return this.props.announcements.items.data.map((announcement, i) =>
      <Announcement key={i} parentProps={this.props} announcement={announcement}
                    avatarColor={this.getAvatarColor(announcement.category.category_type)}/>
    )
  }

  renderFilterChips() {
    if (Object.keys(this.props.auth_user.user).length != 0) {
      const categories = this.props.announcements.categories;
      if (Object.keys(this.props.auth_user.user).length != 0) {
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
    if (Object.keys(this.props.auth_user.user).length != 0) {
      const {categories, filters} = this.props.announcements;
      if (filters.length == categories.length) {
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
        <Header title="Activities and events happening in your college."
                type="Announcement"
                parentProps={this.props}
                hasButton={true}
                buttonLabel="Make an announcement"/>
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
                  <StickyDiv offsetTop={65}>
                    <div className="right-content">
                      <label>Currently Showing</label>
                      <Divider style={{marginTop: 2, marginBottom: 2}}/>
                      <div style={this.styles.wrapper}>
                        {this.renderSelectedFilters()}
                      </div>
                      <label>Categories</label>
                      <Divider style={{marginTop: 2, marginBottom: 2}}/>
                      <div style={this.styles.wrapper}>
                        {this.renderFilterChips()}
                        <div style={{marginRight: '20px'}}>
                          <FloatingActionButton secondary={true}>
                            <i className="material-icons" style={{fontSize: 26}}>settings</i>
                          </FloatingActionButton>
                          <div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </StickyDiv>
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
    actions: bindActionCreators({...announcementActions}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementsContainer);


