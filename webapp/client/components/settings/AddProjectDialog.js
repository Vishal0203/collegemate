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
  state = {
    open: false,
  };

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
      fab: {
        float: 'right'
      }
    }
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
        onClick={this.handleClose}
      />,
    ];

    return (
        <div>
          <FloatingActionButton style={this.styles.fab} label="Dialog" onClick={this.handleOpen}>
            <ContentAdd />
          </FloatingActionButton>
          <Dialog
            title="Add Project"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            <Formsy.Form>
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
              </Row>
            </Formsy.Form>
          </Dialog>
        </div>
    );
  }
}