import {
  CREATE_ANNOUNCEMENT_REQUEST,
  CREATE_ANNOUNCEMENT_RESPONSE,
  CREATE_ANNOUNCEMENT_TOGGLE,
  FETCH_ANNOUNCEMENTS_REQUEST,
  FETCH_ANNOUNCEMENTS_RESPONSE
} from '../actions/announcements';

const initialState = {
  toggleForm: false,
  loadingMore: false,
  nextPageUrl: null,
  hasMore: true,
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
      console.log(action.notification);
      return {
        ...state,
        toggleForm: !state.toggleForm,
        items: {...state.items, data: [action.notification, ...state.items.data]},
        loadingMore: false
      };
    }
    case FETCH_ANNOUNCEMENTS_RESPONSE: {
      return {
        ...state,
        items: {...action.response, data: [...state.items.data, ...action.response.data]},
        loadingMore: false,
        hasMore: !!action.response.next_page_url,
        nextPageUrl: action.response.next_page_url
      };
    }
    case CREATE_ANNOUNCEMENT_TOGGLE: {
      return {...state, toggleForm: !state.toggleForm};
    }
    default: {
      return state
    }
  }
}