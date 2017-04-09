import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table/index';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Row, Col} from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {FormsyText, FormsyToggle} from 'formsy-material-ui/lib';
import ChipInput from 'material-ui-chip-input';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton';
import {grey500, grey600} from 'material-ui/styles/colors'
import CategoryNotifiersDialog from './CategoryNotifiersDialog';

class SubscriptionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      canSubmit: false,
      deletionConfirmation: false,
      deletionCategory: null,
      private_category: null,
      email_ids: []
    }
  }

  get styles() {
    return {
      formField: {
        fontSize: 14,
        fontWeight: 300,
        width: '100%',
      },
      chipLabel: {
        lineHeight: '28px',
        color: '#757575',
        fontSize: 13
      }
    }
  }

  handleToggle(evt, category_guid) {
    if (evt.target.getAttribute('data-toggled') === 'true') {
      this.props.parentProps.actions.unsubscribeAnnouncementRequest(category_guid)
    } else {
      this.props.parentProps.actions.subscribeAnnouncementRequest(category_guid)
    }
  }

  handleCategoryCreate(data) {
    data = {...data, email_ids: this.state.email_ids};
    this.props.parentProps.actions.createAnnouncementCategoryRequest(data)
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

  toggleCategoryNotifiersDialog(category = null, subscribed_as) {
    if (category) {
      category.subscribed_as = subscribed_as;
    }
    const {parentProps} = this.props;
    const institute_guid = parentProps.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/category/notifiers`;
    const data = {category_guid: category.category_guid};
    parentProps.actions.toggleNotifiersDialog();
    parentProps.actions.fetchCategoryNotifersRequest(data, url);
    this.setState({category});
  }

  handleChipChange(email_ids) {
    this.setState({email_ids})
  }

  renderUsersAdditionForm() {
    if (this.state.private_category) {
      return (
        <Row style={{padding: '0 16px 16px'}}>
          <Col xs={12}>
            <ChipInput
              fullWidth
              defaultValue={this.state.email_ids}
              spellCheck={false}
              hintText="Email id's of the users to be notified by this category"
              newChipKeyCodes={[13, 32, 188]}
              style={this.styles.formField}
              onChange={(chips) => this.handleChipChange(chips)}
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
        </Row>
      )
    }
  }

  renderCreateCategoryForm() {
    const role = this.props.parentProps.auth_user.selectedInstitute.user_institute_info[0].role;
    if (role === 'inst_superuser' || role === 'inst_admin' || role === 'inst_staff') {
      return (
        <div>
          <Subheader>Create Announcement Category</Subheader>
          <Formsy.Form
            onValid={this.enableButton.bind(this)}
            onInvalid={this.disableButton.bind(this)}
            onValidSubmit={(data) => this.handleCategoryCreate(data)}
          >
            <Row style={{padding: '0 16px 16px'}}>
              <Col xs={4}>
                <FormsyText
                  hintText="Category Type"
                  name="category_type"
                  style={this.styles.formField}
                  required
                  autoComplete="off"
                />
              </Col>
              <Col xs={8}>
                <FormsyText
                  hintText="Category Description"
                  name="category_desc"
                  style={this.styles.formField}
                  required
                  autoComplete="off"
                />
              </Col>
            </Row>
            <ReactCSSTransitionGroup
              transitionName='fieldAnimation'
              transitionEnterTimeout={600}
              transitionLeaveTimeout={500}>
              {this.renderUsersAdditionForm()}
            </ReactCSSTransitionGroup>
            <Row style={{padding: '0 16px 16px'}}>
              <Col xs={4}>
                <FormsyToggle
                  style={this.styles.formField}
                  name="private"
                  label="Make private category"
                  onChange={(event, isInputChecked) => this.setState({private_category: isInputChecked})}
                />
              </Col>
            </Row>
            <Row style={{padding: '0 16px 16px'}}>
              <Col xs={2}>
                <RaisedButton
                  type="submit"
                  label="Create Category"
                  fullWidth={true}
                  disabled={!this.state.canSubmit}
                  buttonStyle={{height: '30px', lineHeight: '30px'}}
                  labelStyle={{fontSize: 11}}
                  style={{marginTop: 12}}
                  primary={true}/>
              </Col>
            </Row>
          </Formsy.Form>
        </div>
      )
    }
  }

  toggleDeletionConfirmationDialog(deletionCategory) {
    this.setState({deletionConfirmation: !this.state.deletionConfirmation, deletionCategory})
  }

  handleCategoryDelete(category_guid) {
    this.toggleDeletionConfirmationDialog();
    const parentProps = this.props.parentProps;

    parentProps.actions.removeAnnouncementCategoryRequest(category_guid);
  }

  renderDeletionConfirmation() {
    const deletionCategory = this.state.deletionCategory;
    const actions = [
      <FlatButton
        label="Cancel"
        labelStyle={{textTransform: 'capitalize'}}
        primary={true}
        onTouchTap={() => this.toggleDeletionConfirmationDialog()}
      />,
      <FlatButton label="Remove" style={{color: '#AE181F'}}
                  labelStyle={{textTransform: 'capitalize'}}
                  onTouchTap={() => this.handleCategoryDelete(deletionCategory.category_guid)}
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
        {deletionCategory ?
          `Are you sure you want to delete ${deletionCategory.category_type}? This will delete all the previous
           announcements posted on this category.` : ''
        }
      </Dialog>
    );
  }

  renderOptions(category, subscribed_as) {
    const {user} = this.props.parentProps.auth_user;

    if (category.creator.user_guid === user.user_guid || user.default_institute.user_institute_info[0].role === 'inst_superuser') {
      return (
        <IconMenu
          iconButtonElement={
            <IconButton>
              <FontIcon className="material-icons" color={grey500}>more_horiz</FontIcon>
            </IconButton>
          }
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          menuStyle={{fontSize: 12}}
        >
          <MenuItem
            innerDivStyle={{padding: '0 16px 0 55px', fontSize: 14}}
            primaryText="Settings"
            onTouchTap={() => this.toggleCategoryNotifiersDialog(category, subscribed_as)}
            leftIcon={
              <FontIcon
                className="material-icons"
                style={{fontSize: 22}}
                color={grey500}>
                settings
              </FontIcon>
            }
          />
          <MenuItem
            innerDivStyle={{padding: '0 16px 0 55px', fontSize: 14}}
            primaryText="Delete"
            onTouchTap={() => this.toggleDeletionConfirmationDialog(category)}
            leftIcon={
              <FontIcon
                className="material-icons"
                style={{fontSize: 22}}
                color={grey500}>
                delete_forever
              </FontIcon>
            }
          />
        </IconMenu>
      )
    } else {
      return (
        <IconButton onTouchTap={() => this.toggleCategoryNotifiersDialog(category, subscribed_as)}>
          <FontIcon className="material-icons" color={grey500}>more_horiz</FontIcon>
        </IconButton>
      )
    }
  }

  renderCategories() {
    const allCategories = this.props.parentProps.auth_user.selectedInstitute.categories;
    const {subscriptions, notifying_categories} = this.props.parentProps.auth_user.selectedInstitute;
    let category_list = [];

    allCategories.map((category, index) => {
      let subscribed_as = 'Not Subscribed';
      let disabled = category.disabled;
      let toggle = false;
      for (let i = 0; i < subscriptions.length; i++) {
        if (category.category_guid === subscriptions[i].category_guid) {
          subscribed_as = 'Recipient';
          toggle = true;
          break;
        }
      }

      for (let i = 0; i < notifying_categories.length; i++) {
        if (category.category_guid === notifying_categories[i].category_guid) {
          subscribed_as = 'Announcer';
          disabled = true;
          toggle = true;
          break;
        }
      }

      category_list.push(
        <TableRow key={index}>
          <TableRowColumn style={{textTransform: 'capitalize'}}>
            {category.category_type}
            <p style={{margin: '4px 0', fontSize: 'smaller', color: grey500}}>
              {category.creator.first_name} {category.creator.last_name}
            </p>
          </TableRowColumn>
          <TableRowColumn>{subscribed_as}</TableRowColumn>
          <TableRowColumn>
            <Toggle disabled={disabled} defaultToggled={toggle}
                    data-toggled={toggle}
                    onToggle={(evt) => this.handleToggle(evt, category.category_guid)}/>
          </TableRowColumn>
          {
            this.props.showOptions ? (
              <TableRowColumn>
                {this.renderOptions(category, subscribed_as)}
              </TableRowColumn>
            ) : null
          }

        </TableRow>
      );
    });

    return category_list;
  }

  render() {
    return (
      <div>
        {this.renderCreateCategoryForm()}
        <Subheader>Subscriptions Manager</Subheader>
        <div style={{padding: '0 16px 25px'}}>
          <Table fixedHeader={true} selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{color: grey600}}>
                  Category
                  <p style={{margin: '4px 0', fontSize: 'smaller', color: grey500}}>
                    Category Creator
                  </p>
                </TableHeaderColumn>
                <TableHeaderColumn style={{color: grey600}}>Subscribed As</TableHeaderColumn>
                <TableHeaderColumn style={{color: grey600}}>Status</TableHeaderColumn>
                {
                  this.props.showOptions ?
                    (<TableHeaderColumn style={{color: grey600}}>Actions</TableHeaderColumn>) :
                    null
                }
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.renderCategories()}
            </TableBody>
          </Table>
          <CategoryNotifiersDialog
            category={this.state.category}
            parentProps={this.props.parentProps}
          />
        </div>
        {this.renderDeletionConfirmation()}
      </div>
    )
  }
}

export default SubscriptionForm