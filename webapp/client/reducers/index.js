import {combineReducers} from 'redux';
import announcements from './announcementReducer';
import auth_user from './userReducer';
import snackbar from './snackbarReducer'
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  announcements,
  auth_user,
  snackbar,
  routing: routerReducer
});

export default rootReducer;

