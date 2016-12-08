import React from 'react';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import FlatButton from 'material-ui/FlatButton';
import Tooltip from 'material-ui/internal/Tooltip';

class Announcement extends React.Component {
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
      }
    }
  }

  get styles() {
    return {
      notificationDescription: {
        padding: '12px 16px 12px 18px'
      },
      notificationAttachment: {
        padding: '0px 16px 0px 16px'
      },
      notificationPublisher: {
        padding: '10px 16px 12px 16px',
        fontStyle: 'italic',
        color: '#a5a5a5',
        fontWeight: 300,
        fontSize: 13
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
      }
    }
  }

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
        label: `${files.length} ${files.length > 1 ? 'files': 'file'}`
      }
    })
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
                        onMouseLeave={()=>{this.setState({ attachmentTooltip: {show: false, label: ''} }) }}
                        secondary={true} className="attachment-btn" label="Download Attachments"
                        icon={<i className="material-icons">attachment</i>} />
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

  render() {
    const {announcement, avatarColor} = this.props;
    const timezone = moment.tz.guess();
    const time = moment.tz(announcement.created_at, null).format();

    return (
      <Card style={{marginTop: 15, marginBottom: 15}}>
        <CardHeader
          title={announcement.notification_head}
          subtitle={`${announcement.category.category_type}`}
          avatar={
            <Avatar size={45} backgroundColor={avatarColor}>
              {announcement.category.category_type[0].toUpperCase()}
            </Avatar>
          }
          subtitleStyle={{textTransform: 'capitalize', marginTop: 4}}>
          <div className="time-container" onMouseEnter={() => this.timeTooltipMouseEnter(timezone, time)}
               onMouseLeave={()=>{this.setState({ timeTooltip: {show: false, label: ''} }) }}>
            <label> {moment(time).tz(timezone).fromNow()} </label>
          </div>
          <Tooltip show={this.state.timeTooltip.show}
                   label={this.state.timeTooltip.label}
                   style={{right: 40, top: 14, fontSize: 12, fontWeight: 400}}
                   horizontalPosition="left"
                   verticalPosition="bottom"
                   touch={true}
          />
        </CardHeader>

        <CardText style={this.styles.notificationDescription}>
          {announcement.notification_body}
        </CardText>
        {this.showAttachments(announcement)}
        <CardText style={this.styles.notificationPublisher}>
          {announcement.publisher.first_name} {announcement.publisher.last_name}, {announcement.publisher.institutes[0].designation}
        </CardText>
      </Card>
    );
  }
}

export default Announcement;