import * as actions from '../actions/announcements/index';
import * as userActions from '../actions/users/index';
import * as eventActions from '../actions/events/index';
import {OPEN_CATEGORY_ANNOUNCEMENTS} from '../actions/notifications/index';
import moment from 'moment/moment';

const initialState = {
  categories: [],
  filters: [],
  toggleForm: false,
  showUpdateAnnouncementForm: false,
  loadingMore: false,
  nextPageUrl: null,
  hasMore: true,
  skip: 0,
  items: {
    data: []
  },
  eventsLoader: false,
  events: [],
  eventsCalendar: {
    eventsInWeek: [],
    eventsInMonth: [],
    eventsWeekLoader: false,
    monthEventsStartDate: null,
    monthEventsEndDate: null
  },
  singleAnnouncement: null,
  singleAnnouncementLoader: false,
  defaultAnnouncements: []
};

function updateEvents(state, notification) {
  let eventsInMonth = state.eventsCalendar.eventsInMonth;
  let eventsInWeek = state.eventsCalendar.eventsInWeek;
  let events = state.events;
  const {event_date} = notification;
  if (event_date) {
    const dayDiffFromToday = moment(event_date).diff(moment().startOf('day'), 'days');

    events = [...events, notification];
    events = events.sort((event1, event2) => moment(event1.event_date).diff(moment(event2.event_date), 'days'))
      .slice(0,4);


    if (dayDiffFromToday >= 0 && dayDiffFromToday < 7) {
      eventsInWeek = [...eventsInWeek, notification];
      eventsInWeek.sort((event1, event2) => moment(event1.event_date).diff(moment(event2.event_date), 'days'));
    }
    if (state.eventsCalendar.monthEventsStartDate) {
      const dayDiffFromMonthStart = moment(event_date).diff(state.eventsCalendar.monthEventsStartDate, 'days');
      const dayDiffFromMonthEnd = moment(event_date).diff(state.eventsCalendar.monthEventsEndDate, 'days');
      if (dayDiffFromMonthStart >= 0 && dayDiffFromMonthEnd <= 0) {
        eventsInMonth = [...eventsInMonth, {
          ...notification,
          allDay: true,
        }];
      }
    }
  }
  return {eventsInMonth, eventsInWeek, events}
}

export default function announcementReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ANNOUNCEMENTS_REQUEST:
    case actions.CREATE_ANNOUNCEMENT_REQUEST: {
      return {...state, loadingMore: true}
    }
    case actions.NEW_ANNOUNCEMENT_ADDED: {
      const skip = state.skip + 1;
      const match = state.filters.filter(function (filter) {
        return filter.category_guid === action.notification.category.category_guid
      });
      if (match.length === 0) {
        return {
          ...state,
          loadingMore: false
        };
      }
      const {eventsInMonth, eventsInWeek, events} = updateEvents(state, action.notification);
      return {
        ...state,
        skip,
        items: {...state.items, data: [action.notification, ...state.items.data]},
        events,
        eventsCalendar: {
          ...state.eventsCalendar,
          eventsInWeek,
          eventsInMonth
        },
        loadingMore: false
      };
    }
    case actions.ANNOUNCEMENT_UPDATE_NO_NOTIFY: {
      let notification = state.items.data.map((notification) => notification.notification_guid)
        .indexOf(action.notification.notification_guid);

      state.items.data[notification] = action.notification;
      return {...state}
    }
    case actions.DELETE_ANNOUNCEMENT_REQUEST: {
      return {...state, loadingMore: true}
    }
    case actions.ANNOUNCEMENT_DELETED: {
      const match = state.filters.filter(function (filter) {
        return filter.category_guid === action.notification.category.category_guid
      });
      if (match.length === 0) {
        return {
          ...state,
          loadingMore: false
        };
      }
      const events = state.events.filter(
        (event) => event.notification_guid !== action.notification.notification_guid
      );
      const eventsInWeek = state.eventsCalendar.eventsInWeek.filter(
        (event) => event.notification_guid !== action.notification.notification_guid
      );
      const eventsInMonth = state.eventsCalendar.eventsInMonth.filter(
        (event) => event.notification_guid !== action.notification.notification_guid
      );
      const itemsData = state.items.data.filter(
        (announcement) => announcement.notification_guid !== action.notification.notification_guid
      );

      const skip = itemsData.length === state.items.data.length ? state.skip : state.skip - 1;
      return {
        ...state,
        skip,
        items: {...state.items, data: itemsData},
        events,
        eventsCalendar: {
          ...state.eventsCalendar,
          eventsInWeek,
          eventsInMonth
        },
        loadingMore: false
      };
    }
    case actions.FETCH_ANNOUNCEMENTS_RESPONSE: {
      return {
        ...state,
        skip: state.skip,
        items: {...action.response, data: [...state.items.data, ...action.response.data]},
        loadingMore: false,
        hasMore: !!action.response.next_page_url,
        nextPageUrl: action.response.next_page_url
      };
    }
    case actions.FETCH_SINGLE_ANNOUNCEMENT_REQUEST: {
      return {
        ...state,
        singleAnnouncementLoader: true
      }
    }
    case actions.FETCH_SINGLE_ANNOUNCEMENT_RESPONSE: {
      return {
        ...state,
        singleAnnouncementLoader: false,
        singleAnnouncement: action.response.notification
      }
    }
    case actions.FETCH_EVENTS_REQUEST: {
      return {
        ...state,
        eventsLoader: true
      }
    }
    case actions.FETCH_EVENTS_RESPONSE: {
      return {
        ...state,
        events: action.response.events,
        eventsLoader: false
      }
    }
    case actions.SET_ANNOUNCEMENT_CATEGORIES: {
      return {
        ...state,
        categories: action.categories,
        filters: action.categories
      }
    }
    case actions.ADD_FILTER: {
      const {categories, filters} = state;
      if (categories.length == filters.length) {
        return {
          ...initialState,
          categories,
          filters: [action.filter]
        }
      }
      else if (categories.length != filters.length && filters.indexOf(action.filter) == -1) {
        return {
          ...initialState,
          categories,
          filters: [action.filter, ...state.filters]
        }
      }
      else {
        return state;
      }
    }
    case actions.REMOVE_FILTER: {
      const {categories, filters} = state;
      const index = filters.indexOf(action.filter);
      let newFiltersSet = [...filters.slice(0, index), ...filters.slice(index + 1)];
      if (newFiltersSet.length == 0) {
        newFiltersSet = [...state.categories]
      }
      return {
        ...initialState,
        categories,
        filters: newFiltersSet
      }
    }
    case actions.CREATE_ANNOUNCEMENT_TOGGLE: {
      return {...state, toggleForm: !state.toggleForm};
    }
    case actions.UPDATE_ANNOUNCEMENT_TOGGLE: {
      return {...state, showUpdateAnnouncementForm: !state.showUpdateAnnouncementForm};
    }
    case actions.RELOAD_ANNOUNCEMENTS: {
      return {
        ...initialState,
        defaultAnnouncements: state.defaultAnnouncements,
        categories: state.categories,
        filters: state.filters
      }
    }
    case actions.FETCH_DEFAULT_ANNOUNCEMENT_RESPONSE: {
      return {
        ...state,
        defaultAnnouncements: action.response.data
      }
    }
    case OPEN_CATEGORY_ANNOUNCEMENTS: {
      let newFilters = state.categories.filter((category) => {
        return category.category_guid === action.announcementGuid.category_guid
      });

      if (!newFilters.length) {
        newFilters = state.filters
      }

      return {
        ...initialState,
        categories: state.categories,
        defaultAnnouncements: state.defaultAnnouncements,
        filters: newFilters
      }
    }
    case eventActions.FETCH_WEEK_EVENTS_REQUEST: {
      return {
        ...state,
        eventsCalendar: {
          ...state.eventsCalendar,
          eventsInWeek: [],
          eventsWeekLoader: true
        }
      }
    }
    case eventActions.FETCH_WEEK_EVENTS_RESPONSE: {
      return {
        ...state,
        eventsCalendar: {
          ...state.eventsCalendar,
          eventsInWeek: action.response.events,
          eventsWeekLoader: false
        }
      }
    }
    case eventActions.FETCH_MONTH_EVENTS_RESPONSE: {
      const eventsInMonth = action.response.events.map((event) => {
        return {
          ...event,
          allDay: true
        }
      });
      return {
        ...state,
        eventsCalendar: {
          ...state.eventsCalendar,
          eventsInMonth,
          monthEventsStartDate: action.eventsStartDate,
          monthEventsEndDate: action.eventsEndDate
        }
      }
    }
    case userActions.SELECTED_INSTITUTE_CHANGED: {
      return {
        ...initialState,
        categories: state.categories,
        filters: state.filters
      }
    }
    case '@@router/LOCATION_CHANGE': {
      if (action.payload.pathname !== '/') {
        return {
          ...initialState,
          defaultAnnouncements: state.defaultAnnouncements,
          categories: state.categories,
          filters: state.filters
        }
      }
      return state
    }
    default: {
      return state
    }
  }
}