export const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';
export const TOGGLE_ERROR_DIALOG = 'TOGGLE_ERROR_DIALOG';

export const FEEDBACK_SUBMIT_REQUEST = 'FEEDBACK_SUBMIT_REQUEST';
export const TESTIMONIALS_SUBMIT_REQUEST = 'TESTIMONIAL_SUBMIT_REQUEST';

export function toggleSnackbar(message = '') {
  return {
    type: TOGGLE_SNACKBAR,
    message
  }
}

export function toggleErrorDialog() {
  return {
    type: TOGGLE_ERROR_DIALOG
  }
}

export function feedbackSubmit(data) {
  return {
    type: FEEDBACK_SUBMIT_REQUEST,
    data
  }
}

export function submitTestimonials(data) {
  return {
    type: TESTIMONIALS_SUBMIT_REQUEST,
    data
  }
}
