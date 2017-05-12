import {takeLatest} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';
import * as notificationActions from '../../actions/notifications/index';
import {toggleSnackbar} from '../../actions/commons/index';
import {HttpHelper} from '../utils/apis';
import * as selectors from '../../reducers/selectors';
import {APPROVAL_NOTIFICATION} from '../../components/Notifications';
import {newStaffApproval, newStudentApproval} from '../../actions/institutes/index';

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
    return category.category_guid === params.announcementGuid.category_guid
  });

  if (!newFilters.length) {
    yield put(toggleSnackbar('The requested category has been deleted.'))
  }
}

function *newNotification(params) {
  const browser_location = yield select(selectors.browser_location);
  const selectedInstitute = yield select(selectors.selected_institute);
  //For new approval Notifications
  if (browser_location === '/institute_settings' &&
    params.notification.type === APPROVAL_NOTIFICATION &&
    params.notification.data.institutes[0].inst_profile_guid === selectedInstitute.inst_profile_guid) {
    let approvalUser = params.notification.data;
    let role = approvalUser.institutes[0].pivot.role;
    approvalUser.pivot = approvalUser.institutes[0].pivot;
    delete approvalUser.institutes;
    role === 'inst_student' ?
      yield put(newStudentApproval(approvalUser)):
      yield put(newStaffApproval(approvalUser));
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

function *watchNewNotification() {
  yield *takeLatest(notificationActions.NEW_NOTIFICATION, newNotification)
}

export default function *notificationSaga() {
  yield [
    fork(watchReadNotification),
    fork(watchReadAllNotifications),
    fork(watchOpenAnnouncementNotification),
    fork(watchNewNotification)
  ]
}