import * as actions from '../actions/users/index'

const initialState = {
  user: {},
  selectedInstitute: {}
};

export default function userReducer(state=initialState, action) {
  switch (action.type) {
    case actions.USER_LOGIN_REQUEST: {
      // ToDo might be needed later to show loader
      return state;
    }
    case actions.USER_LOGIN_RESPONSE: {
      return {
        ...state,
        user: action.userData.user,
        selectedInstitute: {
          ...action.userData.user.default_institute
        }
      };
    }
    case actions.SUBSCRIBE_ANNOUNCEMNET_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          subscriptions: [...state.selectedInstitute.subscriptions, action.category]
        }
      }
    }
    case actions.UNSUBSCRIBE_ANNOUNCEMNET_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          subscriptions: state.selectedInstitute.subscriptions.filter(
            category => category.category_guid != action.category.category_guid
          )
        }
      }
    }
    case actions.UPDATE_USER_PROFILE_RESPONSE: {
      return {
        ...state,
        user: {
          ...state.user,
          default_institute: {
            ...state.user.default_institute,
            user_institute_info: action.response.default_institute.user_institute_info
          },
          user_profile: {...action.response.user_profile}
        },
        selectedInstitute: {
          ...state.user.default_institute,
          user_institute_info: action.response.default_institute.user_institute_info
        }
      }
    }
    case actions.USER_LOGOUT_RESPONSE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}