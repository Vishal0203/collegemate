export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_RESPONSE = 'USER_LOGIN_RESPONSE';
export const SUBSCRIBE_CHANNEL = 'SUBSCRIBE_CHANNEL';

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

export function subscribeChannel(subscriptionType, channelName, nextAction) {
  return {
    type: SUBSCRIBE_CHANNEL,
    subscriptionType,
    channelName,
    nextAction
  }
}
