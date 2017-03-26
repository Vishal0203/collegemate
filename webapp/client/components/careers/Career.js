import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import Header from '../Header';

class Career extends Component {

  constructor(props) {
    super(props);
  }

  get styles() {
    return {
      CareerRow: {
        padding: 16,
      },
      JobSubtitle: {
        fontSize: 18
      },
      divider: {
        width: '97%',
        backgroundColor: 'rgba(224, 224, 224, 0.6)'
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '0px 16px 0px 16px'
      },
      tagsContainer: {
        padding: '0px 16px 0px 0px'
      },
      chip: {
        margin: 4
      }
    }
  }

  handleRequestDelete() {
    alert('You clicked the delete button.');
  }

  renderJob() {
    return (
      <Card style={{height: 'inherit'}}>
        <CardTitle title="Software Engineer" subtitle="Microsoft" subtitleStyle={this.styles.JobSubtitle}/>
        <div style="text-align: center;">
          <Divider style={this.styles.divider}/>
        </div>
        <CardText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardText style={this.styles.tagsContainer}>
          <div style={this.styles.wrapper}>
            <Chip style={this.styles.chip}>Full Time</Chip>
            <Chip style={this.styles.chip}>Software</Chip>
            <Chip style={this.styles.chip}>Hyderabad</Chip>
          </div>
        </CardText>
      </Card>
    );
  }

  render() {
    return (
      <div className="main-content">
        <Header title="Internships and Job offers for your college."/>
        <div style={{marginTop: '20px'}}>
          <Grid>
            <div className="wrap">
              <div style={this.styles.wrapper}>
                <Chip
                  onRequestDelete={this.handleRequestDelete}
                  style={this.styles.chip}
                >
                  Deletable Text Chip
                </Chip>
              </div>
              <Row style={this.styles.CareerRow}>
                <Col xs>
                  {this.renderJob()}
                </Col>
                <Col xs>
                  {this.renderJob()}
                </Col>
              </Row>
            </div>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Career;
