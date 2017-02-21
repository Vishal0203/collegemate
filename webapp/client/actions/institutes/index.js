export const FETCH_INSTITUTE_LIST_REQUEST = 'FETCH_INSTITUTE_LIST_REQUEST';
export const FETCH_INSTITUTE_LIST_RESPONSE = 'FETCH_INSTITUTE_LIST_RESPONSE';

export const SELECT_INSTITUTE_REQUEST = 'SELECT_INSTITUTE_REQUEST';
export const SELECT_INSTITUTE_RESPONSE = 'SELECT_INSTITUTE_RESPONSE';

export const CREATE_INSTITUTE_REQUEST = 'CREATE_INSTITUTE_REQUEST';
export const CREATE_INSTITUTE_RESPONSE = 'CREATE_INSTITUTE_RESPONSE';

export function fetchInstituteRequest() {
  return {
    type: FETCH_INSTITUTE_LIST_REQUEST
  }
}

export function fetchInstituteResponse(list) {
  return {
    type: FETCH_INSTITUTE_LIST_RESPONSE,
    list
  }
}

export function selectInstituteRequest(institute_guid) {
  return {
    type: SELECT_INSTITUTE_REQUEST,
    institute_guid
  }
}

export function selectInstituteResponse(institute) {
  return {
    type: SELECT_INSTITUTE_RESPONSE,
    institute
  }
}

export function createInstituteRequest(formData) {
  return {
    type: CREATE_INSTITUTE_REQUEST,
    formData
  }
}

export function createInstituteResponse(institute) {
  return {
    type: CREATE_INSTITUTE_RESPONSE,
    institute
  }
}
