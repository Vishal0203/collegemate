import React, {Component} from 'react';
import moment from 'moment/moment';
import {Row} from 'react-flexbox-grid'
import {grey500, grey600} from 'material-ui/styles/colors';
import ReplyForm from './ReplyForm';
import {markdownToHtml, simplemde_config} from '../extras/utils';
import {Divider, Dialog, FlatButton, CardText, IconButton} from 'material-ui';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';


class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      simplemde: null,
      edit: false,
      showConfirmation: false,
      replyForm: false
    };
  }

  get styles() {
    return {
      votesContainer: {
        color: grey600,
        margin: '-16px auto auto',
        paddingBottom: 0,
        fontSize: 12
      },
      commentContainer: {
        width: '95%',
        margin: 'auto'
      },
      commentVotesCount: {
        fontSize: 12,
        margin: '-19px auto auto'
      },
      commentVotesIcon: {
        width: 45,
        height: 45,
        margin: 'auto',
        padding: 0,
        color: grey500,
      },
      commentFooter: {
        fontWeight: 300,
        fontSize: 13,
        padding: '6px 0 10px 0',
        color: grey600,
        marginBottom: 20
      },
      timeContainer: {
        fontSize: 12,
        fontWeight: 300,
        color: 'rgba(0, 0, 0, 0.541176)',
        marginTop: 4
      },
      commentUpvotesIconButton: {
        padding: 0,
        margin: '2px auto',
        width: 52,
        height: 52
      },
      actionButton: {
        color: grey500,
        padding: '0 9px 0 1px',
        display: 'inline-block'
      },
      commentDivider: {
        border: 'none',
        borderTop: '1px dotted rgb(220, 220, 220)',
        marginLeft: 2,
        width: '100%',
        backgroundColor: 'none'
      }
    }
  }

  createMarkup(commentContent) {
    return {__html: commentContent};
  };

  toggleConfirmation() {
    this.setState({showConfirmation: !this.state.showConfirmation});
  }

  toggleCommentUpvote(comment) {
    const instituteGuid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const postGuid = this.props.parentProps.interactions.selectedPost.post_guid;
    const formData = {institute_guid: instituteGuid};
    this.props.parentProps.actions.toggleCommentUpvoteRequest(postGuid, comment, formData);
  }

  deleteComment() {
    const comment = this.props.comment;
    const instituteGuid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
    const postGuid = this.props.parentProps.interactions.selectedPost.post_guid;
    const formData = {institute_guid: instituteGuid};
    this.props.parentProps.actions.deleteCommentRequest(postGuid, comment, formData);
    this.toggleConfirmation();
  }

  editComment(operation) {
    const comment = this.props.comment;
    switch (operation) {
      case 'show': {
        this.setState({edit: true}, () => {
          this.setState({
            simplemde: new SimpleMDE({
              ...simplemde_config,
              initialValue: comment.comment,
              element: document.getElementById('comment-rte')
            })
          })
        });
        break;
      }
      case 'submit': {
        const instituteGuid = this.props.parentProps.auth_user.selectedInstitute.inst_profile_guid;
        const postGuid = this.props.parentProps.interactions.selectedPost.post_guid;
        const formData = {
          institute_guid: instituteGuid,
          comment: this.state.simplemde.value(),
        };
        this.props.parentProps.actions.editCommentRequest(postGuid, comment, formData);
        this.setState({edit: false});
        break;
      }
      case 'cancel': {
        this.setState({edit: false});
        break;
      }
      default:
        break;
    }
  }

  renderVotes() {
    const comment = this.props.comment;
    let disabled = false;
    if (comment.canEdit) {
      disabled = true;
    }
    let upvotedColor = null;
    if (comment.upvoted === true) {
      upvotedColor = {color: 'rgb(18, 107, 111)'}
    }
    return (
      <CardText style={this.styles.votesContainer}>
        <Row>
          <IconButton disabled={disabled} style={this.styles.commentUpvotesIconButton}
                      onClick={() => this.toggleCommentUpvote(comment)}>
            <div>
              <ArrowDropUp style={{...this.styles.commentVotesIcon, ...upvotedColor}}/>
            </div>
          </IconButton>
        </Row>
        <Row>
          <span style={this.styles.commentVotesCount}>{comment.upvotes_count}</span>
        </Row>
        <Row>
          <span style={{margin: '-5px auto auto auto'}}>votes</span>
        </Row>
      </CardText>
    );
  }

  renderEditComment() {
    return (
      <div>
        <textarea id="comment-rte"/>
      </div>
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

  getDate(date) {
    const timezone = moment.tz.guess();
    const time = moment.tz(date, null).format();
    return moment(time).tz(timezone).fromNow();
  }

  renderComments(replies) {
    return replies.map((reply, i) => {
      const username = reply.user ? `${reply.user.first_name} ${reply.user.last_name}` : 'Anonymous';
      let deleteButton = null;
      if (reply.canEdit || this.props.parentProps.auth_user.user.todevs_superuser) {
        deleteButton = <span onClick={() => this.onReplyDelete(reply)}
                             style={{color: grey600, cursor: 'pointer'}}>  &mdash;  delete</span>
      }

      return (
        <div key={i}>
          <Divider style={this.styles.commentDivider}/>
          <CardText style={{padding: '8px 20px 8px 5px', fontSize: 12, lineHeight: '16px'}}>
            {reply.reply_body} &mdash;
            <strong style={{textTransform: 'captitalize'}}>{username}</strong> &nbsp;
            <span style={{color: 'rgb(205, 205, 205)'}}>| {this.getDate(reply.created_at)}</span>
            {deleteButton}
          </CardText>
        </div>
      )
    })
  }

  onReplyDelete(reply) {
    const data = {
      ...reply,
      comment_guid: this.props.comment.comment_guid
    };

    this.props.parentProps.actions.deleteReply(data)
  }

  onReplySubmit(data) {
    data = {
      type: 'comment',
      comment_guid: this.props.comment.comment_guid,
      ...data
    };
    this.props.parentProps.actions.addReplyRequest(data);
    this.setState({replyForm: false})
  }


  render() {
    let comment = this.props.comment;
    const auth_user = this.props.parentProps.auth_user.user;
    const timezone = moment.tz.guess();
    const time = moment.tz(comment.created_at, null).format();
    let edit = null;
    if (comment.canEdit) {
      edit = (
        <div style={this.styles.actionButton}>
          <label style={{cursor: 'pointer'}} onClick={() => this.editComment('show')}>
            edit
          </label>
        </div>
      );
    }
    let deleteIcon = null;
    if (comment.canEdit ||
      auth_user.todevs_superuser ||
      auth_user.todevs_staff) {
      deleteIcon = (
        <div style={this.styles.actionButton}>
          <label style={{cursor: 'pointer'}} onClick={() => this.toggleConfirmation()}>
            delete
          </label>
        </div>
      );
    }

    let commentContent = null;
    if (this.state.edit === false) {
      commentContent = (
        <div className="post-content"
             dangerouslySetInnerHTML={this.createMarkup(markdownToHtml(comment.comment))}/>
      );
    }
    else {
      commentContent = this.renderEditComment();
    }
    let actions = null;
    if (this.state.edit) {
      actions = [
        <div key={1} style={this.styles.actionButton}>
          <label style={{cursor: 'pointer'}}
                 onClick={() => this.editComment('submit')}>
            submit
          </label>
        </div>,
        <div key={2} style={this.styles.actionButton}>
          <label style={{cursor: 'pointer'}}
                 onClick={() => this.editComment('cancel')}>
            cancel
          </label>
        </div>
      ];
    }
    else {
      const username = comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : 'Anonymous';
      actions = [
        <span key={1}>
          {edit}
        </span>,
        <span key={2}>
          {deleteIcon}
        </span>,
        <div key={4} style={{float: 'right', display: 'inline-block', textAlign: 'right', height: 44}}>
          <label style={{fontWeight: 400, textTransform: 'capitalize'}}>{username}</label>
          <div style={this.styles.timeContainer}>
            <label> {`Answered ${moment(time).tz(timezone).fromNow()}`} </label>
          </div>
        </div>
      ]
    }

    return (
      <div style={this.styles.commentContainer}>
        <Row>
          <div style={{width: '11%', flexBasis: '11%'}}>
            {this.renderVotes()}
          </div>
          <div style={{width: '87%', flexBasis: '87%', textAlign: 'justify'}}>
            <CardText style={{padding: '10px 0'}}>
              {commentContent}
            </CardText>
            <div style={this.styles.commentFooter}>
              {actions}
              {this.renderDeleteConfirmation()}
            </div>
            {this.renderComments(comment.replies)}
            <Divider style={this.styles.commentDivider}/>
            <ReplyForm
              openForm={this.state.replyForm}
              formPadding={{padding: '5px 0px 5px 5px'}}
              onButtonClick={() => this.setState({replyForm: !this.state.replyForm})}
              onSubmit={(data) => this.onReplySubmit(data)}
            />
          </div>
        </Row>
      </div>
    )
  }
}

export default Comment;