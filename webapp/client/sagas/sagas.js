import {takeEvery, takeLatest} from 'redux-saga';
import {CREATE_ANNOUNCEMENT_REQUEST, FETCH_ANNOUNCEMENTS_REQUEST} from '../actions/announcements';
import {USER_LOGIN_REQUEST} from '../actions/users';
import {TAGS_FETCH, CREATE_POST_REQUEST, FETCH_POSTS_REQUEST} from '../actions/interactions';
import {fork, put, call} from 'redux-saga/effects';
import {createAnnouncementResponse, fetchAnnouncementResponse} from '../actions/announcements';
import {userLoginResponse} from '../actions/users/index';
import {HttpHelper} from './apis';
import {toggleSnackbar} from '../actions/snackbar/index'
import {fetchTagsResponse, createPostResponse, fetchPostsResponse} from '../actions/interactions'

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
  yield put(createAnnouncementResponse(response.data.notification, params.filters));
  yield put(toggleSnackbar(`Announcement posted in ${response.data.notification.category.category_type}`));
}

function *userAuthentication() {
  const data = {
    email: 'todevs.test@todevs.com',
    password: 'password'
  };

  const response = yield call(HttpHelper, 'login', 'POST', data, null);
  yield put(userLoginResponse(response.data));
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

export default function *rootSaga() {
  yield [
    fork(userAuthenticationRequest),
    fork(watchCreateAnnouncement),
    fork(watchCreatePostRequest),
    fork(watchAnnouncementFetch),
    fork(watchPostsFetch),
    fork(watchTagsRequest)
  ]
}