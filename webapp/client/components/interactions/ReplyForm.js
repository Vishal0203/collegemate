import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import {FormsyText} from 'formsy-material-ui/lib';
import {grey500, grey600} from 'material-ui/styles/colors';
import {CardText} from 'material-ui';

class ReplyForm extends Component {
  static propTypes = {
    formPadding: PropTypes.object,
    onSubmit: PropTypes.func,
    openForm: PropTypes.bool,
    onButtonClick: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  get styles() {
    return {
      postFooter: {
        fontWeight: 300,
        fontSize: 13,
        padding: '6px 26px 12px 0',
        color: grey600
      },
      actionButton: {
        color: grey500,
        padding: '0 9px 0 1px',
        display: 'inline-block'
      }
    }
  }

  render() {
    let commentForm = null;
    if (this.props.openForm) {
      commentForm = (
        <div>
          <CardText style={this.props.formPadding}>
            <Formsy.Form
              onValidSubmit={this.props.onSubmit}
            >
              <FormsyText
                name="reply"
                required
                validations={{maxLength: 600, minLength: 10}}
                validationErrors={{
                  maxLength: 'Comment shouldn\'t be more than 600 characters',
                  minLength: 'Comment length should be atleast 10 characters'
                }}
                hintText="Have a follow up question? Ask here.. (enter to submit)"
                fullWidth={true}
                style={{fontSize: 12}}
                autoFocus
                autoComplete="off"
                inputStyle={{boxShadow: 'none'}}
              />
            </Formsy.Form>
          </CardText>
        </div>
      )
    }

    return (
      <div>
        {commentForm}
        <div style={this.styles.postFooter}>
          <div style={this.styles.actionButton}>
            <label style={{cursor: 'pointer'}}
                   onClick={this.props.onButtonClick}>
              {this.props.openForm ? 'cancel' : 'add a comment'}
            </label>
          </div>
        </div>
      </div>
    )
  }
}

export default ReplyForm
