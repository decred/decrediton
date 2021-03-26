import { getJSON, postJSON } from "helpers/fetch";

const URL_BASE = "https://api.decred.org";

const GET = (path, vspClientSig) => {
  const config = vspClientSig
    ? {
        headers: {
          "VSP-CLIENT-SIGNATURE": vspClientSig
        }
      }
    : {};
  return getJSON(path, config);
};

const POST = (path, vspClientSig, json) => {
  const config = vspClientSig
    ? {
        headers: {
          "VSP-Client-Signature": vspClientSig
        }
      }
    : {};
  // This json request is strigfied at the call which is making it.
  return postJSON(path, json, config);
};

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

// getVSPInfo gets the vspinfo.
export function getVSPInfo(host, cb) {
  GET(host + "/api/v3/vspinfo")
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}

export function getVSPTicketStatus({ host, sig, json }, cb) {
  POST(host + "/api/v3/ticketstatus", sig, json)
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}

// getFeeAddress gets a ticket`s fee address.
export function getFeeAddress({ host, sig, req }, cb) {
  console.log(req);
  POST(host + "/api/v3/feeaddress", sig, req)
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}

// payFee informs of a ticket`s fee payment.
export function payFee({ host, sig, req }, cb) {
  console.log(req);
  POST(host + "/api/v3/payfee", sig, req)
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}

export function getTicketStatus({ host, vspClientSig, request }, cb) {
  POST(host + "/api/ticketstatus", vspClientSig, request)
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}
