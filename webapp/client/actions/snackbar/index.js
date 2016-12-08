export const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

export function toggleSnackbar(message = '') {
  return {
    type: TOGGLE_SNACKBAR,
    message
  }
}
