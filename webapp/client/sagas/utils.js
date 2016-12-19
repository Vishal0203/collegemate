import {toggleSnackbar} from '../actions/snackbar/index'
import {put} from 'redux-saga/effects';

export function *showSnackbar(type, data) {
  switch (type) {
    case 'announcement': {
      yield put(toggleSnackbar(`Announcement published in ${data.category.category_type}`));
    }
  }
}