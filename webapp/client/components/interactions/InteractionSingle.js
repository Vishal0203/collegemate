import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment/moment';
import Loader from 'halogenium/ScaleLoader';
import {Grid, Row, Col} from 'react-flexbox-grid'
import StickyDiv from 'react-stickydiv';
import Chip from 'material-ui/Chip';
import {Card, CardHeader, CardText} from 'material-ui/Card/index';
import {grey500, grey600} from 'material-ui/styles/colors';
import Tooltip from 'material-ui/internal/Tooltip';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import {toggleSnackbar} from '../../actions/commons/index';
import * as interactionActions from '../../actions/interactions/index'
import Header from '../Header';
import Comment from './Comment'
import PostUpdateDialog from './PostUpdateDialog';
import MobileTearSheet from '../extras/MobileTearSheet';
import Branding from '../Branding';
import ReplyForm from './ReplyForm';

class InteractionSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeTooltip: {
        show: false,
        label: ''
      },
      showConfirmation: false,
      postGuid: null,
      replyForm: false
    };
  }

  componentWillMount() {
    this.setState({postGuid: this.props.params.postGuid});
    this.fetchPost(this.props.params.postGuid);
  }

  componentWillUpdate() {
    const newPostGuid = this.props.params.postGuid;
    if (this.state.postGuid !== newPostGuid) {
      this.setState({postGuid: newPostGuid});
      this.fetchPost(newPostGuid);
    }
  }

  get styles() {
    return {
      postTitle: {
        paddingBottom: '2px',
        fontWeight: 500,
        fontSize: 18,
        marginLeft: 10
      },
      votesContainer: {
        padding: 0,
        color: grey600
      },
      postLabel: {
        marginTop: 5,
        fontWeight: 400
      },
      notificationPublisher: {
        padding: '10px 16px 12px 16px',
        fontStyle: 'italic',
        color: '#a5a5a5',
        fontWeight: 300,
        fontSize: 13
      },
      postSubtitle: {
        textTransform: 'capitalize',
        marginTop: 3,
        color: 'rgba(0, 0, 0, 0.35)',
        fontWeight: 400,
        fontSize: 14
      },
      postFooter: {
        fontWeight: 300,
        fontSize: 13,
        padding: '6px 26px 12px 0',
        color: grey600
      },
      chipsContainer: {
        paddingTop: 0,
        paddingLeft: 0
      },
      chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chipLabel: {
        lineHeight: '24px',
        textTransform: 'capitalize',
        color: '#757575',
        fontSize: 13
      },
      timeContainer: {
        fontSize: 12,
        fontWeight: 300,
        color: 'rgba(0, 0, 0, 0.541176)'
      },
      postVotesCount: {
        fontSize: 18,
        margin: 'auto',
        marginTop: '-16px'
      },
      postVotesIcon: {
        fontSize: 55,
        margin: 'auto',
        padding: 0,
        color: grey500
      },
      postUpvotesIconButton: {
        padding: 0,
        margin: 'auto',
        width: 55,
        height: 55
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
        width: '97%',
        backgroundColor: 'none'
      }
    }
  }

  createMarkup(content) {
    return {__html: content};
  };

  fetchPost(postGuid) {
    if (Object.keys(this.props.auth_user.user).length !== 0) {
      const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
      this.props.actions.fetchSinglePostRequest(institute_guid, postGuid);
    }
  }

  togglePostUpvote(post) {
    const instituteGuid = this.props.auth_user.selectedInstitute.inst_profile_guid;
    const postGuid = post.post_guid;
    this.props.actions.togglePostUpvoteRequest(instituteGuid, postGuid);
  }

  toggleUpdatePostForm() {
    this.props.actions.togglePostUpdateForm();
  }

  deletePost() {
    const instituteGuid = this.props.auth_user.selectedInstitute.inst_profile_guid;
    const postGuid = this.props.interactions.selectedPost.post_guid;
    this.props.actions.deletePostRequest(instituteGuid, postGuid);
  }

  toggleConfirmation(visiblity) {
    this.setState({showConfirmation: visiblity});
  }

  timeTooltipMouseEnter(timezone, time) {
    this.setState({
      timeTooltip: {
        show: true,
        label: `${moment(time).tz(timezone).format('h:mm a, MMMM Do YYYY')}`
      }
    })
  }

  renderChips(post) {
    return post.tags.map((tag, i) =>
      <Chip key={i} className="chip post-chip" labelStyle={this.styles.chipLabel}>{tag.name}</Chip>
    )
  }

  renderVotes(count) {
    const post = this.props.interactions.selectedPost;
    let disabled = false;
    if (post.isEditable) {
      disabled = true;
    }
    let upvotedColor = null;
    if (post.upvoted == true) {
      upvotedColor = {color: 'rgb(18, 107, 111)'}
    }
    return (
      <CardText style={this.styles.votesContainer}>
        <Row>
          <IconButton disabled={disabled} style={this.styles.postUpvotesIconButton}
                      onClick={() => this.togglePostUpvote(post)}>
            <div>
              <FontIcon className="material-icons"
                        style={{...this.styles.postVotesIcon, ...upvotedColor}}>arrow_drop_up</FontIcon>
            </div>
          </IconButton>
        </Row>
        <Row>
          <span style={this.styles.postVotesCount}>{count}</span>
        </Row>
        <Row>
          <span style={{margin: 'auto'}}>votes</span>
        </Row>
      </CardText>
    );
  }

  renderDeleteConfirmation() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.toggleConfirmation(false)}
      />,
      <FlatButton
        label="Delete"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={() => this.deletePost()}
      />
    ];
    return (
      <Dialog
        title="Are you sure?"
        actions={actions}
        modal={false}
        open={this.state.showConfirmation}
        onRequestClose={() => this.toggleConfirmation(false)}
      >
        Are you sure you want to delete this post? This can't be reverted.
      </Dialog>

    );
  }

  renderLoader() {
    return (
      <div style={{marginTop: '70px', marginBottom: '50px'}}>
        <Row center="xs">
          <Loader color="#126B6F" size="12px" margin="5px"/>
        </Row>
      </div>
    );

  }

  renderComments() {
    if (this.props.interactions.selectedPost.comments.length === 0) {
      return (
        <CardText style={{minHeight: '30px', color: 'rgba(0, 0, 0, 0.35)'}}>
          <label style={{paddingLeft: 12}}>We rise by lifting others. Help, by answering this question.</label>
        </CardText>
      )
    }
    return this.props.interactions.selectedPost.comments.map((comment) =>
      <div key={comment.comment_guid}>
        <Comment parentProps={this.props} comment={comment}/>
        <Divider className="card-divider"/>
      </div>
    );
  }

  getDate(date) {
    const timezone = moment.tz.guess();
    const time = moment.tz(date, null).format();
    return moment(time).tz(timezone).fromNow();
  }

  renderReplies(replies) {
    return replies.map((reply, i) => {
      const username = reply.user ? `${reply.user.first_name} ${reply.user.last_name}` : 'Anonymous';
      let deleteButton = null;
      if (reply.canEdit || this.props.auth_user.user.todevs_superuser) {
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
    this.props.actions.deleteReply(reply)
  }

  onReplySubmit(data) {
    data = {
      type: 'post', ...data
    };
    this.props.actions.addReplyRequest(data);
    this.setState({replyForm: false})
  }

  renderInteractionFooter() {
    const post = this.props.interactions.selectedPost;
    const user = this.props.auth_user.user;

    const timezone = moment.tz.guess();
    const time = moment.tz(post.created_at, null).format();

    let edit = null;
    if (post.isEditable || user.todevs_superuser || user.todevs_staff) {
      edit = (
        <div style={this.styles.actionButton}>
          <label style={{cursor: 'pointer'}}
                 onClick={() => this.toggleUpdatePostForm(post)}>
            edit
          </label>
        </div>
      );
    }
    let deletePost = null;
    if (post.isEditable || user.todevs_superuser || user.todevs_staff) {
      deletePost = (
        <div style={this.styles.actionButton}>
          <label style={{cursor: 'pointer'}}
                 onClick={() => this.toggleConfirmation(true)}>
            delete
          </label>
        </div>
      );
    }

    return (
      <div style={this.styles.postFooter}>
        <span>
          {edit}
        </span>
        <span>
          {deletePost}
        </span>
        <div style={{float: 'right', right: '20px', display: 'inline-block', textAlign: 'right', height: 26}}>
          <div style={this.styles.timeContainer}
               onMouseEnter={() => this.timeTooltipMouseEnter(timezone, time)}
               onMouseLeave={() => {
                 this.setState({timeTooltip: {show: false, label: ''}})
               }}>
            <label> Asked {moment(time).tz(timezone).fromNow()} </label>
            <Tooltip show={this.state.timeTooltip.show}
                     label={this.state.timeTooltip.label}
                     style={{right: 6, top: 3, fontSize: 12, fontWeight: 400}}
                     horizontalPosition="left"
                     verticalPosition="bottom"
                     touch={true}
            />
          </div>
        </div>
      </div>
    )
  }

  renderInteraction() {
    const post = this.props.interactions.selectedPost;

    let commentLoader = null;
    if (this.props.interactions.commentLoading) {
      commentLoader = this.renderLoader();
    }

    if (post) {
      let votes = this.renderVotes(post.upvotes_count);
      const commentsCount = `${post.comments_count} Answers`;
      const username = 'user' in post ? `${post.user.first_name} ${post.user.last_name}` : 'Anonymous';
      const userIcon = 'user' in post ? post.user.user_profile.user_avatar :
        `${process.env.SERVER_HOST}/avatar/defaultuser.jpg`;

      return (
        <div style={{paddingBottom: 40}}>
          <Card>
            <Row>
              <CardHeader
                className="post-header"
                title={post.post_heading}
                subtitle={username}
                avatar={
                  <Avatar size={43} style={{marginRight: 10}} src={userIcon}/>
                }
                style={this.styles.postTitle}
                titleStyle={{fontSize: '20px'}}
                subtitleStyle={this.styles.postSubtitle}>
              </CardHeader>
            </Row>
            <Divider className="card-divider"/>
            <Row style={{marginTop: '-10px'}}>
              <div style={{width: '11%', flexBasis: '11%', marginLeft: '14px'}}>
                {votes}
              </div>
              <div style={{width: '86%', flexBasis: '86%', textAlign: 'justify'}}>
                <CardText style={{padding: '10px 23px 10px 0'}}>
                  <div className="post-content" dangerouslySetInnerHTML={this.createMarkup(post.post_description)}/>
                </CardText>
                <PostUpdateDialog
                  parentProps={this.props}
                  type='Interactions'
                  onCancelClick={() => this.toggleUpdatePostForm()}
                />
                <CardText style={this.styles.chipsContainer}>
                  <div style={this.styles.chipWrapper}>
                    {this.renderChips(post)}
                  </div>
                </CardText>
                {this.renderInteractionFooter()}
                {this.renderReplies(post.replies)}
                <Divider style={this.styles.commentDivider}/>
                <ReplyForm
                  openForm={this.state.replyForm}
                  formPadding={{padding: '5px 20px 5px 5px'}}
                  onButtonClick={() => this.setState({replyForm: !this.state.replyForm})}
                  onSubmit={(data) => this.onReplySubmit(data)}
                />
              </div>
            </Row>
            <Row>
              <CardHeader
                title={commentsCount}
                style={this.styles.postTitle}>
              </CardHeader>
            </Row>
            <Divider className="card-divider"/>
            <div style={{paddingBottom: 0}}>
              {commentLoader}
              {this.renderComments()}
            </div>
          </Card>
          {this.renderDeleteConfirmation()}
        </div>
      );
    }
  }

  render() {
    let postLoader = null;

    if (this.props.interactions.postLoading) {
      postLoader = this.renderLoader();
    }
    return (
      <div className="main-content">
        <Header title="Get helped by reading the answers on the question."
                type="InteractionSingle"
                parentProps={this.props}
                hasButton={true}
                buttonLabel="Answer question"/>

        <div style={{marginTop: '35px'}}>
          <Grid>
            <div className="wrap">
              <Row>
                <Col xs={8}>
                  {postLoader}
                  {this.renderInteraction()}
                </Col>
                <Col xs={4}>
                  <StickyDiv zIndex={1} offsetTop={65}>
                    <div style={{marginTop: 0}} className="right-content">
                      <MobileTearSheet height={300}>
                        <div>
                          <h4 style={{marginBottom: 5}}>How to answer?</h4>
                          <ul className="how-to-list" style={{fontSize: 14}}>
                            <li>It is recommended to use formal language while answering the questions.</li>
                            <li>Avoid using short forms and extra full stops.</li>
                            <li><span>Use</span>
                              <i className="material-icons" style={{position: 'relative', fontSize: 20, top: '5px'}}>
                                format_bold
                              </i>
                              as stressor.
                            </li>
                            <li><span>Use </span>
                              <i className="material-icons" style={{position: 'relative', fontSize: 20, top: '2px'}}>
                                format_quote
                              </i>
                              <span> tool to refer something in question.</span>
                            </li>
                            <li>
                              Use <code>shift+enter</code> to continue typing in code block.
                            </li>
                          </ul>
                        </div>
                      </MobileTearSheet>
                      <Branding />
                    </div>
                  </StickyDiv>
                </Col>
              </Row>
            </div>
          </Grid>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    interactions: state.interactions
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...interactionActions, toggleSnackbar}, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(InteractionSingle);