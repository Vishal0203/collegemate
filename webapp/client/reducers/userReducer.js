import {USER_LOGIN_REQUEST, USER_LOGIN_RESPONSE, ADD_FILTER, REMOVE_FILTER} from '../actions/users/index'

export default function userReducer(state = {user: {}, selectedInstitute: {filters: []}}, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST: {
      // ToDo might be needed later to show loader
      return state;
    }
    case USER_LOGIN_RESPONSE: {
      return {
        ...state,
        user: action.userData.user,
        selectedInstitute: {
          ...action.userData.user.default_institute,
          filters: action.userData.user.default_institute.categories
        }
      };
    }
    case ADD_FILTER: {
      const {categories, filters} = state.selectedInstitute;
      if (categories.length == filters.length) {
        return {
          ...state,
          selectedInstitute: {...state.selectedInstitute, filters: [action.filter]}
        }
      }
      else if (categories.length != filters.length && filters.indexOf(action.filter) == -1) {
        return {
          ...state,
          selectedInstitute: {...state.selectedInstitute, filters: [action.filter, ...state.selectedInstitute.filters]}
        }
      }
      else {
        return state;
      }
    }
    case REMOVE_FILTER: {
      const {filters} = state.selectedInstitute;
      const index = filters.indexOf(action.filter);
      let newFiltersSet = [...filters.slice(0, index), ...filters.slice(index + 1)];
      if (newFiltersSet.length == 0) {
        newFiltersSet = [...state.selectedInstitute.categories]
      }
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          filters: newFiltersSet
        }
      }
    }
    default: {
      return state;
    }
  }
}