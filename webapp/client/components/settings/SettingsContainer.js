import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Avatar from 'material-ui/Avatar';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {grey600} from 'material-ui/styles/colors';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import Formsy from 'formsy-react';
import {FormsySelect, FormsyText, FormsyDate} from 'formsy-material-ui/lib';

import Header from '../Header';
import SubscriptionForm from './SubscriptionForm'

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

  render() {
    // initial values of the form
    const username = `${this.props.auth_user.user.first_name} ${this.props.auth_user.user.last_name}`;
    const {member_id, designation} = this.props.auth_user.selectedInstitute.user_institute_info[0];
    const {dob, about_me, gender} = this.props.auth_user.user.user_profile;

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

    return (
      <div className="main-content">
        <Header title="Settings that help us know you and your choices better."/>
        <div style={{marginTop: '20px'}}>
          <Grid>
            <div className="wrap">
              <Card style={{padding: 16}}>
                <Row>
                  <Col xs={4} style={{marginTop: 80}}>
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
                    <Formsy.Form
                      onValid={this.enableButton.bind(this)}
                      onInvalid={this.disableButton.bind(this)}
                      onValidSubmit={(data) => this.handleUserProfileSave(data)}
                    >
                      <CardTitle style={{padding: 0}} title="Your Profile"/>
                      <div style={{paddingTop: 5}}>
                        <FormsyText
                          style={this.styles.formField}
                          name="memberId"
                          floatingLabelText="Member ID"
                          floatingLabelStyle={this.styles.floatingLabelStyle}
                          fullWidth={true}
                          defaultValue={member_id}
                          required
                          autoComplete="off"
                        />
                        <FormsyText
                          style={this.styles.formField}
                          name="designation"
                          floatingLabelText="Designation"
                          floatingLabelStyle={this.styles.floatingLabelStyle}
                          hintText="ex: CSE Student, CSE Staff etc"
                          fullWidth={true}
                          defaultValue={designation}
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
                          style={this.styles.formField}
                          multiLine={true}
                          fullWidth={true}
                          rows={1}
                          rowsMax={4}
                          required
                        />
                      </div>
                      <RaisedButton
                        label="Save"
                        type="submit"
                        disabled={!this.state.canSubmit}
                        buttonStyle={{height: '30px', lineHeight: '30px'}}
                        labelStyle={{fontSize: 11}}
                        style={{marginTop: 12}}
                        primary={true}/>
                    </Formsy.Form>
                  </Col>
                </Row>
              </Card>

              <Card style={{padding: 16, marginBottom: 40, marginTop: 20}}>
                <CardTitle title="Announcement Settings"/>
                <SubscriptionForm parentProps={this.props} showOptions={true}/>
              </Card>
            </div>
          </Grid>
        </div>
      </div>
    )
  }
}

export default SettingsContainer;
