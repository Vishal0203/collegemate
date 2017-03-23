export const CREATE_POST_TOGGLE = 'CREATE_POST_TOGGLE';

export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST';
export const CREATE_POST_RESPONSE = 'CREATE_POST_RESPONSE';

export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
export const FETCH_POSTS_RESPONSE = 'FETCH_POSTS_RESPONSE';

export const TAGS_FETCH = 'TAGS_FETCH';
export const TAG_ADD = 'TAG_ADD';
export const TAGS_RESPONSE = 'TAGS_RESPONSE';

export const FETCH_SINGLE_POST_REQUEST = 'FETCH_SINGLE_POST_REQUEST';
export const FETCH_SINGLE_POST_RESPONSE = 'FETCH_SINGLE_POST_RESPONSE';

export const ADD_COMMENT_TOGGLE = 'ADD_COMMENT_TOGGLE';
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_RESPONSE = 'ADD_COMMENT_RESPONSE';

export const TOGGLE_COMMENT_UPVOTE_REQUEST = 'TOGGLE_COMMENT_UPVOTE_REQUEST';
export const TOGGLE_COMMENT_UPVOTE_RESPONSE = 'TOGGLE_COMMENT_UPVOTE_RESPONSE';

export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST';
export const DELETE_COMMENT_RESPONSE = 'DELETE_COMMENT_RESPONSE';

export const TOGGLE_POST_UPVOTE_REQUEST = 'TOGGLE_POST_UPVOTE_REQUEST';
export const TOGGLE_POST_UPVOTE_RESPONSE = 'TOGGLE_POST_UPVOTE_RESPONSE';

export const TOGGLE_POST_UPDATE_FORM = 'TOGGLE_POST_UPDATE_FORM';

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST';
export const UPDATE_POST_RESPONSE = 'UPDATE_POST_RESPONSE';

export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST';
export const DELETE_POST_RESPONSE = 'DELETE_POST_RESPONSE';

export const EDIT_COMMENT_REQUEST = 'EDIT_COMMENT_REQUEST';
export const EDIT_COMMENT_RESPONSE = 'EDIT_COMMENT_RESPONSE';

export const ADD_TAG_FILTER = 'ADD_TAG_FILTER';
export const REMOVE_TAG_FILTER = 'REMOVE_TAG_FILTER';

export const POST_UPDATE = 'POST_UPDATE';
export const COMMENT_UPDATE = 'COMMENT_UPDATE';
export const FETCH_SINGLE_COMMENT_RESPONSE = 'FETCH_SINGLE_COMMENT_RESPONSE';

export function postFormToggle() {
  return {
    type: CREATE_POST_TOGGLE
  }
}

export function commentFormToggle() {
  return {
    type: ADD_COMMENT_TOGGLE
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

export function addCustomTagsRequest(formData) {
  return {
    type: TAG_ADD,
    formData
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

export function fetchSinglePostRequest(instituteGuid, postGuid) {
  return {
    type: FETCH_SINGLE_POST_REQUEST,
    instituteGuid,
    postGuid
  }
}

export function fetchSinglePostResponse(response) {
  return {
    type: FETCH_SINGLE_POST_RESPONSE,
    response
  }
}

export function togglePostUpvoteRequest(instituteGuid, postGuid) {
  return {
    type: TOGGLE_POST_UPVOTE_REQUEST,
    instituteGuid,
    postGuid
  }
}

export function togglePostUpvoteResponse(response) {
  return {
    type: TOGGLE_POST_UPVOTE_RESPONSE,
    response
  }
}

export function togglePostUpdateForm() {
  return {
    type: TOGGLE_POST_UPDATE_FORM
  }
}

export function updatePostRequest(instituteGuid, postGuid, formData) {
  return {
    type: UPDATE_POST_REQUEST,
    instituteGuid,
    postGuid,
    formData
  }
}

export function updatePostResponse() {
  return {
    type: UPDATE_POST_RESPONSE
  }
}

export function deletePostRequest(instituteGuid, postGuid) {
  return {
    type: DELETE_POST_REQUEST,
    instituteGuid,
    postGuid
  }
}

export function deletePostResponse(response) {
  return {
    type: DELETE_POST_RESPONSE,
    response
  }
}

export function addCommentRequest(postGuid, formData) {
  return {
    type: ADD_COMMENT_REQUEST,
    postGuid,
    formData
  }
}
export function addCommentResponse() {
  return {
    type: ADD_COMMENT_RESPONSE
  }
}

export function toggleCommentUpvoteRequest(postGuid, comment, formData) {
  return {
    type: TOGGLE_COMMENT_UPVOTE_REQUEST,
    formData,
    postGuid,
    comment
  }
}

export function toggleCommentUpvoteResponse(comment, response) {
  return {
    type: TOGGLE_COMMENT_UPVOTE_RESPONSE,
    comment,
    response
  }
}

export function deleteCommentRequest(postGuid, comment, formData) {
  return {
    type: DELETE_COMMENT_REQUEST,
    formData,
    postGuid,
    comment
  }
}

export function deleteCommentResponse(comment, response) {
  return {
    type: DELETE_COMMENT_RESPONSE,
    comment,
    response
  }
}

export function editCommentRequest(postGuid, comment, formData) {
  return {
    type: EDIT_COMMENT_REQUEST,
    postGuid,
    comment,
    formData
  }
}

export function editCommentResponse(comment, response) {
  return {
    type: EDIT_COMMENT_RESPONSE,
    comment,
    response
  }
}

export function addTagFilter(filter) {
  return {
    type: ADD_TAG_FILTER,
    filter
  }
}

export function removeTagFilter(filter) {
  return {
    type: REMOVE_TAG_FILTER,
    filter
  }
}

export function postUpdate(response) {
  return {
    type: POST_UPDATE,
    response
  }
}

export function commentUpdate(commentUpdates) {
  return {
    type: COMMENT_UPDATE,
    commentUpdates
  }
}

export function fetchSingleCommentResponse(comment) {
  return {
    type: FETCH_SINGLE_COMMENT_RESPONSE,
    comment
  }
}