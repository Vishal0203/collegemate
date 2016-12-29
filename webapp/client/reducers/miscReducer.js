import {
  GAPI_LOADED
} from '../actions/misc/index'

export default function miscReducer(state = {gapi: false}, action) {
  switch (action.type) {
    case GAPI_LOADED: {
      return {
        ...state,
        gapi: true
      }
    }
    default: {
      return state;
    }
  }
}