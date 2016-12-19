import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESPONSE
} from '../actions/users/index'

export default function userReducer(state = {user: {}, selectedInstitute: {}}, action) {
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
    default: {
      return state;
    }
  }
}