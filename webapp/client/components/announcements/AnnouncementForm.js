import React from 'react';
import {Card, CardActions, CardText, CardTitle} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Col, Row} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class AnnouncementForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
    this.state = {value: null};
    this.handleChange = this.handleChange.bind(this)
  }

  get styles() {
    return {
      notificationTitle: {
        padding: '12px 16px 0px 16px',
      },
      notificationDescription: {
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

  handleAnnouncementSubmit() {
    const formData = {
      instituteGuid: this.parentProps.auth_user.selectedInstitute.inst_profile_guid,
      notificationHeader: this.refs.notificationHeader.getValue(),
      notificationBody: this.refs.notificationBody.getValue(),
      notificationCategory: this.refs.notificationCategory.props.value
    };

    this.parentProps.actions.createAnnouncementRequest(formData);
  }

  handleChange(event, index, value) {
    this.setState({value});
  }

  render() {
    const {notifying_categories} = this.parentProps.auth_user.selectedInstitute;
    const {onCancelClick} = this.props;
    return (
      <Card style={{marginTop: 15, marginBottom: 200}}>
        <CardTitle titleStyle={{fontSize: 20}} style={this.styles.notificationTitle}
                   title="Make an Announcement" subtitle="All fields are required"/>
        <CardText style={this.styles.notificationDescription}>
          <Col xs={12}>
            <TextField ref="notificationHeader" hintText="Heading" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
            <TextField ref="notificationBody" hintText="Content" multiLine={true} fullWidth={true}
                       style={{fontSize: 14}}/>

            <SelectField ref="notificationCategory" value={this.state.value} onChange={this.handleChange}
                         hintText="Choose Category">
              {notifying_categories.map((category, i) => <MenuItem key={i}
                                                         value={category.category_guid}
                                                         primaryText={category.category_type}/>)}
            </SelectField>
            <br/>
            <br/>
            <RaisedButton secondary={true} label="Attach Files (optional)"
                          labelPosition="before">
              <input type="file" multiple style={this.styles.chooseButton}/>
            </RaisedButton>
          </Col>
        </CardText>
        <CardActions style={{textAlign: 'right'}}>
          <FlatButton label="Cancel" secondary={true} onClick={onCancelClick}/>
          <FlatButton label="Announce" primary={true} onClick={() => this.handleAnnouncementSubmit()}/>
        </CardActions>
      </Card>
    );
  }
}

export default AnnouncementForm;
