import {takeEvery, takeLatest} from 'redux-saga';
import {fork, put, call, select} from 'redux-saga/effects';

import * as userActions from '../../actions/users/index';
import {toggleSnackbar} from '../../actions/commons/index';
import * as interactionsActions from '../../actions/interactions/index';

import {HttpHelper} from '../utils/apis';
import * as selectors from '../../reducers/selectors';
import {hashHistory} from 'react-router';

function *fetchPosts(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.url_params);
  yield put(interactionsActions.fetchPostsResponse(response.data));
}

function *fetchTags(params) {
  const response = yield call(HttpHelper, 'tags', 'GET', null, params.url_params);
  yield put(interactionsActions.fetchTagsResponse(response.data.tags))
}

function *addTags(params) {
  const response = yield call(
    HttpHelper, 'tags', 'POST', params.formData, null
  );
}

function *createPost(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post`, 'POST', params.formData, null
  );

  if (response.status === 200) {
    yield put(interactionsActions.postFormToggle())
  }
  else {
    yield put(toggleErrorDialog());
  }
}

function *fetchSinglePostRequest(params) {
  const {postGuid, instituteGuid, url_params} = params;
  const url = `institute/${instituteGuid}/post/${postGuid}`;
  const response = yield call(
    HttpHelper, url, 'GET', null, url_params
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.fetchSinglePostResponse(response.data));
  if (!response.data.error) {
    yield put(userActions.subscribeChannel(`post_${postGuid}:post-update`,
      interactionsActions.postUpdate));
    yield put(userActions.subscribeChannel(`post_${postGuid}:comment-update`,
      interactionsActions.commentUpdate));

  }
}

function *addComment(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment`, 'POST', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.addCommentResponse());

}

function *toggleCommentUpvote(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment/${params.comment.comment_guid}/upvote`, 'POST', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.toggleCommentUpvoteResponse(params.comment, response.data));
}

function *removeComment(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment/${params.comment.comment_guid}`, 'DELETE', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.deleteCommentResponse(params.comment, response.data));
}

function *editComment(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment/${params.comment.comment_guid}`, 'PUT', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.editCommentResponse(params.comment, response.data));
}

function *commentUpdate(params) {
  if (params.commentUpdates.type !== 'deleted-comment') {
    const institute_guid = {institute_guid: params.commentUpdates.institute_guid};
    const response = yield call(
      HttpHelper,
      `post/${params.commentUpdates.post_guid}/comment/${params.commentUpdates.comment_guid}`,
      'GET', null, institute_guid
    );
    yield put(interactionsActions.fetchSingleCommentResponse(response.data.comment));
  }
}

function *togglePostUpvote(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post/${params.postGuid}/upvote`, 'POST', null, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.togglePostUpvoteResponse(response.data));
}

function *editPost(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post/${params.postGuid}`, 'PUT', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.updatePostResponse());
}

function *deletePost(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post/${params.postGuid}`, 'DELETE', null, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.deletePostResponse(response.data));
  if (response.data.success) {
    yield put(toggleSnackbar(response.data.success));
    hashHistory.push('/interactions');
  }
}

function *handleTabChange(params) {
  const post = yield select(selectors.getSelectedPost);
  if (post) {
    if (!params.payload.pathname.match(`/\/interactions\/${post.post_guid}.+/`)
      && params.payload.action !== 'REPLACE') {
      yield put(userActions.unsubscribeChannel(`post_${post.post_guid}:post-update`));
      yield put(userActions.unsubscribeChannel(`post_${post.post_guid}:comment-update`));
      yield put(interactionsActions.clearSinglePost(post.post_guid));
    }
  }
}

/*
 Watchers
 */

function *watchPostsFetch() {
  yield *takeLatest(interactionsActions.FETCH_POSTS_REQUEST, fetchPosts);
}

function *watchTagsRequest() {
  yield *takeLatest(interactionsActions.TAGS_FETCH, fetchTags);
}

function *watchAddCustomTag() {
  yield *takeLatest(interactionsActions.TAG_ADD, addTags);
}

function *watchCreatePostRequest() {
  yield *takeLatest(interactionsActions.CREATE_POST_REQUEST, createPost);
}

function *watchSinglePostFetch() {
  yield *takeLatest(interactionsActions.FETCH_SINGLE_POST_REQUEST, fetchSinglePostRequest)
}

function *watchAddComment() {
  yield *takeLatest(interactionsActions.ADD_COMMENT_REQUEST, addComment);
}

function *watchToggleCommentUpvote() {
  yield *takeLatest(interactionsActions.TOGGLE_COMMENT_UPVOTE_REQUEST, toggleCommentUpvote);
}

function *watchRemoveComment() {
  yield *takeLatest(interactionsActions.DELETE_COMMENT_REQUEST, removeComment);
}

function *watchTogglePostUpvote() {
  yield *takeLatest(interactionsActions.TOGGLE_POST_UPVOTE_REQUEST, togglePostUpvote);
}

function *watchEditPost() {
  yield *takeLatest(interactionsActions.UPDATE_POST_REQUEST, editPost);
}

function *watchEditComment() {
  yield *takeLatest(interactionsActions.EDIT_COMMENT_REQUEST, editComment);
}

function *watchDeletePost() {
  yield *takeLatest(interactionsActions.DELETE_POST_REQUEST, deletePost);
}

function *watchCommentUpdate() {
  yield *takeEvery(interactionsActions.COMMENT_UPDATE, commentUpdate);
}

function *watchTabChange() {
  yield *takeLatest('@@router/LOCATION_CHANGE', handleTabChange);
}

export default function *interactionSaga() {
  yield [
    fork(watchCreatePostRequest),
    fork(watchPostsFetch),
    fork(watchTagsRequest),
    fork(watchAddCustomTag),
    fork(watchSinglePostFetch),
    fork(watchAddComment),
    fork(watchToggleCommentUpvote),
    fork(watchRemoveComment),
    fork(watchTogglePostUpvote),
    fork(watchEditPost),
    fork(watchEditComment),
    fork(watchDeletePost),
    fork(watchCommentUpdate),
    fork(watchTabChange)
  ]
}
