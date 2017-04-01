export const FETCH_MONTH_EVENTS_REQUEST = 'FETCH_MONTH_EVENTS_REQUEST';
export const FETCH_MONTH_EVENTS_RESPONSE = 'FETCH_MONTH_EVENTS_RESPONSE';

export const FETCH_WEEK_EVENTS_REQUEST = 'FETCH_WEEK_EVENTS_REQUEST';
export const FETCH_WEEK_EVENTS_RESPONSE = 'FETCH_WEEK_EVENTS_RESPONSE';

export function fetchMonthEventsRequest(url, url_params) {
  return {
    type: FETCH_MONTH_EVENTS_REQUEST,
    url,
    url_params
  }
}

export function fetchMonthEventsResponse(response, eventsStartDate, eventsEndDate) {
  return {
    type: FETCH_MONTH_EVENTS_RESPONSE,
    response,
    eventsStartDate,
    eventsEndDate
  }
}

export function fetchWeekEventsRequest(url, url_params) {
  return {
    type: FETCH_WEEK_EVENTS_REQUEST,
    url,
    url_params
  }
}

export function fetchWeekEventsResponse(response) {
  return {
    type: FETCH_WEEK_EVENTS_RESPONSE,
    response
  }
}