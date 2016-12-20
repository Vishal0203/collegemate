import {toggleSnackbar} from '../actions/snackbar/index'
import {put} from 'redux-saga/effects';

export function *showSnackbar(message) {
  yield put(toggleSnackbar(message));
}