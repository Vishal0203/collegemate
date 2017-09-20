export const GET_TESTIMONIALS = 'GET_TESTIMONIALS';
export const GET_TESTIMONIALS_RESPONSE = 'GET_TESTIMONIALS_RESPONSE';
export const GET_JOBS_REQUEST = 'GET_JOBS_REQUEST';
export const GET_JOBS_RESPONSE = 'GET_JOBS_RESPONSE';

export function getTestimonials() {
  return {
    type: GET_TESTIMONIALS
  }
}

export function getTestimonialsResponse(data) {
  return {
    type: GET_TESTIMONIALS_RESPONSE,
    data
  }
}

export function getJobsRequest() {
  return {
    type: GET_JOBS_REQUEST
  }
}

export function getJobsResponse(data) {
  return {
    type: GET_JOBS_RESPONSE,
    data
  }
}