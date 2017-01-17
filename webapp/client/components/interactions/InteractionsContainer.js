import React, {Component} from 'react';
import Header from '../Header';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loader from 'halogen/ScaleLoader';
import {Grid, Row, Col} from 'react-flexbox-grid';
import InfiniteScroll from 'redux-infinite-scroll';
import StickyDiv from 'react-stickydiv';
import * as interactionActions  from '../../actions/interactions/index';
import InteractionPost from './InteractionPost';
import {toggleSnackbar} from '../../actions/snackbar'

class InteractionsContainer extends Component {

  constructor(props) {
    super(props);
    this.props.actions.fetchTags({type: 'posts'});
  }

  loadMore() {
    if (Object.keys(this.props.auth_user.user).length != 0) {
      const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
      let url = `institute/${institute_guid}/post`;
      if (this.props.interactions.nextPageUrl) {
        url = this.props.interactions.nextPageUrl;
        this.props.actions.fetchPostsRequest(url, {skip: this.props.interactions.skip})
      } else {
        this.props.actions.fetchPostsRequest(url, null)
      }
    }
  }

  renderInteractions() {
    return this.props.interactions.items.posts.map((post, i) =>
      <InteractionPost key={i} parentProps={this.props} post={post} />
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(InteractionsContainer);
