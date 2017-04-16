import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card/index';
import RaisedButton from 'material-ui/RaisedButton'
import {FormsyText} from 'formsy-material-ui/lib';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table/index';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {grey500, grey600} from 'material-ui/styles/colors';
import {hashHistory} from 'react-router';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import IconButton from 'material-ui/IconButton';

class ManageStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      canSubmit: false,
      showButton: false,
      formValid: false,
      memberId: '',
      designation: '',
      email: ''
    };
  }

  componentWillMount() {
    const role = this.props.parentProps.auth_user.selectedInstitute.user_institute_info[0].role;
    if (role === 'inst_student') {
      hashHistory.replace('/');
    } else {
      this.props.parentProps.actions.staffApprovalRequest();
    }
  }

  get styles() {
    return {
      formTitle: {
        padding: '12px 16px 0px 16px',
      },
      formDescription: {
        padding: '0px 16px 16px 16px',
        fontWeight: 300,
        fontSize: '10px'
      },
      chooseButton: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      }
    }
  }

  enableButton() {
    this.setState({canSubmit: true})
    this.setState({formValid: true})
  }

  disableButton() {
    this.setState({canSubmit: false})
    this.setState({formValid: false})
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }


  onFileSelect(e) {
    if (e.target.files.length === 0) {
      this.refs.chosenFiles.innerHTML = '<i style="color: #c6c6c6">No file Chosen</i>';
      this.setState({canSubmit: false})
      this.setState({showButton: false})
    } else {
      let validExts = ['.xlsx', '.xls', '.xlt', '.xltm', '.xltx', '.xlsb', '.xlsm'];
      let text = e.target.files[0].name;
      let fileExt = text.substring(text.lastIndexOf('.'));
      if (validExts.indexOf(fileExt) < 0) {
        this.parentProps.actions.toggleSnackbar('Please select a valid file');
        return;
      }
      this.refs.chosenFiles.innerHTML = '';
      this.refs.chosenFiles.innerHTML = text;
      this.setState({showButton: true})
      this.setState({canSubmit: true})
    }
  }

  onSubmitForm() {
    this.handleOpen();
  }

  clearAttachement() {
    this.refs.StaffAttachments.value = '';
    this.refs.chosenFiles.innerHTML = '';
    this.setState({showButton: false})
    if (!this.state.formValid) {
      this.disableButton();
    }

  }

  submitForm() {
    if (this.refs.StaffAttachments.files.length > 0) {
      const data = {hasFile: true, bulk_invite_file: this.refs.StaffAttachments.files[0]};
      this.parentProps.actions.submitStaffAdditionRequest(data);
      this.refs.StaffAttachments.value = '';
      this.refs.chosenFiles.innerHTML = '';
    }
    else {
      const data = {memberId: this.state.memberId,
        email: this.state.email,
        designation: this.state.designation};
      const request = {hasFile: false, invite_data: data};
      this.parentProps.actions.submitStaffAdditionRequest(request);
    }
    this.setState({open: false});
    this.setState({canSubmit: false});
    this.setState({showButton: false});
    this.refs.form.reset();
  }

  handleClick(user_guid, status) {
    this.parentProps.actions.staffApprovalAction(user_guid, status);
  }
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }
  renderRows() {
    const { pending_staffs } = this.parentProps.auth_user.selectedInstitute;
    if (pending_staffs && pending_staffs.length !== 0) {
      return pending_staffs.map((staff, i) => {
        const name = `${staff.first_name} ${staff.last_name}`;
        return (
          <TableRow key={i}>
            <TableRowColumn style={{ padding: '0 12px' }}>
              <ListItem
                disabled={true}
                primaryText={name}
                secondaryText={staff.email}
                leftAvatar={<Avatar src={staff.user_profile.user_avatar} size={45} />}
              >
              </ListItem>
            </TableRowColumn>
            <TableRowColumn style={{ color: grey600 }}>
              {staff.pivot.member_id}
            </TableRowColumn>
            <TableRowColumn style={{ color: grey600, width: 80 }}>
              <IconButton>
                <FontIcon className="material-icons" onClick={() => this.handleClick(staff.user_guid, 'declined')}>
                  clear
                </FontIcon>
              </IconButton>
              <IconButton>
                <FontIcon className="material-icons" onClick={() => this.handleClick(staff.user_guid, 'accepted')}>
                  done
                </FontIcon>
              </IconButton>
            </TableRowColumn>
          </TableRow>
        )
      });
    }

    if (pending_staffs && pending_staffs.length === 0) {
      return (
        <TableRow>
          <TableRowColumn style={{ fontSize: 14 }}>
            There are no pending requests.
          </TableRowColumn>
        </TableRow>
      )
    }
  }
  renderStaffApprovals() {
    this.parentProps = this.props.parentProps;
    return (
      <Card style={{marginBottom: 40, marginTop: 20}}>
        <CardTitle titleStyle={{ fontSize: 20 }} style={this.styles.formTitle}
                   title="Approve Staff Members" subtitle="Check for email and employee id to validate" />

        <CardText style={{ padding: '16px 0' }}>
          <Table fixedHeader={true} selectable={false}>
            <TableBody displayRowCheckbox={false}>
              {this.renderRows()}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    )
  }

  render() {
    this.parentProps = this.props.parentProps;
    const institute_guid = this.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const sample_sheet = `${process.env.SERVER_HOST}/api/v1_0/institute/${institute_guid}/download_staff_template`;

    const actions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={() => this.handleClose()}/>,
      <FlatButton label="Submit" primary={true} keyboardFocused={true} onTouchTap={() => this.submitForm()}/>
    ];

    return (
      <div>
        <Formsy.Form
          ref="form"
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
        >
          <Card>
            <CardTitle titleStyle={{fontSize: 20}} style={this.styles.formTitle}
                       title="Invite Staff" subtitle="All fields are required"/>
            <CardText style={this.styles.formDescription}>
              <Col xs={12}>
                <FormsyText
                  style={{marginTop: 12}}
                  hintText="Employee ID"
                  name="memberId"
                  fullWidth={true}
                  required
                  onChange={(e) => this.handleChange(e)}
                  autoComplete="off"/>
                <FormsyText
                  style={{marginTop: 12}}
                  hintText="Designation (ex: CSE Staff)"
                  name="designation"
                  autoComplete="off"
                  onChange={(e) => this.handleChange(e)}
                  fullWidth={true}
                  required/>
                <FormsyText
                  style={{marginTop: 12}}
                  hintText="Email"
                  name="email"
                  fullWidth={true}
                  onChange={(e) => this.handleChange(e)}
                  validations={{isEmail: true}}
                  validationErrors={{isEmail: 'Not a valid Email ID'}}
                  required
                  autoComplete="off"/>
              </Col>
            </CardText>
            <CardActions style={{padding: '0px 16px 16px'}}>
              <RaisedButton
                containerElement="label"
                primary={true}
                label="Import via excel">
                <input ref="StaffAttachments" type="file"
                       style={this.styles.chooseButton}
                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                       onChange={(e) => this.onFileSelect(e)}/>
              </RaisedButton>
              <em style={{paddingLeft: 5, fontSize: 11, color: '#c6c6c6'}} ref="chosenFiles">
                No file chosen
              </em>
              {this.state.showButton ? (
                  <i className="material-icons"
                     style={{fontSize: 16, verticalAlign: 'middle', color: grey500, cursor: 'pointer'}}
                     onTouchTap={() => this.clearAttachement()}>clear</i>) : ''}
              <p style={{margin: '16px 0 0', fontSize: 12, color: grey500}}>
                Download sample <a href={sample_sheet}>spreadsheet</a> to import via excel
              </p>
            </CardActions>
            <CardActions style={{textAlign: 'right'}}>
              <RaisedButton
                label="Submit"
                type="submit"
                buttonStyle={{height: '30px', lineHeight: '30px'}}
                labelStyle={{fontSize: 11}}
                primary={true}
                onTouchTap={() => this.onSubmitForm()}
                disabled={!this.state.canSubmit}/>
            </CardActions>
          </Card>
        </Formsy.Form>

        {this.renderStaffApprovals()}

        <Dialog
          title="Are you sure?"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={() => this.handleClose()}
        >
          {this.state.showButton ?('Your file will be uploaded') :
              ('Submitting will create new staff member')}
        </Dialog>
      </div>
    )
  }
}

export default ManageStaff;
