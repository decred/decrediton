// @flow
import axios from "axios";
import querystring from "querystring";
export function stakePoolInfo(cb) {
  axios.get("https://api.decred.org/?c=gsd")
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
      "Authorization": "Bearer " + apiToken,
    }
  };
  var url = apiUrl+"/api/v1/address";
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
      "Authorization": "Bearer " + apiToken,
    }
  };
  var url = apiUrl+"/api/v2/voting";
  axios.post(url,
    querystring.stringify({
      VoteBits: voteChoices.toString(),
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
      "Authorization": "Bearer " + apiToken,
    }
  };
  var url = apiUrl+"/api/v1/getpurchaseinfo";
  axios.get(url, config)
  .then(function(response) {
    cb(response, null, apiUrl);
  })
  .catch(function(error) {
    cb(null, error, apiUrl);
  });
}
