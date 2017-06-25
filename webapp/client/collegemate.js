import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './components/Main';
import {Router, Route, IndexRoute, hashHistory, Redirect} from 'react-router';
import Auth from './components/auth/Auth'
import Testimonials from './components/footer/Testimonials'
import AnnouncementsContainer from './components/announcements/AnnouncementsContainer';
import EventsCalendar from './components/announcements/EventsCalendar';
import SettingsContainer from './components/settings/SettingsContainer';
import InstituteSettingsContainer from './components/InstituteSettings/InstituteSettingsContainer';
import InstituteContainer from './components/InstituteSettings/InstituteContainer';
import InteractionsContainer from './components/interactions/InteractionsContainer';
import InteractionSingle from './components/interactions/InteractionSingle';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import rootSaga from './sagas/index';
import {syncHistoryWithStore} from 'react-router-redux';
import './styles/style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);
store.runSaga(rootSaga);

const router = (
  <Provider store={store}>
    <Router history={history}>
      <Redirect from="/" to="/announcements"/>
      <Route path='/welcome' component={Auth}/>
      <Route path='/' component={Main}>
        <Route path="/announcements" component={AnnouncementsContainer}/>
        <Route path='/interactions'>
          <IndexRoute component={InteractionsContainer}/>
          <Route path='/interactions/:postGuid' component={InteractionSingle}/>
        </Route>
        <Route path='/events' component={EventsCalendar}/>
        <Route path='/settings' component={SettingsContainer}/>
        <Route path='/institute' component={InstituteContainer}/>
        <Route path='/institute_settings' component={InstituteSettingsContainer}/>
        <Route path='/testimonial' component={Testimonials}/>
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(
  router,
  document.getElementById('root')
);
