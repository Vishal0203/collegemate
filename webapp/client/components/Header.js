import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {Grid, Col, Row} from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import AnnouncementForm from './announcements/AnnouncementForm';
import InteractionForm from './interactions/InteractionForm';
//noinspection JSUnresolvedVariable
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Header extends Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
  }

  toggleForm(type) {
    switch (type) {
      case 'Announcement':
        this.parentProps.actions.announcementFormToggle();
        break;
      case 'Interaction':
        this.parentProps.actions.postFormToggle();
        break;
    }
  }

  render() {
    const {title, type, parentProps, hasButton, buttonLabel} = this.props;

    let form = '';
    let actionButton = '';
    let headerHeight = {height: '115px'};
    switch (type) {
      case 'Announcement': {
        if (hasButton && parentProps.announcements.toggleForm) {
          headerHeight = {height: '260px'};
          actionButton = '';
          form = (
            <Grid>
              <div key="announcementForm-0" className="wrap" style={{marginTop: '20px'}}>
                <AnnouncementForm onCancelClick={() => this.toggleForm('Announcement')} parentProps={parentProps}/>
              </div>
            </Grid>
          );
        } else {
          form = '';
          actionButton = (
            <div key="announcementForm-1">
              <Col xs={12}>
                <Row center="xs" className="header-or">or</Row>
                <Row center="xs">
                  <RaisedButton label={buttonLabel} primary={true} className="header-button" onClick={() => this.toggleForm('Announcement')}/>
                </Row>
              </Col>
            </div>
          );
        }
        break;
      }
      case 'Interaction': {
        if (hasButton && parentProps.interactions.toggleForm) {
          headerHeight = {height: '350px'};
          actionButton = '';
          form = (
            <Grid>
              <div key="interactionForm-0" className="wrap" style={{marginTop: '20px'}}>
                <InteractionForm onCancelClick={() => this.toggleForm('Interaction')} parentProps={parentProps}/>
              </div>
            </Grid>
          )
        } else {
          form = '';
          actionButton = (
            <div key="interactionForm-1">
              <Col xs={12}>
                <Row center="xs" className="header-or">or</Row>
                <Row center="xs">
                  <RaisedButton label={buttonLabel} primary={true} className="header-button" onClick={() => this.toggleForm('Interaction')}/>
                </Row>
              </Col>
            </div>
          )
        }
      }
    }

    return (
      <Paper style={headerHeight} className="header" zDepth={0}>
        <Col xs={12}>
          <Row center="xs" className="header-title">
            {title}
          </Row>
        </Col>
        {actionButton}
        <ReactCSSTransitionGroup
          transitionName='headerForm'
          transitionEnterTimeout={600}
          transitionLeaveTimeout={500}>
          {form}
        </ReactCSSTransitionGroup>
      </Paper>
    )
  }
}

export default Header;