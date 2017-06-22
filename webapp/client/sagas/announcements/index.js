import {takeEvery, takeLatest} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';

import * as userActions from '../../actions/users/index';
import {toggleSnackbar} from '../../actions/commons/index';
import {toggleErrorDialog} from '../../actions/commons/index';
import * as announcementActions from '../../actions/announcements/index';

import {HttpHelper} from '../utils/apis';
import * as selectors from '../../reducers/selectors';

function *createAnnouncement(params) {
  let data = new FormData();
  data.append('category_guid', params.formData.notificationCategory);
  data.append('notification_head', params.formData.notificationHeader);
  data.append('notification_body', params.formData.notificationBody);
  if (params.formData.eventDate) {
    data.append('event_date', params.formData.eventDate);
  }
  for (let i = 0; i < params.formData.notificationAttachments.length; i++) {
    if (!params.formData.notificationAttachments[i].url_code) {
      data.append('notification_files[]', params.formData.notificationAttachments[i]);
    }
  }
  const response = yield call(
    HttpHelper, `institute/${params.formData.instituteGuid}/notification`, 'POST', data, null
  );

  if (response.status === 200) {
    yield put(announcementActions.announcementFormToggle())
  }
  else {
    yield put(toggleErrorDialog());
  }
}

function *updateAnnouncement(params) {
  let data = new FormData();
  data.append('category_guid', params.formData.notificationCategory);
  data.append('notification_head', params.formData.notificationHeader);
  data.append('notification_body', params.formData.notificationBody);
  data.append('notify', params.formData.notify);

  if (params.formData.eventDate) {
    data.append('event_date', params.formData.eventDate);
  }
  // sending array of files to be deleted
  for (let i = 0; i < params.formData.removedFiles.length; i++) {
    data.append('removed_files[]', params.formData.removedFiles[i]);
  }
  // sending array of files to be uploaded
  for (let i = 0; i < params.formData.notificationAttachments.length; i++) {
    if (!params.formData.notificationAttachments[i].url_code) {
      data.append('notification_files[]', params.formData.notificationAttachments[i]);
    }
  }

  const response = yield call(
    HttpHelper,
    `institute/${params.formData.instituteGuid}/notification/${params.formData.notificationGuid}`,
    'POST',
    data,
    null
  );

  if (response.status === 200) {
    yield put(announcementActions.updateAnnouncementToggle());
    yield put(toggleSnackbar(response.data.message));
  } else {
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

function *deleteAnnouncement(params) {
  const response = yield call(
    HttpHelper, params.url, 'DELETE', null, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  if (response.data.success) {
    yield put(toggleSnackbar(response.data.success));
  }
}

function *announcementUpdates(params) {
  const type = params.update.type;
  delete params.update.type;
  switch (type) {
    case 'NewAnnouncement':
      yield put(announcementActions.newAnnouncementAdded(params.update));
      break;
    case 'AnnouncementUpdate':
      console.log(params.update);
      if (params.update.notify_users === 'true') {
        yield put(announcementActions.announcementDeleted(params.update));
        yield put(announcementActions.newAnnouncementAdded(params.update));
      } else {
        yield put(announcementActions.announcementUpdateNoNotify(params.update));
      }
      break;
    case 'AnnouncementDelete':
      yield put(announcementActions.announcementDeleted(params.update));
      break;
  }
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

    const channelName = `category_${response.data.category.category_guid}:announcement-updates`;
    yield put(userActions.subscribeChannel(channelName, announcementActions.announcementUpdates));

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

    const channelName = `category_${response.data.category.category_guid}:announcement-updates`;
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

function *watchUpdateAnnouncement() {
  yield *takeEvery(announcementActions.UPDATE_ANNOUNCEMENT_REQUEST, updateAnnouncement);
}

function *watchAnnouncementFetch() {
  yield *takeLatest(announcementActions.FETCH_ANNOUNCEMENTS_REQUEST, fetchAnnouncements);
}

function *watchSingleAnnouncementFetch() {
  yield *takeLatest(announcementActions.FETCH_SINGLE_ANNOUNCEMENT_REQUEST, fetchSingleAnnouncement)
}

function *watchAnnouncementUpdates() {
  yield *takeEvery(announcementActions.ANNOUNCEMENT_UPDATES, announcementUpdates)
}

function *watchAnnouncementDelete() {
  yield *takeEvery(announcementActions.DELETE_ANNOUNCEMENT_REQUEST, deleteAnnouncement)
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
    fork(watchUpdateAnnouncement),
    fork(watchAnnouncementFetch),
    fork(watchAnnouncementUpdates),
    fork(watchAnnouncementDelete),
    fork(watchEventsFetch),
    fork(watchAnnouncementChannelSubscribe),
    fork(watchAnnouncementChannelUnsubscribe),
    fork(watchSingleAnnouncementFetch)
  ]
}
