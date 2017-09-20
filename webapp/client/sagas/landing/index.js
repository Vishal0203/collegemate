import {takeLatest} from 'redux-saga';
import {fork, call, put} from 'redux-saga/effects';
import * as landingActions from '../../actions/landing/index';
import {HttpHelper} from '../utils/apis';

function *fetchTestimonials() {
  const response = yield call(HttpHelper, 'testimonials', 'GET', null, null);
  yield put(landingActions.getTestimonialsResponse(response.data))
}

function *fetchJobs() {
  const response = yield call(HttpHelper, 'get_jobs_landing', 'GET', null, null);
  yield put(landingActions.getJobsResponse(response.data))
}

/*
 Watchers
*/

function *watchTestimonialsFetch() {
  yield *takeLatest(landingActions.GET_TESTIMONIALS, fetchTestimonials);
}

function *watchJobsFetch() {
  yield *takeLatest(landingActions.GET_JOBS_REQUEST, fetchJobs);
}

export default function *landingSaga() {
  yield [
    fork(watchTestimonialsFetch),
    fork(watchJobsFetch)
  ]
}
