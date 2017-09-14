import React from 'react';
import Dialog from 'material-ui/Dialog';
import {Row, Col} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import {FormsyText} from 'formsy-material-ui/lib';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class AddProjectDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      open: false
    };
  }
  get styles() {
    return {
      formField: {
        fontSize: 14,
        fontWeight: 300,
        width: '100%',
      },
      floatingLabelStyle: {
        fontSize: 16
      },
      alert: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: 'rgb(167, 26, 26)',
        fontSize: 'large',
        fontWeight: '500'
      },
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

  handleAddProject(data) {
    const project = {
      ...data,
      title: data.title.replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
    };

    this.props.parentProps.actions.addUserProject(project);
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        keyboardFocused={true}
        type="submit"
        disabled={!this.state.canSubmit}
        onTouchTap={() => {
          this.formsyForm.submit();
          this.handleClose();
        }}
      />,
    ];

    return (
        <div>
          <RaisedButton
            label="Add"
            onClick={this.handleOpen}
            buttonStyle={{height: '30px', lineHeight: '30px'}}
            labelStyle={{fontSize: 11}}
            style={{marginTop: 12}}
            primary={true} />
          <Dialog
            title="Add Project"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            <Formsy.Form
              ref={(form) => {
                this.formsyForm = form;
              }}
              onValid={this.enableButton.bind(this)}
              onInvalid={this.disableButton.bind(this)}
              onValidSubmit={(data) => this.handleAddProject(data)}
            >
              <Row>
                <Col xs={12}>
                  <FormsyText
                    floatingLabelText="Title"
                    floatingLabelStyle={this.styles.floatingLabelStyle}
                    name="title"
                    textareaStyle={{boxShadow: 'none'}}
                    style={this.styles.formField}
                    fullWidth={true}
                    required
                  />
                </Col>
                <Col xs={12}>
                  <FormsyText
                    floatingLabelText="Description"
                    floatingLabelStyle={this.styles.floatingLabelStyle}
                    name="description"
                    textareaStyle={{boxShadow: 'none'}}
                    style={this.styles.formField}
                    multiLine={true}
                    fullWidth={true}
                    rows={1}
                    rowsMax={4}
                    required
                  />
                </Col>
                <Col xs={12}>
                  <FormsyText
                      floatingLabelText="Link"
                      floatingLabelStyle={this.styles.floatingLabelStyle}
                      name="link"
                      textareaStyle={{boxShadow: 'none'}}
                      style={this.styles.formField}
                      fullWidth={true}
                  />
                </Col>
              </Row>
            </Formsy.Form>
          </Dialog>
        </div>
    );
  }
}