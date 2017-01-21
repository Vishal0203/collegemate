import * as actions from '../actions/announcements/index';

const initialState = {
  categories: [],
  filters: [],
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
    case actions.FETCH_ANNOUNCEMENTS_REQUEST:
    case actions.CREATE_ANNOUNCEMENT_REQUEST: {
      return {...state, loadingMore: true}
    }
    case actions.NEW_ANNOUNCEMENT_ADDED: {
      const skip = state.skip + 1;
      const match = state.filters.filter(function (filter) {
        return filter.category_guid === action.notification.category.category_guid
      });
      if(match.length == 0) {
        return {
          ...state,
          loadingMore: false
        };
      }
      return {
        ...state,
        skip,
        items: {...state.items, data: [action.notification, ...state.items.data]},
        loadingMore: false
      };
    }
    case actions.FETCH_ANNOUNCEMENTS_RESPONSE: {
      return {
        ...state,
        skip: state.skip,
        items: {...action.response, data: [...state.items.data, ...action.response.data]},
        loadingMore: false,
        hasMore: !!action.response.next_page_url,
        nextPageUrl: action.response.next_page_url
      };
    }
    case actions.SET_ANNOUNCEMENT_CATEGORIES: {
      return {
        ...state,
        categories: action.categories,
        filters: action.categories
      }
    }
    case actions.ADD_FILTER: {
      const {categories, filters} = state;
      if (categories.length == filters.length) {
        return {
          ...initialState,
          categories,
          filters: [action.filter]
        }
      }
      else if (categories.length != filters.length && filters.indexOf(action.filter) == -1) {
        return {
          ...initialState,
          categories,
          filters: [action.filter, ...state.filters]
        }
      }
      else {
        return state;
      }
    }
    case actions.REMOVE_FILTER: {
      const {categories, filters} = state;
      const index = filters.indexOf(action.filter);
      let newFiltersSet = [...filters.slice(0, index), ...filters.slice(index + 1)];
      if (newFiltersSet.length == 0) {
        newFiltersSet = [...state.categories]
      }
      return {
        ...initialState,
        categories,
        filters: newFiltersSet
      }
    }
    case actions.CREATE_ANNOUNCEMENT_TOGGLE: {
      return {...state, toggleForm: !state.toggleForm};
    }
    case actions.RELOAD_ANNOUNCEMENTS: {
      return {
        ...initialState,
        categories: state.categories,
        filters: state.filters
      }
    }
    case '@@router/LOCATION_CHANGE': {
      if (action.payload.pathname != '/') {
        return {
          ...initialState,
          categories: state.categories,
          filters: state.filters
        }
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}