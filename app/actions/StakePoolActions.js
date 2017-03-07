import { stakePoolInfo, getPurchaseInfo, setStakePoolAddress } from '../middleware/stakepoolapi';
import { getNextAddress } from './ControlActions';
import { NextAddressRequest } from '../middleware/walletrpc/api_pb';
import { getCfg } from '../config.js';

export const UPDATESTAKEPOOLCONFIG_ATTEMPT = "UPDATESTAKEPOOLCONFIG_ATTEMPT"
export const UPDATESTAKEPOOLCONFIG_FAILED = "UPDATESTAKEPOOLCONFIG_FAILED"
export const UPDATESTAKEPOOLCONFIG_SUCCESS = "UPDATESTAKEPOOLCONFIG_SUCCESS"

export function setStakePoolInformation(poolHost, apiKey, accountNum, internal) {
  return (dispatch, getState) => {
    if (!internal) {
      dispatch({ type: UPDATESTAKEPOOLCONFIG_ATTEMPT });
    }
    var needAddress = false;
    getPurchaseInfo(
      poolHost, 
      apiKey,
      function(response, err) {
        if (err) {
          console.error(err);
          return;
        } else {
          // parse response data for no err
          if (response.data.status == 'success') {
            console.log(response.data.message);
            console.log(response.data.data);
            dispatch(updateSavedConfig(response.data.data, poolHost, apiKey, accountNum));
          } else if (response.data.status == 'error') {
            if (response.data.message == 'purchaseinfo error - no address submitted') {
              dispatch(setStakePoolAddressAction(poolHost, apiKey, accountNum));
              console.log("setting need address to true");
              return (true);
            } else {
              console.error(response.data.message);
              dispatch({ error: response.data.message, type: UPDATESTAKEPOOLCONFIG_FAILED });
            }
          }
        }
      }
    );
  }
}

function updateSavedConfig(newPoolInfo, poolHost, apiKey, accountNum) {
  return (dispatch) => {
    var config = getCfg();
    var stakePoolConfigs = config.get('stakepools');
    console.log(stakePoolConfigs)
    for (var i = 0; i < stakePoolConfigs.length; i++) {
      if (stakePoolConfigs[i].Host == poolHost) {
        stakePoolConfigs[i].ApiKey = apiKey;
        stakePoolConfigs[i].PoolFees = newPoolInfo.PoolFees;
        stakePoolConfigs[i].PoolAddress = newPoolInfo.PoolAddress;
        stakePoolConfigs[i].Script = newPoolInfo.Script;
        stakePoolConfigs[i].TicketAddress = newPoolInfo.TicketAddress;
        stakePoolConfigs[i].VotingAccount = accountNum;
        console.log(stakePoolConfigs[i])
        break;
      };
    }
    console.log(stakePoolConfigs)
    config.set('stakepools', stakePoolConfigs)
    dispatch({ currentStakePoolConfig: stakePoolConfigs, type: UPDATESTAKEPOOLCONFIG_SUCCESS });
  }
}
        
function setStakePoolAddressAction(poolHost, apiKey, accountNum) {
  return (dispatch, getState) => {
  console.log("getting new address pubkey");
  const { walletService } = getState().grpc;
  // get new address for requested VotingAccount
  var request = new NextAddressRequest();
  request.setAccount(accountNum);
  request.setKind(0);
  var addressPubKey = null;
  walletService.nextAddress(request,
    function(err, getNextAddressResponse) {
      if (err) {
        // handle some err here some way
      } else {
        addressPubKey = getNextAddressResponse.getPublicKey();
        setStakePoolAddress(
          poolHost, 
          apiKey, 
          addressPubKey, 
          function(response, err) {
            if (response.data.status == 'success') {
              console.log(response.data.message);
              console.log(response.data.data);
              dispatch(setStakePoolInformation(poolHost, apiKey, accountNum, true));
            } else if (response.data.status == 'error') {
              console.error(response.data.message);
              dispatch({ error: response.data.message, type: UPDATESTAKEPOOLCONFIG_FAILED });
            } else {
              console.error("shouldn't be here set address:", response);
            }
          }
        );
      }
    }
  );
  }
}