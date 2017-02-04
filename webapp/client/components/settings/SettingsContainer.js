import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Avatar from 'material-ui/Avatar';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {grey600} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

import Header from '../Header';
import SubscriptionForm from './SubscriptionForm'

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    const gender = props.auth_user.user.user_profile.gender;

    this.state = {
      gender
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

  handleChange(event, index, value) {
    this.setState({gender: value})
  }

  handleUserProfileSave() {
    const profileData = {
      memberId: this.refs.memberId.getValue(),
      designation: this.refs.designation.getValue(),
      gender: this.state.gender,
      dob: moment(this.refs.dob.getDate()).format('YYYY-MM-DD'),
      aboutMe: this.refs.aboutMe.getValue()
    };

    this.props.actions.updateUserProfileRequest(profileData)
  }

  render() {
    // initial values of the form
    const username = `${this.props.auth_user.user.first_name} ${this.props.auth_user.user.last_name}`;
    const {member_id, designation} = this.props.auth_user.selectedInstitute.user_institute_info[0];
    const {dob, about_me} = this.props.auth_user.user.user_profile;

    const renderDate = () => {
      if (dob) {
        return (
          <DatePicker
            ref="dob"
            floatingLabelText="Date of birth"
            floatingLabelStyle={this.styles.floatingLabelStyle}
            defaultDate={new Date(dob)}
            style={this.state.datePickerStyle}
            textFieldStyle={this.styles.formField}
            hintText="Date of Birth"
            formatDate={new global.Intl.DateTimeFormat('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format}
          />
        )
      } else {
        return (
          <DatePicker
            ref="dob"
            floatingLabelText="Date of birth"
            floatingLabelStyle={this.styles.floatingLabelStyle}
            textFieldStyle={this.styles.formField}
            hintText="Date of Birth"
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
                    <CardTitle style={{padding: 0}} title="Your Profile" />
                    <div style={{paddingTop: 5}}>
                      <TextField style={this.styles.formField}
                                 ref="memberId"
                                 floatingLabelText="* Member ID"
                                 floatingLabelStyle={this.styles.floatingLabelStyle}
                                 fullWidth={true}
                                 defaultValue={member_id}/>
                      <TextField style={this.styles.formField}
                                 ref="designation"
                                 floatingLabelText="* Designation"
                                 floatingLabelStyle={this.styles.floatingLabelStyle}
                                 hintText="ex: CSE Student, CSE Staff etc"
                                 fullWidth={true}
                                 defaultValue={designation}/>
                      <Row>
                        <Col xs={6}>
                          <SelectField
                            floatingLabelText="Gender"
                            floatingLabelStyle={this.styles.floatingLabelStyle}
                            style={this.styles.formField}
                            fullWidth={true}
                            value={this.state.gender}
                            onChange={(event, index, value) => this.handleChange(event, index, value)}
                          >
                            <MenuItem value="male" primaryText="Male"/>
                            <MenuItem value="female" primaryText="Female"/>
                          </SelectField>
                        </Col>
                        <Col xs={6}>
                          {renderDate()}
                        </Col>
                      </Row>
                      <TextField
                        defaultValue={about_me}
                        floatingLabelText="About me"
                        floatingLabelStyle={this.styles.floatingLabelStyle}
                        ref="aboutMe"
                        style={this.styles.formField}
                        multiLine={true}
                        fullWidth={true}
                        rows={1}
                        rowsMax={4}
                      />
                    </div>
                    <RaisedButton
                      label="Save"
                      onClick={() => this.handleUserProfileSave()}
                      buttonStyle={{height: '30px', lineHeight: '30px'}}
                      labelStyle={{fontSize: 11}}
                      style={{marginTop: 12}}
                      primary={true}/>
                  </Col>
                </Row>
              </Card>

              <Card style={{padding: 16, marginBottom: 40, marginTop: 20}}>
                <CardTitle title="Announcement Settings"/>
                <SubscriptionForm parentProps={this.props}/>
              </Card>
            </div>
          </Grid>
        </div>
      </div>
    )
  }
}

export default SettingsContainer;
