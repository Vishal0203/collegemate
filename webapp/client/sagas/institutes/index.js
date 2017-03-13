import {takeEvery, takeLatest, eventChannel} from 'redux-saga';
import {put, call, fork} from 'redux-saga/effects';

import {toggleSnackbar} from '../../actions/commons/index';
import * as instituteActions from '../../actions/institutes/index';
import * as userActions from '../../actions/users/index';
import * as announcementActions from '../../actions/announcements/index';
import * as interactionsActions from '../../actions/interactions/index';
import * as notificationActions from '../../actions/notifications/index';

import {HttpHelper} from '../utils/apis';
import {hashHistory} from 'react-router';

function *fetchInstituteList() {
  const response = yield call(HttpHelper, 'institutes', 'GET', null, null);
  if (response.status === 200) {
    yield put(instituteActions.fetchInstituteResponse(response.data.institutes))
  }
  else {
    yield put(toggleErrorDialog());
  }
}

function *registerToInstitute(params) {
  const response = yield call(HttpHelper, `institute/${params.institute_guid}/register`, 'POST', null, null);
  if (response.status === 200) {
    yield put(userActions.setSelectedInstitute(response.data.user));

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

    // subscribe to notifications
    const user_guid = response.data.user.user_guid;
    yield put(userActions.subscribeChannel(`private-users_${user_guid}:new-notification`, notificationActions.newNotification));

    const member_id = response.data.user.default_institute.user_institute_info[0].member_id;
    const designation = response.data.user.default_institute.user_institute_info[0].designation;
    if (!(member_id && designation)) {
      hashHistory.replace('/settings');
      yield put(toggleSnackbar('Please update your member id and designation.'));
    }
    else {
      hashHistory.replace('/');
    }
  }
  else {
    yield put(toggleErrorDialog());
  }
}

function *createInstitute(params) {
  const response = yield call(HttpHelper, 'institutes', 'POST', params.formData, null);
  if(response.status === 200) {
    yield put(userActions.setSelectedInstitute(response.data.user));

    const member_id = response.data.user.default_institute.user_institute_info[0].member_id;
    const designation = response.data.user.default_institute.user_institute_info[0].designation;
    if (!(member_id && designation)) {
      hashHistory.replace('/settings');
      yield put(toggleSnackbar('Please update your member id and designation.'));
    }
  }
  else {
    yield put(toggleErrorDialog());
  }
}

/*
Watchers
*/

function *watchFetchInstituteListRequest() {
  yield *takeLatest(instituteActions.FETCH_INSTITUTE_LIST_REQUEST, fetchInstituteList)
}

function *watchSelectInstituteRequest() {
  yield *takeLatest(instituteActions.SELECT_INSTITUTE_REQUEST, registerToInstitute)
}

function *watchCreateInstituteRequest() {
  yield *takeLatest(instituteActions.CREATE_INSTITUTE_REQUEST, createInstitute)
}

export default function *instituteSaga() {
  yield [
    fork(watchFetchInstituteListRequest),
    fork(watchSelectInstituteRequest),
    fork(watchCreateInstituteRequest)
  ]
}