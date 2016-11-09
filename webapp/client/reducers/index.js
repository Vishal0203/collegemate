import {combineReducers} from 'redux';
import announcements from './announcementReducer';
import auth_user from './userReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  announcements,
  auth_user,
  routing: routerReducer
});

export default rootReducer;

