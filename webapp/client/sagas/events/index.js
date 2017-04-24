import {takeLatest} from 'redux-saga';
import {put, call, select, fork} from 'redux-saga/effects';
import * as eventActions from '../../actions/events/index';
import {toggleSnackbar} from '../../actions/commons/index';
import {HttpHelper} from '../utils/apis';

function *fetchWeekEvents(params) {
  const response = yield call(
    HttpHelper, params.url, 'GET', null, params.url_params
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  if (response.data) {
    yield put(eventActions.fetchWeekEventsResponse(response.data));
  }
}

function *fetchMonthEvents(params) {
  const response = yield call(
    HttpHelper, params.url, 'GET', null, params.url_params
  );
  if (response.data.error) {
    yield put(toggleSnackbar(response.data.error));
  }
  if (response.data) {
    yield put(eventActions.fetchMonthEventsResponse(response.data,
      params.url_params.startDate, params.url_params.endDate));
  }
}

/*
 Watchers
 */

function *watchFetchWeekEvents() {
  yield *takeLatest(eventActions.FETCH_WEEK_EVENTS_REQUEST, fetchWeekEvents)
}

function *watchFetchMonthEvents() {
  yield *takeLatest(eventActions.FETCH_MONTH_EVENTS_REQUEST, fetchMonthEvents)
}

export default function *eventSaga() {
  yield [
    fork(watchFetchWeekEvents),
    fork(watchFetchMonthEvents)
  ]
}