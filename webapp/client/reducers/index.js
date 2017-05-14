import {combineReducers} from 'redux';
import announcements from './announcementReducer';
import auth_user from './userReducer';
import snackbar from './snackbarReducer';
import errorDialog from './errorDialogReducer';
import interactions from './interactionReducer';
import institutes from './instituteReducer';
import category from './categoryReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  announcements,
  interactions,
  institutes,
  auth_user,
  category,
  snackbar,
  errorDialog,
  routing: routerReducer
});

export default rootReducer;

