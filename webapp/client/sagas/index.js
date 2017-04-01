import {fork} from 'redux-saga/effects';
import announcementSaga from './announcements/index';
import interactionSaga from './interactions/index';
import instituteSaga from './institutes/index';
import socketSaga from './socket/index';
import userSaga from './user/index';
import notificationSaga from './notifications/index';
import notifiersSaga from './notifiers/index';
import eventsSaga from './events/index';

export default function *rootSaga() {
  yield [
    fork(announcementSaga),
    fork(interactionSaga),
    fork(instituteSaga),
    fork(socketSaga),
    fork(userSaga),
    fork(notificationSaga),
    fork(notifiersSaga),
    fork(eventsSaga),
  ]
}
