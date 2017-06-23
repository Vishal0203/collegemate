import React from 'react';
import {Col, Row} from 'react-flexbox-grid';
import Formsy from 'formsy-react';
import {FormsyText} from 'formsy-material-ui/lib';
import {RaisedButton} from 'material-ui';

class CreateInstituteForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;

    this.state = {
      canSubmit: false
    }
  };

  get styles() {
    return {
      instituteSettingsTitle: {
        padding: '12px 16px 0px 16px',
      },
      instituteDescription: {
        padding: '0px 16px 16px 16px',
        fontWeight: 300,
        fontSize: '10px'
      }
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

  onCreate(data) {
    this.parentProps.actions.createInstituteRequest(data);
  }

  render() {
    return (
      <Formsy.Form
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}
        onValidSubmit={(data) => this.onCreate(data)}
      >
        <Row>
          <Col xs={3}>
            <FormsyText
              name="institute_code"
              hintText="Institute Code"
              fullWidth={true}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
          <Col xs={9}>
            <FormsyText
              name="institute_name"
              hintText="Institute Name"
              fullWidth={true}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormsyText
              name="institute_description"
              hintText="Institute Description"
              multiLine={true}
              fullWidth={true}
              rowsMax={4}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormsyText
              name="address"
              hintText="Address"
              multiLine={true}
              fullWidth={true}
              rowsMax={2}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <FormsyText
              name="city"
              hintText="City"
              fullWidth={true}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
          <Col xs={4}>
            <FormsyText
              name="state"
              hintText="State"
              fullWidth={true}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
          <Col xs={4}>
            <FormsyText
              name="country"
              hintText="Country"
              fullWidth={true}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <FormsyText
              name="postal_code"
              hintText="Postal Code"
              fullWidth={true}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
          <Col xs={6}>
            <FormsyText
              name="contact"
              hintText="Contact"
              fullWidth={true}
              style={{paddingTop: '15px', fontWeight: 400}}
              required
              autoComplete="off"
            />
          </Col>
        </Row>
        <div style={{marginTop: 15}}>
          <RaisedButton
            label="Create"
            type="submit"
            disabled={!this.state.canSubmit}
            primary={true}
          />
        </div>
      </Formsy.Form>
    );
  }
}

export default CreateInstituteForm;
