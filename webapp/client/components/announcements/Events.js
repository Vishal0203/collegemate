import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {getDateDiff} from '../extras/utils';
import {grey600, grey700} from 'material-ui/styles/colors';
import MobileTearSheet from '../extras/MobileTearSheet';
import AnnouncementDialog from './AnnouncementDialog';
import {hashHistory} from 'react-router';

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcementDialog: {
        showAnnouncementDialog: false,
        selectedAnnouncement: null,
        title: null
      }
    }
  }

  get styles() {
    return {
      eventTitle: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: 14,
        color: grey700,
        lineHeight: 'normal',
      },
      eventSubtitle: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: 'smaller',
      },
      showAllButton: {
        fontSize: 14,
        color: grey600,
        textTransform: 'Capitalize',
        padding: 0,
        cursor: 'pointer'
      },
      noEventsMessage: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: 14,
        color: grey700,
        margin: '15px 5px',
        textAlign: 'center'
      },
      announcementContent: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        maxHeight: 30,
        padding: '4px 0'
      }
    }
  }

  createMarkup(content, preText) {
    return {__html: `<b>${preText}</b> -- ${content}`};
  }

  handleShowAll() {
    hashHistory.push('/events');
  }

  toggleAnnouncementDialog(event) {
    this.setState({
      announcementDialog: {
        showAnnouncementDialog: !this.state.showAnnouncementDialog,
        selectedAnnouncement: event? event.notification_guid: null,
        title: event? `Event ${getDateDiff(event.event_date)}`: null
      }
    });
  }

  render() {
    const events = this.props.events.map((event, i) =>
      <Card key={`event_${i}`} style={{boxShadow: 'Transparent'}}>
        <CardTitle
          title={event.notification_head}
          subtitle={
            <div
              className="event-content"
              style={this.styles.announcementContent}
              dangerouslySetInnerHTML={
                this.createMarkup(event.notification_body, getDateDiff(event.event_date, true))
              }/>
          }
          style={{padding: '8px 16px', cursor: 'pointer'}}
          titleStyle={this.styles.eventTitle}
          subtitleStyle={this.styles.eventSubtitle}
          onTouchTap={() => this.toggleAnnouncementDialog(event)}
        />
        <Divider style={{marginLeft: 5, marginRight: 5}}/>
      </Card>
    );

    const eventsContainer = [
      <div key="events_list">
        {events}
      </div>,
      <div style={{padding: 4, textAlign: 'center'}} key="events_showAll">
        <label style={this.styles.showAllButton} onClick={this.handleShowAll}>Show All</label>
      </div>
    ];

    const noEvents = (
      <div style={this.styles.noEventsMessage}>
        <label style={{fontSize: 'inherit'}}>No upcoming events in your subscribed categories.</label>
      </div>
    );

    return (
      <div style={this.props.style}>
        <MobileTearSheet containerStyle={{padding: 0}}>
          <div style={{padding: '10px'}}><label style={{fontWeight: 500}}>Upcoming Events</label></div>
          <Divider style={{marginTop: 2}}/>
          <div style={{paddingBottom: 10}}>
            {this.props.events.length > 0 ? eventsContainer: noEvents}
          </div>
        </MobileTearSheet>
        {
          this.state.announcementDialog.selectedAnnouncement ?
            <AnnouncementDialog
              auth_user={this.props.auth_user}
              announcement={this.state.announcementDialog.selectedAnnouncement}
              open={this.state.announcementDialog.showAnnouncementDialog}
              handleClose={() => this.toggleAnnouncementDialog()}
              title={this.state.announcementDialog.title}
            /> : null
        }
      </div>
    )
  }
}

export default Events;