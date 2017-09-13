import React from 'react';
import moment from 'moment/moment';
import {getDateDiff, markdownToHtml} from '../extras/utils';
import {grey500, grey600} from 'material-ui/styles/colors';
import Tooltip from 'material-ui/internal/Tooltip';
import {Avatar, Dialog, Card, CardHeader, CardActions, CardText, FlatButton, RaisedButton} from 'material-ui';

export class JobContent extends React.Component {
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
      showDeleteConfirmation: false,
      expanded: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sliderChanged)
    {
      this.setState({expanded: false});
    }
  }


  get styles() {
    return {
      notificationDescription: {
        padding: '0 18px',
        textAlign: 'justify'
      },
      notificationAttachment: {
        padding: '0 16px 2px'
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
    let moment_time = moment.tz(time, null).format();
    this.setState({
      timeTooltip: {
        show: true,
        label: `${moment(moment_time).tz(timezone).format('h:mm a, MMMM Do YYYY')}`
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

  applyForJob(notification_guid) {
    const institute_guid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const url = `institute/${institute_guid}/notification/${notification_guid}/apply`;
    this.props.parentProps.actions.applyForJob(url);
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

  renderActions() {
    const {publisher} = this.props.announcement;
    const user = this.props.parentProps.auth_user;
    let postActions = null;
    if (publisher.user_guid === user.user.user_guid) {
      postActions = (
        <span>
          <div style={this.styles.actionButton}>
            <label style={{cursor: 'pointer'}} onClick={this.props.onEditClick}>
              <span style={{color: '#EEEEEE', paddingLeft: 8}}>edit</span>
            </label>
            <label style={{cursor: 'pointer'}}
                   onClick={() => this.setState({showDeleteConfirmation: true})}>
              <span style={{color: '#EEEEEE', paddingLeft: 8}}>delete</span>
            </label>
          </div>
          {this.renderDeleteConfirmation()}
        </span>
      );
    }
    let finalpostActions = (
        <span>
          {postActions}
          <RaisedButton label= 'Apply Now' labelColor= '#00BCD4'
                        onClick={() => this.applyForJob(this.props.announcement.notification_guid)}/>
        </span>);
    return finalpostActions;
  }

  render() {
    const {announcement, avatarColor} = this.props;
    const timezone = moment.tz.guess();
    const time = moment.tz(announcement.edited_at, null).format();
    return (
      <div>
        <Card
          style={{marginTop: 15, marginBottom: 15, paddingBottom: 8, backgroundColor:'#00BCD4'}}
          expanded={this.state.expanded}
          onExpandChange={() => this.setState({expanded: !this.state.expanded})}
        >
          <CardHeader
            className="announcement-header"
            title={announcement.notification_head}
            subtitle={`${announcement.category.category_type}`}
            titleStyle={{marginTop: 3, color: '#F5F5F5'}}
            subtitleStyle={{textTransform: 'capitalize', marginTop: 4, color: '#EEEEEE'}}
            actAsExpander={true}
            showExpandableButton={true}
            iconStyle={{color: '#F5F5F5'}}>
            <Tooltip show={this.state.timeTooltip.show}
                     label={this.state.timeTooltip.label}
                     style={{right: 40, top: 14, fontSize: 12, fontWeight: 400}}
                     horizontalPosition="left"
                     verticalPosition="bottom"
                     touch={true}
            />
          </CardHeader>

          <CardText expandable={true} style={this.styles.notificationDescription}>
            <div style={{color:'#ECEFF1'}} className="post-content"
                 dangerouslySetInnerHTML={this.createMarkup(markdownToHtml(announcement.notification_body))}/>
          </CardText>
          {this.showAttachments(announcement)}
          <CardText expandable={false} style={this.styles.notificationPublisher}>
            {this.renderActions()}
          </CardText>
        </Card>
      </div>
    );
  }
}

class JobAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
  }

  render() {
    return (     
       <JobContent {...this.props}/>
    );
  }
}

export default JobAnnouncement;