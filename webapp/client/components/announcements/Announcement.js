import React from 'react';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

class Announcement extends React.Component {
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

  render() {
    const {announcement, avatarColor} = this.props;

    return (
      <Card style={{marginTop: 15, marginBottom: 15}}>
        <CardHeader
          title={announcement.notification_head}
          subtitle={`${announcement.category.category_type}, 08:30 AM`}
          avatar={
            <Avatar size={45} backgroundColor={avatarColor}>
              {announcement.category.category_type[0].toUpperCase()}
            </Avatar>
          }
          subtitleStyle={{textTransform: 'capitalize', marginTop: 4}}
        />
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