import Paper from 'material-ui/Paper';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {feedbackSubmit} from '../../actions/commons/index';
import {grey500, grey600} from 'material-ui/styles/colors';
import {Dialog, FlatButton, TextField, SelectField, MenuItem} from 'material-ui';
import {hashHistory} from 'react-router';

class Branding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      feedback_type: 'feedback'
    }
  }

  get styles() {
    return {
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

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  changeLocation = () => {
    hashHistory.push('/testimonial');
  };

  onFileSelect = (e) => {
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
  };

  handleFeedbackSubmit = () => {
    const formData = {
      type: this.state.feedback_type,
      feedback_message: this.refs.feedback_message.getValue(),
      feedback_attachment: this.refs.feedbackAttachment.files
    };

    this.props.actions.feedbackSubmit(formData);
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleFeedbackSubmit}
      />,
    ];
    return (
      <Paper zDepth={0} className="paper-style" style={{textAlign: 'left', marginTop: 20}}>
        <div style={{fontSize: 12, color: grey600, marginLeft: 2}}>
          <a style={{color: grey500}} href="https://www.facebook.com/cmtodevs/" target="_blank">
            Like Us
          </a>
          <span>  &middot;  </span>
          <p style={{color: grey500, cursor: 'pointer', textDecoration: 'underline', display: 'inline-block'}}
             onTouchTap={this.handleOpen}>
            Feedback
          </p>
          <span>  &middot;  </span>
          <p style={{color: grey500, cursor: 'pointer', textDecoration: 'underline', display: 'inline-block'}}
             onTouchTap={this.changeLocation}>
            Write us a testimonial
          </p>
          <span>  &hearts;</span>
          <Dialog
            title="Send a Feedback"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <SelectField
              floatingLabelText="Feedback Type"
              value={this.state.feedback_type}
              onChange={(event, index, value) => this.setState({feedback_type: value})}
            >
              <MenuItem value='feedback' primaryText="Feedback"/>
              <MenuItem value='bug' primaryText="Report Bug"/>
              <MenuItem value='feature' primaryText="Request Feature"/>
            </SelectField>
            <TextField
              ref="feedback_message"
              floatingLabelText="Type your message here.."
              multiLine={true}
              fullWidth={true}
              rows={2}
              rowsMax={4}
            />
            <FlatButton
              style={{top: 8}}
              className="attach-btn"
              containerElement="label"
              label="Attach Screenshot">
              <input ref="feedbackAttachment"
                     type="file"
                     style={this.styles.chooseButton}
                     onChange={this.onFileSelect}/>
            </FlatButton>
            <label
              style={{paddingTop: 18, paddingLeft: 10, fontSize: 12, display: 'table-cell', verticalAlign: 'middle'}}
              ref="chosenFiles">
              <em style={{color: '#c6c6c6'}}>No file chosen</em>
            </label>
          </Dialog>
          <br/>
          <span>ToDevs &#x24B8; 2017</span>
        </div>
      </Paper>
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
    actions: bindActionCreators({feedbackSubmit}, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Branding);
