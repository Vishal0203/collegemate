import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {Avatar, Divider} from 'material-ui';

class GuestTalks extends Component {
  constructor(props) {
    super(props)
  }

  get styles() {
    return {
      heading: {
        color: 'white',
        fontSize: '6vmin',
        fontWeight: '300',
        margin: '15px 0'
      },
      avatar: {
        borderStyle: 'solid',
        borderWidth: 'thick',
        boxShadow: '1px 1px 5px #888888'
      },
      secondarytext: {
        fontSize: 14,
        overflow: 'none',
        whiteSpace: 'none',
        textAlign: 'center'
      }
    }
  }

  render() {
    return (
      <div className='wrap'>
        <h1 style={{
          ...this.styles.heading,
          fontSize: 25,
          textAlign: 'center',
          color: '#212121',
          marginTop: 10
        }}>
          Guest Talks
        </h1>
        <div>
          <Row style={{marginTop: 30, marginLeft: 20}}>
            <Col xs={4} style={{textAlign: 'center'}}>
              <Avatar className='hover-avatar' src={require('../../styles/images/guest/sai.jpg')} size={90}/>
            </Col>
            <Col xs={8}>
              <p className="list-primary" style={{textTransform: 'capitalize', textAlign: 'center', margin: '26px 0 4px'}}>
                Sai Kiran Gangidi
              </p>
              <div style={this.styles.secondarytext}>
                Software Engineer, Microsoft India
              </div>
            </Col>
          </Row>
          <Divider style={{marginTop: 10}}/>
          <Row style={{marginTop: 20}}>
            <Col xs={8}>
              <p className="list-primary" style={{textTransform: 'capitalize', textAlign: 'center', margin: '26px 0 4px'}}>
                Randhir Kumar
              </p>
              <div style={this.styles.secondarytext}>
                Application Developer, NTT Data
              </div>
            </Col>
            <Col xs={4} style={{textAlign: 'center'}}>
              <Avatar className='hover-avatar' src={require('../../styles/images/guest/randhir.jpg')} size={90}/>
            </Col>
          </Row>
          <Divider style={{marginTop: 10}}/>
          <Row style={{marginTop: 20, marginLeft: 20}}>
            <Col xs={4} style={{textAlign: 'center'}}>
              <Avatar className='hover-avatar' src={require('../../styles/images/guest/vishal.jpg')} size={90}/>
            </Col>
            <Col xs={8}>
              <p className="list-primary" style={{textTransform: 'capitalize', textAlign: 'center', margin: '26px 0 4px'}}>
                Vishal Sharma
              </p>
              <div style={this.styles.secondarytext}>
                Engineering Lead, Beautiful Code
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default GuestTalks
