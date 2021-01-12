// @flow
import axios from "axios";
import querystring from "querystring";

const URL_BASE = "https://api.decred.org";

const LEGACY_GET = (path, apiToken) => {
  const config = {
    headers: {
      Authorization: "Bearer " + apiToken
    }
  };
  return axios.get(path, config);
};

const GET = (path, vspClientSig) => {
  const config = vspClientSig ? {
    headers: {
      "VSP-CLIENT-SIGNATURE": vspClientSig
    }
  } : {};
  return axios.get(path, config);
};

const LEGACY_POST = (path, apiToken, json) => {
  const config = {
    headers: {
      Authorization: "Bearer " + apiToken
    }
  };
  return axios.post(path, querystring.stringify(json), config);
};

const POST = (path, vspClientSig, json) => {
  const config = {
    headers: {
      "VSP-CLIENT-SIGNATURE": vspClientSig
    }
  };
  // This json request is strigfied at the call which is making it.
  return axios.post(path, json, config);
};

// stakePoolInfo gets vsp info from vsps v1 and v2.
// This can be removed after stopping to support them.
export function stakePoolInfo(cb) {
  // stakepPoolInfoResponseToConfig converts a response object for the
  // stakePoolInfo call into an object array of available stakepool configs.
  const stakepPoolInfoResponseToConfig = (response) => {
    const stakePoolNames = Object.keys(response.data);
    return stakePoolNames
      .map((name) => {
        const { APIEnabled, URL, Network, APIVersionsSupported } = response.data[
          name
        ];
        return !APIEnabled ? null : { Host: URL, Network, APIVersionsSupported };
      })
      .filter((v) => v);
  };

  GET(URL_BASE + "/?c=gsd")
    .then(function (response) {
      cb(stakepPoolInfoResponseToConfig(response));
    })
    .catch(function (error) {
      console.log("Error contacting remote stakepools api.", error);
      cb(null, error);
    });
}

// getAllVspsInfo gets vsp info from vsps v1 and v2.
// This can be removed after stopping to support them.
export function getAllVspsInfo(cb) {
  const readVspInfoResponse = (response) => {
    const hosts = Object.keys(response.data);
    const vsps = hosts.reduce((availableVsps, host) => {
      const vspData = response.data[host];
      if (vspData.closed) return availableVsps;
      // call from /?c=vsp does not include its protocol, becaise when calling
      // from dcrwallet, it is not used. Therefore, we need to add them.
      availableVsps.push({
        host,
        vspData
      });
      return availableVsps;
    }, []);
    return vsps;
  };

  GET(URL_BASE + "/?c=vsp")
    .then(function (response) {
      cb(readVspInfoResponse(response));
    })
    .catch(function (error) {
      console.log("Error contacting remote stakepools api.", error);
      cb(null, error);
    });
}

function parseStakePoolResults(response) {
  const stakePoolNames = Object.keys(response.data);

  return stakePoolNames
    .map((name) => {
      const { APIEnabled, URL } = response.data[name];
      return !APIEnabled ? null : { Host: URL, ...response.data[name] };
    })
    .filter((v) => v);
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
  LEGACY_POST(apiUrl + "/api/v1/address", apiToken, {
    UserPubKeyAddr: pKAddress
  })
    .then(function (response) {
      cb(response);
    })
    .catch(function (error) {
      cb(null, error);
    });
}

export function setVoteChoices({ apiUrl, apiToken, voteChoices }, cb) {
  LEGACY_POST(apiUrl + "/api/v2/voting", apiToken, {
    VoteBits: voteChoices.toString()
  })
    .then(function (response) {
      cb(response);
    })
    .catch(function (error) {
      cb(null, error);
    });
}

export function getPurchaseInfo({ apiUrl, apiToken }, cb) {
  LEGACY_GET(apiUrl + "/api/v1/getpurchaseinfo", apiToken)
    .then(function (response) {
      cb(response, null, apiUrl);
    })
    .catch(function (error) {
      cb(null, error, apiUrl);
    });
}

// statsFromStakePool grabs stats and config information directly from the
// stakepool host.
export function statsFromStakePool(host, cb) {
  LEGACY_GET(host + "/api/v1/stats")
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}

// getVSPInfo gets the vspinfo.
export function getVSPInfo(host, cb) {
  GET(host + "/api/v3/vspinfo")
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}

export function getTicketStatus({ host, vspClientSig, request }, cb) {
  POST(host + "/api/ticketstatus", vspClientSig, request)
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}
