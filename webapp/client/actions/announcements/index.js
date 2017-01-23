export const CREATE_ANNOUNCEMENT_REQUEST = 'CREATE_ANNOUNCEMENT_REQUEST';
export const NEW_ANNOUNCEMENT_ADDED = 'NEW_ANNOUNCEMENT_ADDED';
export const CREATE_ANNOUNCEMENT_TOGGLE = 'CREATE_ANNOUNCEMENT_TOGGLE';

export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const SET_ANNOUNCEMENT_CATEGORIES = 'SET_ANNOUNCEMENT_CATEGORIES';
export const REMOVE_ANNOUNCEMENT_CATEGORY = 'REMOVE_ANNOUNCEMENT_CATEGORY';

export const RELOAD_ANNOUNCEMENTS = 'RELOAD_ANNOUNCEMENTS';
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

export function newAnnouncementAdded(notification) {
  return {
    type: NEW_ANNOUNCEMENT_ADDED,
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

export function setAnnouncementCategories(categories) {
  return {
    type: SET_ANNOUNCEMENT_CATEGORIES,
    categories
  }
}

export function removeAnnouncementCategory(category) {
  return {
    type: REMOVE_ANNOUNCEMENT_CATEGORY,
    category
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
