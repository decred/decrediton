// @flow
import axios from "axios";
import querystring from "querystring";

const URL_BASE = "https://api.decred.org";

const GET = (path, apiToken) => {
  const config = {
    headers: {
      Authorization: "Bearer " + apiToken
    }
  };
  return axios.get(path, config);
};

const POST = (path, apiToken, json) => {
  const config = {
    headers: {
      Authorization: "Bearer " + apiToken
    }
  };
  return axios.post(path, querystring.stringify(json), config);
};

// stakepPoolInfoResponseToConfig converts a response object for the
// stakePoolInfo call into an object array of available stakepool configs.
function stakepPoolInfoResponseToConfig(response) {
  const data = JSON.parse(`{
    "Tango":{
    "APIEnabled":true,
    "APIVersionsSupported":[1,2],
    "Network":"testnet",
    "URL":"https://testnet.decredvoting.com",
    "Launched":1535630100,
    "LastUpdated":1587938189
    ,"Immature":0,"Live":0,"Voted":516,"Missed":69,"PoolFees":2,
    "ProportionLive":0,"ProportionMissed":0.11794871794871795,
    "UserCount":19,"UserCountActive":9,"Version":"1.5.0-pre"
  },"Dinner":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"testnet","URL":"https://dcrstakedinner.com","Launched":1583854080,"LastUpdated":1591379190,"Immature":0,"Live":0,"Voted":968,"Missed":0,"PoolFees":0.5,"ProportionLive":0,"ProportionMissed":0,"UserCount":59,"UserCountActive":43,"Version":"1.6.0-pre"},"Everstake":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://decred.everstake.one","Launched":1563896760,"LastUpdated":1591379188,"Immature":1,"Live":28,"Voted":154,"Missed":1,"PoolFees":1,"ProportionLive":0.000674016657840258,"ProportionMissed":0.0064516129032258064,"UserCount":109,"UserCountActive":52,"Version":"1.5.0"},"Lima":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://ultrapool.eu","Launched":1495534560,"LastUpdated":1591379188,"Immature":26,"Live":824,"Voted":39339,"Missed":99,"PoolFees":1,"ProportionLive":0.019835347359299024,"ProportionMissed":0.002510269283432223,"UserCount":1338,"UserCountActive":689,"Version":"1.5.0-pre"},"Quebec":{"APIEnabled":false,"APIVersionsSupported":[],"Network":"testnet","URL":"https://test.stakey.net","Launched":1516655040,"LastUpdated":0,"Immature":0,"Live":0,"Voted":0,"Missed":0,"PoolFees":0,"ProportionLive":0,"ProportionMissed":0,"UserCount":0,"UserCountActive":0,"Version":""},"Life":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://dcrpool.ibitlin.com","Launched":1530925800,"LastUpdated":1591379189,"Immature":9,"Live":129,"Voted":2533,"Missed":13,"PoolFees":1,"ProportionLive":0.003105291030764046,"ProportionMissed":0.005106048703849175,"UserCount":193,"UserCountActive":131,"Version":"1.5.0-pre"},"Scarmani":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://stakey.com","Launched":1539357000,"LastUpdated":1591379188,"Immature":4,"Live":110,"Voted":3427,"Missed":226,"PoolFees":0.4,"ProportionLive":0.0026479225843724424,"ProportionMissed":0.06186695866411169,"UserCount":210,"UserCountActive":82,"Version":"1.6.0-pre"},"Zeta":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://dcrstake.coinmine.pl","Launched":1540247400,"LastUpdated":1591379189,"Immature":38,"Live":1370,"Voted":13501,"Missed":20,"PoolFees":0.5,"ProportionLive":0.032978672187184054,"ProportionMissed":0.0014791805339841727,"UserCount":372,"UserCountActive":276,"Version":"1.5.0-pre"},"Dittrex":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://dcrpool.dittrex.com","Launched":1543421580,"LastUpdated":1591379189,"Immature":2,"Live":50,"Voted":461,"Missed":21,"PoolFees":1,"ProportionLive":0.0012494689756853336,"ProportionMissed":0.043568464730290454,"UserCount":197,"UserCountActive":108,"Version":"1.5.0"},"Golf":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://stakepool.dcrstats.com","Launched":1464167340,"LastUpdated":1591379188,"Immature":29,"Live":678,"Voted":150758,"Missed":154,"PoolFees":5,"ProportionLive":0.016320831929131963,"ProportionMissed":0,"UserCount":6041,"UserCountActive":2778,"Version":"1.5.0-pre"},"November":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://decred.raqamiya.net","Launched":1513878600,"LastUpdated":1591379188,"Immature":13,"Live":342,"Voted":17037,"Missed":50,"PoolFees":1,"ProportionLive":0.008232632035048867,"ProportionMissed":0.002926201205594897,"UserCount":269,"UserCountActive":117,"Version":"1.5.0-pre"},"Papa":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://stakey.net","Launched":1516655040,"LastUpdated":1591379189,"Immature":67,"Live":2293,"Voted":45464,"Missed":45,"PoolFees":1,"ProportionLive":0.05519714987241828,"ProportionMissed":0.000988815399151816,"UserCount":819,"UserCountActive":615,"Version":"1.5.0-pre"},"Alfa":{"APIEnabled":false,"APIVersionsSupported":[],"Network":"testnet","URL":"https://test-dcrpool.dittrex.com","Launched":1550412000,"LastUpdated":0,"Immature":0,"Live":0,"Voted":0,"Missed":0,"PoolFees":0,"ProportionLive":0,"ProportionMissed":0,"UserCount":0,"UserCountActive":0,"Version":""},"Juliett":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://dcr.ubiqsmart.com","Launched":1465764720,"LastUpdated":1591379188,"Immature":58,"Live":1293,"Voted":56841,"Missed":118,"PoolFees":0.95,"ProportionLive":0.031125126378123345,"ProportionMissed":0.0020716655840165733,"UserCount":1274,"UserCountActive":608,"Version":"1.5.0-pre"},"Kilo":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"testnet","URL":"https://teststakepool.decred.org","Launched":1486504800,"LastUpdated":1591216288,"Immature":0,"Live":8,"Voted":46248,"Missed":484,"PoolFees":5,"ProportionLive":0.0015634160641000586,"ProportionMissed":0.010356928871009159,"UserCount":20,"UserCountActive":10,"Version":"1.6.0-pre"},"Mike":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://dcr.farm","Launched":1513878600,"LastUpdated":1591379188,"Immature":40,"Live":722,"Voted":24995,"Missed":51,"PoolFees":1,"ProportionLive":0.01738000096288094,"ProportionMissed":0.002036253293939152,"UserCount":795,"UserCountActive":423,"Version":"1.5.0"},"99split":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://99split.com","Launched":1576547820,"LastUpdated":1591379189,"Immature":22,"Live":412,"Voted":763,"Missed":0,"PoolFees":0.99,"ProportionLive":0.009917673679649512,"ProportionMissed":0,"UserCount":200,"UserCountActive":79,"Version":"1.5.0-pre"},"Charlie":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://decred.yieldwallet.io","Launched":1580311920,"LastUpdated":1591379189,"Immature":0,"Live":14,"Voted":34,"Missed":1,"PoolFees":2,"ProportionLive":0.000337008328920129,"ProportionMissed":0.02857142857142857,"UserCount":22,"UserCountActive":15,"Version":"1.5.0"},"Staked":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://decred.staked.us","Launched":1543433400,"LastUpdated":1591379189,"Immature":0,"Live":62,"Voted":3197,"Missed":11,"PoolFees":5,"ProportionLive":0.0014924654566462858,"ProportionMissed":0.003428927680798005,"UserCount":268,"UserCountActive":115,"Version":"1.4.0-pre+dev"},"Delta":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://dcr.stakeminer.com","Launched":1463671140,"LastUpdated":1591379189,"Immature":196,"Live":5239,"Voted":246938,"Missed":469,"PoolFees":1,"ProportionLive":0.12611333108661113,"ProportionMissed":0.00189566180423351,"UserCount":4874,"UserCountActive":2249,"Version":"1.5.0"},"Echo":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://pool.d3c.red","Launched":1464026340,"LastUpdated":1591379188,"Immature":12,"Live":184,"Voted":29267,"Missed":117,"PoolFees":5,"ProportionLive":0.004429252322950267,"ProportionMissed":0.003981758780288593,"UserCount":1045,"UserCountActive":410,"Version":"1.6.0-pre"},"Hotel":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://stake.decredbrasil.com","Launched":1464463860,"LastUpdated":1591379189,"Immature":18,"Live":524,"Voted":50312,"Missed":51,"PoolFees":5,"ProportionLive":0.012613740311010544,"ProportionMissed":0.0010126481742549094,"UserCount":1632,"UserCountActive":982,"Version":"1.5.0"},"India":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://stakepool.eu","Launched":1463943480,"LastUpdated":1591379188,"Immature":2,"Live":326,"Voted":11424,"Missed":87,"PoolFees":5,"ProportionLive":0.007847479659140148,"ProportionMissed":0.007557988011467292,"UserCount":998,"UserCountActive":368,"Version":"1.1.1"},"Sierra":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://decredvoting.com","Launched":1535630100,"LastUpdated":1591379189,"Immature":11,"Live":262,"Voted":2473,"Missed":9,"PoolFees":1,"ProportionLive":0.006306870155505272,"ProportionMissed":0.0036261079774375505,"UserCount":473,"UserCountActive":382,"Version":"1.5.0-pre"},"Mega":{"APIEnabled":true,"APIVersionsSupported":[1,2],"Network":"mainnet","URL":"https://dcrpos.megapool.info","Launched":1540027800,"LastUpdated":1591379191,"Immature":0,"Live":142,"Voted":19034,"Missed":50,"PoolFees":1,"ProportionLive":0.00341822733618988,"ProportionMissed":0.002619995808006707,"UserCount":72,"UserCountActive":50,"Version":"1.1.1"},
  "localhost": {
    "APIEnabled":true,
    "APIVersionsSupported":[1,2, 3],
    "Network":"testnet",
    "URL":"http://localhost:3001",
    "Launched":1535630100,
    "LastUpdated":1587938189
    ,"Immature":0,"Live":0,"Voted":516,"Missed":69,"PoolFees":2,
    "ProportionLive":0,"ProportionMissed":0.11794871794871795,
    "UserCount":19,"UserCountActive":9,"Version":"1.5.0-pre"
    }
  }`);
  const stakePoolNames = Object.keys(data);

  return stakePoolNames
    .map((name) => {
      // const { APIEnabled, URL, Network, APIVersionsSupported } = response.data[
      //   name
      // ];
       const { APIEnabled, URL, Network, APIVersionsSupported } = data[name];
      return !APIEnabled ? null : { Host: URL, Network, APIVersionsSupported };
    })
    .filter((v) => v);
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
  POST(apiUrl + "/api/v1/address", apiToken, {
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
  POST(apiUrl + "/api/v2/voting", apiToken, {
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
  GET(apiUrl + "/api/v1/getpurchaseinfo", apiToken)
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
  GET(host + "/api/v1/stats")
    .then((resp) => cb(resp, null, host))
    .catch((error) => cb(null, error, host));
}
