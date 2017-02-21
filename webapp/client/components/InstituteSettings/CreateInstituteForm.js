import React from 'react';
import {Card, CardActions, CardText, CardTitle} from 'material-ui/Card';
import {Col, Row} from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class CreateInstituteForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;    
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

  onCreate() {
    const formData = {
      institute_code: this.refs.instituteCode.getValue(),
      institute_name: this.refs.instituteName.getValue(),
      institute_description: this.refs.instituteDescripton.getValue(),
      address: this.refs.address.getValue(),
      city: this.refs.city.getValue(),
      state: this.refs.state.getValue(),
      country: this.refs.country.getValue(),
      postal_code: this.refs.postalCode.getValue(),
      contact: this.refs.contact.getValue(),
    };

    this.parentProps.actions.createInstituteRequest(formData);
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={2}>
            <TextField ref="instituteCode" hintText="Institue Code" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
          <Col xs={10}>
            <TextField ref="instituteName" hintText="Institue Name" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <TextField ref="instituteDescripton" hintText="Institue Description" multiLine={true} fullWidth={true}
                       rowsMax={4} style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <TextField ref="address" hintText="Address" multiLine={true} fullWidth={true}
                       rowsMax={2} style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <TextField ref="city" hintText="City" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
          <Col xs={4}>
            <TextField ref="state" hintText="State" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
          <Col xs={4}>
            <TextField ref="country" hintText="Country" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <TextField ref="postalCode" hintText="Postal Code" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
          <Col xs={6}>
            <TextField ref="contact" hintText="Contact" fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
          </Col>
        </Row>
        <div style={{marginTop: 15}}>
          <RaisedButton label="Create" onClick={() => this.onCreate()} primary={true}/>
        </div>
      </div>
    );
  }
}

export default CreateInstituteForm;
