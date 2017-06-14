import React from 'react';
import {CardActions, CardText} from 'material-ui/Card/index';
import MenuItem from 'material-ui/MenuItem';
import {Col, Row} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import {grey600} from 'material-ui/styles/colors';
import Formsy from 'formsy-react';
import {FormsySelect, FormsyText} from 'formsy-material-ui/lib';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment/moment';
import {simplemde_config} from '../extras/utils';
import {Chip} from 'material-ui';

class AnnouncementForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;

    this.state = {
      canSubmit: false,
      eventChecked: false,
      eventDate: moment(),
      simplemde: null,
      selectedFiles: props.update ? [...props.update.notification_files] : []
    };

    if (props.update) {
      this.state = {
        ...this.state,
        removedFiles: [],
        formData: {
          notificationHeader: props.update.notification_head,
          categoryGuid: props.update.category.category_guid
        }
      };
    }
  }

  get styles() {
    return {
      notificationDescription: {
        padding: '0px 16px 16px 16px',
        fontSize: 16
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

  componentDidMount() {
    if (this.props.update) {
      this.setState({
        simplemde: new SimpleMDE({
          ...simplemde_config,
          initialValue: this.props.update.notification_body,
          element: document.getElementById('announcementUpdate-rte')
        }),
        eventChecked: !!this.props.update.event_date,
        eventDate: this.props.update.event_date
      });
    } else {
      this.setState({
        simplemde: new SimpleMDE({
          ...simplemde_config,
          element: document.getElementById('announcement-rte')
        })
      });
    }
  }

  handleAnnouncementUpdate(data) {
    const formData = {
      ...data,
      removedFiles: this.state.removedFiles,
      notificationGuid: this.props.update.notification_guid
    };
    this.parentProps.actions.updateAnnouncementRequest(formData);
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
      notificationBody: this.state.simplemde.value(),
      notificationAttachments: this.state.selectedFiles
    };
    if (formData.notificationBody === '') {
      this.parentProps.actions.toggleSnackbar('Announcement body can\'t be left empty.')
    } else {
      if (this.props.update) {
        this.handleAnnouncementUpdate(formData)
      } else {
        this.parentProps.actions.createAnnouncementRequest(formData);
      }
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
    this.setState({selectedFiles: [...this.state.selectedFiles,  ...Array.from(e.target.files)]});
  }

  removeSelectedFile(filename, key = 'name') {
    this.filesData = this.state.selectedFiles;
    const fileToDelete = this.filesData.map((file) => file[key]).indexOf(filename);

    if (this.props.update && this.state.selectedFiles[fileToDelete].url_code) {
      this.setState({removedFiles: [...this.state.removedFiles, this.filesData[fileToDelete].url_code]});
    }

    this.filesData.splice(fileToDelete, 1);
    this.setState({selectedFiles: this.filesData});
  }

  render() {
    const {notifying_categories} = this.parentProps.auth_user.selectedInstitute;
    const {onCancelClick} = this.props;

    const renderSelectedFiles = () => {
      return this.state.selectedFiles.map((file, i) => {
        return (
          <Chip
            className="file-chip"
            key={i}
            onRequestDelete={
              this.props.update ?
                () => this.removeSelectedFile(file.file, 'file') : () => this.removeSelectedFile(file.name)
            }
          >
            {this.props.update && file.url_code ? file.file : file.name}
          </Chip>
        )
      });
    };

    return (
      <Formsy.Form
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}
        onValidSubmit={(data) => this.handleAnnouncementSubmit(data)}
      >
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
              defaultValue={this.props.update ? this.state.formData.notificationHeader : ''}
              autoComplete="off"
            />

            <textarea id={this.props.update ? 'announcementUpdate-rte' : 'announcement-rte'}/>
            <Row style={{paddingLeft: 10}}>
              <FormsySelect
                style={{marginTop: 10}}
                value={this.props.update ? this.state.formData.categoryGuid : null}
                name="notificationCategory"
                hintText="Choose Category"
                required
              >
                {notifying_categories.map((category, i) =>
                  <MenuItem key={i} value={category.category_guid} primaryText={category.category_type}/>)}
              </FormsySelect>
              <DatePicker
                ref="eventDate"
                name="eventDate"
                style={{display: 'none'}}
                shouldDisableDate={(date) => {
                  return (moment(date).diff(moment().startOf('day'), 'days') < 0)
                }}
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
              {
                this.state.selectedFiles.length > 0 ?
                  renderSelectedFiles() : <em style={{color: '#c6c6c6'}}>No file chosen</em>
              }
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
            label={this.props.update ? 'Update' : 'Announce'}
            primary={true}
            type="submit"
            disabled={!this.state.canSubmit}
          />
        </CardActions>
      </Formsy.Form>
    );
  }
}

export default AnnouncementForm;
