import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {
  Step,
  Stepper,
  StepButton,
  StepContent
} from 'material-ui/Stepper/index';
import * as snackbarActions  from '../../actions/commons/index';
import {
  submitStaffAdditionRequest
}  from '../../actions/users/index';
import {studentApprovalRequest,staffApprovalRequest} from '../../actions/institutes/index';
import {studentApprovalAction,staffApprovalAction} from '../../actions/institutes/index';
import ManageStudents from './ManageStudents';
import ManageStaff from './ManageStaff';

class InstituteSettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0
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
        return <ManageStaff parentProps={this.props}/>;
      case 1:
        return <ManageStudents parentProps={this.props}/>;
    }
  }

  render() {
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
                        Manage Institute Staff
                      </StepButton>
                      <StepContent>
                        <p style={this.styles.stepperContent}>
                          Invite staff to your institute. Do it individually or make a bulk invite.
                        </p>
                      </StepContent>
                    </Step>
                    <Step>
                      <StepButton onTouchTap={() => this.handleStepperSelect(1)} iconContainerStyle={{display: 'none'}}>
                        Manage Institute Students
                      </StepButton>
                      <StepContent>
                        <p style={this.styles.stepperContent}>
                          Verify registered students belong to your Institute or not.
                        </p>
                      </StepContent>
                    </Step>
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