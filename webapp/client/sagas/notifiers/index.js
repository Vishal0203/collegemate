import {takeLatest} from 'redux-saga';
import {put, call, fork} from 'redux-saga/effects';
import {toggleSnackbar} from '../../actions/snackbar/index';
import {HttpHelper} from '../utils/apis';
import * as userActions from '../../actions/users/index';

function *fetchCategoryNotifiers(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.data);
  if (response.status === 200) {
    yield put(userActions.fetchCategoryNotifersResponse(response.data));
  }
  else {
    let message = response.data.error ? response.data.error : 'Something went wrong. Please try again after sometime';
    yield put(toggleSnackbar(message));
  }
}

function *validateNotifier(params) {
  const response = yield call(HttpHelper, params.url, 'GET', null, params.data);
  if (response.status === 200 && !response.data.error) {
    yield put(userActions.notifierValidationResponse(response.data));
  }
  else {
    let message = response.data.error ? response.data.error : 'Something went wrong. Please try again after sometime';
    yield put(toggleSnackbar(message));
  }
}

function *addNotifiers(params) {
  let url = `institute/${params.institute_guid}/category/assign_notifier`;
  const response = yield call(HttpHelper, url, 'POST', params.data, null);

  if (response.status === 200 && !response.data.error) {
    url = `institute/${params.institute_guid}/category/notifiers`;
    const data = {category_guid: params.data.category_guid};
    yield put(userActions.fetchCategoryNotifersRequest(data, url));
  }
  else {
    let message = response.data.error ? response.data.error : 'Something went wrong. Please try again after sometime';
    yield put(toggleSnackbar(message));
  }
}

function *removeNotifier(params) {
  const response = yield call(HttpHelper, params.url, 'DELETE', params.data, null);
  let message = null;
  if (response.status !== 200 || response.data.error) {
    message = response.data.error ? response.data.error : 'Something went wrong. Please try again after sometime';
  } else {
    message = response.data.success;
  }
  yield put(toggleSnackbar(message));
  yield put(userActions.removeNotifierResponse(params.data.user_guid));
}


function *watchFetchCategoryNotifiers() {
  yield *takeLatest(userActions.FETCH_CATEGORY_NOTIFIERS_REQUEST, fetchCategoryNotifiers);
}

function *watchValidateNotifier() {
  yield *takeLatest(userActions.NOTIFIER_VALIDATION_REQUEST, validateNotifier);
}

function *watchAddNotifiers() {
  yield *takeLatest(userActions.ADD_NOTIFIERS_REQUEST, addNotifiers);
}

function *watchRemoveNotifier() {
  yield *takeLatest(userActions.REMOVE_NOTIFIER_REQUEST, removeNotifier);
}

export default function *notifiersSaga() {
  yield [
    fork(watchFetchCategoryNotifiers),
    fork(watchValidateNotifier),
    fork(watchAddNotifiers),
    fork(watchRemoveNotifier)
  ]
}
