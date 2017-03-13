export const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';
export const TOGGLE_ERROR_DIALOG = 'TOGGLE_ERROR_DIALOG';

export const FEEDBACK_SUBMIT_REQUEST = 'FEEDBACK_SUBMIT_REQUEST';
export const FEEDBACK_SUBMIT_RESPONSE = 'FEEDBACK_SUBMIT_RESPONSE';

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
