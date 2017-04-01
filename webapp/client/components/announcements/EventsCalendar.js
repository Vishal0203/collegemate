import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import Divider from 'material-ui/Divider';
import Loader from 'halogen/ScaleLoader';
import StickyDiv from 'react-stickydiv';
import * as eventActions  from '../../actions/events/index';
import AnnouncementDialog from './AnnouncementDialog';
import {toggleSnackbar} from '../../actions/commons/index';
import {getDateDiff} from '../extras/utils';

class EventsCalendar extends React.Component {
  constructor(props) {
    super(props);
    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );
    this.state = {
      stepIndex: 0,
      currentCalendarDate: moment().toDate(),
      announcementDialog: {
        showAnnouncementDialog: false,
        selectedAnnouncement: null,
        title: null
      }
    };
  }

  componentWillMount() {
    this.fetchEvents(
      moment().format('YYYY-MM-DD'),
      moment().add(6, 'days').format('YYYY-MM-DD'),
      this.props.actions.fetchWeekEventsRequest
    );
    this.fetchMonthEvents(moment());
  }

  get styles() {
    return {
      container: {
        marginTop: 20,
        fontFamily: 'Roboto, sans-serif',
        minHeight: '80vh'
      },
      footerImage: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: '-1',
      }
    }
  }

  getStepTitle(events) {
    const ellipsisTitle = events[0].notification_head.length > 28 ?
      `${events[0].notification_head.substring(0,28)}...` : events[0].notification_head;
    const moreEvents = events.length > 1 ? ` + ${events.length - 1} more` : '';
    return `${ellipsisTitle}${moreEvents}`;
  }

  fetchEvents(startDate, endDate, requestCall) {
    const category_guid = this.props.announcements.categories.map(function (category) {
      return category.category_guid
    }).join(',');
    const data = {startDate, endDate, category_guid};
    const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/get_events_in_range`;
    requestCall(url, data);
  }

  fetchMonthEvents(date) {
    moment().isoWeekday(7);
    this.setState({currentCalendarDate: moment(date).toDate()});
    const startDate = moment(date).startOf('month').weekday(0).format('YYYY-MM-DD');
    const endDate = moment(date).endOf('month').weekday(6).format('YYYY-MM-DD');
    this.fetchEvents(startDate, endDate, this.props.actions.fetchMonthEventsRequest)
  }

  toggleAnnouncementDialog(notification_guid, event_date) {
    this.setState({
      announcementDialog: {
        showAnnouncementDialog: !this.state.showAnnouncementDialog,
        selectedAnnouncement: notification_guid,
        title: event? `Event ${getDateDiff(event_date)}`: null
      }
    });
  }

  renderLoader() {
    return (
      <div style={{marginTop: '70px', marginBottom: '50px'}}>
        <Row center="xs">
          <Loader color="#126B6F" size="10px" margin="5px"/>
        </Row>
      </div>
    );
  }

  renderWeekEvents() {

    if(this.props.announcements.eventsCalendar.eventsWeekLoader) {
      return this.renderLoader();
    }

    let multipleEvents = {};

    this.props.announcements.eventsCalendar.eventsInWeek.forEach((event) => {
      multipleEvents[event.event_date] = multipleEvents[event.event_date] ?
        [...multipleEvents[event.event_date], event] :
        [event]
    });

    const steps = Object.keys(multipleEvents).map( (key, i) =>
      <Step key={`event_${i}`}>
        <StepButton onTouchTap={() => this.setState({stepIndex: i})}
                    icon={<EventStepperIcon>{moment(multipleEvents[key][0].event_date).format('ddd')}</EventStepperIcon>}
                    className="eventStep"
        >
          {
            this.getStepTitle(multipleEvents[key])
          }
        </StepButton>
        <StepContent>
          <ol style={{listStyleType: 'none'}}>
            {multipleEvents[key].map(
              (event) => (
                <li key={event.notification_guid}
                    style={{fontSize: 14, padding: 5, cursor: 'pointer'}}
                    onTouchTap={() => this.toggleAnnouncementDialog(event.notification_guid, event.event_date)}>
                {event.notification_head}
                </li>
              )
            )}
          </ol>
        </StepContent>
      </Step>
    );
    if (steps.length === 0) {
      return (
        <div style={{textAlign: 'center', padding: 15}}>
          <label>Nothing's planned for this week. Enjoy!</label>
        </div>
      )
    }
    return (
      <Stepper
        activeStep={this.state.stepIndex}
        linear={false}
        orientation="vertical"
      >
        {steps}
      </Stepper>

    )
  }

  render() {
    return (
      <div className="main-content">
        <div style={this.styles.container}>
          <Grid style={{width: '90%'}}>
            <div className="wrap">
              <Paper style={{padding: 20}}>
                <Row style={{minHeight: '75vh'}}>
                  <Col xs={4}>
                    <StickyDiv zIndex={1} offsetTop={65}>
                      <div style={{margin: '8px 20px'}}>
                        <div style={{padding: '10px 0px 10px 5px'}}><label style={{fontWeight: 500}}>Events this week</label></div>
                        <Divider style={{marginTop: 2}}/>
                        {this.renderWeekEvents()}
                      </div>
                    </StickyDiv>
                  </Col>
                  <Col xs={8}>
                    <div style={{margin: 15, height: '95%'}}>
                      <BigCalendar
                        events={this.props.announcements.eventsCalendar.eventsInMonth}
                        defaultDate={this.state.currentCalendarDate}
                        views={['month']}
                        popup={true}
                        onNavigate={(date) =>this.fetchMonthEvents(date)}
                        onSelectEvent={(event) =>
                          this.toggleAnnouncementDialog(event.notification_guid, event.event_date)}
                        titleAccessor="notification_head"
                        startAccessor="event_date"
                        endAccessor="event_date"
                      />
                    </div>
                  </Col>
                </Row>
              </Paper>
            </div>
          </Grid>
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
          <img style={this.styles.footerImage} src={require('../../styles/images/institutes.png')}/>
        </div>
      </div>
    )
  }
}

class EventStepperIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  get styles() {
    return {
      stepperIcon: {
        borderRadius: 4,
        backgroundColor: '#126B6F',
        color: 'white',
        width: 40,
        height: 25,
        verticalAlign: 'middle',
        display: 'table-cell'
      }
    }
  }

  render()
  {
    return (
      <div style={this.styles.stepperIcon}>
        {this.props.children}
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
      ...eventActions,
      toggleSnackbar
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsCalendar);
