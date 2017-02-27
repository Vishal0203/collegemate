import {takeEvery, takeLatest, eventChannel} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';

import {toggleSnackbar} from '../../actions/snackbar/index';
import * as userActions from '../../actions/users/index';
import * as announcementActions from '../../actions/announcements/index';
import * as interactionsActions from '../../actions/interactions/index';
import * as notificationActions from '../../actions/notifications/index';

import {HttpHelper} from '../utils/apis';
import * as selectors from '../../reducers/selectors';
import {hashHistory} from 'react-router';

function *handleAuthResponse(response) {
  // subscribe to notifications
  const user_guid = response.data.user.user_guid;
  yield put(userActions.subscribeChannel(`private-users_${user_guid}:new-notification`, notificationActions.newNotification));

  if (response.data.user.default_institute) {
    const subscribed_categories = response.data.user.default_institute.subscriptions;
    yield put(announcementActions.setAnnouncementCategories(subscribed_categories));
    // subscribe to categories
    for (let i in subscribed_categories) {
      const channelName = `category_${subscribed_categories[i].category_guid}:new-announcement`;
      yield put(userActions.subscribeChannel(channelName, announcementActions.newAnnouncementAdded));
    }
    // subscribe to posts
    const institute_guid = response.data.user.default_institute.inst_profile_guid;
    yield put(userActions.subscribeChannel(`posts_${institute_guid}:new-post`, interactionsActions.createPostResponse));

    const member_id = response.data.user.default_institute.user_institute_info[0].member_id;
    const designation = response.data.user.default_institute.user_institute_info[0].designation;
    if (!(member_id && designation)) {
      hashHistory.replace('/settings');
      yield put(toggleSnackbar('Please update your member id and designation.'));
    }
  }
  else {
    hashHistory.replace('/institute');
    yield put(toggleSnackbar('Please Select an Institute'));
  }

  yield put(userActions.userLoginResponse(response.data));
}

function *userAuthentication() {
  const data = {
    email: 'todevs.test@todevs.com',
    password: 'password'
  };

  const response = yield call(HttpHelper, 'login', 'POST', data, null);
  yield call(handleAuthResponse, response);
}

function *googleLogin(params) {
  const response = yield call(HttpHelper, 'google_token', 'POST', params.payload, null);
  yield call(handleAuthResponse, response);
}

function *updateUserProfile(params) {
  const selected_institute = yield select(selectors.selected_institute);
  const formData = {...params.profileData, institute_guid: selected_institute.inst_profile_guid};
  const response = yield call(HttpHelper, 'update_profile', 'POST', formData, null);
  if (response.status == 200) {
    yield put(userActions.updateUserProfileResponse(response.data.user));
    yield put(toggleSnackbar('Your profile has been updated.'));
  }
}

function *logoutUser() {
  const response = yield call(HttpHelper, 'logout', 'GET', null, null);
  if (response.status == 200) {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    GoogleAuth.signOut();
    yield put(userActions.userLogoutResponse());
    hashHistory.push('/login');
  }
}

function *createAnnouncementCategory(params) {
  const selected_institute = yield select(selectors.selected_institute);
  const institute_guid = selected_institute.inst_profile_guid;
  const response = yield call(HttpHelper, `institute/${institute_guid}/category`, 'POST', params.category, null);
  if (response.status == 200) {
    yield put(userActions.createAnnouncementCategoryResponse(response.data.category));
    const selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));

    const channelName = `category_${response.data.category.category_guid}:new-announcement`;
    yield put(userActions.subscribeChannel(channelName, announcementActions.newAnnouncementAdded));

    yield put(announcementActions.reloadAnnouncements());
    yield put(toggleSnackbar(`New announcement category ${response.data.category.category_type} has been created.`));
  }
}

function *removeAnnouncementCategory(params) {
  let selected_institute = yield select(selectors.selected_institute);
  const institute_guid = selected_institute.inst_profile_guid;
  const response = yield call(
    HttpHelper,
    `institute/${institute_guid}/category/${params.category_guid}`,
    'DELETE',
    null,
    null
  );

  if (response.status == 200) {
    yield put(userActions.removeAnnouncementCategoryResponse(params.category_guid));
    selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));
  }
  yield put(toggleSnackbar(response.data.message))
}

/*
 Watchers
 */

function *userAuthenticationRequest() {
  yield *takeLatest(userActions.USER_LOGIN_REQUEST, userAuthentication);
}

function *watchGoogleAuth() {
  yield *takeLatest(userActions.GOOGLE_AUTH, googleLogin);
}

function *watchUserLogout() {
  yield *takeLatest(userActions.USER_LOGOUT_REQUEST, logoutUser);
}

function *watchProfileUpdate() {
  yield *takeLatest(userActions.UPDATE_USER_PROFILE_REQUEST, updateUserProfile)
}

function *watchCreateAnnouncementCategory() {
  yield *takeLatest(userActions.CREATE_ANNOUNCEMENT_CATEGORY_REQUEST, createAnnouncementCategory)
}

function *watchDeleteAnnouncementCategory() {
  yield *takeLatest(userActions.REMOVE_ANNOUNCEMENT_CATEGORY_REQUEST, removeAnnouncementCategory)
}

export default function *userSaga() {
  yield [
    fork(watchGoogleAuth),
    fork(watchUserLogout),
    fork(userAuthenticationRequest),
    fork(watchProfileUpdate),
    fork(watchCreateAnnouncementCategory),
    fork(watchDeleteAnnouncementCategory),
  ]
}
