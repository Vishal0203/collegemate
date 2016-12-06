import React from 'react';
import {Card, CardActions, CardText, CardTitle} from 'material-ui/Card';
import {Col, Row} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RichTextEditor from 'react-rte';
import ChipInput from 'material-ui-chip-input';
import Toggle from 'material-ui/Toggle';
import Chip from 'material-ui/Chip';

class InteractionForm extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
    this.state = {
      tags: [],
      value: RichTextEditor.createEmptyValue()
    };
    this.handleChange = this.handleChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  get styles() {
    return {
      postTitle: {
        padding: '12px 16px 0px 16px',
      },
      notificationDescription: {
        padding: '0px 16px 16px 16px',
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

  handlePostSubmit() {
    const formData = {
      instituteGuid: this.parentProps.auth_user.selectedInstitute.inst_profile_guid,
    };
  }

  handleChange(event, index, tag) {
    this.setState({tag, value: this.state.value});
  }

  onTextChange(value) {
    this.setState({tag: this.state.tag, value});
    console.log(value.toString('html'));
  };

  handleTagAdd(tag) {
    console.log(tag);
    this.setState({
      tags: [...this.state.tags, tag]
    })
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
    const {onCancelClick} = this.props;

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

    return (
      <Card style={{marginTop: 15, marginBottom: 200}}>
        <CardTitle titleStyle={{fontSize: 20}} style={this.styles.postTitle}
                   title="Ask a question" subtitle="All fields are required"/>
        <CardText style={this.styles.notificationDescription}>
          <Col xs={12}>
            <TextField ref="postHeader" hintText="What would you like to ask? Be specific." fullWidth={true}
                       style={{paddingTop: '15px', fontWeight: 400}}/>
            <div style={{marginTop: '5px'}}></div>
            <RichTextEditor className="rte-container"
                            editorClassName="rte-editor"
                            toolbarConfig={toolbarConfig}
                            value={this.state.value} onChange={this.onTextChange} />

            <Toggle
              label="Post Anonymously"
              style={this.styles.toggleButton}
            />

            <ChipInput
              value={this.state.tags}
              onRequestAdd={(tag) => this.handleTagAdd(tag)}
              onRequestDelete={(deletedTag) => this.handleTagDelete(deletedTag)}
              dataSource={this.parentProps.interactions.tags}
              dataSourceConfig={{text: 'name', value: 'tag_guid'}}
              hintText="Add tags to your question for easy visibility."
              openOnFocus={true}
              fullWidth
              chipRenderer={({ text, value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
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

          </Col>
        </CardText>
        <CardActions style={{textAlign: 'right'}}>
          <FlatButton label="Cancel" secondary={true} onClick={onCancelClick}/>
          <FlatButton label="Announce" primary={true} onClick={() => this.handlePostSubmit()}/>
        </CardActions>
      </Card>
    );
  }
}

export default InteractionForm;
