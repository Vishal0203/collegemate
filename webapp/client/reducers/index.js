import {combineReducers} from 'redux';
import announcements from './announcementReducer';
import auth_user from './userReducer';
import snackbar from './snackbarReducer'
import interactions from './interactionReducer'
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  announcements,
  interactions,
  auth_user,
  snackbar,
  routing: routerReducer
});

export default rootReducer;

