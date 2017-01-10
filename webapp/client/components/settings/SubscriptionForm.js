import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';

class SubscriptionForm extends Component {
  constructor(props) {
    super(props);
  }

  handleToggle(category_guid, toggle) {
    if (toggle) {
      this.props.parentProps.actions.subscribeAnnouncementRequest(category_guid)
    } else {
      this.props.parentProps.actions.unsubscribeAnnouncementRequest(category_guid)
    }
  }

  renderCategories() {
    const allCategories = this.props.parentProps.auth_user.selectedInstitute.categories;
    const {subscriptions, notifying_categories} = this.props.parentProps.auth_user.selectedInstitute;
    let category_list = [];

    allCategories.map((category, index) => {
      let subscribed_as = 'Not Subscribed';
      let disabled = false;
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
                    onToggle={() => this.handleToggle(category.category_guid, !toggle)}/>
          </TableRowColumn>
        </TableRow>
      );
    });

    return category_list;
  }

  render() {
    return (
      <div>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Subscribed As</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.renderCategories()}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default SubscriptionForm