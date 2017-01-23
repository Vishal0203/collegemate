import {fork} from 'redux-saga/effects';
import announcementSaga from './announcements/index';
import interactionSaga from './interactions/index';
import socketSaga from './socket/index';
import userSaga from './user/index';

export default function *rootSaga() {
  yield [
    fork(announcementSaga),
    fork(interactionSaga),
    fork(socketSaga),
    fork(userSaga)
  ]
}
