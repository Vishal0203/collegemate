export const CREATE_ANNOUNCEMENT_REQUEST = 'CREATE_ANNOUNCEMENT_REQUEST';
export const UPDATE_ANNOUNCEMENT_REQUEST = 'UPDATE_ANNOUNCEMENT_REQUEST';

export const ANNOUNCEMENT_UPDATES = 'ANNOUNCEMENT_UPDATES';
export const NEW_ANNOUNCEMENT_ADDED = 'NEW_ANNOUNCEMENT_ADDED';
export const ANNOUNCEMENT_DELETED = 'ANNOUNCEMENT_DELETED';
export const CREATE_ANNOUNCEMENT_TOGGLE = 'CREATE_ANNOUNCEMENT_TOGGLE';
export const UPDATE_ANNOUNCEMENT_TOGGLE = 'UPDATE_ANNOUNCEMENT_TOGGLE';

export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const SET_ANNOUNCEMENT_CATEGORIES = 'SET_ANNOUNCEMENT_CATEGORIES';

export const RELOAD_ANNOUNCEMENTS = 'RELOAD_ANNOUNCEMENTS';
export const FETCH_ANNOUNCEMENTS_REQUEST = 'FETCH_ANNOUNCEMENTS_REQUEST';
export const FETCH_ANNOUNCEMENTS_RESPONSE = 'FETCH_ANNOUNCEMENTS_RESPONSE';

export const FETCH_EVENTS_REQUEST = 'FETCH_EVENTS_REQUEST';
export const FETCH_EVENTS_RESPONSE = 'FETCH_EVENTS_RESPONSE';

export const FETCH_SINGLE_ANNOUNCEMENT_REQUEST = 'FETCH_SINGLE_ANNOUNCEMENT_REQUEST';
export const FETCH_SINGLE_ANNOUNCEMENT_RESPONSE = 'FETCH_SINGLE_ANNOUNCEMENT_RESPONSE';

export const DELETE_ANNOUNCEMENT_REQUEST = 'DELETE_ANNOUNCEMENT_REQUEST';

export function announcementFormToggle() {
  return {
    type: CREATE_ANNOUNCEMENT_TOGGLE
  }
}

export function updateAnnouncementToggle() {
  return {
    type: UPDATE_ANNOUNCEMENT_TOGGLE
  }
}

export function createAnnouncementRequest(formData) {
  return {
    type: CREATE_ANNOUNCEMENT_REQUEST,
    formData
  };
}

export function updateAnnouncementRequest(formData) {
  return {
    type: UPDATE_ANNOUNCEMENT_REQUEST,
    formData
  };
}

export function announcementUpdates(update) {
  return {
    type: ANNOUNCEMENT_UPDATES,
    update
  }
}

export function newAnnouncementAdded(notification) {
  return {
    type: NEW_ANNOUNCEMENT_ADDED,
    notification
  }
}

export function announcementDeleted(notification) {
  return {
    type: ANNOUNCEMENT_DELETED,
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

export function fetchEventsRequest(url, url_params) {
  return {
    type: FETCH_EVENTS_REQUEST,
    url,
    url_params
  }
}

export function fetchEventsResponse(response) {
  return {
    type: FETCH_EVENTS_RESPONSE,
    response
  }
}


export function setAnnouncementCategories(categories) {
  return {
    type: SET_ANNOUNCEMENT_CATEGORIES,
    categories
  }
}

export function addFilter(filter) {
  return {
    type: ADD_FILTER,
    filter
  }
}

export function removeFilter(filter) {
  return {
    type: REMOVE_FILTER,
    filter
  }
}

export function reloadAnnouncements() {
  return {
    type: RELOAD_ANNOUNCEMENTS
  }
}

export function fetchSingleAnnouncementRequest(url) {
  return {
    type: FETCH_SINGLE_ANNOUNCEMENT_REQUEST,
    url
  }
}

export function fetchSingleAnnouncementResponse(response) {
  return {
    type: FETCH_SINGLE_ANNOUNCEMENT_RESPONSE,
    response
  }
}

export function deleteAnnouncementRequest(url) {
  return {
    type: DELETE_ANNOUNCEMENT_REQUEST,
    url
  }
}
