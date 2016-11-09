import axios from 'axios';

export function HttpHelper(type, method, data, params) {
  let url = `${process.env.SERVER_HOST}/api/v1_0/${type}`;
  if (type.includes(process.env.SERVER_HOST)) {
    url = type
  }
  return axios({
    method,
    url,
    params,
    data,
    withCredentials: true
  })
    .then(function (response) {
      return response
    })
    .catch(function (error) {
      console.log(error);
    });
}