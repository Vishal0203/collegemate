import React from 'react';
import {Card, CardActions, CardText, CardTitle} from 'material-ui/Card/index';
import MenuItem from 'material-ui/MenuItem';
import {Col, Row} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import {grey600} from 'material-ui/styles/colors';
import Formsy from 'formsy-react';
import {FormsySelect, FormsyText, FormsyToggle} from 'formsy-material-ui/lib';
import RichEditor from '../rte/RichEditor';
import {EditorState, CompositeDecorator} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {Link, findLinkEntities} from '../rte/CommonUtils';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

class AnnouncementForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      canSubmit: false,
      eventChecked: false,
      eventDate: moment()
    };

    this.onChange = (editorState) => this.setState({editorState});
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
      },
      eventToggle: {
        margin: '12px 0 8px 6px',
        fontWeight: 300,
        width: 170,
        fontSize: 14
      },
      eventDatePicker: {
        margin: '10px 0px 0px 50px',
        display: 'inline',
        position: 'relative'
      }
    }
  }

  handleAnnouncementSubmit(data) {
    if (data.is_event && !this.refs.eventDate.state.date) {
      this.parentProps.actions.toggleSnackbar('Please select the event Date');
      return;
    }

    const formData = {
      ...data,
      instituteGuid: this.parentProps.auth_user.selectedInstitute.inst_profile_guid,
      eventDate: this.state.eventChecked ? moment(this.state.eventDate).format('YYYY-MM-DD') : null,
      notificationBody: stateToHTML(this.state.editorState.getCurrentContent()),
      notificationAttachments: this.refs.notificationAttachments.files
    };
    if (formData.notificationBody === '<p><br></p>') {
      this.parentProps.actions.toggleSnackbar('Announcement body can\'t be left empty.')
    } else {
      this.parentProps.actions.createAnnouncementRequest(formData);
    }
  }

  enableButton() {
    this.setState({
      ...this.state,
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      ...this.state,
      canSubmit: false
    })
  }

  toggleEvent(isInputChecked) {
    this.setState({eventChecked: isInputChecked});
    if (isInputChecked) {
      this.refs.eventDate.openDialog();
    }
  }

  onFileSelect(e) {
    if (e.target.files.length === 0) {
      this.refs.chosenFiles.innerHTML = '<i style="color: #c6c6c6">No file Chosen</i>';
      return
    }

    this.refs.chosenFiles.innerHTML = '';
    let text = '';
    for (let i = 0; i < e.target.files.length; i++) {
      text += `${e.target.files[i].name}${i + 1 === e.target.files.length ? '' : ', '}`;
    }
    this.refs.chosenFiles.innerHTML += `<i>${text}</i>`;
  }

  render() {
    const {notifying_categories} = this.parentProps.auth_user.selectedInstitute;
    const {onCancelClick} = this.props;

    return (
      <Formsy.Form
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}
        onValidSubmit={(data) => this.handleAnnouncementSubmit(data)}
      >
        <Card style={{marginTop: 15, marginBottom: 200}}>
          <CardTitle titleStyle={{fontSize: 20}} style={this.styles.notificationTitle}
                     title="Make an Announcement" subtitle="All fields are required"/>
          <CardText style={this.styles.notificationDescription}>
            <Col xs={12}>
              <FormsyText
                name="notificationHeader"
                hintText="Heading"
                fullWidth={true}
                inputStyle={{boxShadow: 'none'}}
                style={{paddingTop: 15, fontWeight: 400, marginBottom: 6}}
                required
                autoFocus
                autoComplete="off"
              />

              <RichEditor
                editorState={this.state.editorState}
                onChange={this.onChange}
              />
              <Row style={{paddingLeft: 10}}>
                <FormsySelect style={{marginTop: 10}} name="notificationCategory" hintText="Choose Category" required>
                  {notifying_categories.map((category, i) =>
                    <MenuItem key={i} value={category.category_guid} primaryText={category.category_type}/>)}
                </FormsySelect>
                <DatePicker
                  hintText="Event Date"
                  name="event_date"
                  ref="eventDate"
                  style={{display: 'none'}}
                  shouldDisableDate={(date) => {
                    return (moment(date).diff(moment().startOf('day'), 'days') < 0)
                  }}
                  formatDate={new global.Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format}
                  onDismiss={() => this.setState({eventChecked: false})}
                  onChange={(event, date) => this.setState({eventDate: date})}
                />
              </Row>
              <br/>
              <FlatButton
                className="attach-btn"
                containerElement="label"
                label="Attach Files">
                <input ref="notificationAttachments"
                       type="file"
                       style={this.styles.chooseButton}
                       onChange={(e) => this.onFileSelect(e)}
                       multiple/>
              </FlatButton>
              <label style={{paddingLeft: 10, fontSize: 12, display: 'table-cell', verticalAlign: 'middle'}}
                     ref="chosenFiles">
                <em style={{color: '#c6c6c6'}}>No file chosen</em>
              </label>
              {this.state.eventChecked ?
                <p style={{margin: '16px 0 0', fontSize: 12, color: grey600}}>
                  This announcement will create an entry in events calendar on &nbsp;
                  <a href="javascript:void(0);" onClick={() => this.refs.eventDate.openDialog()}>
                    {moment(this.state.eventDate).format('MMMM Do YYYY')}
                  </a>.
                </p> : null}
            </Col>
          </CardText>
          <CardActions style={{textAlign: 'right'}}>
            <Checkbox
              className='event-checkbox'
              checked={this.state.eventChecked}
              iconStyle={{width: 22, height: 22, marginRight: 10}}
              labelStyle={{fontSize: 14}}
              style={{display: 'inline-block', width: 180, textAlign: 'left'}}
              label="Make this an event"
              onCheck={(event, isInputChecked) => this.toggleEvent(isInputChecked)}
            />
            <FlatButton
              label="Cancel"
              secondary={true}
              onClick={onCancelClick}
            />
            <FlatButton
              label="Announce"
              primary={true}
              type="submit"
              disabled={!this.state.canSubmit}
            />
          </CardActions>
        </Card>
      </Formsy.Form>
    );
  }
}

export default AnnouncementForm;
