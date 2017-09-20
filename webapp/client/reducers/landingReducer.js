import * as landingActions from '../actions/landing/index';

const initialState = {
  testimonials: [],
  jobs: []
};

export default function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case landingActions.GET_TESTIMONIALS_RESPONSE: {
      return {
        ...state,
        testimonials: action.data.testimonials
      }
    }
    case landingActions.GET_JOBS_RESPONSE: {
      return {
        ...state,
        jobs: action.data.jobs
      }
    }
    default: {
      return state;
    }
  }
}
