import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table/index';
import {Row, Col} from 'react-flexbox-grid';
import {grey500} from 'material-ui/styles/colors';
import {FormsyText} from 'formsy-material-ui/lib';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ChipInput from 'material-ui-chip-input';
import Loader from 'halogenium/ScaleLoader';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

class CategoryNotifiersDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      deletionConfirmation: false,
      deletionNotifier: null,
      added_subscribers: [],
      removed_subscribers: []
    }
  }

  get styles() {
    return {
      formField: {
        fontSize: 14,
        fontWeight: 300,
        width: '100%',
      },
      chip: {
        margin: 4,
        size: 12
      },
      chipLabel: {
        lineHeight: '28px',
        color: '#757575',
        fontSize: 13
      },
      validatedUsersContainer: {
        padding: '0px 16px 5px 28px',
        display: 'flex',
        flexWrap: 'wrap'
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

  handleDialogClose() {
    this.props.parentProps.actions.toggleNotifiersDialog();
    this.setState({notifier_email: ''});
  }

  toggleDeletionConfirmationDialog(deletionNotifier = null) {
    this.setState({deletionConfirmation: !this.state.deletionConfirmation, deletionNotifier})
  }

  handleUserValidate(data) {
    const formData = {
      category_guid: this.props.category.category_guid,
      email: data.notifier_email,
    };
    const parentProps = this.props.parentProps;
    const institute_guid = parentProps.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/category/validate_notifier`;
    parentProps.actions.notifierValidationRequest(formData, url);
  }

  handleNotifierAddition() {
    let user_guids = [];
    const parentProps = this.props.parentProps;
    parentProps.auth_user.categoryNotifiers.validatedUsers.map((validatedUser) => {
      user_guids.push(validatedUser.user_guid);
    });
    const data = {
      user_guids,
      category_guid: this.props.category.category_guid
    };
    parentProps.actions.addNotifiersRequest(
      data,
      parentProps.auth_user.selectedInstitute.inst_profile_guid
    );
  }

  handleNotifierRemoval(user_guid) {
    this.toggleDeletionConfirmationDialog();
    const data = {
      user_guid,
      category_guid: this.props.category.category_guid
    };
    const parentProps = this.props.parentProps;
    const institute_guid = parentProps.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/category/remove_notifier`;
    parentProps.actions.removeNotifierRequest(data, url);
  }

  renderDeletionConfirmation() {
    const deletionNotifier = this.state.deletionNotifier;
    const actions = [
      <FlatButton
        label="Cancel"
        labelStyle={{textTransform: 'capitalize'}}
        primary={true}
        onTouchTap={() => this.toggleDeletionConfirmationDialog()}
      />,
      <FlatButton label="Remove" style={{color: '#AE181F'}}
                  labelStyle={{textTransform: 'capitalize'}}
                  onTouchTap={() => this.handleNotifierRemoval(deletionNotifier.user_guid)}
                  keyboardFocused={true}
      />,
    ];

    return (
      <Dialog
        title="Are you sure?"
        actions={actions}
        modal={false}
        open={this.state.deletionConfirmation}
        onRequestClose={this.toggleDeletionConfirmationDialog}
        contentStyle={{width: '50%'}}
      >
        {
          deletionNotifier ?
            `Are you sure want to remove ${deletionNotifier.first_name} as a notifier?
          ${deletionNotifier.first_name} will no longer be able announce on '${this.props.category.category_type}'` :
            ''
        }
      </Dialog>
    );
  }

  renderNotifiers(editableNotifiers) {
    let notifiers = this.props.parentProps.auth_user.categoryNotifiers.notifiers;
    let notifier_list = [];
    notifiers.map((notifier, index) => {
      notifier_list.push(
        <TableRow key={index}>
          <TableRowColumn style={{textTransform: 'capitalize'}}>
            <Row style={{display: 'table', borderSpacing: 6, borderCollapse: 'separate'}}>
              <div style={{display: 'table-row'}}>
                <Avatar style={{display: 'table-cell'}} src={notifier.user_profile.user_avatar} size={37}/>
                <span style={{display: 'table-cell', verticalAlign: 'middle'}}>
                {`${notifier.first_name} ${notifier.last_name}`}
              </span>
              </div>
            </Row>
          </TableRowColumn>
          <TableRowColumn>{notifier.email}</TableRowColumn>
          <TableRowColumn>{notifier.designation}</TableRowColumn>
          {notifier.editable_by_user ?
            (<TableRowColumn style={{width: 20}}>
              <IconButton onTouchTap={() => this.toggleDeletionConfirmationDialog(notifier)}>
                <FontIcon className="material-icons" color={grey500}>clear</FontIcon>
              </IconButton>
            </TableRowColumn>) :
            editableNotifiers.length > 0 ? <TableRowColumn style={{width: 20}}/> : null
          }
        </TableRow>
      );

    });
    return notifier_list;
  }

  onSubscriberAdd(email_id) {
    this.props.parentProps.actions.subscribersChipsUpdate(email_id, 'add');
    this.setState({added_subscribers: [email_id, ...this.state.added_subscribers]})
  }

  onSubscriberRemove(email_id) {
    this.props.parentProps.actions.subscribersChipsUpdate(email_id, 'remove');
    this.setState({removed_subscribers: [email_id, ...this.state.removed_subscribers]})
  }

  updateSubscribers() {
    const data = {
      category_guid: this.props.category.category_guid,
      removed_email_ids: this.state.removed_subscribers,
      added_email_ids: this.state.added_subscribers
    };

    this.props.parentProps.actions.updateSubscribers(data);
    this.setState({
      added_subscribers: [],
      removed_subscribers: []
    });
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

  render() {
    let parentProps = this.props.parentProps;
    const category = this.props.category;

    if (!parentProps.auth_user.categoryNotifiers.notifiersDialogOpen) {
      return null;
    }

    let notifiersData = this.getLoader('existing_notifiers');
    if (!parentProps.auth_user.categoryNotifiers.loading) {
      const editableNotifiers = parentProps.auth_user.categoryNotifiers.notifiers.filter((notifier) =>
        notifier.editable_by_user
      );
      notifiersData = (
        <div style={{padding: '16px 16px 0px 16px'}} key="existing_notifiers">
          <Subheader>Currently announced by</Subheader>
          <div style={{padding: '0 16px 16px'}}>
            <Table fixedHeader={true} selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Email</TableHeaderColumn>
                  <TableHeaderColumn>Designation</TableHeaderColumn>
                  {editableNotifiers.length > 0 ? (<TableHeaderColumn style={{width: 20}}/>) : null}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.renderNotifiers(editableNotifiers)}
              </TableBody>
            </Table>
          </div>
          {this.renderDeletionConfirmation()}
        </div>
      );
    }

    const validatedUsers = parentProps.auth_user.categoryNotifiers.validatedUsers;
    let validatedUsersChips = [];
    if (validatedUsers.length > 0) {
      validatedUsers.map((validatedUser, index) => {
        validatedUsersChips.push(
          <Chip
            onRequestDelete={() => parentProps.actions.removeValidatedNotifier(validatedUser.user_guid)}
            style={this.styles.chip}
            key={`validated_${validatedUser.user_guid}`}
            labelStyle={{fontSize: 12}}
          >
            <Avatar src={validatedUser.user_profile.user_avatar}/>
            {`${validatedUser.first_name} ${validatedUser.last_name}`}
          </Chip>
        );
      });
    }
    const validatedUsersContainer = (
      <div style={this.styles.validatedUsersContainer} key="validated_user_chips">
        {validatedUsersChips}
      </div>
    );
    let submitType = null;
    let notifierForm = null;
    if (category.subscribed_as === 'Announcer') {
      notifierForm = (
        <div style={{padding: '0px 16px'}} key="notifier_form">
          <Subheader>Add announcers to category</Subheader>
          <Formsy.Form
            onValid={this.enableButton.bind(this)}
            onInvalid={this.disableButton.bind(this)}
            onValidSubmit={(data) => this.handleUserValidate(data)}
          >
            <Row style={{padding: '0 16px 16px'}}>
              <Col xs={8}>
                <FormsyText
                  hintText="Email id"
                  name="notifier_email"
                  style={this.styles.formField}
                  required
                  validations="isEmail"
                  validationError="Please enter valid email id"
                  autoComplete="off"
                />
              </Col>
              <Col xs={2}>
                <RaisedButton
                  type="submit"
                  label="Validate"
                  fullWidth={true}
                  buttonStyle={{height: '30px', lineHeight: '30px'}}
                  labelStyle={{fontSize: 11}}
                  style={{marginTop: 12}}
                  disabled={!this.state.canSubmit}
                  onTouchTap={() => submitType = 'Validate'}
                  primary={true}/>
              </Col>
              <Col xs={2}>
                <RaisedButton
                  label="Add"
                  fullWidth={true}
                  buttonStyle={{height: '30px', lineHeight: '30px'}}
                  labelStyle={{fontSize: 11}}
                  style={{marginTop: 12}}
                  disabled={validatedUsers.length === 0}
                  onTouchTap={() => this.handleNotifierAddition()}
                  primary={true}/>
              </Col>
            </Row>
          </Formsy.Form>
        </div>
      )
    }

    let privateCategorySubscribers = null;
    if (category.private) {
      privateCategorySubscribers = this.getLoader('current_subscribers');
      if(parentProps.category.subscribers.loaded) {
        privateCategorySubscribers = (
          <div style={{padding: '0 16px'}} key="category_subscribers">
            <Subheader>Current Subscribers</Subheader>
            <Row style={{padding: '0 16px'}}>
              <Col xs={10}>
                <ChipInput
                  fullWidth
                  value={parentProps.category.subscribers.data}
                  onRequestAdd={(email_id) => this.onSubscriberAdd(email_id)}
                  onRequestDelete={(email_id) => this.onSubscriberRemove(email_id)}
                  dataSource={parentProps.category.subscribers.data}
                  spellCheck={false}
                  hintText="Email id's of the users to be notified by this category (Users should already be registered on College Mate)"
                  newChipKeyCodes={[13, 32, 188]}
                  style={this.styles.formField}
                  chipRenderer={({text, value, isFocused, isDisabled, handleClick, handleRequestDelete}, key) => (
                    <Chip
                      key={key}
                      className="chip"
                      labelStyle={this.styles.chipLabel}
                      onTouchTap={handleClick}
                      onRequestDelete={handleRequestDelete}
                    >
                      {text}
                    </Chip>
                  )}
                />
              </Col>
              <Col xs={2}>
                <RaisedButton
                  label="Update"
                  fullWidth={true}
                  buttonStyle={{height: '30px', lineHeight: '30px'}}
                  labelStyle={{fontSize: 11}}
                  style={{marginTop: 12}}
                  onClick={() => this.updateSubscribers()}
                  primary={true}/>
              </Col>
            </Row>
          </div>
        );
      }
    }

    const dialogContent = [
      notifierForm,
      privateCategorySubscribers,
      validatedUsersContainer,
      notifiersData
    ];

    const actions = (
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={() => this.handleDialogClose()}
      />
    );

    return (
      <div>
        <Dialog
          title={`${category.category_type} Notifiers`}
          titleStyle={{textTransform: 'capitalize'}}
          actions={actions}
          modal={false}
          open={parentProps.auth_user.categoryNotifiers.notifiersDialogOpen}
          autoScrollBodyContent={true}
          bodyStyle={{padding: 0}}
          contentStyle={{maxWidth: 1000}}
        >
          {dialogContent}
        </Dialog>
      </div>
    );
  }
}


export default CategoryNotifiersDialog;