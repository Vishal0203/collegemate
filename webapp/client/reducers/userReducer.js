import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESPONSE,
  USER_LOGOUT_RESPONSE,
} from '../actions/users/index'

const initialState = {
  user: {},
  selectedInstitute: {}
}

export default function userReducer(state=initialState, action) {
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
          ...action.userData.user.default_institute
        }
      };
    }
    case USER_LOGOUT_RESPONSE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}