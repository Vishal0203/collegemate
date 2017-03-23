import React, {Component} from 'react';
import moment from 'moment';
import {Row, Col} from 'react-flexbox-grid'
import {CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {grey500, grey600} from 'material-ui/styles/colors';
import Tooltip from 'material-ui/internal/Tooltip';
import {renderVotes} from './InteractionSingle'
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import RichEditor from '../rte/RichEditor';
import {EditorState, CompositeDecorator} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import {Link, findLinkEntities} from '../rte/CommonUtils';


class Comment extends Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      timeTooltip: {
        show: false,
        label: ''
      },
      editorState: EditorState.createWithContent(stateFromHTML(props.comment.comment), decorator),
      edit: false,
      showConfirmation: false
    };

    this.onChange = (editorState) => this.setState({editorState});
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
        fontSize: 45,
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
        position: 'absolute',
        marginTop: 18
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

  createMarkup(commentContent) {
    return {__html: commentContent};
  };

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
          comment: stateToHTML(this.state.editorState.getCurrentContent()),
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
    if (comment.canEdit) {
      disabled = true;
    }
    let upvotedColor = null;
    if (comment.upvoted == true) {
      upvotedColor = {color: 'rgb(18, 107, 111)'}
    }
    return (
      <CardText style={this.styles.votesContainer}>
        <Row>
          <IconButton disabled={disabled} style={this.styles.commentUpvotesIconButton} onClick={() => this.toggleCommentUpvote(comment)}>
            <div>
              <i className="material-icons" style={{...this.styles.commentVotesIcon, ...upvotedColor}}>arrow_drop_up</i>
            </div>
          </IconButton>
        </Row>
        <Row>
          <span style={this.styles.commentVotesCount}>{comment.upvotes_count}</span>
        </Row>
        <Row>
          <span style={{margin : '-5px auto auto auto'}}>votes</span>
        </Row>
      </CardText>
    );
  }

  renderEditComment() {
    return (
      <RichEditor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
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
    if(comment.canEdit) {
      edit = (
        <label style={this.styles.actionButton}
               onClick={() => this.editComment('show')}>
          edit
        </label>
      );
    }
    let deleteIcon = null;
    if(comment.canEdit ||
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
        (<Col xs={1} key={1}>
          <label style={this.styles.actionButton}
                 onClick={() => this.editComment('submit')}>
            submit
          </label>
        </Col>),
        (<Col xs={1} key={2}>
          <label style={this.styles.actionButton}
                 onClick={() => this.editComment('cancel')}>
            cancel
          </label>
        </Col>)
      ];
    }
    else {
      const username = comment.user? `${comment.user.first_name} ${comment.user.last_name}` : 'Anonymous';
      actions = [
        (<Col xs={1} key={1}>
          {edit}
        </Col>),
        (<Col xs={1} key={2}>
          {deleteIcon}
        </Col>),
        (<Col xsOffset={7} xs={3} key={3}>
          <Row end="xs">
            <label style={{fontWeight: 400}}>{username}</label>
            <div style={this.styles.timeContainer}
                 onMouseEnter={() => this.timeTooltipMouseEnter(timezone, moment.tz(comment.created_at, null).format())}
                 onMouseLeave={() => {
                   this.setState({ timeTooltip: {show: false, label: ''} })
                 }}>
              <label> {`Answered ${moment(time).tz(timezone).fromNow()}`} </label>
              <Tooltip show={this.state.timeTooltip.show}
                       label={this.state.timeTooltip.label}
                       style={{right: 6, top: 3, fontSize: 12, fontWeight: 400}}
                       horizontalPosition="left"
                       verticalPosition="bottom"
                       touch={true}
              />
            </div>
          </Row>
        </Col>)
      ]
    }

    return (
      <div style={this.styles.commentContainer}>
        <Row>
          <div style={{width: '11%', flexBasis: '11%'}}>
            {this.renderVotes()}
          </div>
          <div style={{width: '85%', flexBasis: '85%', textAlign: 'justify'}}>
            <CardText style={{paddingLeft: 0, paddingBottom: 10}}>
              {commentContent}
            </CardText>
            <Row style={this.styles.commentFooter}>
              {actions}
              {this.renderDeleteConfirmation()}
            </Row>
          </div>
        </Row>
      </div>
    )
  }
}

export default Comment;