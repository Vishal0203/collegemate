import * as actions from '../actions/users/index';
import * as notificationActions from '../actions/notifications/index';
import * as instituteActions from '../actions/institutes/index';
import * as categoryActions from '../actions/categories/index';

const initialState = {
  user: {},
  projects: [],
  approvalAlert: false,
  selectedInstitute: {
    pending_staffs: [],
    pending_students: []
  },
  categoryNotifiers: {
    loading: false,
    notifiersDialogOpen: false,
    validatedUsers: []
  }
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.USER_LOGIN_RESPONSE: {
      let selectedInstitute = {};
      if (action.userData.user.default_institute) {
        selectedInstitute = {
          ...action.userData.user.default_institute,
          categories: action.userData.user.default_institute.categories.map((category) => {
            return {...category, disabled: false}
          })
        }
      }

      return {
        ...state,
        user: action.userData.user,
        selectedInstitute
      };
    }
    case actions.SELECTED_INSTITUTE_CHANGED: {
      let selectedInstitute = {};
      if (action.response.user.default_institute) {
        selectedInstitute = {
          ...action.response.user.default_institute,
          categories: action.response.user.default_institute.categories.map((category) => {
            return {...category, disabled: false}
          })
        }
      }

      return {
        ...state,
        selectedInstitute
      };
    }
    case actions.SUBSCRIBE_ANNOUNCEMNET_REQUEST: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          categories: state.selectedInstitute.categories.map((category) => {
            return category.category_guid === action.category ? {...category, disabled: true} : category
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
            return category.category_guid === action.category.category_guid ? {...category, disabled: false} : category
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
            return category.category_guid === action.category ? {...category, disabled: true} : category
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
    case actions.REMOVE_ANNOUNCEMENT_CATEGORY_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          subscriptions: state.selectedInstitute.subscriptions.filter(
            (category) => category.category_guid !== action.category_guid
          ),
          categories: state.selectedInstitute.categories.filter(
            (category) => category.category_guid !== action.category_guid
          ),
          notifying_categories: state.selectedInstitute.notifying_categories.filter(
            (category) => category.category_guid !== action.category_guid
          ),
        }
      }
    }
    case actions.UNSUBSCRIBE_ANNOUNCEMNET_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          subscriptions: state.selectedInstitute.subscriptions.filter(
            (category) => category.category_guid !== action.category.category_guid
          ),
          categories: state.selectedInstitute.categories.map((category) => {
            return category.category_guid === action.category.category_guid ? {...category, disabled: false} : category
          })
        }
      }
    }
    case actions.UPDATE_USER_PROFILE_RESPONSE: {
      return {
        ...state,
        approvalAlert: true,
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
    case actions.SET_SELECTED_INSTITUTE: {
      let selectedInstitute = {};
      if (action.data.default_institute) {
        selectedInstitute = {
          ...action.data.default_institute,
          categories: action.data.default_institute.categories.map((category) => {
            return {...category, disabled: false}
          })
        }
      }

      return {
        ...state,
        user: {
          ...state.user,
          institutes: action.data.institutes,
          default_institute: action.data.default_institute
        },
        selectedInstitute
      }
    }
    case actions.USER_LOGOUT_RESPONSE: {
      return initialState;
    }
    case notificationActions.READ_NOTIFICATION_RESPONSE: {
      let updatedNotifications = [...state.user.unread_notifications];
      updatedNotifications = updatedNotifications.filter(function (notification) {
        return action.notificationIds.indexOf(notification.id) === -1
      });

      return {
        ...state,
        user: {
          ...state.user,
          unread_notifications: updatedNotifications
        }
      };
    }
    case notificationActions.READ_ALL_NOTIFICATIONS_RESPONSE: {
      return {
        ...state,
        user: {
          ...state.user,
          unread_notifications: []
        }
      };
    }
    case notificationActions.NEW_NOTIFICATION: {
      delete action.notification.message;
      return {
        ...state,
        user: {
          ...state.user,
          unread_notifications: [action.notification, ...state.user.unread_notifications]
        }
      }
    }
    case actions.TOGGLE_NOTIFIERS_DIALOG: {
      const categoryNotifiers = state.categoryNotifiers.notifiersDialogOpen ? {
        notifiersDialogOpen: false
      } : {
        ...state.categoryNotifiers,
        notifiersDialogOpen: true,
        validatedUsers: []
      };
      return {
        ...state,
        categoryNotifiers
      }
    }
    case actions.FETCH_CATEGORY_NOTIFIERS_REQUEST: {
      return {
        ...state,
        categoryNotifiers: {
          ...state.categoryNotifiers,
          loading: true,
          validatedUsers: []
        }
      }
    }
    case actions.FETCH_CATEGORY_NOTIFIERS_RESPONSE: {
      const notifiers = action.data.category_users.notifiers;
      const category = action.data.category_users;
      delete category.notifiers;
      return {
        ...state,
        categoryNotifiers: {
          ...state.categoryNotifiers,
          category,
          notifiers,
          loading: false
        }
      }
    }
    case actions.NOTIFIER_VALIDATION_RESPONSE: {
      let validatedUsers = state.categoryNotifiers.validatedUsers;
      if (action.data.user) {
        const existingUser = state.categoryNotifiers.validatedUsers.filter(function (validatedUser) {
          return validatedUser.user_guid === action.data.user.user_guid
        });
        validatedUsers = existingUser.length === 0 ?
          [...state.categoryNotifiers.validatedUsers, action.data.user] :
          validatedUsers;
      }
      return {
        ...state,
        categoryNotifiers: {
          ...state.categoryNotifiers,
          validatedUsers,
        }
      }
    }
    case actions.REMOVE_VALIDATED_NOTIFIER: {
      const validatedUsers = state.categoryNotifiers.validatedUsers.filter(function (validatedUser) {
        return validatedUser.user_guid !== action.user_guid
      });
      return {
        ...state,
        categoryNotifiers: {
          ...state.categoryNotifiers,
          validatedUsers
        }
      }
    }
    case actions.ADD_NOTIFIERS_REQUEST: {
      return {
        ...state,
        categoryNotifiers: {
          ...state.categoryNotifiers,
          loading: true,
        }
      }
    }
    case actions.REMOVE_NOTIFIER_REQUEST: {
      return {
        ...state,
        categoryNotifiers: {
          ...state.categoryNotifiers,
          loading: true,
        }
      }
    }
    case actions.REMOVE_NOTIFIER_RESPONSE: {
      let notifiers = action.error ?
        state.categoryNotifiers.notifiers :
        state.categoryNotifiers.notifiers.filter((notifier) =>
          notifier.user_guid !== action.user_guid
        );

      return {
        ...state,
        categoryNotifiers: {
          ...state.categoryNotifiers,
          notifiers,
          loading: false,
        }
      }
    }
    case instituteActions.STUDENT_APPROVAL_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          pending_students: action.students
        }
      }
    }
    case instituteActions.STUDENT_APPROVAL_ACTION_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          pending_students: state.selectedInstitute.pending_students.filter((student) =>
            student.user_guid !== action.user_guid
          )
        }
      }
    }
    case instituteActions.STAFF_APPROVAL_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          pending_staffs: action.staffs
        }
      }
    }
    case instituteActions.STAFF_APPROVAL_ACTION_RESPONSE: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          pending_staffs: state.selectedInstitute.pending_staffs.filter((staff) =>
            staff.user_guid !== action.user_guid
          )
        }
      }
    }
    case instituteActions.NEW_STUDENT_APPROVAL: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          pending_students: [
            action.newUser,
            ...state.selectedInstitute.pending_students.filter((user) => user.user_guid !== action.newUser.user_guid)
          ]
        }
      }
    }
    case instituteActions.NEW_STAFF_APPROVAL: {
      return {
        ...state,
        selectedInstitute: {
          ...state.selectedInstitute,
          pending_staffs: [
            action.newUser,
            ...state.selectedInstitute.pending_staffs.filter((user) => user.user_guid !== action.newUser.user_guid)
          ]
        }
      }
    }
    case actions.GET_USER_PROJECTS_RESPONSE: {
      return {
        ...state,
        projects: action.data.projects
      }
    }
    default: {
      return state;
    }
  }
}