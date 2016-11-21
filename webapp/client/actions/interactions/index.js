export const CREATE_POST_TOGGLE = 'CREATE_POST_TOGGLE';
export const TAGS_FETCH = 'TAGS_FETCH';
export const TAGS_RESPONSE = 'TAGS_RESPONSE';

export function postFormToggle() {
  return {
    type: CREATE_POST_TOGGLE
  }
}

export function fetchTags(url_params) {
  return {
    type: TAGS_FETCH,
    url_params
  }
}

export function fetchTagsResponse(tags) {
  return {
    type: TAGS_RESPONSE,
    tags
  }
}
