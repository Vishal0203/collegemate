import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './components/Main';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Auth from './components/auth/Auth'
import AnnouncementsContainer from './components/announcements/AnnouncementsContainer';
import SettingsContainer from './components/settings/SettingsContainer';
import InteractionsContainer from './components/interactions/InteractionsContainer';
import InteractionSingle from './components/interactions/InteractionSingle';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import rootSaga from './sagas/index';
import {syncHistoryWithStore} from 'react-router-redux';
import './styles/style.css';

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
store.runSaga(rootSaga);

const router = (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/login' component={Auth}/>
      <Route path='/' component={Main}>
        <IndexRoute component={AnnouncementsContainer}/>
        <Route path='/interactions'>
          <IndexRoute component={InteractionsContainer}/>
          <Route path='/interactions/:postGuid' component={InteractionSingle}/>
        </Route>
        <Route path='/settings' component={SettingsContainer}/>
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(
  router,
  document.getElementById('root')
);
