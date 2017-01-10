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
import * as userActions from '../../actions/users/index';
import SubscriptionForm from './SubscriptionForm'

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    const gender = props.auth_user.user.user_profile.gender;

    // work around for style issues
    this.state = {
      gender
    };
    this.state['datePickerStyle'] = gender == null ? {marginTop: 9.5} : {marginTop: 0}
  }

  get styles() {
    return {
      formField: {
        fontSize: 14,
        fontWeight: 300,
        width: '100%',
        marginTop: 5
      }
    }
  }

  handleChange(event, index, value) {
    this.setState({gender: value, datePickerStyle: {marginTop: 0}})
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
            textFieldStyle={this.styles.formField}
            style={this.state.datePickerStyle}
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
                  <Col xs={4} style={{marginTop: 60}}>
                    <Row center="xs">
                      <Avatar src={this.props.auth_user.user.user_profile.user_avatar} size={150}/>
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
                    <CardTitle style={{padding: 0}} title="User Details" subtitle="Help us know you better"/>
                    <div style={{paddingTop: 5}}>
                      <TextField style={this.styles.formField}
                                 ref="memberId"
                                 hintText="* Member ID"
                                 fullWidth={true}
                                 defaultValue={member_id}/>
                      <TextField style={this.styles.formField}
                                 ref="designation"
                                 hintText="* Designation (ex: CSE Student, CSE Staff etc)"
                                 fullWidth={true}
                                 defaultValue={designation}/>
                      <Row>
                        <Col xs={6}>
                          <SelectField
                            hintText="Gender"
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
                        ref="aboutMe"
                        hintText="About me"
                        style={this.styles.formField}
                        multiLine={true}
                        fullWidth={true}
                        rows={1}
                        rowsMax={4}
                      />
                    </div>
                    <RaisedButton label="Save"
                                  onClick={() => this.handleUserProfileSave()}
                                  buttonStyle={{height: '30px', lineHeight: '30px'}}
                                  labelStyle={{fontSize: 11}}
                                  style={{marginTop: 12}}
                                  primary={true}/>
                  </Col>
                </Row>
              </Card>

              <Card style={{padding: 16, marginBottom: 40, marginTop: 20}}>
                <CardTitle title="Subscriptions"
                           subtitle="Your institute's announcement categories"/>
                <SubscriptionForm parentProps={this.props}/>
              </Card>
            </div>
          </Grid>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...userActions}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);


