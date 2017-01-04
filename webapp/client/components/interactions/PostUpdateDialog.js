import React ,{Component} from 'react';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import {Col, Row} from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RichTextEditor from 'react-rte';
import InteractionForm from './InteractionForm'

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class PostUpdateDialog extends Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
  }
  get styles() {
    return {
      postTitle: {
        padding: '12px 16px 0px 16px',
      },
      formDescription: {
        padding: '0 16px 0 16px',
        fontWeight: 300,
        fontSize: '10px'
      },
    }
  }

  togglePostUpdateForm() {
    this.parentProps.actions.togglePostUpdateForm();
  }

  onTextChange(value) {
    this.setState({value});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.togglePostUpdateForm()}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onTouchTap={() => this.togglePostUpdateForm()}
      />,
    ];

    const parentProps = this.parentProps;
    return (
      <Dialog
        title="Edit your question"
        modal={false}
        autoScrollBodyContent={true}
        bodyStyle={{padding: 0}}
        open={this.props.parentProps.interactions.togglePostUpdateForm}
        onRequestClose={() => this.togglePostUpdateForm()}
      >
        <InteractionForm onCancelClick={() => this.togglePostUpdateForm()} type="PostUpdate" parentProps={this.props.parentProps}/>
      </Dialog>
    );
  }
}

export default PostUpdateDialog;