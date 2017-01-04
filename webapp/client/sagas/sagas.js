import {takeEvery, takeLatest, eventChannel} from 'redux-saga';
import {fork, put, call, take} from 'redux-saga/effects';
import {toggleSnackbar} from '../actions/snackbar/index';
import {CREATE_ANNOUNCEMENT_REQUEST, FETCH_ANNOUNCEMENTS_REQUEST} from '../actions/announcements/index';
import {GOOGLE_AUTH, USER_LOGIN_REQUEST, SUBSCRIBE_CHANNEL, UNSUBSCRIBE_CHANNEL} from '../actions/users/index';
import {announcementFormToggle, newAnnouncementAdded, fetchAnnouncementResponse, setAnnouncementCategories} from '../actions/announcements/index';
import {userLoginResponse, subscribeChannel} from '../actions/users/index';
import {HttpHelper, GoogleSignIn} from './apis';
import {showSnackbar} from './utils'
import {
  TAGS_FETCH,
  CREATE_POST_REQUEST,
  FETCH_POSTS_REQUEST,
  FETCH_SINGLE_POST_REQUEST,
  ADD_COMMENT_REQUEST,
  TOGGLE_COMMENT_UPVOTE_REQUEST,
  DELETE_COMMENT_REQUEST,
  TOGGLE_POST_UPVOTE_REQUEST,
  UPDATE_POST_REQUEST,
  DELETE_POST_REQUEST,
  EDIT_COMMENT_REQUEST
} from '../actions/interactions';
import {
  fetchTagsResponse,
  createPostResponse,
  fetchPostsResponse,
  postFormToggle,
  fetchSinglePostResponse,
  addCommentResponse,
  toggleCommentUpvoteResponse,
  deleteCommentResponse,
  togglePostUpvoteResponse,
  updatePostResponse,
  deletePostResponse,
  editCommentResponse
} from '../actions/interactions';
import createWebSocketConnection from './SocketConnection';
import {browserHistory} from 'react-router';

let subscribedChannels = {};

function *createAnnouncement(params) {
  let data = new FormData();
  data.append('category_guid', params.formData.notificationCategory);
  data.append('notification_head', params.formData.notificationHeader);
  data.append('notification_body', params.formData.notificationBody,);
  for (let i = 0; i < params.formData.notificationAttachments.length; i++) {
    data.append('notification_files[]', params.formData.notificationAttachments[i]);
  }

  const response = yield call(
    HttpHelper, `institute/${params.formData.instituteGuid}/notification`, 'POST', data, null
  );

  if (response.status == 200) {
    yield put(announcementFormToggle())
  }
}

function *userAuthentication() {
  const data = {
    email: 'todevs.test@todevs.com',
    password: 'password'
  };

  const response = yield call(HttpHelper, 'login', 'POST', data, null);
  const categories = response.data.user.default_institute.categories;
  yield put(setAnnouncementCategories(categories));
  yield put(userLoginResponse(response.data));
  for (let i in categories) {
    const channelName = `category_${categories[i].category_guid}:new-announcement`;
    yield put(subscribeChannel(channelName, newAnnouncementAdded))
  }
}

function *fetchAnnouncements(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.url_params);
  yield put(fetchAnnouncementResponse(response.data));
}

function *fetchPosts(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.url_params);
  yield put(fetchPostsResponse(response.data));
}

function *fetchTags(params) {
  const response = yield call(HttpHelper, 'tags', 'GET', null, params.url_params);
  yield put(fetchTagsResponse(response.data.tags))
}

function *createPost(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post`, 'POST', params.formData, null
  );

  if (response.status == 200) {
    yield put(postFormToggle())
  }
}

function *googleLogin(params) {
  const response = yield call(HttpHelper, 'google_token', 'POST', params.payload, null);
  if (response.data.user.default_institute) {
    const categories = response.data.user.default_institute.categories;
    yield put(setAnnouncementCategories(categories));
    // subscribe to categories
    for (let i in categories) {
      const channelName = `category_${categories[i].category_guid}:new-announcement`;
      yield put(subscribeChannel(channelName, newAnnouncementAdded))
    }
    // subscribe to posts
    const institute_guid = response.data.user.default_institute.inst_profile_guid;
    yield put(subscribeChannel(`posts_${institute_guid}:new-post`, createPostResponse))
  }
  yield put(userLoginResponse(response.data));
}

function *fetchSinglePostRequest(params) {
  const response = yield call(
    HttpHelper, params.url, 'GET', null, params.url_params
  );
  yield  put(fetchSinglePostResponse(response));
}

function *addComment(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment`, 'POST', params.formData, null
  );
  yield put(addCommentResponse(response.data.comment));

}

function *toggleCommentUpvote(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment/${params.comment.comment_guid}/upvote`, 'POST', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(toggleCommentUpvoteResponse(params.comment, response.data));
}

function *removeComment(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment/${params.comment.comment_guid}`, 'DELETE', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(deleteCommentResponse(params.comment, response.data));
  if (response.data.success) {
    yield put(toggleSnackbar(response.data.success));
  }
}

function *editComment(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment/${params.comment.comment_guid}`, 'PUT', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(editCommentResponse(params.comment, response.data));
}

function *togglePostUpvote(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post/${params.postGuid}/upvote`, 'POST', null, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(togglePostUpvoteResponse(response.data));
}

function *editPost(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post/${params.postGuid}`, 'PUT', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(updatePostResponse(response.data));
}

function *deletePost(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post/${params.postGuid}`, 'DELETE', null, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(deletePostResponse(response.data));
  if (response.data.success) {
    yield put(toggleSnackbar(response.data.success));
    browserHistory.push('/interactions');
  }
}


/*
 Saga watchers beneath this
 */

function *userAuthenticationRequest() {
  yield *takeLatest(USER_LOGIN_REQUEST, userAuthentication);
}

function *watchCreateAnnouncement() {
  yield *takeEvery(CREATE_ANNOUNCEMENT_REQUEST, createAnnouncement);
}

function *watchAnnouncementFetch() {
  yield *takeLatest(FETCH_ANNOUNCEMENTS_REQUEST, fetchAnnouncements);
}

function *watchPostsFetch() {
  yield *takeLatest(FETCH_POSTS_REQUEST, fetchPosts);
}

function *watchTagsRequest() {
  yield *takeLatest(TAGS_FETCH, fetchTags)
}

function *watchCreatePostRequest() {
  yield *takeLatest(CREATE_POST_REQUEST, createPost)
}

function *watchGoogleAuth() {
  yield *takeLatest(GOOGLE_AUTH, googleLogin)
}

function *watchSinglePostFetch() {
  yield *takeLatest(FETCH_SINGLE_POST_REQUEST, fetchSinglePostRequest)
}

function *watchAddComment() {
  yield *takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function *watchToggleCommentUpvote() {
  yield *takeLatest(TOGGLE_COMMENT_UPVOTE_REQUEST, toggleCommentUpvote);
}

function *watchRemoveComment() {
  yield *takeLatest(DELETE_COMMENT_REQUEST, removeComment);
}

function *watchTogglePostUpvote() {
  yield *takeLatest(TOGGLE_POST_UPVOTE_REQUEST, togglePostUpvote);
}

function *watchEditPost() {
  yield *takeLatest(UPDATE_POST_REQUEST, editPost);
}

function *watchEditComment() {
  yield *takeLatest(EDIT_COMMENT_REQUEST, editComment);
}

function *watchDeletePost() {
  yield *takeLatest(DELETE_POST_REQUEST, deletePost);
}

/*
 Socket
 */

function createSocketChannel(socket, channelName) {
  return eventChannel((emit) => {
    const handleEvent = (event) => {
      emit(event)
    };

    socket.on(channelName, handleEvent);
    const unsubscribe = () => {
      socket.off(channelName, handleEvent)
    };

    return unsubscribe
  })
}

function *watchOnSocketEvents(params) {
  const socket = yield call(createWebSocketConnection);
  const socketChannel = yield call(createSocketChannel, socket, params.channelName);
  subscribedChannels[params.channelName] = socketChannel;

  while (true) {
    const payload = yield take(socketChannel);
    yield put(params.nextAction(payload));
    yield call(showSnackbar, payload.message)
  }
}

function *watchChannelSubscription() {
  yield *takeEvery(SUBSCRIBE_CHANNEL, watchOnSocketEvents)
}

function *unsubscribeSocketChannel(params) {
  subscribedChannels[params.channelName].close();
  delete subscribedChannels[params.channelName]
}

function *watchChannelUnsubscribe() {
  yield *takeEvery(UNSUBSCRIBE_CHANNEL, unsubscribeSocketChannel)
}

export default function *rootSaga() {
  yield [
    fork(watchGoogleAuth),
    fork(userAuthenticationRequest),
    fork(watchCreateAnnouncement),
    fork(watchCreatePostRequest),
    fork(watchAnnouncementFetch),
    fork(watchPostsFetch),
    fork(watchTagsRequest),
    fork(watchChannelSubscription),
    fork(watchChannelUnsubscribe),
    fork(watchSinglePostFetch),
    fork(watchAddComment),
    fork(watchToggleCommentUpvote),
    fork(watchRemoveComment),
    fork(watchTogglePostUpvote),
    fork(watchEditPost),
    fork(watchEditComment),
    fork(watchDeletePost),
  ]
}