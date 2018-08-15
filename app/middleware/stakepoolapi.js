// @flow
import axios from "axios";
import querystring from "querystring";

const URL_BASE = "https://api.decred.org";

const GET = (path, apiToken) => {
  const config = {
    headers: {
      "Authorization": "Bearer " + apiToken,
    }
  };
  return axios.get(path, config);
};

const POST = (path, apiToken, json) => {
  const config = {
    headers: {
      "Authorization": "Bearer " + apiToken,
    }
  };
  return axios.post(path,
    querystring.stringify(json),
    config);
};

// stakepPoolInfoResponseToConfig converts a response object for the
// stakePoolInfo call into an object array of available stakepool configs.
function stakepPoolInfoResponseToConfig(response) {
  var stakePoolNames = Object.keys(response.data);

  return stakePoolNames.map(name => {
    let { APIEnabled, URL, Network, APIVersionsSupported } = response.data[name];
    return !APIEnabled
      ? null
      : { Host: URL, Network, APIVersionsSupported };
  }).filter(v => v);
}

export function stakePoolInfo(cb) {
  GET(URL_BASE + "/?c=gsd")
    .then(function (response) {
      cb(stakepPoolInfoResponseToConfig(response));
    })
    .catch(function (error) {
      console.log("Error contacting remote stakepools api.", error);
      cb(null, error);
    });
}

function parseStakePoolResults(response) {
  var stakePoolNames = Object.keys(response.data);

  return stakePoolNames.map(name => {
    let { APIEnabled, URL } = response.data[name];
    return !APIEnabled
      ? null
      : { Host: URL, ...response.data[name] };
  }).filter(v => v);
}

export function allStakePoolStats(cb) {
  GET(URL_BASE + "/?c=gsd")
    .then(function (response) {
      cb(parseStakePoolResults(response));
    })
    .catch(function (error) {
      console.log("Error contacting remote stakepools api.", error);
      cb(null, error);
    });
}

export function setStakePoolAddress({ apiUrl, apiToken, pKAddress }, cb) {
  POST(apiUrl + "/api/v1/address", apiToken, {
    UserPubKeyAddr: pKAddress,
  })
    .then(function(response) {
      cb(response);
    })
    .catch(function(error) {
      cb(null, error);
    });
}

export function setVoteChoices({ apiUrl, apiToken, voteChoices }, cb) {
  POST(apiUrl+"/api/v2/voting", apiToken, {
    VoteBits: voteChoices.toString(),
  })
    .then(function(response) {
      cb(response);
    })
    .catch(function(error) {
      cb(null, error);
    });
}

export function getPurchaseInfo({ apiUrl, apiToken }, cb) {
  GET(apiUrl+"/api/v1/getpurchaseinfo", apiToken)
    .then(function(response) {
      cb(response, null, apiUrl);
    })
    .catch(function(error) {
      cb(null, error, apiUrl);
    });
}

// statsFromStakePool grabs stats and config information directly from the
// stakepool host.
export function statsFromStakePool(host, cb) {
  GET(host + "/api/v1/stats")
    .then(resp => cb(resp, null, host))
    .catch(error => cb(null, error, host));
}
