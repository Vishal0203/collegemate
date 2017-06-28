import {takeLatest} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';
import * as userActions from '../../actions/users/index';
import * as announcementActions from '../../actions/announcements/index';
import * as interactionsActions from '../../actions/interactions/index';
import * as notificationActions from '../../actions/notifications/index';
import {toggleErrorDialog, toggleSnackbar, FEEDBACK_SUBMIT_REQUEST} from '../../actions/commons/index';
import {HttpHelper} from '../utils/apis';
import * as selectors from '../../reducers/selectors';
import {hashHistory} from 'react-router';

function *loadUserData(response) {
  const subscribed_categories = response.data.user.default_institute.subscriptions;
  yield put(announcementActions.setAnnouncementCategories(subscribed_categories));
  // subscribe to categories
  for (let i in subscribed_categories) {
    const channelName = `category_${subscribed_categories[i].category_guid}:announcement-updates`;
    yield put(userActions.subscribeChannel(channelName, announcementActions.announcementUpdates));
  }
  // subscribe to posts
  const institute_guid = response.data.user.default_institute.inst_profile_guid;
  yield put(userActions.subscribeChannel(`posts_${institute_guid}:new-post`, interactionsActions.createPostResponse));

  const {member_id, designation, invitation_status} = response.data.user.default_institute.user_institute_info[0];
  if (!(member_id && designation)) {
    hashHistory.replace('/settings');
    yield put(toggleSnackbar('Please update your member id and designation.'));
  }
  if (invitation_status === 'pending') {
    hashHistory.replace('/settings');
    yield put(toggleSnackbar('Your account is pending approval from your institute.'));
  }
}

function *handleAuthResponse(response) {
  // subscribe to notifications
  const user_guid = response.data.user.user_guid;
  yield put(userActions.subscribeChannel(`private-users_${user_guid}:new-notification`, notificationActions.newNotification));
  if (response.data.user.default_institute) {
    yield call(loadUserData, response);
    hashHistory.replace('/announcements');
  }
  else {
    yield put(toggleSnackbar('Please Select an Institute'));
    hashHistory.replace('/institute');
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

  switch (response.status) {
    case 200:
      yield put(userActions.updateUserProfileResponse(response.data.user));
      yield put(toggleSnackbar('Your profile has been updated.'));
      break;
    case 403:
      yield put(toggleSnackbar(response.data.error));
      break;
    default:
      yield put(toggleErrorDialog());
      break;
  }
}

function *logoutUser() {
  const response = yield call(HttpHelper, 'logout', 'GET', null, null);
  if (response.status === 200) {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    GoogleAuth.signOut();
    yield put(userActions.userLogoutResponse());
    hashHistory.push('/login');
  }
  else {
    yield put(toggleErrorDialog());
  }
}

function *createAnnouncementCategory(params) {
  const selected_institute = yield select(selectors.selected_institute);
  const institute_guid = selected_institute.inst_profile_guid;
  const response = yield call(HttpHelper, `institute/${institute_guid}/category`, 'POST', params.category, null);
  if (response.status === 200) {
    yield put(userActions.createAnnouncementCategoryResponse(response.data.category));
    const selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));

    const channelName = `category_${response.data.category.category_guid}:announcement-updates`;
    yield put(userActions.subscribeChannel(channelName, announcementActions.announcementUpdates));

    yield put(announcementActions.reloadAnnouncements());
    yield put(toggleSnackbar(`New announcement category ${response.data.category.category_type} has been created.`));
  }
  else {
    yield put(toggleErrorDialog());
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

  if (response.status === 200) {
    yield put(userActions.removeAnnouncementCategoryResponse(params.category_guid));
    selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));
  }
  else {
    yield put(toggleErrorDialog());
  }
  yield put(toggleSnackbar(response.data.message))
}

function *handleFeedbackSubmit(params) {
  let formData = new FormData();
  formData.append('type', params.data.type);
  formData.append('feedback_message', params.data.feedback_message);
  formData.append('feedback_attachment', params.data.feedback_attachment[0]);

  const response = yield call(HttpHelper, 'feedback', 'POST', formData, null);
  if (response.status === 200) {
    yield put(toggleSnackbar(response.data.success));
  }
}

function *inviteStaffMember(params) {
  let selected_institute = yield select(selectors.selected_institute);
  const institute_guid = selected_institute.inst_profile_guid;
  const formData = {...params.staffMembers};
  let response;
  if (formData.hasFile === true) {
    let data = new FormData();
    data.append('bulk_invite_file', formData.bulk_invite_file);
    response = yield call(HttpHelper, `institute/${institute_guid}/invitation/bulk_invite`, 'POST', data, null);
  } else {
    response = yield call(HttpHelper, `institute/${institute_guid}/staff/add_staff`, 'POST', formData.invite_data, null);
  }
  if (response.status === 200) {
    yield put(toggleSnackbar(response.data.Response));
  } else {
    yield put(toggleSnackbar(response.data.ErrorResponse));
  }
}

function *changeInstiute(params) {
  const query = {institute_guid: params.institute_guid};
  const response = yield call(HttpHelper, 'change_institute', 'GET', null, query);
  if (response.status === 200) {
    yield call(loadUserData, response);
    yield put(toggleSnackbar('Institute Changed'));
    yield put(userActions.selectedInstituteChanged(response.data));
  }
  else {
    yield put(toggleErrorDialog());
  }
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

function *watchFeedbackSubmit() {
  yield *takeLatest(FEEDBACK_SUBMIT_REQUEST, handleFeedbackSubmit)
}


function *watchInviteStaffMember() {
  yield *takeLatest(userActions.STAFF_ADD_REQUEST, inviteStaffMember)
}

function *watchInstituteChangeRequest() {
  yield *takeLatest(userActions.CHANGE_SELECTED_INSTITUTE_REQUEST, changeInstiute)
}

export default function *userSaga() {
  yield [
    fork(watchGoogleAuth),
    fork(watchUserLogout),
    fork(userAuthenticationRequest),
    fork(watchProfileUpdate),
    fork(watchCreateAnnouncementCategory),
    fork(watchDeleteAnnouncementCategory),
    fork(watchFeedbackSubmit),
    fork(watchInviteStaffMember),
    fork(watchInstituteChangeRequest)
  ]
}
