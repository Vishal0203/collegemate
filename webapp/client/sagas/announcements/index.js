import {takeEvery, takeLatest, eventChannel} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';

import * as userActions from '../../actions/users/index';
import {toggleSnackbar} from '../../actions/commons/index';
import {toggleErrorDialog} from '../../actions/commons/index';
import * as announcementActions from '../../actions/announcements/index';

import {HttpHelper} from '../utils/apis';
import * as selectors from '../../reducers/selectors';
import {hashHistory} from 'react-router';

function *createAnnouncement(params) {
  let data = new FormData();
  data.append('category_guid', params.formData.notificationCategory);
  data.append('notification_head', params.formData.notificationHeader);
  data.append('notification_body', params.formData.notificationBody);
  if (params.formData.eventDate) {
    data.append('event_date', params.formData.eventDate);
  }
  for (let i = 0; i < params.formData.notificationAttachments.length; i++) {
    data.append('notification_files[]', params.formData.notificationAttachments[i]);
  }
  const response = yield call(
    HttpHelper, `institute/${params.formData.instituteGuid}/notification`, 'POST', data, null
  );

  if (response.status == 200) {
    yield put(announcementActions.announcementFormToggle())
  }
  else {
    yield put(toggleErrorDialog());
  }
}

function *fetchAnnouncements(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.url_params);
  yield put(announcementActions.fetchAnnouncementResponse(response.data));
}

function *fetchSingleAnnouncement(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, null);
  yield put(announcementActions.fetchSingleAnnouncementResponse(response.data));
}

function *fetchEvents(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.url_params);
  yield put(announcementActions.fetchEventsResponse(response.data));
}


function *subscribeAnnouncement(params) {
  const response = yield call(HttpHelper, `category/${params.category}/subscribe`, 'POST', null, null);
  if (response.status === 200) {
    yield put(userActions.subscribeAnnouncementResponse(response.data.category));
    const selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));

    const channelName = `category_${response.data.category.category_guid}:new-announcement`;
    yield put(userActions.subscribeChannel(channelName, announcementActions.newAnnouncementAdded));

    yield put(announcementActions.reloadAnnouncements());
    yield put(toggleSnackbar(`You are subscribed to ${response.data.category.category_type}`));
  }
  else {
    yield put(toggleErrorDialog());
  }
}

function *unsubscribeAnnouncement(params) {
  const response = yield call(HttpHelper, `category/${params.category}/unsubscribe`, 'POST', null, null);
  if (response.status === 200) {
    yield put(userActions.unsubscribeAnnouncementResponse(response.data.category));
    const selected_institute = yield select(selectors.selected_institute);
    yield put(announcementActions.setAnnouncementCategories(selected_institute.subscriptions));

    const channelName = `category_${response.data.category.category_guid}:new-announcement`;
    yield put(userActions.unsubscribeChannel(channelName));

    yield put(announcementActions.reloadAnnouncements());
    yield put(toggleSnackbar(`You unsubscribed to ${response.data.category.category_type}`));
  }
  else {
    yield put(toggleErrorDialog());
  }
}

/*
Watchers
 */

function *watchCreateAnnouncement() {
  yield *takeEvery(announcementActions.CREATE_ANNOUNCEMENT_REQUEST, createAnnouncement);
}

function *watchAnnouncementFetch() {
  yield *takeLatest(announcementActions.FETCH_ANNOUNCEMENTS_REQUEST, fetchAnnouncements);
}

function *watchSingleAnnouncementFetch() {
  yield *takeLatest(announcementActions.FETCH_SINGLE_ANNOUNCEMENT_REQUEST, fetchSingleAnnouncement)
}

function *watchEventsFetch() {
  yield *takeLatest(announcementActions.FETCH_EVENTS_REQUEST, fetchEvents);
}

function *watchAnnouncementChannelSubscribe() {
  yield *takeEvery(userActions.SUBSCRIBE_ANNOUNCEMNET_REQUEST, subscribeAnnouncement)
}

function *watchAnnouncementChannelUnsubscribe() {
  yield *takeEvery(userActions.UNSUBSCRIBE_ANNOUNCEMNET_REQUEST, unsubscribeAnnouncement)
}

export default function *announcementSaga() {
  yield [
    fork(watchCreateAnnouncement),
    fork(watchAnnouncementFetch),
    fork(watchEventsFetch),
    fork(watchAnnouncementChannelSubscribe),
    fork(watchAnnouncementChannelUnsubscribe),
    fork(watchSingleAnnouncementFetch)
  ]
}
