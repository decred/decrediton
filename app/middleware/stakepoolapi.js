import axios from 'axios';

export function stakePoolInfo(cb) {
  axios.get('https://decred.org/api/?c=gsd')
  .then(function (response) {
    cb(response);
  })
  .catch(function (error) {
    cb(nil, error);
  });

}