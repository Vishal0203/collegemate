import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card/index';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import moment from 'moment/moment';
import FlatButton from 'material-ui/FlatButton';
import Tooltip from 'material-ui/internal/Tooltip';
import {grey500, grey600} from 'material-ui/styles/colors';
import {getDateDiff} from '../extras/utils';

export class AnnouncementContent extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
    this.state = {
      timeTooltip: {
        show: false,
        label: ''
      },
      attachmentTooltip: {
        show: false,
        label: ''
      },
      showDeleteConfirmation: false
    }
  }

  get styles() {
    return {
      notificationDescription: {
        padding: '0 18px 5px',
        textAlign: 'justify'
      },
      notificationAttachment: {
        padding: '5px 16px 2px'
      },
      notificationPublisher: {
        padding: '10px 16px 12px 16px',
        color: '#a5a5a5',
        fontWeight: 300,
        fontSize: 13,
        position: 'relative'
      },
      attachmentTooltip: {
        left: 0,
        right: 0,
        top: 12,
        fontSize: 12,
        fontWeight: 400,
        opacity: 0.95
      },
      divider: {
        width: '97%',
        backgroundColor: 'rgba(224, 224, 224, 0.6)'
      },
      actionButton: {
        color: grey500,
        paddingRight: 9,
        fontWeight: 300,
        display: 'inline-block'
      },
      eventLabel: {
        display: 'inline-block',
        padding: 3,
        fontSize: 12,
        color: grey600,
        marginLeft: 12,
        fontWeight: 300,
        borderWidth: 'thin',
        borderStyle: 'solid',
        borderRadius: 4,
        position: 'relative',
        top: '-4px'
      }
    }
  }

  createMarkup(content) {
    return {__html: content};
  };

  timeTooltipMouseEnter(timezone, time) {
    this.setState({
      timeTooltip: {
        show: true,
        label: `${moment(time).tz(timezone).format('h:mm a, MMMM Do YYYY')}`
      }
    })
  }

  attachmentTooltipMouseEnter(files) {
    this.setState({
      attachmentTooltip: {
        show: true,
        label: `${files.length} ${files.length > 1 ? 'files' : 'file'}`
      }
    })
  }

  deleteAnnouncement(notificationGuid) {
    const institute_guid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/notification/${notificationGuid}`;
    this.props.parentProps.actions.deleteAnnouncementRequest(url);
    this.setState({showDeleteConfirmation: false});
  }

  showAttachments(announcement) {
    if (announcement.notification_files.length > 0) {
      const institute_guid = this.parentProps.auth_user.selectedInstitute.inst_profile_guid;
      const fileUrl = `${process.env.SERVER_HOST}/api/v1_0/institute/${institute_guid}/files/download?category_guid=${announcement.category.category_guid}&notification_guid=${announcement.notification_guid}`;

      return (
        <div style={{position: 'relative'}}>
          <CardText style={this.styles.notificationAttachment}>
            <FlatButton href={fileUrl}
                        target="_blank"
                        onMouseEnter={() => this.attachmentTooltipMouseEnter(announcement.notification_files)}
                        onMouseLeave={() => {
                          this.setState({attachmentTooltip: {show: false, label: ''}})
                        }}
                        secondary={true} className="attachment-btn" label="Download Attachments"
                        icon={<i className="material-icons">attachment</i>}/>
          </CardText>
          <Tooltip show={this.state.attachmentTooltip.show}
                   label={this.state.attachmentTooltip.label}
                   style={this.styles.attachmentTooltip}
                   horizontalPosition="left"
                   verticalPosition="bottom"
                   touch={true}
          />
        </div>
      )
    }
  }

  renderDeleteConfirmation() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({showDeleteConfirmation: false})}
      />,
      <FlatButton
        label="Delete"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={() => this.deleteAnnouncement(this.props.announcement.notification_guid)}
      />
    ];
    return (
      <Dialog
        title="Are you sure?"
        actions={actions}
        modal={false}
        open={this.state.showDeleteConfirmation}
        onRequestClose={() => this.setState({showDeleteConfirmation: false})}
      >
        Are you sure you want to delete this announcement? This can't be reverted.
      </Dialog>
    );
  }

  renderDelete() {
    const {publisher} = this.props.announcement;
    const user = this.props.parentProps.auth_user;
    let deletePost = null;
    if (
      publisher.user_guid === user.user.user_guid ||
      user.selectedInstitute.user_institute_info[0].role !== 'inst_student'
    ) {
      deletePost = (
        <span>
          <div style={this.styles.actionButton}>
            <label style={{cursor: 'pointer'}}
                   onClick={() => this.setState({showDeleteConfirmation: true})}>
              <span style={{color: grey600}}>&nbsp;&nbsp;|&nbsp;&nbsp;delete</span>
            </label>
          </div>
          {this.renderDeleteConfirmation()}
        </span>
      );
    }
    return deletePost;
  }

  render() {
    const {announcement, avatarColor} = this.props;
    const timezone = moment.tz.guess();
    const time = moment.tz(announcement.created_at, null).format();

    return (
      <div>
        <CardHeader
          title={announcement.notification_head}
          subtitle={`${announcement.category.category_type}`}
          avatar={
            <Avatar size={45} style={{marginRight: 10, backgroundColor: avatarColor}}>
              {announcement.category.category_type[0].toUpperCase()}
            </Avatar>
          }
          titleStyle={{marginTop: 3}}
          subtitleStyle={{textTransform: 'capitalize', marginTop: 4}}>
          <div className="time-container"
               onMouseEnter={() => this.timeTooltipMouseEnter(timezone, announcement.created_at)}
               onMouseLeave={() => {
                 this.setState({timeTooltip: {show: false, label: ''}})
               }}>
            <label> {moment(time).tz(timezone).fromNow()} </label>
          </div>
          <Tooltip show={this.state.timeTooltip.show}
                   label={this.state.timeTooltip.label}
                   style={{right: 40, top: 14, fontSize: 12, fontWeight: 400}}
                   horizontalPosition="left"
                   verticalPosition="bottom"
                   touch={true}
          />
          <div className="time-container" style={{top: 40, color: grey500}}>
            <label>&#10003; Seen by {announcement.views} {announcement.views > 1 ? 'members' : 'member'}</label>
          </div>
        </CardHeader>

        <CardText style={this.styles.notificationDescription}>
          <div className="post-content" dangerouslySetInnerHTML={this.createMarkup(announcement.notification_body)}/>
        </CardText>
        {this.showAttachments(announcement)}
        <CardText style={this.styles.notificationPublisher}>
          <span style={{textTransform: 'capitalize'}}>
            {announcement.publisher.first_name} {announcement.publisher.last_name}, {announcement.publisher.institutes[0].designation}
          </span>
          {this.renderDelete()}
          <span style={{position: 'absolute', right: 16}}>
            {announcement.event_date ?
              <div style={this.styles.eventLabel}>
                Event {getDateDiff(announcement.event_date)}
              </div> : <span/>
            }
          </span>
        </CardText>
      </div>
    );
  }
}

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
  }

  render() {
    return (
      <Card style={{marginTop: 15, marginBottom: 15, paddingBottom: 8}}>
        <AnnouncementContent parentProps={this.parentProps}
                             announcement={this.props.announcement}
                             avatarColor={this.props.avatarColor}/>
      </Card>
    );
  }
}

export default Announcement;