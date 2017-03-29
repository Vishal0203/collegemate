import {TOGGLE_ERROR_DIALOG} from '../actions/commons/index';

const initialState = {
  open: false,
};

export default function errorDialogReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_ERROR_DIALOG: {
      return {
        ...state,
        open: !state.open
      }
    }
    default: {
      return state;
    }
  }
}
