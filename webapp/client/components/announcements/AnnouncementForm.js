import React from 'react';
import {Card, CardActions, CardText, CardTitle} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {Col, Row} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import RichTextEditor from 'react-rte';
import Formsy from 'formsy-react';
import {FormsySelect, FormsyText} from 'formsy-material-ui/lib';

class AnnouncementForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
    this.onTextChange = this.onTextChange.bind(this);

    this.state = {
      content: RichTextEditor.createEmptyValue(),
      canSubmit: false
    };
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

  handleAnnouncementSubmit(data) {
    const formData = {
      ...data,
      instituteGuid: this.parentProps.auth_user.selectedInstitute.inst_profile_guid,
      notificationBody: this.state.content.toString('markdown'),
      notificationAttachments: this.refs.notificationAttachments.files
    };

    if (formData.notificationBody == '<p><br></p>') {
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

  onFileSelect(e) {
    if (e.target.files.length == 0) {
      this.refs.chosenFiles.innerHTML = '<i style="color: #c6c6c6">No file Chosen</i>';
      return
    }

    this.refs.chosenFiles.innerHTML = '';
    let text = '';
    for (let i = 0; i < e.target.files.length; i++) {
      text += `${e.target.files[i].name}${i + 1 == e.target.files.length ? '' : ', '}`;
    }
    this.refs.chosenFiles.innerHTML += `<i>${text}</i>`;
  }

  onTextChange(content) {
    this.setState({value: this.state.value, content});
  };

  render() {
    const {notifying_categories} = this.parentProps.auth_user.selectedInstitute;
    const {onCancelClick} = this.props;

    const toolbarConfig = {
      display: ['INLINE_STYLE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD'},
        {label: 'Italic', style: 'ITALIC'}
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'},
      ]
    };

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
                style={{paddingTop: 15, fontWeight: 400, marginBottom: 6}}
                required
                autoFocus
                autoComplete="off"
              />

              <RichTextEditor
                className="rte-container"
                editorClassName="rte-editor"
                toolbarConfig={toolbarConfig}
                value={this.state.content}
                onChange={this.onTextChange}
              />

              <FormsySelect name="notificationCategory" hintText="Choose Category" required>
                {notifying_categories.map((category, i) =>
                  <MenuItem key={i} value={category.category_guid} primaryText={category.category_type}/>)}
              </FormsySelect>

              <br/>
              <br/>
              <RaisedButton className="attach-btn" secondary={true} containerElement="label" label="Attach Files (optional)">
                <input ref="notificationAttachments"
                       type="file"
                       style={this.styles.chooseButton}
                       onChange={(e) => this.onFileSelect(e)}
                       multiple />
              </RaisedButton>
              <label style={{paddingLeft: 10, fontSize: 12}} ref="chosenFiles">
                <i style={{color: '#c6c6c6'}}>No file chosen</i>
              </label>
            </Col>
          </CardText>
          <CardActions style={{textAlign: 'right'}}>
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
