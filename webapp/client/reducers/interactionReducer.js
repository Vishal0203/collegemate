import {
  CREATE_POST_TOGGLE,
  CREATE_POST_REQUEST,
  CREATE_POST_RESPONSE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_RESPONSE,
  TAGS_RESPONSE
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
  }
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
        toggleForm: !state.toggleForm,
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
    case '@@router/LOCATION_CHANGE': {
      if (action.payload.pathname == '/') {
        return initialState
      }
    }
    default: {
      return state
    }
  }
}