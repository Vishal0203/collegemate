import React, {Component} from 'react';
import {Dialog} from 'material-ui';
import InteractionForm from './InteractionForm'

class PostUpdateDialog extends Component {
  constructor(props) {
    super(props);
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
    this.props.parentProps.actions.togglePostUpdateForm();
  }

  render() {
    return (
      <Dialog
        title="Edit your question"
        modal={false}
        autoScrollBodyContent={true}
        bodyStyle={{padding: 0}}
        open={this.props.parentProps.interactions.togglePostUpdateForm}
        onRequestClose={() => this.togglePostUpdateForm()}
      >
        <InteractionForm
          type="PostUpdate"
          parentProps={this.props.parentProps}
          onCancelClick={() => this.togglePostUpdateForm()}
        />
      </Dialog>
    );
  }
}

export default PostUpdateDialog;