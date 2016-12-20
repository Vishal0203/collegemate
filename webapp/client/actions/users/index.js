export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_RESPONSE = 'USER_LOGIN_RESPONSE';
export const SUBSCRIBE_CHANNEL = 'SUBSCRIBE_CHANNEL';
export const UNSUBSCRIBE_CHANNEL = 'UNSUBSCRIBE_CHANNEL';

export function userLogin() {
  return {
    type: USER_LOGIN_REQUEST
  }
}

export function userLoginResponse(userData) {
  return {
    type: USER_LOGIN_RESPONSE,
    userData
  }
}

export function subscribeChannel(channelName, nextAction) {
  return {
    type: SUBSCRIBE_CHANNEL,
    channelName,
    nextAction
  }
}

export function unsubscribeChannel(channelName) {
  return {
    type: UNSUBSCRIBE_CHANNEL,
    channelName
  }
}
