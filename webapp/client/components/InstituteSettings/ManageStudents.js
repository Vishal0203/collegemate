import React, {Component} from 'react';
import {grey600} from 'material-ui/styles/colors';
import {
  Table, TableBody, TableRow, TableRowColumn, Card,
  CardTitle, CardText, IconButton, ListItem, Avatar, FontIcon
} from 'material-ui';


class ManageStudents extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.parentProps.actions.studentApprovalRequest();
  }

  get styles() {
    return {
      formTitle: {
        padding: '12px 16px 16px 16px',
      }
    }
  }

  handleClick(user_guid, status) {
    this.parentProps.actions.studentApprovalAction(user_guid, status);
  }

  renderRows() {
    const {pending_students} = this.parentProps.auth_user.selectedInstitute;
    if (pending_students && pending_students.length !== 0) {
      return pending_students.map((student, i) => {
        const name = `${student.first_name} ${student.last_name}`;
        return (
          <TableRow key={i}>
            <TableRowColumn style={{padding: '0 12px'}}>
              <ListItem
                disabled={true}
                primaryText={name}
                secondaryText={student.email}
                leftAvatar={<Avatar src={student.user_profile.user_avatar} size={45}/>}
              >
              </ListItem>
            </TableRowColumn>
            <TableRowColumn style={{color: grey600}}>
              {student.pivot.member_id}
            </TableRowColumn>
            <TableRowColumn style={{color: grey600, width: 80}}>
              <IconButton>
                <FontIcon className="material-icons" onClick={() => this.handleClick(student.user_guid, 'declined')}>
                  clear
                </FontIcon>
              </IconButton>
              <IconButton>
                <FontIcon className="material-icons" onClick={() => this.handleClick(student.user_guid, 'accepted')}>
                  done
                </FontIcon>
              </IconButton>
            </TableRowColumn>
          </TableRow>
        )
      });
    }

    if (pending_students && pending_students.length === 0) {
      return (
        <TableRow>
          <TableRowColumn style={{fontSize: 14}}>
            There are no pending requests.
          </TableRowColumn>
        </TableRow>
      )
    }
  }

  render() {
    this.parentProps = this.props.parentProps;
    return (
      <Card>
        <CardTitle titleStyle={{fontSize: 20}} style={this.styles.formTitle}
                   title="Approve Students" subtitle="Check for email and hall ticket number to validate"/>

        <CardText style={{padding: '16px 0'}}>
          <Table fixedHeader={true} selectable={false}>
            <TableBody displayRowCheckbox={false}>
              {this.renderRows()}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    )
  }
}

export default ManageStudents;
