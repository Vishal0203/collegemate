export const FETCH_CATEGORY_SUBSCRIBERS_REQUEST = 'FETCH_CATEGORY_SUBSCRIBERS_REQUEST';
export const FETCH_CATEGORY_SUBSCRIBERS_RESPONSE = 'FETCH_CATEGORY_SUBSCRIBERS_RESPONSE';

export const SUBSCRIBERS_CHIPS_UPDATE = 'SUBSCRIBERS_CHIPS_UPDATE';
export const UPDATE_SUBSCRIBERS = 'UPDATE_SUBSCRIBERS';

export function fetchCategorySubscribersRequest(data, url) {
  return {
    type: FETCH_CATEGORY_SUBSCRIBERS_REQUEST,
    data,
    url
  }
}

export function fetchCategorySubscribersResponse(data) {
  return {
    type: FETCH_CATEGORY_SUBSCRIBERS_RESPONSE,
    data
  }
}

export function subscribersChipsUpdate(email_id, action_type) {
  return {
    type: SUBSCRIBERS_CHIPS_UPDATE,
    action_type,
    email_id
  }
}

export function updateSubscribers(data) {
  return {
    type: UPDATE_SUBSCRIBERS,
    data
  }
}
