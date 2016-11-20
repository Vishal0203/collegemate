export const CREATE_ANNOUNCEMENT_REQUEST = 'CREATE_ANNOUNCEMENT_REQUEST';
export const CREATE_ANNOUNCEMENT_RESPONSE = 'CREATE_ANNOUNCEMENT_RESPONSE';
export const CREATE_ANNOUNCEMENT_TOGGLE = 'CREATE_ANNOUNCEMENT_TOGGLE';

export const ON_FILTER_ADD = 'ON_FILTER_ADD';
export const ON_FILTER_REMOVE = 'ON_FILTER_REMOVE';

export const FETCH_ANNOUNCEMENTS_REQUEST = 'FETCH_ANNOUNCEMENTS_REQUEST';
export const FETCH_ANNOUNCEMENTS_RESPONSE = 'FETCH_ANNOUNCEMENTS_RESPONSE';

export function announcementFormToggle() {
  return {
    type: CREATE_ANNOUNCEMENT_TOGGLE
  }
}

export function createAnnouncementRequest(formData) {
  return {
    type: CREATE_ANNOUNCEMENT_REQUEST,
    formData
  };
}

export function createAnnouncementResponse(notification) {
  return {
    type: CREATE_ANNOUNCEMENT_RESPONSE,
    notification
  }
}

export function fetchAnnouncementRequest(url, url_params) {
  return {
    type: FETCH_ANNOUNCEMENTS_REQUEST,
    url,
    url_params
  }
}

export function fetchAnnouncementResponse(response) {
  return {
    type: FETCH_ANNOUNCEMENTS_RESPONSE,
    response
  }
}

export function onFilterAdd() {
  return {
    type: ON_FILTER_ADD
  }
}

export function onFilterRemove() {
  return {
    type: ON_FILTER_REMOVE
  }
}
