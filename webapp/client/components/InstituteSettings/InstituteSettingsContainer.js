import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import * as snackbarActions  from '../../actions/commons/index';
import {
  submitStaffAdditionRequest
}  from '../../actions/users/index';
import {studentApprovalRequest, staffApprovalRequest} from '../../actions/institutes/index';
import {studentApprovalAction, staffApprovalAction} from '../../actions/institutes/index';
import * as userActions from '../../actions/users/index';
import ManageStudents from './ManageStudents';
import ManageStaff from './ManageStaff';
import ManageUsers from './ManageUsers';
import SubscriptionForm from './SubscriptionForm'
import {Card, CardTitle, Step, Stepper, StepButton, StepContent,Paper, Tabs, Tab} from 'material-ui';

class InstituteSettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      value: 'a'
    }
  }

  get styles() {
    return {
      stepperContent: {
        backgroundColor: 'transparent',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 14,
        lineHeight: '20px'
      },
      wrap: {
        boxSizing: 'border-box',
        maxWidth: '55%',
        margin: '0 auto',
      },
      footerImage: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: '-1'
      }
    }
  };

  handleStepperSelect(stepIndex) {
    this.setState({stepIndex})
  }

  renderContent() {
    switch (this.state.stepIndex) {
      case 0:
        return (
          <Card style={{padding: 16, marginBottom: 40, marginTop: 20}}>
            <CardTitle title="Announcement Settings"/>
            <SubscriptionForm parentProps={this.props} showOptions={true}/>
          </Card>
        );
      case 1:
        return <ManageStaff parentProps={this.props}/>;
      case 2:
        return <ManageStudents parentProps={this.props}/>;
      case 3:
        return this.renderUserManagementTable();
    }
  }

  renderUserManagementTable() {
    const role = this.props.auth_user.selectedInstitute.user_institute_info[0].role;
    return (
      <Card>
        <Paper zDepth={0} style={{backgroundColor: 'transparent'}}>
          <Tabs
            value={this.state.value}
            onChange={() => this.handleChange()}
            className="transparent-tabs"
          >
            <Tab label="Manage Students" value="a" className="dark-text-tab">
              <ManageUsers parentProps={this.props} role='inst_student' showOptions={true}/>
            </Tab>
            {
              (role === 'inst_superuser' || role === 'inst_admin') ?
              <Tab label="Manage Staff" value="b"  className="dark-text-tab">
                <ManageUsers parentProps={this.props} role='inst_staff' showOptions={true}/>
              </Tab> : ''
            }
          </Tabs>
        </Paper>
      </Card>);
  }

  handleChange(value) {
    this.setState({value})
  }

  render() {
    const role = this.props.auth_user.selectedInstitute.user_institute_info[0].role;
    return (
      <div className="main-content">
        <div style={{marginTop: 70}}>
          <Grid>
            <div className="wrap">
              <Row>
                <Col xs={3}>
                  <Stepper
                    activeStep={this.state.stepIndex}
                    linear={false}
                    orientation="vertical"
                  >
                    <Step>
                      <StepButton onTouchTap={() => this.handleStepperSelect(0)} iconContainerStyle={{display: 'none'}}>
                        Subscription Settings
                      </StepButton>
                      <StepContent>
                        <p style={this.styles.stepperContent}>
                          Choose categories to subscribe or unsubscribe.
                        </p>
                      </StepContent>
                    </Step>
                    { (role === 'inst_superuser' || role === 'inst_admin' || role === 'inst_staff')?
                      <Step>
                        <StepButton onTouchTap={() => this.handleStepperSelect(1)} iconContainerStyle={{display: 'none'}}>
                          Manage Institute Staff
                        </StepButton>
                        <StepContent>
                          <p style={this.styles.stepperContent}>
                            Invite staff to your institute. Do it individually or make a bulk invite.
                          </p>
                        </StepContent>
                      </Step>: <Step/>}
                    { (role === 'inst_superuser' || role === 'inst_admin' || role === 'inst_staff')?
                      <Step>
                        <StepButton onTouchTap={() => this.handleStepperSelect(2)} iconContainerStyle={{display: 'none'}}>
                          Manage Institute Students
                        </StepButton>
                        <StepContent>
                          <p style={this.styles.stepperContent}>
                            Verify registered students belong to your Institute or not.
                          </p>
                        </StepContent>
                      </Step>:<Step/>}
                    { (role === 'inst_superuser' || role === 'inst_admin' || role === 'inst_staff')?
                      <Step>
                        <StepButton onTouchTap={() => this.handleStepperSelect(3)} iconContainerStyle={{display: 'none'}}>
                          Manage Users
                        </StepButton>
                        <StepContent>
                          <p style={this.styles.stepperContent}>
                            Update or remove users of your institute.
                          </p>
                        </StepContent>
                      </Step>:<Step/>}
                  </Stepper>
                </Col>
                <Col xs={9}>
                  {this.renderContent()}
                </Col>
              </Row>
            </div>
          </Grid>
          <img style={this.styles.footerImage} src={require('../../styles/images/institutes.png')}/>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...snackbarActions,
      ...userActions,
      submitStaffAdditionRequest,
      studentApprovalRequest,
      studentApprovalAction,
      staffApprovalRequest,
      staffApprovalAction,
    }, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    staffs: state.auth_user.selectedInstitute
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InstituteSettingsContainer);