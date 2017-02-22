import React from 'react';
import {Card, CardActions, CardText, CardTitle} from 'material-ui/Card';
import {Col, Row} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import RichTextEditor from 'react-rte';
import ChipInput from 'material-ui-chip-input';
import Chip from 'material-ui/Chip';
import Formsy from 'formsy-react';
import {FormsySelect, FormsyText, FormsyToggle} from 'formsy-material-ui/lib';

class InteractionForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
    if (props.type == 'PostUpdate') {
      const post = props.parentProps.interactions.selectedPost;
      this.state = {
        tags: post.tags,
        value: RichTextEditor.createValueFromString(post.post_description, 'html')
      };
    }
    else {
      this.state = {
        tags: [],
        value: RichTextEditor.createEmptyValue(),
        canSubmit: true
      };
    }
    this.onTextChange = this.onTextChange.bind(this);
  }

  get styles() {
    return {
      postTitle: {
        padding: '12px 16px 15px 16px',
      },
      formDescription: {
        padding: '0 16px 0 16px',
        fontWeight: 300,
        fontSize: '10px'
      },
      toggleButton: {
        margin: '12px 0 8px 6px',
        fontWeight: 300,
        width: 170,
        fontSize: 12
      },
      chipLabel: {
        lineHeight: '28px',
        textTransform: 'capitalize',
        color: '#757575',
        fontSize: 13
      }
    }
  }

  enableButton() {
    this.setState({
      ...this.state,
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      ...this.state,
      canSubmit: false
    })
  }

  handlePostSubmit(data) {
    const tags = this.state.tags.map(function (a) {
      return a.tag_guid
    });

    const instituteGuid = this.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const formData = {
      ...data,
      post_description: this.state.value.toString('html'),
      tags
    };

    if (formData.post_description == '<p><br></p>') {
      this.parentProps.actions.toggleSnackbar('Post description can\'t be left empty.')
    } else {
      this.parentProps.actions.createPostRequest(instituteGuid, formData);
    }
  }

  handleCommentSubmit(data) {
    const postGuid = this.parentProps.interactions.selectedPost.post_guid;
    const formData = {
      institute_guid: this.parentProps.auth_user.selectedInstitute.inst_profile_guid,
      comment: this.state.value.toString('html')
    };

    if (formData.comment == '<p><br></p>') {
      this.parentProps.actions.toggleSnackbar('Forgot to write the comment?')
    } else {
      this.parentProps.actions.addCommentRequest(postGuid, formData);
    }
  }

  handlePostUpdateSubmit(data) {
    const tags = this.state.tags.map(function (a) {
      return a.tag_guid
    });
    const postGuid = this.parentProps.interactions.selectedPost.post_guid;
    const instituteGuid = this.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const formData = {
      ...data,
      post_description: this.state.value.toString('html'),
      tags
    };

    if (formData.post_description == '<p><br></p>') {
      this.parentProps.actions.toggleSnackbar('Post description can\'t be left empty.')
    } else {
      this.parentProps.actions.updatePostRequest(instituteGuid, postGuid, formData);
    }
  }

  handleSubmit(data, type) {
    switch (type) {
      case 'Interactions' :
        this.handlePostSubmit(data);
        break;
      case 'InteractionSingle':
        this.handleCommentSubmit(data);
        break;
      case 'PostUpdate':
        this.handlePostUpdateSubmit(data);
        break;
      default:
        break;
    }
  }

  onTextChange(value) {
    this.setState({tag: this.state.tag, value});
  };

  handleTagAdd(tag) {
    if (this.state.tags.length == 5) {
      this.parentProps.actions.toggleSnackbar('You can only add 5 tags to a post.');
      return
    }

    if (this.parentProps.interactions.tags.indexOf(tag) != -1) {
      this.setState({
        tags: [...this.state.tags, tag]
      })
    } else {
      this.parentProps.actions.toggleSnackbar('You cannot add custom tags right now.')
    }
  }

  handleTagDelete(deletedTag) {
    if (typeof deletedTag == 'object') {
      this.setState({
        tags: this.state.tags.filter((c) => c !== deletedTag)
      })
    } else {
      this.setState({
        tags: this.state.tags.filter((c) => c.tag_guid !== deletedTag)
      })
    }
  }

  render() {
    const {onCancelClick, type} = this.props;

    const toolbarConfig = {
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'},
        {label: 'Monospace', style: 'CODE'},
      ],
      BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Code Block', style: 'code-block'},
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'},
        {label: 'Blockquote', style: 'blockquote'}
      ]
    };

    let title = null;
    let confirmText = null;
    switch (type) {
      case 'Interactions': {
        title = 'Ask a question';
        confirmText = 'Post Question';
        break;
      }
      case 'InteractionSingle': {
        title = 'Answer a question';
        confirmText = 'Answer';
        break;
      }
      case 'PostUpdate': {
        title = '';
        confirmText = 'Update';
        break;
      }
      default:
        break;
    }
    let postHeader = null;
    let tags = null;
    let anonymousToggle = null;
    if (type == 'Interactions' || type == 'PostUpdate') {
      const defaultHeading = type == 'PostUpdate' ? this.parentProps.interactions.selectedPost.post_heading : '';
      const toggleDefault = type == 'PostUpdate' ?
        !this.parentProps.interactions.selectedPost.user :
        false;
      postHeader = (
        <div>
          <FormsyText
            name="post_heading"
            hintText="What would you like to ask? Be specific."
            fullWidth={true}
            style={{fontWeight: 400}}
            defaultValue={defaultHeading}
            required
            autoFocus
            autoComplete="off"
          />
          <div style={{marginTop: '5px'}}></div>
        </div>
      );

      tags = (
        <ChipInput
          value={this.state.tags}
          onRequestAdd={(tag) => this.handleTagAdd(tag)}
          onRequestDelete={(deletedTag) => this.handleTagDelete(deletedTag)}
          dataSource={this.parentProps.interactions.tags}
          dataSourceConfig={{text: 'name', value: 'tag_guid'}}
          hintText="Add tags to your question for easy visibility (max 5 tags)."
          openOnFocus={true}
          fullWidth
          underlineShow={false}
          chipRenderer={({text, value, isFocused, isDisabled, handleClick, handleRequestDelete}, key) => (
            <Chip
              key={key}
              className="chip"
              labelStyle={this.styles.chipLabel}
              onTouchTap={handleClick}
              onRequestDelete={handleRequestDelete}
            >
              {text}
            </Chip>
          )}
        />
      );
      anonymousToggle = (
        <FormsyToggle
          name="is_anonymous"
          defaultToggled={toggleDefault}
          label="Post Anonymously"
          style={this.styles.toggleButton}
        />
      );
    }

    let cardContents = [
      <CardTitle titleStyle={{fontSize: 20}} style={this.styles.postTitle}
                 title={title} subtitle="All fields are required" key='title'/>,
      <CardText style={this.styles.formDescription} key='content'>
        <Col xs={12}>
          {postHeader}
          <RichTextEditor className="rte-container"
                          editorClassName="rte-editor"
                          toolbarConfig={toolbarConfig}
                          value={this.state.value} onChange={this.onTextChange}/>

          {anonymousToggle}

          {tags}

        </Col>
      </CardText>,
      <CardActions style={{textAlign: 'right'}} key='actions'>
        <FlatButton
          label='Cancel'
          secondary={true}
          onClick={onCancelClick}
        />
        <FlatButton
          label={confirmText}
          primary={true}
          type="submit"
          disabled={!this.state.canSubmit}
        />
      </CardActions>
    ];

    let formContent = (
      <Card style={{marginTop: 15, marginBottom: 200}}>
        <Formsy.Form
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
          onValidSubmit={(data) => this.handleSubmit(data, type)}
        >
          {cardContents}
        </Formsy.Form>
      </Card>
    );

    if (type == 'PostUpdate') {
      formContent = (
        <Formsy.Form
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
          onValidSubmit={(data) => this.handleSubmit(data, type)}
        >
          <div style={{paddingTop: 15}}>
            {cardContents.slice(1)}
          </div>
        </Formsy.Form>
      )
    }

    return (
      <div>
        {formContent}
      </div>
    );
  }
}

export default InteractionForm;
