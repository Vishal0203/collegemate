import {takeEvery, takeLatest, eventChannel} from 'redux-saga';
import {fork, put, call, take} from 'redux-saga/effects';
import {toggleSnackbar} from '../../actions/snackbar/index'
import createWebSocketConnection from './SocketConnection'
import * as userActions from '../../actions/users/index';

let subscribedChannels = {};

function createSocketChannel(socket, channelName) {
  return eventChannel((emit) => {
    const handleEvent = (event) => {
      emit(event)
    };

    socket.on(channelName, handleEvent);
    const unsubscribe = () => {
      socket.off(channelName, handleEvent)
    };

    return unsubscribe
  })
}

function *showSnackbar(message) {
  yield put(toggleSnackbar(message));
}

function *watchOnSocketEvents(params) {
  const socket = yield call(createWebSocketConnection);
  const socketChannel = yield call(createSocketChannel, socket, params.channelName);
  subscribedChannels[params.channelName] = socketChannel;

  while (true) {
    const payload = yield take(socketChannel);
    yield put(params.nextAction(payload));
    if (!payload.type && payload.snackbar) {
      yield call(showSnackbar, payload.message)
    }
  }
}

function *unsubscribeSocketChannel(params) {
  if (subscribedChannels[params.channelName]) {
    subscribedChannels[params.channelName].close();
    delete subscribedChannels[params.channelName];
  }
}

/*
 Watchers
 */

function *watchChannelSubscription() {
  yield *takeEvery(userActions.SUBSCRIBE_CHANNEL, watchOnSocketEvents)
}

function *watchChannelUnsubscribe() {
  yield *takeEvery(userActions.UNSUBSCRIBE_CHANNEL, unsubscribeSocketChannel)
}

export default function *socketSaga() {
  yield [
    fork(watchChannelSubscription),
    fork(watchChannelUnsubscribe)
  ]
}
