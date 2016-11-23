import {
  CREATE_ANNOUNCEMENT_REQUEST,
  CREATE_ANNOUNCEMENT_RESPONSE,
  CREATE_ANNOUNCEMENT_TOGGLE,
  FETCH_ANNOUNCEMENTS_REQUEST,
  FETCH_ANNOUNCEMENTS_RESPONSE,
  ON_FILTER_ADD,
  ON_FILTER_REMOVE
} from '../actions/announcements/index';

const initialState = {
  toggleForm: false,
  loadingMore: false,
  nextPageUrl: null,
  hasMore: true,
  skip: 0,
  items: {
    data: []
  }
};

export default function announcementReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ANNOUNCEMENTS_REQUEST:
    case CREATE_ANNOUNCEMENT_REQUEST: {
      return {...state, loadingMore: true}
    }
    case CREATE_ANNOUNCEMENT_RESPONSE: {
      const skip = state.skip + 1;
      const match = action.filters.filter(function (filter) {
        return filter.category_guid === action.notification.category.category_guid
      });
      if(match.length == 0) {
        return {
          ...state,
          toggleForm: !state.toggleForm,
          loadingMore: false
        };
      }
      return {
        ...state,
        toggleForm: !state.toggleForm,
        skip,
        items: {...state.items, data: [action.notification, ...state.items.data]},
        loadingMore: false
      };
    }
    case FETCH_ANNOUNCEMENTS_RESPONSE: {
      return {
        ...state,
        skip: state.skip,
        items: {...action.response, data: [...state.items.data, ...action.response.data]},
        loadingMore: false,
        hasMore: !!action.response.next_page_url,
        nextPageUrl: action.response.next_page_url
      };
    }
    case CREATE_ANNOUNCEMENT_TOGGLE: {
      return {...state, toggleForm: !state.toggleForm};
    }
    case ON_FILTER_REMOVE:
    case ON_FILTER_ADD: {
      return initialState
    }
    default: {
      return state
    }
  }
}