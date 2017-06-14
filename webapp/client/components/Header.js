import React, {Component} from 'react';
import {Card, CardTitle, Paper} from 'material-ui';
import {Grid, Col, Row} from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import AnnouncementForm from './announcements/AnnouncementForm';
import InteractionForm from './interactions/InteractionForm';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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
      case 'InteractionSingle':
        this.parentProps.actions.commentFormToggle();
        break;
    }
  }

  get styles() {
    return {
      formTitle:  {
        padding: '12px 16px 0px 16px',
      }
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
          headerHeight = {height: '370px'};
          actionButton = '';
          form = (
            <Grid>
              <div key="announcementForm-0" className="wrap" style={{marginTop: '20px'}}>
                <Card style={{marginTop: 15, marginBottom: 200}}>
                  <CardTitle titleStyle={{fontSize: 20}} style={this.styles.formTitle}
                             title="Make an Announcement" subtitle="All fields are required"/>
                  <AnnouncementForm onCancelClick={() => this.toggleForm('Announcement')} parentProps={parentProps}/>
                </Card>
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
                <InteractionForm onCancelClick={() => this.toggleForm('Interaction')} type="Interactions" parentProps={parentProps}/>
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
          );
        }
        break;
      }
      case 'InteractionSingle': {
        if (hasButton && parentProps.interactions.toggleCommentForm) {
          headerHeight = {height: '250px'};
          actionButton = '';
          form = (
            <Grid>
              <div key="interactionForm-0" className="wrap" style={{marginTop: '20px'}}>
                <InteractionForm onCancelClick={() => this.toggleForm('InteractionSingle')} type="InteractionSingle" parentProps={parentProps}/>
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
                  <RaisedButton label={buttonLabel} primary={true} className="header-button" onClick={() => this.toggleForm('InteractionSingle')}/>
                </Row>
              </Col>
            </div>
          );
        }
        break;
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
        <CSSTransitionGroup
          transitionName='headerForm'
          transitionEnterTimeout={600}
          transitionLeaveTimeout={500}>
          {form}
        </CSSTransitionGroup>
      </Paper>
    )
  }
}

export default Header;