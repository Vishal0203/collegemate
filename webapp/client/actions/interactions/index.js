export const CREATE_POST_TOGGLE = 'CREATE_POST_TOGGLE';

export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST';
export const CREATE_POST_RESPONSE = 'CREATE_POST_RESPONSE';

export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
export const FETCH_POSTS_RESPONSE = 'FETCH_POSTS_RESPONSE';

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

export function createPostRequest(instituteGuid, formData) {
  return {
    type: CREATE_POST_REQUEST,
    instituteGuid,
    formData
  }
}

export function fetchPostsRequest(url, url_params) {
  return {
    type: FETCH_POSTS_REQUEST,
    url,
    url_params
  }
}

export function fetchPostsResponse(response) {
  return {
    type: FETCH_POSTS_RESPONSE,
    response
  }
}

export function createPostResponse(post) {
  return {
    type: CREATE_POST_RESPONSE,
    post
  }
}
