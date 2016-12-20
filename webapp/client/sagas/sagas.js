import {takeEvery, takeLatest, eventChannel} from 'redux-saga';
import {fork, put, call, take} from 'redux-saga/effects';
import {CREATE_ANNOUNCEMENT_REQUEST, FETCH_ANNOUNCEMENTS_REQUEST} from '../actions/announcements/index';
import {USER_LOGIN_REQUEST, SUBSCRIBE_CHANNEL} from '../actions/users/index';
import {TAGS_FETCH, CREATE_POST_REQUEST, FETCH_POSTS_REQUEST} from '../actions/interactions/index';
import {announcementFormToggle, newAnnouncementAdded, fetchAnnouncementResponse, setAnnouncementCategories} from '../actions/announcements/index';
import {userLoginResponse, subscribeChannel} from '../actions/users/index';
import {HttpHelper} from './apis';
import {showSnackbar} from './utils'
import {fetchTagsResponse, createPostResponse, fetchPostsResponse} from '../actions/interactions/index'
import createWebSocketConnection from './SocketConnection';

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

  yield put(createPostResponse(response.data.post));
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

  while (true) {
    const payload = yield take(socketChannel);
    yield put(params.nextAction(payload));
    yield call(showSnackbar, payload.message)
  }
}

function *watchChannelSubscription() {
  yield *takeEvery(SUBSCRIBE_CHANNEL, watchOnSocketEvents)
}

export default function *rootSaga() {
  yield [
    fork(userAuthenticationRequest),
    fork(watchCreateAnnouncement),
    fork(watchCreatePostRequest),
    fork(watchAnnouncementFetch),
    fork(watchPostsFetch),
    fork(watchTagsRequest),
    fork(watchChannelSubscription)
  ]
}