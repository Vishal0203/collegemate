import {takeEvery, takeLatest, eventChannel} from 'redux-saga';
import {fork, put, call, take, select} from 'redux-saga/effects';

import * as userActions from '../actions/users/index';
import {toggleSnackbar} from '../actions/snackbar/index';
import * as announcementActions from '../actions/announcements/index';
import * as interactionsActions from '../actions/interactions/index';

import {HttpHelper} from './apis';
import {showSnackbar} from './utils'
import createWebSocketConnection from './SocketConnection';
import * as selectors from '../reducers/selectors';
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
    yield put(announcementActions.announcementFormToggle())
  }
}

function *userAuthentication() {
  const data = {
    email: 'todevs.test@todevs.com',
    password: 'password'
  };

  const response = yield call(HttpHelper, 'login', 'POST', data, null);
  if (response.data.user.default_institute) {
    const subscribed_categories = response.data.user.default_institute.subscriptions;
    yield put(announcementActions.setAnnouncementCategories(subscribed_categories));
    // subscribe to categories
    for (let i in subscribed_categories) {
      const channelName = `category_${subscribed_categories[i].category_guid}:new-announcement`;
      yield put(userActions.subscribeChannel(channelName, announcementActions.newAnnouncementAdded))
    }
    // subscribe to posts
    const institute_guid = response.data.user.default_institute.inst_profile_guid;
    yield put(userActions.subscribeChannel(`posts_${institute_guid}:new-post`, interactionsActions.createPostResponse))
  }
  yield put(userActions.userLoginResponse(response.data));
  const member_id = response.data.user.default_institute.user_institute_info[0].member_id;
  const designation = response.data.user.default_institute.user_institute_info[0].designation;
  if (!(member_id && designation)) {
    browserHistory.replace('/settings');
    yield put(toggleSnackbar('Please update your member id and designation.'));
  }
}

function *fetchAnnouncements(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.url_params);
  yield put(announcementActions.fetchAnnouncementResponse(response.data));
}

function *fetchPosts(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.url_params);
  yield put(interactionsActions.fetchPostsResponse(response.data));
}

function *fetchTags(params) {
  const response = yield call(HttpHelper, 'tags', 'GET', null, params.url_params);
  yield put(interactionsActions.fetchTagsResponse(response.data.tags))
}

function *createPost(params) {
  const response = yield call(
    HttpHelper, `institute/${params.instituteGuid}/post`, 'POST', params.formData, null
  );

  if (response.status == 200) {
    yield put(interactionsActions.postFormToggle())
  }
}

function *googleLogin(params) {
  const response = yield call(HttpHelper, 'google_token', 'POST', params.payload, null);
  if (response.data.user.default_institute) {
    const subscribed_categories = response.data.user.default_institute.subscriptions;
    yield put(announcementActions.setAnnouncementCategories(subscribed_categories));
    // subscribe to categories
    for (let i in subscribed_categories) {
      const channelName = `category_${subscribed_categories[i].category_guid}:new-announcement`;
      yield put(userActions.subscribeChannel(channelName, announcementActions.newAnnouncementAdded))
    }
    // subscribe to posts
    const institute_guid = response.data.user.default_institute.inst_profile_guid;
    yield put(userActions.subscribeChannel(`posts_${institute_guid}:new-post`, interactionsActions.createPostResponse))
  }
  yield put(userActions.userLoginResponse(response.data));
  const member_id = response.data.user.default_institute.user_institute_info[0].member_id;
  const designation = response.data.user.default_institute.user_institute_info[0].designation;
  if (!(member_id && designation)) {
    browserHistory.replace('/settings');
    yield put(toggleSnackbar('Please update your member id and designation.'));
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
    yield put(userActions.subscribeChannel(`post_${postGuid}:post-update`, interactionsActions.fetchSinglePostResponse))
  }
}

function *addComment(params) {
  const response = yield call(
    HttpHelper, `post/${params.postGuid}/comment`, 'POST', params.formData, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  yield put(interactionsActions.addCommentResponse(response.data.comment));

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
  yield put(interactionsActions.editCommentResponse(params.comment, response.data));
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
  yield put(interactionsActions.updatePostResponse(response.data));
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
    browserHistory.push('/interactions');
  }
}

function *logoutUser() {
  const response = yield call(HttpHelper, 'logout', 'GET', null, null);
  if (response.status == 200) {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    GoogleAuth.signOut();
    yield put(userActions.userLogoutResponse());
    browserHistory.push('/login');
  }
}

function *handleTabChange(params) {
  if (!params.payload.pathname.match(/\/interactions\/.+/)) {
    const post = yield select(selectors.getSelectedPost);
    if (post) {
      yield put(userActions.unsubscribeChannel(`post_${post.post_guid}:post-update`));
    }
  }
}

function *updateUserProfile(params) {
  const selected_institute = yield select(selectors.selected_institute);
  const formData = {...params.profileData, institute_guid: selected_institute.institute_guid};
  const response = yield call(HttpHelper, 'update_profile', 'POST', formData, null);
  if (response.status == 200) {
    yield put(userActions.updateUserProfileResponse(response.data.user));
    yield put(toggleSnackbar('Your profile has been updated.'));
  }
}

function *subscribeAnnouncement(params) {
  const response = yield call(HttpHelper, `category/${params.category}/subscribe`, 'POST', null, null);
  if (response.status == 200) {
    yield put(userActions.subscribeAnnouncementResponse(response.data.category));
    const selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));

    const channelName = `category_${response.data.category.category_guid}:new-announcement`;
    yield put(userActions.subscribeChannel(channelName, announcementActions.newAnnouncementAdded));

    yield put(toggleSnackbar(`You are subscribed to ${response.data.category.category_type}`));
  }
}

function *unsubscribeAnnouncement(params) {
  const response = yield call(HttpHelper, `category/${params.category}/unsubscribe`, 'POST', null, null);
  if (response.status == 200) {
    yield put(userActions.unsubscribeAnnouncementResponse(response.data.category));
    const selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));

    const channelName = `category_${response.data.category.category_guid}:new-announcement`;
    yield put(userActions.unsubscribeChannel(channelName));

    yield put(toggleSnackbar(`You unsubscribed to ${response.data.category.category_type}`));
  }
}

/*
 Saga watchers beneath this
 */

function *userAuthenticationRequest() {
  yield *takeLatest(userActions.USER_LOGIN_REQUEST, userAuthentication);
}

function *watchCreateAnnouncement() {
  yield *takeEvery(announcementActions.CREATE_ANNOUNCEMENT_REQUEST, createAnnouncement);
}

function *watchAnnouncementFetch() {
  yield *takeLatest(announcementActions.FETCH_ANNOUNCEMENTS_REQUEST, fetchAnnouncements);
}

function *watchPostsFetch() {
  yield *takeLatest(interactionsActions.FETCH_POSTS_REQUEST, fetchPosts);
}

function *watchTagsRequest() {
  yield *takeLatest(interactionsActions.TAGS_FETCH, fetchTags);
}

function *watchCreatePostRequest() {
  yield *takeLatest(interactionsActions.CREATE_POST_REQUEST, createPost);
}

function *watchGoogleAuth() {
  yield *takeLatest(userActions.GOOGLE_AUTH, googleLogin);
}

function *watchUserLogout() {
  yield *takeLatest(userActions.USER_LOGOUT_REQUEST, logoutUser);
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

function *watchTabChange() {
  yield *takeLatest('@@router/LOCATION_CHANGE', handleTabChange);
}

function *watchProfileUpdate() {
  yield *takeLatest(userActions.UPDATE_USER_PROFILE_REQUEST, updateUserProfile)
}

function *watchAnnouncementChannelSubscribe() {
  yield *takeEvery(userActions.SUBSCRIBE_ANNOUNCEMNET_REQUEST, subscribeAnnouncement)
}

function *watchAnnouncementChannelUnsubscribe() {
  yield *takeEvery(userActions.UNSUBSCRIBE_ANNOUNCEMNET_REQUEST, unsubscribeAnnouncement)
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
  yield *takeEvery(userActions.SUBSCRIBE_CHANNEL, watchOnSocketEvents)
}

function *unsubscribeSocketChannel(params) {
  subscribedChannels[params.channelName].close();
  delete subscribedChannels[params.channelName]
}

function *watchChannelUnsubscribe() {
  yield *takeEvery(userActions.UNSUBSCRIBE_CHANNEL, unsubscribeSocketChannel)
}

export default function *rootSaga() {
  yield [
    fork(watchGoogleAuth),
    fork(watchUserLogout),
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
    fork(watchTabChange),
    fork(watchProfileUpdate),
    fork(watchAnnouncementChannelSubscribe),
    fork(watchAnnouncementChannelUnsubscribe)
  ]
}