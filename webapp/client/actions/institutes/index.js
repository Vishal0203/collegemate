export const FETCH_INSTITUTE_LIST_REQUEST = 'FETCH_INSTITUTE_LIST_REQUEST';
export const FETCH_INSTITUTE_LIST_RESPONSE = 'FETCH_INSTITUTE_LIST_RESPONSE';

export const SELECT_INSTITUTE_REQUEST = 'SELECT_INSTITUTE_REQUEST';
export const SELECT_INSTITUTE_RESPONSE = 'SELECT_INSTITUTE_RESPONSE';

export const CREATE_INSTITUTE_REQUEST = 'CREATE_INSTITUTE_REQUEST';
export const CREATE_INSTITUTE_RESPONSE = 'CREATE_INSTITUTE_RESPONSE';

export const STUDENT_APPROVAL_REQUEST = 'STUDENT_APPROVAL_REQUEST';
export const STUDENT_APPROVAL_RESPONSE = 'STUDENT_APPROVAL_RESPONSE';

export const STUDENT_APPROVAL_ACTION = 'STUDENT_APPROVAL_ACTION';
export const STUDENT_APPROVAL_ACTION_RESPONSE = 'STUDENT_APPROVAL_ACTION_RESPONSE';

export const STAFF_APPROVAL_REQUEST = 'STAFF_APPROVAL_REQUEST';
export const STAFF_APPROVAL_RESPONSE = 'STAFF_APPROVAL_RESPONSE';
export const STAFF_APPROVAL_ACTION = 'STAFF_APPROVAL_ACTION';
export const STAFF_APPROVAL_ACTION_RESPONSE = 'STAFF_APPROVAL_ACTION_RESPONSE';

export const NEW_STAFF_APPROVAL = 'NEW_STAFF_APPROVAL';
export const NEW_STUDENT_APPROVAL = 'NEW_STUDENT_APPROVAL';


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

export function studentApprovalRequest() {
  return {
    type: STUDENT_APPROVAL_REQUEST
  }
}

export function studentApprovalResponse(students) {
  return {
    type: STUDENT_APPROVAL_RESPONSE,
    students
  }
}

export function studentApprovalAction(user_guid, status) {
  return {
    type: STUDENT_APPROVAL_ACTION,
    user_guid,
    status
  }
}

export function studentApprovalActionResponse(user_guid) {
  return {
    type: STUDENT_APPROVAL_ACTION_RESPONSE,
    user_guid
  }
}

export function staffApprovalRequest() {
  return {
    type: STAFF_APPROVAL_REQUEST
  }
}

export function staffApprovalResponse(staffs) {
  return {
    type: STAFF_APPROVAL_RESPONSE,
    staffs
  }
}

export function staffApprovalAction(user_guid, status) {
  return {
    type: STAFF_APPROVAL_ACTION,
    user_guid,
    status
  }
}

export function staffApprovalActionResponse(user_guid) {
  return {
    type: STAFF_APPROVAL_ACTION_RESPONSE,
    user_guid
  }
}

export function newStaffApproval(newUser) {
  return {
    type: NEW_STAFF_APPROVAL,
    newUser
  }
}

export function newStudentApproval(newUser) {
  return {
    type: NEW_STUDENT_APPROVAL,
    newUser
  }
}