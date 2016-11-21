import {CREATE_POST_TOGGLE} from '../actions/interactions/index';
import {TAGS_RESPONSE} from '../actions/interactions/index';

const initialState = {
  tags: [],
  toggleForm: false,
  loadingMore: false,
  nextPageUrl: null,
  hasMore: true,
  skip: 0,
  items: {
    data: []
  }
};

export default function interactionReducer(state=initialState, action) {
  switch (action.type) {
    case CREATE_POST_TOGGLE: {
      return {...state, toggleForm: !state.toggleForm};
    }
    case TAGS_RESPONSE: {
      return {...state, tags: [...action.tags]}
    }
    default: {
      return state
    }
  }
}