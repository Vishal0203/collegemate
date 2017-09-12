import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {grey600} from 'material-ui/styles/colors';
import moment from 'moment/moment';
import Formsy from 'formsy-react';
import Header from '../Header';
import SubscriptionForm from './SubscriptionForm'
import AddProjectDialog from './AddProjectDialog'
import {FormsySelect, FormsyText, FormsyDate} from 'formsy-material-ui/lib';
import {Card, CardTitle, Paper, RaisedButton, MenuItem, Avatar, Subheader, Divider} from 'material-ui';

class SettingsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false
    };
  }

  get styles() {
    return {
      formField: {
        fontSize: 14,
        fontWeight: 300,
        width: '100%',
      },
      floatingLabelStyle: {
        fontSize: 16
      },
      alert: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: 'rgb(167, 26, 26)',
        fontSize: 'large',
        fontWeight: '500'
      }
    }
  }

  enableButton() {
    this.setState({
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      canSubmit: false
    })
  }

  handleUserProfileSave(data) {
    const profileData = {
      ...data,
      dob: moment(data.dob).format('YYYY-MM-DD')
    };

    this.props.actions.updateUserProfileRequest(profileData)
  }

  renderSubscriptionForm() {
    const {invitation_status} = this.props.auth_user.selectedInstitute.user_institute_info[0];
    if (invitation_status === 'accepted') {
      return (
        <Card style={{padding: 16, marginBottom: 40, marginTop: 20}}>
          <CardTitle title="Announcement Settings"/>
          <SubscriptionForm parentProps={this.props} showOptions={true}/>
        </Card>
      )
    }

    if (this.props.auth_user.approvalAlert) {
      return (
        <Paper zDepth={0} style={this.styles.alert}>
          <div style={{marginTop: 30}}>
            <p>&#9432; Your account needs approval from your insitute. <br/><br/>
              You will be notified via email, when your account is approved.</p>
          </div>
        </Paper>
      )
    }
  }

  renderProjectsSection() {
    const {projects} = {};

    return (
        <Card style={{padding: 16, marginBottom: 20, marginTop: 20}}>
          <CardTitle title="Projects"/>
          <Subheader># Projects</Subheader>
          <div style={{padding: 16}}>
            <Row>
              <Col xs={12}>
                <h4>College Mate</h4>
                <p>An application for everyone.</p>
                <Divider/>
                <h4>College Mate</h4>
                <p>An application for everyone.</p>
              <AddProjectDialog/>
              </Col>
            </Row>

          </div>
          {/*{projects.map((project) => {*/}
            {/*<Row>*/}
              {/*<Col xs={4}><h5>{project.title}</h5></Col>*/}
              {/*<Col xs={8}><p>{project.description}</p></Col>*/}
            {/*</Row>*/}
          {/*})}*/}

        </Card>
    )
  }

  render() {
    // initial values of the form
    const username = `${this.props.auth_user.user.first_name} ${this.props.auth_user.user.last_name}`;
    const {member_id, specialization, graduated_year, cgpa} = this.props.auth_user.selectedInstitute.user_institute_info[0];
    const {dob, about_me, gender, github_link, linkedin_link, stackoverflow_link} = this.props.auth_user.user.user_profile;

    const renderDate = () => {
      if (dob) {
        return (
          <FormsyDate
            name="dob"
            floatingLabelText="Date of birth"
            floatingLabelStyle={this.styles.floatingLabelStyle}
            defaultDate={new Date(dob)}
            textFieldStyle={this.styles.formField}
            hintText="Date of Birth"
            required
            formatDate={new global.Intl.DateTimeFormat('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format}
          />
        )
      } else {
        return (
          <FormsyDate
            name="dob"
            floatingLabelText="Date of birth"
            floatingLabelStyle={this.styles.floatingLabelStyle}
            textFieldStyle={this.styles.formField}
            hintText="Date of Birth"
            required
            formatDate={new global.Intl.DateTimeFormat('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format}
          />
        )
      }
    };

    //
    function *validYearsFrom(start) {
      let index = 0;
      let end = new Date().getFullYear() + 4;
      while (end > start++) {
        yield start;
      }
    }

    const renderGradYearDropdown = () => {
      return (
        <FormsySelect
          floatingLabelText="Graduated Year"
          floatingLabelStyle={this.styles.floatingLabelStyle}
          style={this.styles.formField}
          fullWidth={true}
          value={graduated_year}
          name="graduated_year"
        >
          {[...validYearsFrom(1964)].map((year) =>
              <MenuItem value={year} primaryText={year} />
          )}
        </FormsySelect>
      )
    };

    return (
      <div className="main-content">
        <Header title="Settings that help us know you and your choices better."/>
        <div style={{marginTop: '20px'}}>
          <Grid>
            <div className="wrap">
              <Card style={{padding: 16}}>
                <Formsy.Form
                  onValid={this.enableButton.bind(this)}
                  onInvalid={this.disableButton.bind(this)}
                  onValidSubmit={(data) => this.handleUserProfileSave(data)}
                >
                  <Row>
                    <Col xs={4} style={{marginTop: 40, marginBottom: 40}}>
                      <Row center="xs">
                        <Avatar src={this.props.auth_user.user.user_profile.user_avatar} size={180}/>
                      </Row>
                      <Row center="xs" style={{marginTop: 10}}>
                        <div style={{color: grey600, fontWeight: 500, fontSize: 14}}>{username}</div>
                      </Row>
                      <Row center="xs" style={{marginTop: 4}}>
                        <div
                          style={{color: grey600, fontWeight: 300, fontSize: 12}}>{this.props.auth_user.user.email}</div>
                      </Row>
                    </Col>
                    <Col xs={8}>
                      <CardTitle style={{padding: 0}} title="Your Profile"/>
                      <div style={{paddingTop: 5}}>
                        <FormsyText
                          inputStyle={{boxShadow: 'none'}}
                          style={this.styles.formField}
                          name="memberId"
                          floatingLabelText="Hallticket Number"
                          floatingLabelStyle={this.styles.floatingLabelStyle}
                          fullWidth={true}
                          defaultValue={member_id}
                          disabled={member_id !== null}
                          required
                          autoComplete="off"
                        />
                        <Row>
                          <Col xs={6}>
                            <FormsySelect
                              floatingLabelText="Gender"
                              floatingLabelStyle={this.styles.floatingLabelStyle}
                              style={this.styles.formField}
                              fullWidth={true}
                              value={gender}
                              name="gender"
                            >
                              <MenuItem value="male" primaryText="Male"/>
                              <MenuItem value="female" primaryText="Female"/>
                            </FormsySelect>
                          </Col>
                          <Col xs={6}>
                            {renderDate()}
                          </Col>
                        </Row>
                        <FormsyText
                          defaultValue={about_me}
                          floatingLabelText="About me"
                          floatingLabelStyle={this.styles.floatingLabelStyle}
                          name="aboutMe"
                          textareaStyle={{boxShadow: 'none'}}
                          style={this.styles.formField}
                          multiLine={true}
                          fullWidth={true}
                          rows={1}
                          rowsMax={4}
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row style={{marginTop: 25}}>
                    <Col xs={12}>
                      <CardTitle style={{padding: 0}} title="Advanced"/>
                      <div style={{paddingTop: 5}}>
                        <Row>
                          <Col xs={12}>
                            <FormsyText
                              defaultValue={specialization}
                              floatingLabelText="Specialization"
                              floatingLabelStyle={this.styles.floatingLabelStyle}
                              hintText="ex: CSE, ECE, etc."
                              name="specialization"
                              autoComplete="off"
                              fullWidth={true}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={6}>
                            <FormsyText
                              defaultValue={cgpa}
                              floatingLabelText="CGPA/Percentage"
                              floatingLabelStyle={this.styles.floatingLabelStyle}
                              hintText="ex: 8.2 or 78"
                              name="cgpa"
                              autoComplete="off"
                              fullWidth={true}
                            />
                          </Col>
                          <Col xs={6}>
                            {renderGradYearDropdown()}
                          </Col>
                        </Row>
                        <p>Links</p>
                        <Row>
                          <Col xs={4}>
                            <FormsyText
                              defaultValue={github_link}
                              floatingLabelText="Github"
                              floatingLabelStyle={this.styles.floatingLabelStyle}
                              name="github_link"
                              autoComplete="off"
                              fullWidth={true}
                            />
                          </Col>
                          <Col xs={4}>
                            <FormsyText
                              defaultValue={linkedin_link}
                              floatingLabelText="LinkedIn"
                              floatingLabelStyle={this.styles.floatingLabelStyle}
                              name="linkedin_link"
                              autoComplete="off"
                              fullWidth={true}
                            />
                          </Col>
                          <Col xs={4}>
                            <FormsyText
                              defaultValue={stackoverflow_link}
                              floatingLabelText="Stack Overflow"
                              floatingLabelStyle={this.styles.floatingLabelStyle}
                              name="stackoverflow_link"
                              autoComplete="off"
                              fullWidth={true}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <RaisedButton
                    label="Save"
                    type="submit"
                    disabled={!this.state.canSubmit}
                    buttonStyle={{height: '30px', lineHeight: '30px'}}
                    labelStyle={{fontSize: 11}}
                    style={{marginTop: 12}}
                    primary={true}/>
                </Formsy.Form>
              </Card>

              {this.renderProjectsSection()}

              {this.renderSubscriptionForm()}
            </div>
          </Grid>
        </div>
      </div>
    )
  }
}

export default SettingsContainer;
