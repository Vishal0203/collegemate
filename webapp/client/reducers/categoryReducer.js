import * as categoryActions from '../actions/categories/index';

const initialState = {
  subscribers: {
    loaded: false,
    data: []
  }
};

export default function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case categoryActions.FETCH_CATEGORY_SUBSCRIBERS_REQUEST: {
      return {
        ...state,
        subscribers: {
          ...state.subscribers,
          loaded: false
        }
      }
    }
    case categoryActions.FETCH_CATEGORY_SUBSCRIBERS_RESPONSE: {
      return {
        ...state,
        subscribers: {
          ...state.subscribers,
          loaded: true,
          data: action.data.subscribers
        }
      }
    }
    case categoryActions.SUBSCRIBERS_CHIPS_UPDATE: {
      if (action.action_type === 'remove') {
        return {
          ...state,
          subscribers: {
            ...state.subscribers,
            data: state.subscribers.data.filter((email_id) => {
              return email_id !== action.email_id
            })
          }
        }
      } else {
        return {
          ...state,
          subscribers: {
            ...state.subscribers,
            data: [...state.subscribers.data, action.email_id]
          }
        }
      }
    }
    default: {
      return state;
    }
  }
}
