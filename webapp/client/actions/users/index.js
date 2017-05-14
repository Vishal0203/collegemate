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

export const CREATE_ANNOUNCEMENT_CATEGORY_REQUEST = 'CREATE_ANNOUNCEMENT_CATEGORY_REQUEST';
export const CREATE_ANNOUNCEMENT_CATEGORY_RESPONSE = 'CREATE_ANNOUNCEMENT_CATEGORY_RESPONSE';
export const REMOVE_ANNOUNCEMENT_CATEGORY_REQUEST = 'REMOVE_ANNOUNCEMENT_CATEGORY_REQUEST';
export const REMOVE_ANNOUNCEMENT_CATEGORY_RESPONSE = 'REMOVE_ANNOUNCEMENT_CATEGORY_RESPONSE';

export const SET_SELECTED_INSTITUTE = 'SET_SELECTED_INSTITUTE';

export const TOGGLE_NOTIFIERS_DIALOG = 'TOGGLE_NOTIFIERS_DIALOG';
export const FETCH_CATEGORY_NOTIFIERS_REQUEST = 'FETCH_CATEGORY_NOTIFIERS_REQUEST';
export const FETCH_CATEGORY_NOTIFIERS_RESPONSE = 'FETCH_CATEGORY_NOTIFIERS_RESPONSE';
export const NOTIFIER_VALIDATION_REQUEST = 'NOTIFIER_VALIDATION_REQUEST';
export const NOTIFIER_VALIDATION_RESPONSE = 'NOTIFIER_VALIDATION_RESPONSE';
export const REMOVE_VALIDATED_NOTIFIER = 'CLEAR_VALIDATED_NOTIFIER';
export const ADD_NOTIFIERS_REQUEST = 'ADD_NOTIFIERS_REQUEST';
export const REMOVE_NOTIFIER_REQUEST = 'REMOVE_NOTIFIER_REQUEST';
export const REMOVE_NOTIFIER_RESPONSE = 'REMOVE_NOTIFIER_RESPONSE';
export const STAFF_ADD_REQUEST = 'STAFF_ADD_REQUEST';
export const STAFF_ADD_RESPONSE = 'STAFF_ADD_RESPONSE';

export const CHANGE_SELECTED_INSTITUTE_REQUEST = 'CHANGE_SELECTED_INSTITUTE_REQUEST';
export const SELECTED_INSTITUTE_CHANGED = 'SELECTED_INSTITUTE_CHANGED';

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

export function createAnnouncementCategoryRequest(category) {
  return {
    type: CREATE_ANNOUNCEMENT_CATEGORY_REQUEST,
    category
  }
}

export function createAnnouncementCategoryResponse(category) {
  return {
    type: CREATE_ANNOUNCEMENT_CATEGORY_RESPONSE,
    category
  }
}

export function removeAnnouncementCategoryRequest(category_guid) {
  return {
    type: REMOVE_ANNOUNCEMENT_CATEGORY_REQUEST,
    category_guid
  }
}

export function removeAnnouncementCategoryResponse(category_guid) {
  return {
    type: REMOVE_ANNOUNCEMENT_CATEGORY_RESPONSE,
    category_guid
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

export function setSelectedInstitute(data) {
  return {
    type: SET_SELECTED_INSTITUTE,
    data
  }
}

export function toggleNotifiersDialog() {
  return {
    type: TOGGLE_NOTIFIERS_DIALOG
  }
}

export function fetchCategoryNotifersRequest(data, url) {
  return {
    type: FETCH_CATEGORY_NOTIFIERS_REQUEST,
    data,
    url
  }
}

export function fetchCategoryNotifersResponse(data) {
  return {
    type: FETCH_CATEGORY_NOTIFIERS_RESPONSE,
    data
  }
}

export function notifierValidationRequest(data, url) {
  return {
    type: NOTIFIER_VALIDATION_REQUEST,
    data,
    url
  }
}

export function notifierValidationResponse(data) {
  return {
    type: NOTIFIER_VALIDATION_RESPONSE,
    data
  }
}

export function removeValidatedNotifier(user_guid) {
  return {
    type: REMOVE_VALIDATED_NOTIFIER,
    user_guid
  }
}

export function addNotifiersRequest(data, institute_guid) {
  return {
    type: ADD_NOTIFIERS_REQUEST,
    institute_guid,
    data
  }
}

export function removeNotifierRequest(data, url) {
  return {
    type: REMOVE_NOTIFIER_REQUEST,
    url,
    data
  }
}

export function removeNotifierResponse(user_guid) {
  return {
    type: REMOVE_NOTIFIER_RESPONSE,
    user_guid
  }
}

export function submitStaffAdditionRequest(staffMembers) {
  return {
    type: STAFF_ADD_REQUEST,
    staffMembers
  }
}

export function submitStaffAdditionResponse(response) {
  return {
    type: STAFF_ADD_RESPONSE,
    response
  }
}

export function changeSelectedInstitute(institute_guid) {
  return {
    type: CHANGE_SELECTED_INSTITUTE_REQUEST,
    institute_guid
  }
}

export function selectedInstituteChanged(response) {
  return {
    type: SELECTED_INSTITUTE_CHANGED,
    response
  }
}
