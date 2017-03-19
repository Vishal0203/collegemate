import React, {Component} from 'react';
import Header from '../Header';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loader from 'halogen/ScaleLoader';
import {Grid, Row, Col} from 'react-flexbox-grid';
import InfiniteScroll from 'redux-infinite-scroll';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import StickyDiv from 'react-stickydiv';
import * as interactionActions  from '../../actions/interactions/index';
import InteractionPost from './InteractionPost';
import {toggleSnackbar} from '../../actions/snackbar';
import Paper from 'material-ui/Paper';
import MobileTearSheet from '../extras/MobileTearSheet';
import Branding from '../Branding';

class InteractionsContainer extends Component {

  constructor(props) {
    super(props);
    this.props.actions.fetchTags({type: 'posts'});
  }

  get styles() {
    return {
      chipLabel: {
        lineHeight: '28px',
        textTransform: 'capitalize',
        color: '#757575',
        fontSize: 13
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 20
      },
      selectedFilterLabel: {
        marginTop: 8,
        paddingLeft: 5,
        fontFamily: 'Roboto, sans-serif',
        fontSize: 'smaller',
        color: '#9E9E9E'
      }
    }
  }

  loadMore() {
    if (Object.keys(this.props.auth_user.user).length != 0) {
      const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
      let url = `institute/${institute_guid}/post`;
      let tags = null;
      tags = this.props.interactions.filters.map(function (tag) {
        return tag.tag_guid
      }).join(',');
      if (this.props.interactions.nextPageUrl) {
        url = this.props.interactions.nextPageUrl;
        this.props.actions.fetchPostsRequest(url, {skip: this.props.interactions.skip})
      } else {
        this.props.actions.fetchPostsRequest(url, {tags_guid: tags})
      }

    }
  }

  handleFilterDelete(tag) {
    this.props.actions.removeTagFilter(tag);
  }

  handleFilterSelect(tag) {
    this.props.actions.addTagFilter(tag);
  }

  renderInteractions() {
    if (this.props.interactions.items.posts.length) {
      return this.props.interactions.items.posts.map((post, i) =>
        <InteractionPost key={i} parentProps={this.props} post={post} />
      );
    }

    if (this.props.interactions.items.posts.length == 0 && this.props.interactions.loadingMore == false) {
      return [
        <Paper className="paper-style" zDepth={0} key={0}>
          <p>There are no interactions to show.</p>
        </Paper>
      ]
    }
  }

  renderTagChips() {
    if (Object.keys(this.props.auth_user.user).length != 0) {
      const tags = this.props.interactions.tags;
      if (Object.keys(this.props.auth_user.user).length != 0) {
        return tags.map((tag, i) =>
          <Chip key={i} className="chip" onTouchTap={() => this.handleFilterSelect(tag)}
                labelStyle={this.styles.chipLabel}>
            {tag.name}
          </Chip>
        );
      }
    }
  }

  renderSelectedTags() {
    if (Object.keys(this.props.auth_user.user).length != 0) {
      const {tags, filters} = this.props.interactions;
      if (filters.length == 0) {
        return (
          <label style={this.styles.selectedFilterLabel}>All Posts</label>
        )
      }
      else {
        return (
          filters.map((tag, i) =>
            <Chip key={i} className="chip" onRequestDelete={() => this.handleFilterDelete(tag)}
                  labelStyle={this.styles.chipLabel}>
              {tag.name}
            </Chip>
          )
        )
      }
    }
  }

  render() {
    const loader = (
      <div style={{marginTop: '70px', marginBottom: '50px'}}>
        <Row center="xs">
          <Loader color="#126B6F" size="10px" margin="5px"/>
        </Row>
      </div>
    );

    return (
      <div className="main-content">
        <Header title="Help your college mates by answering their questions."
                type="Interaction"
                parentProps={this.props}
                hasButton={true}
                buttonLabel="Ask a question"/>
        <div style={{marginTop: '20px'}}>
          <Grid>
            <div className="wrap">
              <Row>
                <Col xs={8}>
                  <InfiniteScroll elementIsScrollable={false} hasMore={this.props.interactions.hasMore}
                                  loadingMore={this.props.interactions.loadingMore}
                                  loadMore={() => this.loadMore()} loader={loader}>
                    {this.renderInteractions()}
                  </InfiniteScroll>
                </Col>
                <Col xs={4}>
                  <StickyDiv zIndex={1} offsetTop={65}>
                    <div className="right-content">
                      <MobileTearSheet height={260}>
                        <div>
                          <h4 style={{marginBottom: 5}}>How to ask question?</h4>
                          <ul className="how-to-list" style={{fontSize: 14}}>
                            <li>It is recommended to use formal language while asking a question.</li>
                            <li>Avoid using short forms and extra full stops.</li>
                            <li><span>Use</span>
                              <i className="material-icons" style={{position: 'relative', fontSize: 20, top: '5px'}}>
                                format_bold
                              </i>
                              as stressor.
                            </li>
                            <li>Try to explain your question as much as possible to get answers quickly.</li>
                            <li>
                              Use <code>shift+enter</code> to continue typing in code block.
                            </li>
                          </ul>
                        </div>
                      </MobileTearSheet>
                      <label>Currently Showing</label>
                      <Divider style={{marginTop: 2, marginBottom: 2}}/>
                      <div style={this.styles.wrapper}>
                        {this.renderSelectedTags()}
                      </div>
                      <label>Tags</label>
                      <Divider style={{marginTop: 2, marginBottom: 2}}/>
                      <div style={this.styles.wrapper}>
                        {this.renderTagChips()}
                      </div>
                      <Branding/>
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

export default connect(mapStateToProps, mapDispatchToProps)(InteractionsContainer);