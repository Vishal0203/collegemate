import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';


class SubscriptionForm extends Component {
  constructor(props) {
    super(props);
  }

  get styles() {
    return {
      formField: {
        fontSize: 14,
        fontWeight: 300,
        width: '100%',
      }
    }
  }

  handleToggle(evt, category_guid) {
    if (evt.target.getAttribute('data-toggled') == 'true') {
      this.props.parentProps.actions.unsubscribeAnnouncementRequest(category_guid)
    } else {
      this.props.parentProps.actions.subscribeAnnouncementRequest(category_guid)
    }
  }

  handleCategoryCreate() {
    const categoryData = {
      category_type: this.refs.category_type.getValue(),
      category_desc: this.refs.category_desc.getValue(),
    };

    this.props.parentProps.actions.createAnnouncementCategoryRequest(categoryData)
  }

  renderCreateCategoryForm() {
    if (this.props.parentProps.auth_user.selectedInstitute.user_institute_info[0].role == 'inst_superuser') {
      return (
        <div>
          <Subheader>Create Announcement Category</Subheader>
          <Row style={{padding: '0 16px 16px'}}>
            <Col xs={4}>
              <TextField
                hintText="* Category Type"
                ref="category_type"
                style={this.styles.formField}
              />
            </Col>
            <Col xs={6}>
              <TextField
                hintText="* Category Description"
                ref="category_desc"
                style={this.styles.formField}
              />
            </Col>
            <Col xs={2}>
              <RaisedButton
                onClick={() => this.handleCategoryCreate()}
                label="Create"
                fullWidth={true}
                buttonStyle={{height: '30px', lineHeight: '30px'}}
                labelStyle={{fontSize: 11}}
                style={{marginTop: 12}}
                primary={true}/>
            </Col>
          </Row>
        </div>
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
        if (category.category_guid == subscriptions[i].category_guid) {
          subscribed_as = 'Recipient';
          toggle = true;
          break;
        }
      }

      for (let i = 0; i < notifying_categories.length; i++) {
        if (category.category_guid == notifying_categories[i].category_guid) {
          subscribed_as = 'Announcer';
          disabled = true;
          toggle = true;
          break;
        }
      }

      category_list.push(
        <TableRow key={index}>
          <TableRowColumn style={{textTransform: 'capitalize'}}>{category.category_type}</TableRowColumn>
          <TableRowColumn>{subscribed_as}</TableRowColumn>
          <TableRowColumn>
            <Toggle disabled={disabled} defaultToggled={toggle}
                    data-toggled={toggle}
                    onToggle={(evt) => this.handleToggle(evt, category.category_guid)}/>
          </TableRowColumn>
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
          <Table fixedHeader={true} selectable={false} bodyStyle={{height: 300}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn>Subscribed As</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.renderCategories()}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

export default SubscriptionForm