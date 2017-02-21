import {takeLatest} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';
import * as notificationActions from '../../actions/notifications/index';
import {toggleSnackbar} from '../../actions/snackbar/index';
import {HttpHelper} from '../utils/apis';
import * as selectors from '../../reducers/selectors';

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

function *openCategoryAnnouncements(params) {
  const announcement_categories = yield select(selectors.announcement_categories);
  const newFilters = announcement_categories.filter((category) => {
    return category.category_guid == params.announcementGuid.category_guid
  });

  if (!newFilters.length) {
    yield put(toggleSnackbar('The requested category has been deleted.'))
  }
}

/*
 Watchers
 */

function *watchReadNotification() {
  yield *takeLatest(notificationActions.READ_NOTIFICATION_REQUEST, readNotification)
}

function *watchReadAllNotifications() {
  yield *takeLatest(notificationActions.READ_ALL_NOTIFICATIONS_REQUEST, readAllNotifications)
}

function *watchOpenAnnouncementNotification() {
  yield *takeLatest(notificationActions.OPEN_CATEGORY_ANNOUNCEMENTS, openCategoryAnnouncements)
}

export default function *userSaga() {
  yield [
    fork(watchReadNotification),
    fork(watchReadAllNotifications),
    fork(watchOpenAnnouncementNotification)
  ]
}