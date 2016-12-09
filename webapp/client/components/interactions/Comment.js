import React, {Component} from 'react';
import moment from 'moment';
import {Row, Col} from 'react-flexbox-grid'
import {CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {grey600} from 'material-ui/styles/colors';
import Tooltip from 'material-ui/internal/Tooltip';
import {renderVotes} from './InteractionSingle'
import FlatButton from 'material-ui/FlatButton';
import RichTextEditor from 'react-rte';
import Dialog from 'material-ui/Dialog';


class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeTooltip: {
        show: false,
        label: ''
      },
      value: RichTextEditor.createValueFromString(props.comment.comment, 'html'),
      edit: false,
      showConfirmation: false
    };
    this.onTextChange = this.onTextChange.bind(this);
  }
  get styles() {
    return {
      votesContainer: {
        color: grey600,
        margin: 'auto',
        marginTop: '-16px',
        paddingBottom: 0
      },
      commentContainer: {
        width: '95%',
        margin: 'auto'
      },
      commentVotesCount: {
        fontSize: 15,
        margin: 'auto',
        marginTop: '-16px'
      },
      commentVotesIcon: {
        fontSize: 52,
        margin: 'auto',
        padding: 0,
        color: grey600,
      },
      commentFooter: {
        fontWeight: 300,
        fontSize: 13,
        padding: '6px 26px 10px 0',
        color: grey600
      },
      timeContainer: {
        display: 'inline-block',
        alignContent: 'right',
        fontSize: 12,
        fontWeight: 300,
        color: 'rgba(0, 0, 0, 0.541176)',
        position: 'absolute'
      },
      commentUpvotesIconButton : {
        padding: 0,
        margin: 'auto',
        width: 52 ,
        height: 52
      },
      actionButton: {
        color: grey600,
        cursor: 'pointer'
      }
    }
  }

  createMarkup(commentContent) { return {__html: commentContent}; };

  timeTooltipMouseEnter(timezone, time) {
    this.setState({
      timeTooltip: {
        show: true,
        label: `${moment(time).tz(timezone).format('h:mm a, MMMM Do YYYY')}`
      }
    })
  }

  toggleConfirmation() {
    this.setState({showConfirmation: !this.state.showConfirmation});
  }

  toggleCommentUpvote(comment) {
    const instituteGuid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const postGuid = this.props.parentProps.interactions.selectedPost.post_guid;
    const formData = {institute_guid : instituteGuid };
    this.props.parentProps.actions.toggleCommentUpvoteRequest(postGuid, comment, formData);
  }

  deleteComment() {
    const comment = this.props.comment;
    const instituteGuid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const postGuid = this.props.parentProps.interactions.selectedPost.post_guid;
    const formData = {institute_guid : instituteGuid };
    this.props.parentProps.actions.deleteCommentRequest(postGuid, comment, formData);
    this.toggleConfirmation();
  }

  onTextChange(value) {
    this.setState({value});
  };

  editComment(operation) {
    const comment = this.props.comment;
    switch(operation) {
      case 'show': {
        this.setState({edit: true});
        break;
      }
      case 'submit': {
        const instituteGuid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
        const postGuid = this.props.parentProps.interactions.selectedPost.post_guid;
        const formData = {
          institute_guid: instituteGuid,
          comment: this.state.value.toString('html'),
        };
        this.props.parentProps.actions.editCommentRequest(postGuid, comment, formData);
        this.setState({edit: false});
        break;
      }
      case 'cancel': {
        this.setState({edit: false});
        break;
      }
      default: break;
    }
  }

  renderVotes() {
    const comment = this.props.comment;
    const auth_user = this.props.parentProps.auth_user.user;
    let disabled = false;
    if (comment.user.user_guid == auth_user.user_guid) {
      disabled = true;
    }
    return (
      <CardText style={this.styles.votesContainer}>
        <Row>
          <IconButton disabled={disabled} style={this.styles.commentUpvotesIconButton} onClick={() => this.toggleCommentUpvote(comment)}>
            <div>
              <i className="material-icons" style={this.styles.commentVotesIcon}>arrow_drop_up</i>
            </div>
          </IconButton>
        </Row>
        <Row>
          <span style={this.styles.commentVotesCount}>{comment.upvotes_count}</span>
        </Row>
        <Row>
          <span style={{margin : 'auto'}}>Votes</span>
        </Row>
      </CardText>
    );
  }

  renderEditComment() {
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
      <RichTextEditor className="rte-container"
                    editorClassName="rte-editor"
                    toolbarConfig={toolbarConfig}
                    value={this.state.value} onChange={this.onTextChange}/>
    );
  }

  renderDeleteConfirmation() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.toggleConfirmation()}
      />,
      <FlatButton
        label="Delete"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={() => this.deleteComment()}
      />
    ];
    return (
      <Dialog
        title="Are you sure?"
        actions={actions}
        modal={false}
        open={this.state.showConfirmation}
        onRequestClose={() => this.toggleConfirmation()}
      >
        Are you sure you want to delete this comment? This can't be reverted.
      </Dialog>

    );
  }


  render() {
    let comment = this.props.comment;
    const auth_user = this.props.parentProps.auth_user.user;
    const timezone = moment.tz.guess();
    const time = moment.tz(comment.created_at, null).format();
    let edit = null;
    if(comment.user.user_guid == auth_user.user_guid) {
      edit = (
        <label style={this.styles.actionButton}
               onClick={() => this.editComment('show')}>
          edit
        </label>
      );
    }
    let deleteIcon = null;
    if(comment.user.user_guid == auth_user.user_guid ||
      auth_user.todevs_superuser ||
      auth_user.todevs_staff) {
      deleteIcon = (
        <label style={this.styles.actionButton}
               onClick={() => this.toggleConfirmation()}>
          delete
        </label>
      );
    }

    let commentContent = null;
    if(this.state.edit == false) {
      commentContent = (
        <div className="post-content" dangerouslySetInnerHTML={this.createMarkup(comment.comment)} />
      );
    }
    else {
      commentContent = this.renderEditComment();
    }
    let actions = null;
    if(this.state.edit) {
      actions = [
        (<div style={{width: '10%', flexBasis: '10%', marginLeft: '14px'}} key={1}>
          <FlatButton
            label="submit"
            style={{marginTop: -25, minWidth: 20}}
            labelStyle={this.styles.actionButton}
            onClick={() => this.editComment('submit')}/>
        </div>),
        (<div style={{width: '10%', flexBasis: '10%', marginLeft: '14px'}} key={2}>
          <FlatButton
            label="cancel"
            style={{marginTop: -25, minWidth: 20}}
            labelStyle={this.styles.actionButton}
            onClick={() => this.editComment('cancel')}/>
        </div>)
      ];
    }
    else {
      actions = [
        (<div style={{width: '10%', flexBasis: '10%', marginLeft: '14px'}} key={1}>
          {edit}
        </div>),
        (<div style={{width: '10%', flexBasis: '10%'}} key={2}>
          {deleteIcon}
        </div>)
      ]
    }

    return (
      <div style={this.styles.commentContainer}>
        <Row>
          <div style={{width: '11%', flexBasis: '11%', marginLeft: '14px'}}>
            {this.renderVotes()}
          </div>
          <div style={{width: '85%', flexBasis: '85%', textAlign: 'justify'}}>
            <CardText style={{paddingLeft: 0, paddingBottom: 10}}>
              {commentContent}
            </CardText>
            <Row style={this.styles.commentFooter}>
              {actions}
              {this.renderDeleteConfirmation()}
              <div style={{width: '60%', flexBasis: '60%', textAlign: 'right'}}>
                <div style={this.styles.timeContainer} onMouseEnter={() => this.timeTooltipMouseEnter(timezone, moment.tz(comment.created_at, null).format())}
                     onMouseLeave={()=>{this.setState({ timeTooltip: {show: false, label: ''} }) }}>
                  <label> {moment(time).tz(timezone).fromNow()} </label>
                  <Tooltip show={this.state.timeTooltip.show}
                           label={this.state.timeTooltip.label}
                           style={{right: 6, top: 3, fontSize: 12, fontWeight: 400}}
                           horizontalPosition="left"
                           verticalPosition="bottom"
                           touch={true}
                  />
                </div>
              </div>
            </Row>
          </div>
        </Row>
      </div>
    )
  }
}

export default Comment;