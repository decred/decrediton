import { getJSON, postJSON } from "helpers/fetch";

const URL_BASE = "https://api.decred.org";

const GET = (path, vspClientSig) => {
  const config = vspClientSig
    ? {
        headers: {
          "VSP-Client-Signature": vspClientSig
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

const pickResponse = (res) => ({ data: res.data, status: res.status });

// getAllVspsInfo gets vsp info from vsps v1 and v2.
// This can be removed after stopping to support them.
export const getAllVspsInfo = async () => {
  const response = await GET(URL_BASE + "/?c=vsp");
  const hosts = Object.keys(response.data);
  return hosts.reduce((availableVsps, host) => {
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
};

export const getVSPInfo = async (host) => ({
  ...pickResponse(await GET(host + "/api/v3/vspinfo")),
  host
});

export const getVSPTicketStatus = async ({ host, sig, json }) => ({
  ...pickResponse(await POST(host + "/api/v3/ticketstatus", sig, json)),
  host
});
