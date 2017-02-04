import * as actions from '../actions/institutes/index';

const initialState = {
  list: []
};

export default function instituteReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_INSTITUTE_LIST_RESPONSE: {
      return {
        ...state,
        list: [...action.list]
      }
    }
    default: {
      return state
    }
  }
}