import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import Loader from 'halogen/ScaleLoader';
import {Grid, Row, Col} from 'react-flexbox-grid'
import StickyDiv from 'react-stickydiv';
import * as interactionActions from '../../actions/interactions/index'
import Header from '../Header';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import Comment from './Comment'
import Chip from 'material-ui/Chip';
import {grey500, grey600} from 'material-ui/styles/colors';
import Tooltip from 'material-ui/internal/Tooltip';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import PostUpdateDialog from './PostUpdateDialog';
import {toggleSnackbar} from '../../actions/snackbar';
import Avatar from 'material-ui/Avatar';
import ReactMarkdown from 'react-markdown';

class InteractionSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeTooltip: {
        show: false,
        label: ''
      },
      showConfirmation: false
    };
  }
  componentWillMount() {
    this.fetchPost(this.props.params.postGuid);
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
        padding: '6px 26px 10px 0',
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
        display: 'inline-block',
        alignContent: 'right',
        fontSize: 12,
        fontWeight: 300,
        color: 'rgba(0, 0, 0, 0.541176)',
        position: 'absolute'
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
      postUpvotesIconButton : {
        padding: 0,
        margin: 'auto',
        width: 55 ,
        height: 55
      },
      actionButton: {
        color: grey600,
        cursor: 'pointer'
      }
    }
  }

  fetchPost(postGuid) {
    if (Object.keys(this.props.auth_user.user).length != 0) {
      const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
      this.props.actions.fetchSinglePostRequest(institute_guid, postGuid, null);
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
          <IconButton disabled={disabled} style={this.styles.postUpvotesIconButton} onClick={() => this.togglePostUpvote(post)}>
            <div>
              <i className="material-icons" style={{...this.styles.postVotesIcon, ...upvotedColor}}>arrow_drop_up</i>
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
    if (this.props.interactions.selectedPost.comments.length == 0) {
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

  renderInteraction() {
    const post = this.props.interactions.selectedPost;
    const user = this.props.auth_user.user;
    let commentLoader = null;
    if(this.props.interactions.commentLoading) {
      commentLoader = this.renderLoader();
    }

    if (post) {
      let votes = this.renderVotes(post.upvotes_count);
      const username = 'user' in post ? `${post.user.first_name} ${post.user.last_name}` : 'Anonymous';
      const userIcon = 'user' in post ?
        post.user.user_profile.user_avatar:
        `${process.env.SERVER_HOST}/avatar/defaultuser.jpg`;
      const timezone = moment.tz.guess();
      const time = moment.tz(post.created_at, null).format();
      const answersCount = `${post.comments_count} Answers`;
      let edit = null;
      if (post.isEditable) {
        edit = (
          <label style={this.styles.actionButton}
                 onClick={() => this.toggleUpdatePostForm(post)}>
            edit
          </label>
        );
      }
      let deletePost = null;
      if (post.isEditable ||
        user.todevs_superuser ||
        user.todevs_staff) {
        deletePost = (
          <label style={this.styles.actionButton}
                 onClick={() => this.toggleConfirmation(true)}>
            delete
          </label>
        );
      }
      return (
        <div style={{paddingBottom: 40}}>
          <Card>
            <Row>
              <CardHeader
                title={post.post_heading}
                subtitle={username}
                avatar={
                  <Avatar size={43} style={{marginRight: 10}} src={userIcon} />
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
              <div style={{width: '85%', flexBasis: '85%', textAlign: 'justify'}}>
                <CardText style={{paddingLeft: 0, paddingBottom: 10}}>
                  <div className="post-content">
                    <ReactMarkdown source={post.post_description}/>
                  </div>
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
                <Row style={this.styles.postFooter}>
                  <Col xs={1}>
                    {edit}
                  </Col>
                  <Col xs={1}>
                    {deletePost}
                  </Col>
                  <Col xsOffset={7} xs={3}>
                    <Row end="xs">
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
                    </Row>
                  </Col>
                </Row>
              </div>
            </Row>
            <Row>
              <CardHeader
                title={answersCount}
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
                  <StickyDiv offsetTop={65}>
                    <div className="right-content">
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