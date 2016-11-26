import {TOGGLE_SNACKBAR} from '../actions/snackbar/index';

const initialState = {
  open: false,
  text: ''
};

export default function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SNACKBAR: {
      return {
        ...state,
        open: !state.open,
        text: action.message
      }
    }
    default: {
      return state;
    }
  }
}
