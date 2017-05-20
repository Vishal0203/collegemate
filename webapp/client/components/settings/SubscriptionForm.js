import React, {Component} from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table/index';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Row, Col} from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {FormsyText, FormsyCheckbox} from 'formsy-material-ui/lib';
import ChipInput from 'material-ui-chip-input';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton';
import {grey500, grey600, red500} from 'material-ui/styles/colors'
import CategoryNotifiersDialog from './CategoryNotifiersDialog';
import AutoComplete from 'material-ui/AutoComplete';
import * as snackbarActions  from '../../actions/commons/index';

class SubscriptionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      canSubmit: false,
      deletionConfirmation: false,
      deletionCategory: null,
      private_category: false,
      email_ids: [],
      value: 'a',
      searchText: ''
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
      },
      privateLabel: {
        borderStyle: 'solid',
        borderRadius: 4,
        borderWidth: 'thin',
        padding: 2,
        fontSize: 'smaller',
        color: red500,
        marginLeft: 10
      }
    }
  }

  handleNewRequest(chosenRequest) {
    if (chosenRequest.category_guid !== null && chosenRequest.category_guid !== undefined) {
      this.setState({
        value: this.state.value,
        searchText: chosenRequest.category_guid
      });
    } else {
      this.props.parentProps.actions.toggleSnackbar('Please enter a valid search text');
    }
  }

  handleEmptySearch() {
    this.setState({
      searchText: ''
    });
  }
  handleToggle(evt, category_guid) {
    if (evt.target.getAttribute('data-toggled') === 'true') {
      this.props.parentProps.actions.unsubscribeAnnouncementRequest(category_guid)
    } else {
      this.props.parentProps.actions.subscribeAnnouncementRequest(category_guid)
    }
  }

  handleCategoryCreate(data) {
    if (data.private && this.state.email_ids.length < 2) {
      this.props.parentProps.actions.toggleSnackbar('There should be atleast 2 recepients for a private category.')
    } else {
      data = {...data, private: !!data.private, email_ids: this.state.email_ids};
      this.props.parentProps.actions.createAnnouncementCategoryRequest(data);
      this.refs.category_form.reset();
      this.setState({private_category: false, email_ids: []})
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

  toggleCategoryNotifiersDialog(category = null, subscribed_as) {
    if (category) {
      category.subscribed_as = subscribed_as;
    }
    const {parentProps} = this.props;
    const institute_guid = parentProps.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/category/notifiers`;
    let data = {category_guid: category.category_guid};
    parentProps.actions.toggleNotifiersDialog();
    parentProps.actions.fetchCategoryNotifersRequest(data, url);
    if (category.private) {
      url = `institute/${institute_guid}/category/subscribers`;
      data = {category_guid: category.category_guid};
      parentProps.actions.fetchCategorySubscribersRequest(data, url);
    }
    this.setState({category});
  }

  handleChipChange(email_ids) {
    this.setState({email_ids})
  }

  renderUsersAdditionForm() {
    if (this.state.private_category) {
      return (
        <Row style={{padding: '0 16px 10px'}}>
          <Col xs={12}>
            <ChipInput
              fullWidth
              defaultValue={this.state.email_ids}
              spellCheck={false}
              hintText="Email id's of the users to be notified by this category (Users should already be registered on College Mate)"
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
            ref="category_form"
            onValid={this.enableButton.bind(this)}
            onInvalid={this.disableButton.bind(this)}
            onValidSubmit={(data) => this.handleCategoryCreate(data)}
          >
            <Row style={{padding: '0 16px 10px'}}>
              <Col xs={4}>
                <FormsyText
                  hintText="Category Name"
                  name="category_type"
                  inputStyle={{boxShadow: 'none'}}
                  style={this.styles.formField}
                  required
                  autoComplete="off"
                />
              </Col>
              <Col xs={8}>
                <FormsyText
                  hintText="Category Description"
                  name="category_desc"
                  inputStyle={{boxShadow: 'none'}}
                  style={this.styles.formField}
                  required
                  autoComplete="off"
                />
              </Col>
            </Row>
            <CSSTransitionGroup
              transitionName='fieldAnimation'
              transitionEnterTimeout={600}
              transitionLeaveTimeout={500}>
              {this.renderUsersAdditionForm()}
            </CSSTransitionGroup>
            <Row style={{padding: '0 16px 16px'}}>
              <Col xs={3}>
                <RaisedButton
                  type="submit"
                  label="Create Category"
                  fullWidth={true}
                  disabled={!this.state.canSubmit}
                  labelStyle={{fontSize: 12}}
                  primary={true}/>
              </Col>
              <div style={{display: 'inline-block'}}>
                <FormsyCheckbox
                  style={{...this.styles.formField, marginTop: 8}}
                  iconStyle={{width: 20, height: 20, marginRight: 10}}
                  name="private"
                  label="Make this a private category"
                  labelStyle={{fontSize: 12, fontWeight:400, width:'100%', bottom:'2px'}}
                  onChange={(event, isInputChecked) => this.setState({private_category: isInputChecked})}
                />
              </div>
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
    let allCategories = this.props.parentProps.auth_user.selectedInstitute.categories.filter(
      (category) => {
        return category.category_guid.toLowerCase().indexOf(
            this.state.searchText.toLowerCase()) !== -1;
      }
    );
    const {subscriptions, notifying_categories} = this.props.parentProps.auth_user.selectedInstitute;
    let category_list = [];


    allCategories.map((category, index) => {
      let subscribed_as = 'Not Subscribed';
      let disabled = category.disabled;
      let toggle = false;
      category.private = !!category.private;
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

      disabled = disabled || category.private;

      category_list.push(
        <TableRow key={index} style={{height: 55}}>
          <TableRowColumn style={{textTransform: 'capitalize', lineHeight: '16px'}}>
            {category.category_type} {category.private ? <span style={this.styles.privateLabel}>Private</span> : <span/>}
            <p style={{margin: '4px 0', fontSize: 'smaller', color: grey500}}>
              {category.creator.first_name} {category.creator.last_name}
            </p>
          </TableRowColumn>
          <TableRowColumn>
            {subscribed_as}
            <p style={{margin: '4px 0', fontSize: 'smaller', color: grey500}}>
              {category.subscribers_count} {category.subscribers_count === 1 ? 'subscriber' : 'subscribers'}
            </p>
          </TableRowColumn>
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
    const Categories = this.props.parentProps.auth_user.selectedInstitute.categories;
    const dataSourceConfig = {
      text: 'category_type',
      value: 'category_guid'
    };
    return (
      <div>
        {this.renderCreateCategoryForm()}
        <Row style={{padding: '10px 8px'}}>
          <Col xs={4}>
            <Subheader style={{paddingLeft: '8px'}}>
              Subscriptions Manager
            </Subheader>
          </Col>
          <Col xs={8} style={{paddingLeft: '12px'}}>
            <AutoComplete
              listStyle={{maxHeight: 200, overflow: 'auto'}}
              textFieldStyle={this.styles.formField}
              hintText="Search Category"
              fullWidth={true}
              onNewRequest={(chosenRequest) => this.handleNewRequest(chosenRequest)}
              openOnFocus={true}
              onClose={() => this.handleEmptySearch()}
              dataSource={Categories}
              dataSourceConfig={dataSourceConfig}
              filter={AutoComplete.fuzzyFilter}/>
          </Col>
        </Row>
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
                <TableHeaderColumn style={{color: grey600}}>
                  Subscribed As
                  <p style={{margin: '4px 0', fontSize: 'smaller', color: grey500}}>
                    Number of subscribers
                  </p>
                </TableHeaderColumn>
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