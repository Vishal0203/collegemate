import React from 'react';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import Tooltip from 'material-ui/internal/Tooltip';

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTimeTooltip: false,
      tooltipLabel: 'placeholder'
    }
  }

  get styles() {
    return {
      notificationTitle: {
        padding: '12px 16px 12px 16px',
      },
      notificationDescription: {
        padding: '12px 16px 12px 18px'
      },
      divider: {
        width: '97%',
        backgroundColor: 'rgba(224, 224, 224, 0.6)'
      }
    }
  }

  handleMouseEnter(timezone, time) {
    this.setState({
      showTimeTooltip: true,
      tooltipLabel: `${moment(time).tz(timezone).format('h:mm a, MMMM Do YYYY')}`
    })
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
          <div className="time-container" onMouseEnter={() => this.handleMouseEnter(timezone, time)}
               onMouseLeave={()=>{this.setState({showTimeTooltip: false})}}>
            {moment(time).tz(timezone).fromNow()}
          </div>
          <Tooltip show={this.state.showTimeTooltip}
                   label={this.state.tooltipLabel}
                   style={{right: 40, top: 14, fontSize: 12, fontWeight: 400}}
                   horizontalPosition="left"
                   verticalPosition="bottom"
                   touch={true}
          />
        </CardHeader>

        <CardText style={this.styles.notificationDescription}>
          {announcement.notification_body}
        </CardText>
        <CardText style={{fontStyle: 'italic', color: '#a5a5a5', fontWeight: 300}}>
          {announcement.publisher.first_name} {announcement.publisher.last_name}, {announcement.publisher.institutes[0].designation}
        </CardText>
      </Card>
    );
  }
}

export default Announcement;