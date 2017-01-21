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
          ...action.userData.user.default_institute,
          categories: action.userData.user.default_institute.categories.map((category) => {
            return {...category, disabled: false}
          })
        }
      };
    }
    case actions.SUBSCRIBE_ANNOUNCEMNET_REQUEST: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          categories: state.selectedInstitute.categories.map((category) => {
            return category.category_guid == action.category ? {...category, disabled: true} : category
          })
        }
      }
    }
    case actions.SUBSCRIBE_ANNOUNCEMNET_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          subscriptions: [...state.selectedInstitute.subscriptions, action.category],
          categories: state.selectedInstitute.categories.map((category) => {
            return category.category_guid == action.category.category_guid ? {...category, disabled: false} : category
          })
        }
      }
    }
    case actions.UNSUBSCRIBE_ANNOUNCEMNET_REQUEST: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          categories: state.selectedInstitute.categories.map((category) => {
            return category.category_guid == action.category ? {...category, disabled: true} : category
          })
        }
      }
    }
    case actions.CREATE_ANNOUNCEMENT_CATEGORY_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          subscriptions: [...state.selectedInstitute.subscriptions, action.category],
          categories: [...state.selectedInstitute.categories, action.category],
          notifying_categories: [...state.selectedInstitute.notifying_categories, action.category]
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
          ),
          categories: state.selectedInstitute.categories.map((category) => {
            return category.category_guid == action.category.category_guid ? {...category, disabled: false} : category
          })
        }
      }
    }
    case actions.UPDATE_USER_PROFILE_RESPONSE: {
      return {
        ...state,
        user: {
          ...state.user,
          user_profile: {...action.response.user_profile}
        },
        selectedInstitute: {
          ...state.selectedInstitute,
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