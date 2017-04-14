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

export function setStakePoolAddress(apiUrl, apiToken, pKAddress, cb) {
  var config = {
    headers: {
      'Authorization': 'Bearer ' + apiToken,
    }
  };
  var url = apiUrl+'/api/v1/address';
  axios.post(url,
    querystring.stringify({
      UserPubKeyAddr: pKAddress,
    }),
    config)
  .then(function(response) {
    cb(response);
  })
  .catch(function(error) {
    cb(null, error);
  });
}

export function setVoteChoices(apiUrl, apiToken, voteChoices, cb) {
  var config = {
    headers: {
      'Authorization': 'Bearer ' + apiToken,
    }
  };
  var url = apiUrl+'/api/v1/votechoices';
  axios.post(url,
    querystring.stringify({
      VoteChoices: voteChoices,
    }),
    config)
  .then(function(response) {
    cb(response);
  })
  .catch(function(error) {
    cb(null, error);
  });
}

export function getPurchaseInfo(apiUrl, apiToken, cb) {
  var config = {
    headers: {
      'Authorization': 'Bearer ' + apiToken,
    }
  };
  var url = apiUrl+'/api/v1/getpurchaseinfo';
  axios.get(url, config)
  .then(function(response) {
    cb(response);
  })
  .catch(function(error) {
    cb(null, error);
  });
}