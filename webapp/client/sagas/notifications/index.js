import {takeLatest} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';
import * as notificationActions from '../../actions/notifications/index';
import {HttpHelper} from '../utils/apis';

function *readNotification(params) {
  const response = yield call(
    HttpHelper, params.url, 'PUT', params.notificationIds, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  if (response.data.success) {
    yield put(notificationActions.readNotificationResponse(params.notificationIds.notification_ids));
  }
}

function *readAllNotifications(params) {
  const response = yield call(
    HttpHelper, params.url, 'PUT', null, null
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  if (response.data.success) {
    yield put(notificationActions.readAllNotificationsResponse());
  }
}

function *watchReadNotification() {
  yield *takeLatest(notificationActions.READ_NOTIFICATION_REQUEST, readNotification)
}

function *watchReadAllNotifications() {
  yield *takeLatest(notificationActions.READ_ALL_NOTIFICATIONS_REQUEST, readAllNotifications)
}

export default function *userSaga() {
  yield [
    fork(watchReadNotification),
    fork(watchReadAllNotifications)
  ]
}