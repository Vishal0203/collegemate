import {fork} from 'redux-saga/effects';
import announcementSaga from './announcements/index';
import interactionSaga from './interactions/index';
import instituteSaga from './institutes/index';
import socketSaga from './socket/index';
import userSaga from './user/index';
import notificationSaga from './notifications/index';

export default function *rootSaga() {
  yield [
    fork(announcementSaga),
    fork(interactionSaga),
    fork(instituteSaga),
    fork(socketSaga),
    fork(userSaga),
    fork(notificationSaga)
  ]
}
