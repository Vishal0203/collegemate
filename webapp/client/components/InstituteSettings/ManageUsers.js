import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {FormsyText, FormsySelect} from 'formsy-material-ui/lib';
import {grey500, grey600, red500} from 'material-ui/styles/colors'
import {
  Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn, TableFooter, MenuItem, IconMenu, Avatar,
  Card, CardTitle, RaisedButton, IconButton, FontIcon, Dialog, FlatButton
} from 'material-ui';
import Formsy from 'formsy-react';
import {Row, Col} from 'react-flexbox-grid';
import * as userActions from '../../actions/users/index';
import * as snackbarActions from '../../actions/commons/index';
import Loader from 'halogenium/ScaleLoader';
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';
import Create from 'material-ui/svg-icons/content/create';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      idx: -1,
      canSubmit: false,
      openDailouge: false
    };
  }

  componentWillMount() {
    const data = {
      sortBy: 'first_name',
      sortDir: 'ASC',
      pageNo: 1,
      FilterCol: 'email',
      FilterVal: '',
      role: this.props.role
    };
    const role = this.props.role;
    if (role === 'inst_student') {
      this.props.actions.getInstStudentsRequest(data);
    } else if (role === 'inst_staff') {
      this.props.actions.getInstStaffRequest(data);
    }
  }

  get styles() {
    return {
      floatingLabelStyle: {
        fontSize: 16
      },
      formField: {
        fontSize: 14,
        fontWeight: 300,
        width: '100%',
      }
    }
  }

  getLoader = (key) => {
    return (
      <div style={{marginTop: '15px', marginBottom: '15px'}} key={key}>
        <Row center="xs">
          <Loader color="#126B6F" size="5px" margin="5px"/>
        </Row>
      </div>
    )
  };

  handleDialogClose() {
    this.setState({open: false});
  }

  handleDelDialogClose() {
    this.setState({openDailouge: false});
  }

  editUser(idx) {
    this.setState({open: true, idx});
  }

  deleteUserDailouge(idx) {
    this.setState({openDailouge: true, idx});
  }

  deleteUser() {
    const idx = this.state.idx;
    const role = this.props.role;
    if (role === 'inst_student') {
      const user_guid = this.props.get_inst_students.user[idx].user_guid;
      this.props.actions.deleteUserRequest(user_guid);
    } else {
      const user_guid = this.props.get_inst_staff.user[idx].user_guid;
      this.props.actions.deleteUserRequest(user_guid);
    }
    this.handleDelDialogClose();
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
    this.setState({open: false});
    const idx = this.state.idx;
    const role = this.props.role;
    if (role === 'inst_student') {
      const user_guid = this.props.get_inst_students.user[idx].user_guid;
      const formdata = {
        ...data,
        user_guid,
        role
      };
      this.props.actions.updateUserByStaff(formdata);
    } else if (role === 'inst_staff') {
      const user_guid = this.props.get_inst_staff.user[idx].user_guid;
      const formdata = {
        ...data,
        user_guid,
        role
      };
      this.props.actions.updateUserByStaff(formdata);
    }
    this.handleDialogClose();
  }

  renderProfile() {
    const idx = this.state.idx;
    const role = this.props.role;
    let first_name = '';
    let last_name = '';
    let email = '';
    let member_id = '';
    let designation = '';
    let avatar = '';
    if (role === 'inst_student') {
      first_name = this.props.get_inst_students.user[idx].first_name;
      last_name = this.props.get_inst_students.user[idx].last_name;
      email = this.props.get_inst_students.user[idx].email;
      member_id = this.props.get_inst_students.user[idx].pivot.member_id;
      designation = this.props.get_inst_students.user[idx].pivot.designation;
      avatar = this.props.get_inst_students.user[idx].user_profile.user_avatar;
    } else if (role === 'inst_staff') {
      first_name = this.props.get_inst_staff.user[idx].first_name;
      last_name = this.props.get_inst_staff.user[idx].last_name;
      email = this.props.get_inst_staff.user[idx].email;
      member_id = this.props.get_inst_staff.user[idx].pivot.member_id;
      designation = this.props.get_inst_staff.user[idx].pivot.designation;
      avatar = this.props.get_inst_staff.user[idx].user_profile.user_avatar;
    }
    return (
      <div>
        <Formsy.Form
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
          onValidSubmit={(data) => this.handleUserProfileSave(data)}
        >
          <CardTitle style={{padding: 0}} title={`${first_name}'s Profile`}/>
          <div style={{paddingTop: 5}}>
            <Row>
              <Col xs={4} style={{marginTop: 80}}>
                <Row center="xs">
                  <Avatar src={avatar} size={180}/>
                </Row>
                <Row center="xs" style={{marginTop: 4}}>
                  <div
                    style={{color: grey600, fontWeight: 300, fontSize: 12}}>{email}</div>
                </Row>
              </Col>
              <Col xs={8}>
                <FormsyText
                  inputStyle={{boxShadow: 'none'}}
                  style={this.styles.formField}
                  name="memberId"
                  floatingLabelText="Member Id"
                  floatingLabelStyle={this.styles.floatingLabelStyle}
                  fullWidth={false}
                  defaultValue={member_id}
                  disabled={member_id !== null}
                  required
                  autoComplete="off"
                />

                <FormsyText
                  inputStyle={{boxShadow: 'none'}}
                  style={this.styles.formField}
                  name="first_name"
                  floatingLabelText="First Name"
                  floatingLabelStyle={this.styles.floatingLabelStyle}
                  fullWidth={false}
                  defaultValue={first_name}
                  required
                  autoComplete="off"
                />

                <FormsyText
                  inputStyle={{boxShadow: 'none'}}
                  style={this.styles.formField}
                  name="last_name"
                  floatingLabelText="Designation"
                  floatingLabelStyle={this.styles.floatingLabelStyle}
                  fullWidth={false}
                  defaultValue={last_name}
                  required
                  autoComplete="off"
                />

                <FormsyText
                  inputStyle={{boxShadow: 'none'}}
                  style={this.styles.formField}
                  name="designation"
                  floatingLabelText="Designation"
                  floatingLabelStyle={this.styles.floatingLabelStyle}
                  fullWidth={false}
                  defaultValue={designation}
                  required
                  autoComplete="off"
                />
                <Row>
                  <RaisedButton
                    label="Update"
                    type="submit"
                    disabled={!this.state.canSubmit}
                    buttonStyle={{height: '30px', lineHeight: '30px'}}
                    labelStyle={{fontSize: 11}}
                    style={{marginTop: 12}}
                    primary={true}/>
                </Row>
              </Col>
            </Row>
          </div>
        </Formsy.Form>
      </div>
    );
  }

  filterSearch(cellDataKey, val) {
    let filterBy = val.toLowerCase();
    const role = this.props.role;
    const data = {
      sortBy: 'first_name',
      sortDir: 'ASC',
      FilterCol: cellDataKey,
      FilterVal: filterBy,
      pageNo: 1,
      role
    };
    if (role === 'inst_student') {
      this.props.actions.getInstStudentsRequest(data);
    } else if (role === 'inst_staff') {
      this.props.actions.getInstStaffRequest(data);
    }
  }

  _sortRowsBy(cellDataKey) {
    const role = this.props.role;
    let sortDir = '';
    let pageNo = '';
    let Sort = '';
    if (role === 'inst_student') {
      sortDir = this.props.get_inst_students.sortDir;
      Sort = this.props.get_inst_students.sortBy;
      pageNo = this.props.get_inst_students.pageNo;
    } else if (role === 'inst_staff') {
      sortDir = this.props.get_inst_staff.sortDir;
      Sort = this.props.get_inst_staff.sortBy;
      pageNo = this.props.get_inst_staff.pageNo;
    }
    let sortBy = cellDataKey;
    if (sortBy === Sort) {
      sortDir = (sortDir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      sortDir = 'DESC';
    }
    const data = {
      sortBy: cellDataKey,
      sortDir,
      pageNo,
      FilterCol: 'email',
      FilterVal: '',
      role: this.props.role
    };
    if (role === 'inst_student') {
      this.props.actions.getInstStudentsRequest(data);
    } else if (role === 'inst_staff') {
      this.props.actions.getInstStaffRequest(data);
    }
  }

  tableDef() {
    const role = this.props.role;
    let sortDir = '';
    let pageNo = '';
    let sortBy = '';
    if (role === 'inst_student') {
      sortDir = this.props.get_inst_students.sortDir;
      sortBy = this.props.get_inst_students.sortBy;
      pageNo = this.props.get_inst_students.pageNo;
    } else if (role === 'inst_staff') {
      sortDir = this.props.get_inst_staff.sortDir;
      sortBy = this.props.get_inst_staff.sortBy;
      pageNo = this.props.get_inst_staff.pageNo;
    }
    return (
      <Table fixedHeader={true} selectable={false}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn key="member_id">
              <a onClick={() => this._sortRowsBy('member_id')}> Id</a>
              {(sortBy === 'member_id' ?
                (sortDir === 'DESC' ? ' ↓' : ' ↑') : '')}
            </TableHeaderColumn>
            <TableHeaderColumn key="first_name">
              <a onClick={() => this._sortRowsBy('first_name')}> First Name</a>
              {(sortBy === 'first_name' ?
                (sortDir === 'DESC' ? ' ↓' : ' ↑') : '')}
            </TableHeaderColumn>
            <TableHeaderColumn key="last_name">
              <a onClick={() => this._sortRowsBy('last_name')}> Last Name</a>
              {(sortBy === 'last_name' ?
                (sortDir === 'DESC' ? ' ↓' : ' ↑') : '')}
            </TableHeaderColumn>
            <TableHeaderColumn key="email">
              <a onClick={() => this._sortRowsBy('email')}> E-Mail</a>
              {(sortBy === 'email' ?
                (sortDir === 'DESC' ? ' ↓' : ' ↑') : '')}
            </TableHeaderColumn>
            <TableHeaderColumn key="designation">
              <a onClick={() => this._sortRowsBy('designation')}>Designation</a>
              {(sortBy === 'designation' ?
                (sortDir === 'DESC' ? ' ↓' : ' ↑') : '')}
            </TableHeaderColumn>
            <TableHeaderColumn>
              Actions
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.renderRows()}
        </TableBody>
        {this.renderFooter()}
      </Table>);
  }

  changePage(dir) {
    const role = this.props.role;
    let pageNo = '';
    let moreInd = '';
    if (role === 'inst_student') {
      pageNo = this.props.get_inst_students.pageNo;
      moreInd = this.props.get_inst_students.moreInd;
    } else if (role === 'inst_staff') {
      pageNo = this.props.get_inst_staff.pageNo;
      moreInd = this.props.get_inst_staff.moreInd;
    }
    if (dir === 'right' && moreInd === 'Y') {
      pageNo = (parseInt(pageNo) + 1);
    } else if (dir === 'left' && (pageNo > 1)) {
      pageNo = (pageNo - 1);
    }
    const data = {
      sortBy: 'first_name',
      sortDir: 'ASC',
      FilterCol: 'email',
      FilterVal: '',
      pageNo,
      role: this.props.role
    };
    if (role === 'inst_student') {
      this.props.actions.getInstStudentsRequest(data);
    } else if (role === 'inst_staff') {
      this.props.actions.getInstStaffRequest(data);
    }
  }


  renderFooter() {
    const role = this.props.role;
    let pageNo = '';
    let total = '';
    let moreInd = '';
    if (role === 'inst_student') {
      pageNo = this.props.get_inst_students.pageNo;
      total = this.props.get_inst_students.total;
      moreInd = this.props.get_inst_students.moreInd;
    } else if (role === 'inst_staff') {
      pageNo = this.props.get_inst_staff.pageNo;
      total = this.props.get_inst_staff.total;
      moreInd = this.props.get_inst_staff.moreInd;
    }
    return (
      <TableFooter adjustForCheckbox={false}>
        <TableRow>
          <TableRowColumn style={{textAlign: 'right'}}>
            {pageNo <= 1 ? '' : <IconButton>
              <KeyboardArrowLeft onClick={() => this.changePage('left')}/>
            </IconButton>}
            <label ref="PageNo">
              <span style={{fontSize: 22}}>
                {total > 0 ? pageNo : 0}
              </span>
              <span style={{fontSize: 18}}>
              /{(total / 10) > parseInt(total / 10) ? (parseInt(total / 10) + 1) : parseInt(total / 10)}
              </span>
            </label>
            {moreInd == 'Y' ? <IconButton>
              <KeyboardArrowLeft onClick={() => this.changePage('right')}/>
            </IconButton> : ''}
          </TableRowColumn>
        </TableRow>
      </TableFooter>)
      ;
  }

  renderRows() {
    const role = this.props.role;
    let rows = '';
    if (role === 'inst_student') {
      rows = this.props.get_inst_students.user;
    } else if (role === 'inst_staff') {
      rows = this.props.get_inst_staff.user;
    }
    return rows.map((user, i) => {
      return (
        <TableRow key={i}>
          <TableRowColumn>
            {user.pivot.member_id}
          </TableRowColumn>
          <TableRowColumn>
            {user.first_name}
          </TableRowColumn>
          <TableRowColumn>
            {user.last_name}
          </TableRowColumn>
          <TableRowColumn>
            {user.email}
          </TableRowColumn>
          <TableRowColumn>
            {user.pivot.designation}
          </TableRowColumn>
          <TableRowColumn>
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <MoreHoriz color={grey500}/>
                </IconButton>
              }
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              menuStyle={{fontSize: 12}}
            >
              <MenuItem
                innerDivStyle={{padding: '0 16px 0 55px', fontSize: 14}}
                primaryText="Edit User"
                onTouchTap={() => this.editUser(i)}
                leftIcon={
                  <Create color={grey500} style={{fontSize: 22}}/>
                }
              />
              <MenuItem
                innerDivStyle={{padding: '0 16px 0 55px', fontSize: 14}}
                primaryText="Remove User"
                onTouchTap={() => this.deleteUserDailouge(i)}
                leftIcon={
                  <DeleteForever color={grey500} style={{fontSize: 22}}/>
                }
              />
            </IconMenu>
          </TableRowColumn>
        </TableRow>
      )
    });
  }

  onReset() {
    const role = this.props.role;
    const data = {
      sortBy: 'first_name',
      sortDir: 'ASC',
      pageNo: 1,
      FilterCol: 'email',
      FilterVal: '',
      role
    };
    if (role === 'inst_student') {
      this.props.actions.getInstStudentsRequest(data);
    } else if (role === 'inst_staff') {
      this.props.actions.getInstStaffRequest(data);
    }
    // this.renderRows();
    this.refs.field_val.resetValue();
  }

  handleSearch(data) {
    this.filterSearch(data.Field, data.field_value);
  }

  render() {
    const role = this.props.role;
    const actions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={() => this.handleDelDialogClose()}/>,
      <FlatButton label="Remove" primary={true} keyboardFocused={true} onTouchTap={() => this.deleteUser()}/>
    ];
    return (
      <div style={{padding: 16, marginTop: 20}}>
        <Formsy.Form onValidSubmit={(data) => this.handleSearch(data)}>
          <Row style={{padding: '0 0 10px'}}>
            <Col xs={4}>
              <FormsyText
                floatingLabelText="Query"
                hintText="Search by field name"
                name="field_value"
                ref="field_val"
                floatingLabelStyle={this.styles.floatingLabelStyle}
                inputStyle={{boxShadow: 'none'}}
                style={{
                  marginTop: -24,
                  fontSize: 14,
                  fontWeight: 300,
                  width: '100%'
                }}
                required
                autoComplete="off"
              />
            </Col>
            <Col xs={4}>
              <FormsySelect
                floatingLabelText="Field"
                floatingLabelStyle={this.styles.floatingLabelStyle}
                style={{
                  marginTop: -24, fontSize: 14,
                  fontWeight: 300,
                  width: '100%'
                }}
                fullWidth={false}
                name="Field"
                required
              >
                <MenuItem value="member_id" primaryText="Member Id"/>
                <MenuItem value="first_name" primaryText="First Name"/>
                <MenuItem value="last_name" primaryText="Last Name"/>
                <MenuItem value="designation" primaryText="Designation"/>
                <MenuItem value="email" primaryText="Email"/>
              </FormsySelect>
            </Col>
            <Col xs={4}>
              <RaisedButton
                label="Search"
                type="submit"
                buttonStyle={{height: '30px', lineHeight: '30px'}}
                labelStyle={{fontSize: 11}}
                style={{marginTop: 12, minWidth: 110}}
                primary={true}/>
              <RaisedButton
                label="Reset"
                buttonStyle={{height: '30px', lineHeight: '30px'}}
                labelStyle={{fontSize: 11}}
                style={{marginTop: 12, marginLeft: 5, minWidth: 110}}
                onTouchTap={() => this.onReset()}
                primary={true}/>
            </Col>
          </Row>
        </Formsy.Form>{(role === 'inst_student') ?
        ((!this.props.get_inst_students || this.props.get_inst_students.loading) ? this.getLoader('Loading Users') : this.tableDef()) :
        ((!this.props.get_inst_staff || this.props.get_inst_staff.loading) ? this.getLoader('Loading Users') : this.tableDef())}
        <Dialog
          titleStyle={{textTransform: 'capitalize'}}
          modal={false}
          open={this.state.open}
          autoScrollBodyContent={true}
          onRequestClose={() => this.handleDialogClose()}
        >
          {this.state.open ? this.renderProfile() : ''}
        </Dialog>
        <Dialog
          title={'Remove User?'}
          actions={actions}
          titleStyle={{textTransform: 'capitalize'}}
          modal={false}
          open={this.state.openDailouge}
          autoScrollBodyContent={true}
          bodyStyle={{padding: 0}}
          contentStyle={{maxWidth: 1000}}
          onRequestClose={() => this.handleDelDialogClose()}
        >
          {this.state.openDailouge ? <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to remove&nbsp;
            {(role === 'inst_student') ? (this.props.get_inst_students.user[this.state.idx].first_name) :
              (this.props.get_inst_staff.user[this.state.idx].first_name)} from institute</h4> : ''}
        </Dialog>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...snackbarActions,
      ...userActions,
    }, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    get_inst_students: state.auth_user.selectedInstitute.get_inst_students,
    get_inst_staff: state.auth_user.selectedInstitute.get_inst_staff
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);