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
      notificationCategory: this.refs.notificationCategory.props.value,
      notificationAttachments: this.refs.notificationAttachments.files
    };
    this.parentProps.actions.createAnnouncementRequest(formData);
  }

  handleChange(event, index, value) {
    this.setState({value});
  }

  onFileSelect(e) {
    console.log(e.target.files);
    if (e.target.files.length == 0) {
      this.refs.chosenFiles.innerHTML = '<i style="color: #c6c6c6">No file Chosen</i>';
      return
    }

    this.refs.chosenFiles.innerHTML = '';
    let text = '';
    for (let i = 0; i < e.target.files.length ; i++ ) {
      text += `${e.target.files[i].name}${i+1 == e.target.files.length? '': ', '}`;
    }
    this.refs.chosenFiles.innerHTML += `<i>${text}</i>`;
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
            <RaisedButton className="attach-btn" secondary={true} containerElement="label" label="Attach Files (optional)">
              <input ref="notificationAttachments" type="file" multiple style={this.styles.chooseButton} onChange={(e) => this.onFileSelect(e)}/>
            </RaisedButton>
            <label style={{paddingLeft:10, fontSize: 12}} ref="chosenFiles"><i style={{color: '#c6c6c6'}}>No file Chosen</i></label>
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
