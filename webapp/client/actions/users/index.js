export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_RESPONSE = 'USER_LOGIN_RESPONSE';
export const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
export const USER_LOGOUT_RESPONSE = 'USER_LOGOUT_RESPONSE';
export const SUBSCRIBE_CHANNEL = 'SUBSCRIBE_CHANNEL';
export const UNSUBSCRIBE_CHANNEL = 'UNSUBSCRIBE_CHANNEL';
export const GOOGLE_AUTH = 'GOOGLE_AUTH';
export const UPDATE_USER_PROFILE_REQUEST = 'UPDATE_USER_PROFILE_REQUEST';
export const UPDATE_USER_PROFILE_RESPONSE = 'UPDATE_USER_PROFILE_RESPONSE';

export const SUBSCRIBE_ANNOUNCEMNET_REQUEST = 'SUBSCRIBE_ANNOUNCEMENT_REQUEST';
export const SUBSCRIBE_ANNOUNCEMNET_RESPONSE = 'SUBSCRIBE_ANNOUNCEMENT_RESPONSE';

export const UNSUBSCRIBE_ANNOUNCEMNET_REQUEST = 'UNSUBSCRIBE_ANNOUNCEMNET_REQUEST';
export const UNSUBSCRIBE_ANNOUNCEMNET_RESPONSE = 'UNSUBSCRIBE_ANNOUNCEMNET_RESPONSE';

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

export function userLogout() {
  return {
    type: USER_LOGOUT_REQUEST
  }
}

export function userLogoutResponse() {
  return {
    type: USER_LOGOUT_RESPONSE
  }
}

export function subscribeAnnouncementRequest(category) {
  return {
    type: SUBSCRIBE_ANNOUNCEMNET_REQUEST,
    category
  }
}

export function subscribeAnnouncementResponse(category) {
  return {
    type: SUBSCRIBE_ANNOUNCEMNET_RESPONSE,
    category
  }
}

export function unsubscribeAnnouncementRequest(category) {
  return {
    type: UNSUBSCRIBE_ANNOUNCEMNET_REQUEST,
    category
  }
}

export function unsubscribeAnnouncementResponse(category) {
  return {
    type: UNSUBSCRIBE_ANNOUNCEMNET_RESPONSE,
    category
  }
}

export function updateUserProfileRequest(profileData) {
  return {
    type: UPDATE_USER_PROFILE_REQUEST,
    profileData
  }
}

export function updateUserProfileResponse(response) {
  return {
    type: UPDATE_USER_PROFILE_RESPONSE,
    response
  }
}

export function oauthLogin(payload) {
  return {
    type: GOOGLE_AUTH,
    payload
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
