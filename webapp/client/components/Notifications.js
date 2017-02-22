import React from 'react';
import Badge from 'material-ui/Badge';
import moment from 'moment';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import {Grid, Row, Col} from 'react-flexbox-grid'
import DoneIcon from 'material-ui/svg-icons/action/done';
import {grey600, grey400} from 'material-ui/styles/colors';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import {CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton/IconButton';
import {readNotificationRequest, readAllNotificationsRequest, openCategoryAnnouncements} from '../actions/notifications/index';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {bindActionCreators} from 'redux';

export const POST_COMMENT_NOTIFICATION = 'App\\Notifications\\PostCommentNotification';
export const ANNOUNCEMENT_NOTIFICATION = 'App\\Notifications\\AnnouncementNotification';
export const POST_UPVOTE_NOTIFICATION = 'App\\Notifications\\PostUpvoteNotification';
export const COMMENT_UPVOTE_NOTIFICATION = 'App\\Notifications\\CommentUpvoteNotification';
export const POST_NOTIFICATION = 'PostNotification';

class Notifications extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notificationsMenuOpen: false,
    };
  }

  get styles() {
    return {
      notification: {
        fontSize: 13,
        fontWeight: 400,
        padding: '0px 16px 0 16px',
        lineHeight: '20px'
      },
      footer: {
        fontSize: 13,
        padding: 0,
        fontWeight: 400,
        textAlign: 'center'
      },
      readIcon: {
        cursor:'pointer',
        height: 50,
        lineHeight: '50px'
      },
      timeStamp: {
        fontSize: 11,
        color: grey600
      },
      notificationText: {
        paddingLeft: 14,
        cursor:'pointer',
      },
      badgeStyle: {
        top: 24,
        right: 23,
        height: 17,
        width: 17,
        backgroundColor: '#AE181F',
        color: 'white',
        fontSize: 10
      }
    }
  }

  openNotificationMenu(event) {

    event.preventDefault();

    this.setState({
      notificationsMenuOpen: !this.state.notificationsMenuOpen,
      anchorEl: event.currentTarget,
    });
  };

  closeNotificationMenu() {
    this.setState({
      notificationsMenuOpen: false,
    });
  };

  readNotification(notification) {
    const notificationIds = {notification_ids: notification.id};
    let url = 'read_notifications';
    this.props.actions.readNotificationRequest(notificationIds, url);
  }

  readAllNotifications() {
    let url = 'read_all_notifications';
    this.props.actions.readAllNotificationsRequest(url);
  }

  openNotification(notification) {
    this.closeNotificationMenu();
    if (notification.type == POST_NOTIFICATION) {
      hashHistory.push(`interactions/${notification.post_guid}`);
    }
    else {
      hashHistory.push('/');
      const category = {category_guid: notification.category_guid, category_type: notification.category_type};
      this.props.actions.openCategoryAnnouncements(category);
    }
    this.readNotification(notification);
  }

  notificationText(notification) {
    let notificationMessage = null;
    let temp = null;
    switch (notification.type) {
      case POST_NOTIFICATION:
        const {upvoteCount, commentCount} = notification;
        if (upvoteCount && commentCount) {
          temp = `${upvoteCount} upvote(s) and ${commentCount} new comment(s)`;
        } else if (upvoteCount) {
          temp = `${upvoteCount} upvote(s)`;
        } else {
          temp = `${commentCount} new comment(s)`;
        }
        notificationMessage = (
          <p className="notification-text">
            {temp} on your post '<b>{notification.post_heading.substring(0,25)}...</b>'
          </p>
        );
        break;
      case ANNOUNCEMENT_NOTIFICATION:
        notificationMessage = (
          <p className="notification-text">
            {notification.count} new announcement(s) in <b>{notification.category_type}</b>
          </p>
        );
        break;
      case COMMENT_UPVOTE_NOTIFICATION:
        notificationMessage = (
          <p className="notification-text">
            {notification.count} upvote(s) on your comment on post '<b>{notification.post_heading.substring(0,25)}...</b>'
          </p>
        );
        break;
      default:
        notificationMessage = null;
        break;
    }
    return notificationMessage;
  }

  aggregateNotifications() {
    const user = this.props.auth_user.user;
    let notifications = {};

    user.unread_notifications.map((notification) => {
      const {id, created_at} = notification;
      const {post_guid, post_heading, comment_guid, category_guid, category_type} = notification.data;
      switch (notification.type) {
        case ANNOUNCEMENT_NOTIFICATION:
          notifications[category_guid] = notifications[category_guid] ? {
            ...notifications[category_guid],
            count: notifications[category_guid].count + 1,
            id: [...notifications[category_guid].id, notification.id]
          } :
          {id: [id], type: notification.type, category_type, count: 1, category_guid, created_at};
          break;
        case POST_COMMENT_NOTIFICATION:
          notifications[post_guid] = notifications[post_guid] ? {
            ...notifications[post_guid],
            commentCount: notifications[post_guid].commentCount + 1,
            id: [...notifications[post_guid].id, notification.id]
          } :
          {id: [id], type: POST_NOTIFICATION, commentCount: 1, upvoteCount: 0, post_guid, post_heading, created_at};
          break;
        case POST_UPVOTE_NOTIFICATION:
          notifications[post_guid] = notifications[post_guid] ? {
            ...notifications[post_guid],
            upvoteCount: notifications[post_guid].upvoteCount + 1,
            id: [...notifications[post_guid].id, notification.id]
          } :
          {id: [id], type: POST_NOTIFICATION, commentCount: 0, upvoteCount: 1, post_guid, post_heading, created_at};
          break;
        case COMMENT_UPVOTE_NOTIFICATION:
          notifications[comment_guid] = notifications[comment_guid] ? {
            ...notifications[comment_guid],
            count: notifications[comment_guid].count + 1,
            id: [...notifications[comment_guid].id, notification.id]
          } :
          {id: [id], type: COMMENT_UPVOTE_NOTIFICATION, count: 1, post_guid, post_heading, created_at};
          break;
      }
    });
    return notifications;
  }

  renderNotifications(notifications) {
    return Object.keys(notifications).map((key, index) =>
      <div key={key}>
        <CardText style={this.styles.notification}>
          <Row>
            <Col xs={1}>
              <i className="material-icons" style={{height: 50, lineHeight: '50px', color:grey600}} >
                {notifications[key].type == ANNOUNCEMENT_NOTIFICATION? 'announcement' : 'question_answer'}
              </i>
            </Col>
            <Col xs={9} style={this.styles.notificationText} onTouchTap={() => this.openNotification(notifications[key])}>
              {this.notificationText(notifications[key])}
              <Row style={{margin: 'auto'}}>
                <div style={this.styles.timeStamp}>
                  {`${moment(moment.tz(notifications[key].created_at, null).format()).tz(moment.tz.guess()).fromNow()}`}
                </div>
              </Row>
            </Col>
            <Col xs={2}>
              <Row end="xs">
                <DoneIcon style={this.styles.readIcon} color={grey400} onTouchTap={() => this.readNotification(notifications[key])}/>
              </Row>
            </Col>
          </Row>
        </CardText>
        <Divider className="card-divider"/>
      </div>
    );
  }

  renderNotificationIcon(notifications, notificationMenuContent) {
    let badgeVisibility = null;
    let notificationIconColor = '#FAFAFB';
    if(Object.keys(notifications).length == 0) {
      badgeVisibility = {display: 'none'};
      notificationIconColor = 'rgba(255, 255, 255, 0.4)';
    }
    return (
      <div>
        <Badge
          badgeContent={Object.keys(notifications).length}
          badgeStyle={{...this.styles.badgeStyle, ...badgeVisibility}}
        >
          <IconButton onTouchTap={(event) => this.openNotificationMenu(event)}>
            <NotificationsIcon viewBox="0 0 28 28" color={notificationIconColor}/>
          </IconButton>
        </Badge>
        <Popover
          open={this.state.notificationsMenuOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={() => this.closeNotificationMenu()}
        >
          <Menu width={350} maxHeight={450}>
            {notificationMenuContent}
          </Menu>
        </Popover>
      </div>
    )
  }

  render() {
    const notifications = this.aggregateNotifications();
    let notificationMenuContent;
    if (Object.keys(notifications).length > 0) {
      notificationMenuContent = [
        this.renderNotifications(notifications),
        <CardText key="Notification_Footer" style={this.styles.footer}>
          <span style = {{cursor:'pointer'}} onTouchTap={() => this.readAllNotifications()}>
            Mark all as read
          </span>
        </CardText>
      ];
    } else {
      notificationMenuContent = (
        <CardText style={{...this.styles.footer, padding: 15}}>No new notifications.</CardText>
      );
    }

    return (
      <div>
        {this.renderNotificationIcon(notifications, notificationMenuContent)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth_user: state.auth_user,
    announcements: state.announcements
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({readNotificationRequest, readAllNotificationsRequest, openCategoryAnnouncements}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);