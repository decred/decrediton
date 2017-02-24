import axios from 'axios';
import querystring from 'querystring';
export function stakePoolInfo(cb) {
  axios.get('https://decred.org/api/?c=gsd')
  .then(function (response) {
    cb(response);
  })
  .catch(function (error) {
    cb(null, error);
  });

}

export function apiClientRequest(apiUrl, request, apiToken, cb) {
  var config = {
    headers: { 
      "Authorization": "Bearer " + apiToken,
    }
  }
  console.log(apiUrl+request);
  axios.get(apiUrl+request)
  .then(function(response) {
    cb(response);
  })
  .catch(function(error) {
    cb(null, error);
  });
}