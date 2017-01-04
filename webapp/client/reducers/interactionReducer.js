
import {
  CREATE_POST_TOGGLE,
  CREATE_POST_REQUEST,
  CREATE_POST_RESPONSE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_RESPONSE,
  TAGS_RESPONSE,
  FETCH_SINGLE_POST_REQUEST,
  FETCH_SINGLE_POST_RESPONSE,
  TOGGLE_POST_UPVOTE_REQUEST,
  TOGGLE_POST_UPVOTE_RESPONSE,
  DELETE_POST_REQUEST,
  DELETE_POST_RESPONSE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_RESPONSE,
  TOGGLE_POST_UPDATE_FORM,
  ADD_COMMENT_TOGGLE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_RESPONSE,
  TOGGLE_COMMENT_UPVOTE_RESPONSE,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_RESPONSE,
  EDIT_COMMENT_REQUEST,
  EDIT_COMMENT_RESPONSE
} from '../actions/interactions';

const initialState = {
  tags: [],
  toggleForm: false,
  loadingMore: false,
  nextPageUrl: null,
  hasMore: true,
  skip: 0,
  items: {
    posts: []
  },
  postLoading: false,
  commentLoading: false,
  selectedPost: null,
  toggleCommentForm: false,
  togglePostUpdateForm: false
};

export default function interactionReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
    case CREATE_POST_REQUEST: {
      return {...state, loadingMore: true}
    }
    case CREATE_POST_RESPONSE: {
      const skip = state.skip + 1;
      return {
        ...state,
        skip,
        items: {...state.items, posts: [action.post, ...state.items.posts]},
        loadingMore: false
      };
    }
    case FETCH_POSTS_RESPONSE: {
      return {
        ...state,
        skip: state.skip,
        items: {...action.response, posts: [...state.items.posts, ...action.response.posts]},
        loadingMore: false,
        hasMore: !!action.response.next_page_url,
        nextPageUrl: action.response.next_page_url
      };
    }
    case CREATE_POST_TOGGLE: {
      return {...state, toggleForm: !state.toggleForm};
    }
    case TAGS_RESPONSE: {
      return {...state, tags: [...action.tags]}
    }
    case FETCH_SINGLE_POST_REQUEST: {
      return {...state, postLoading: true}
    }
    case FETCH_SINGLE_POST_RESPONSE: {
      if (state.selectedPost)
      {
        return {
          ...state,
          selectedPost: {
            ...action.response,
            isEditable: state.selectedPost.isEditable
          },
          postLoading: false
        }
      }
      if(action.response.error) {
        return {...state, postLoading: false}
      }
      return {...state, selectedPost:action.response.post, postLoading: false}
    }
    case TOGGLE_POST_UPVOTE_RESPONSE: {
      if(action.response.error) {
        return {...state, postLoading: false}
      }
      return {
        ...state,
        selectedPost: {...state.selectedPost, upvotes_count: action.response.upvotes_count}
      }
    }
    case DELETE_POST_REQUEST: {
      return {...state, postLoading: true}
    }
    case DELETE_POST_RESPONSE: {
      return {...state, selectedPost: null, postLoading: false}
    }
    case TOGGLE_POST_UPDATE_FORM: {
      return {...state, togglePostUpdateForm: !state.togglePostUpdateForm}
    }
    case UPDATE_POST_REQUEST: {
      return {...state, postLoading: true}
    }
    case UPDATE_POST_RESPONSE: {
      const postResponse = action.response.post;
      const updatedPost = {
        ...state.selectedPost,
        visibility: postResponse.visibility,
        is_anonymous: postResponse.is_anonymous,
        post_heading: postResponse.post_heading,
        post_description: postResponse.post_description,
        tags: postResponse.tags
      };

      if (state.selectedPost.user && !postResponse.user) {
        delete updatedPost.user;
      }

      if(!state.selectedPost.user && postResponse.user ) {
        updatedPost.user = postResponse.user;
      }
      return {
        ...state,
        selectedPost: updatedPost,
        togglePostUpdateForm: false,
        postLoading: false
      }
    }
    case ADD_COMMENT_TOGGLE: {
      return {
        ...state,
        toggleCommentForm: !state.toggleCommentForm
      }
    }
    case ADD_COMMENT_REQUEST: {
      return {...state, commentLoading: true}
    }
    case ADD_COMMENT_RESPONSE: {
      return {
        ...state,
        toggleCommentForm: !state.toggleCommentForm,
        commentLoading: false,
        selectedPost: {
          ...state.selectedPost,
          comments: [action.response, ...state.selectedPost.comments],
          comments_count: state.selectedPost.comments_count + 1
        }
      }
    }
    case TOGGLE_COMMENT_UPVOTE_RESPONSE: {
      if(action.response.error) {
        return state
      }
      let newComments = [...state.selectedPost.comments];
      const index = newComments.indexOf(action.comment);
      const updatedComment = {
        ...newComments[index],
        upvotes_count: action.response.upvotes_count
      };
      newComments.splice(index, 1, updatedComment);
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          comments: newComments
        },
      }
    }
    case DELETE_COMMENT_REQUEST: {
      return {
        ...state,
        commentLoading: true
      }
    }
    case DELETE_COMMENT_RESPONSE: {
      if(action.response.error) {
        return {
          ...state,
          commentLoading: false
        }
      }
      let newComments = [...state.selectedPost.comments];
      const index = newComments.indexOf(action.comment);
      newComments.splice(index, 1);
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          comments: newComments,
          comments_count: state.selectedPost.comments_count-1
        },
        commentLoading: false
      }
    }
    case EDIT_COMMENT_REQUEST: {
      return {
        ...state,
        commentLoading: true
      }
    }
    case EDIT_COMMENT_RESPONSE: {
      if(action.response.error) {
        return {...state, commentLoading: false}
      }
      let newComments = [...state.selectedPost.comments];
      const index = newComments.indexOf(action.comment);
      const updatedComment = {
        ...newComments[index],
        comment: action.response.comment.comment,
        updated_at: action.response.comment.updated_at
      };
      newComments.splice(index, 1, updatedComment);
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          comments: newComments
        },
        commentLoading: false
      }
    }

    case '@@router/LOCATION_CHANGE': {
      if (action.payload.pathname == '/interactions') {
        return {
          ...initialState,
          tags: state.tags
        }
      }
    }
    default: {
      return state
    }
  }
}