import React from 'react';
import {CardActions, CardText} from 'material-ui';
import muiTheme from '../../styles/theme/collegemate.theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Toolbar, ToolbarGroup, ToolbarTitle, RaisedButton, Paper} from 'material-ui';
import {FormsyText} from 'formsy-material-ui/lib';
import {Col, Grid, Row} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {submitTestimonials} from '../../actions/commons/index';

class Testimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      formValid: false,
    }
  }

  get styles() {
    return {
      title: {
        fontWeight: 200,
        paddingRight: 1,
        color: 'white',
        fontSize: 22
      },
      formDescription: {
        padding: '0px 16px 16px 16px',
        fontWeight: 300,
        fontSize: '10px'
      }
    }
  }

  submitForm(data) {
    this.props.actions.submitTestimonials(data);
    this.refs.form.reset();
  }

  setFormValidity(enabled) {
    this.setState({canSubmit: enabled, formValid: enabled});
  }

  render() {
    return (
      <div>
        <div style={{margin: '3% 0 10%'}}>
          <Grid>
            <Paper zDepth={0} style={{backgroundColor: 'transparent'}}>
              <div className="wrap">
                <Col xs={12}>
                  <Row center="xs" style={{marginTop: 80}}>
                    <h2>Write a Testimonial &hearts;</h2>
                  </Row>
                </Col>
                <Col xs={12}>
                  <Col xsOffset={2} mdOffset={1} xs={8} md={10}>
                    <Row center="xs">
                      <p style={{margin: 0}}>We appretiate the time you are giving us for this. Thanks!</p>
                    </Row>
                    <Formsy.Form
                      ref="form"
                      onValid={() => this.setFormValidity(true)}
                      onInvalid={() => this.setFormValidity(false)}
                      onValidSubmit={(data) => this.submitForm(data)}
                    >
                      <Col xs={12} style={{marginTop: 15}}>
                        <CardText style={this.styles.formDescription}>
                          <FormsyText
                            style={{marginTop: 12}}
                            hintText="Start here.."
                            name="message"
                            fullWidth={true}
                            multiLine={true}
                            rows={1}
                            rowsMax={7}
                            errorStyle={{float: 'left'}}
                            autoComplete="off"
                            required/>
                        </CardText>
                        <CardActions>
                          <RaisedButton
                            label="Submit"
                            type="submit"
                            labelStyle={{fontSize: 11}}
                            secondary={true}
                            fullWidth={true}
                            disabled={!this.state.canSubmit}
                          />
                        </CardActions>
                      </Col>
                    </Formsy.Form>
                  </Col>
                </Col>
              </div>
            </Paper>
          </Grid>
        </div>
        <div className="footer" style={{position: 'fixed', bottom: '0px'}}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth_user: state.auth_user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({submitTestimonials}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Testimonials);
