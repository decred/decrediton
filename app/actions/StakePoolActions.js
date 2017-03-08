import { getPurchaseInfo, setStakePoolAddress } from '../middleware/stakepoolapi';
import { NextAddressRequest } from '../middleware/walletrpc/api_pb';
import { getCfg } from '../config.js';

export const UPDATESTAKEPOOLCONFIG_ATTEMPT = 'UPDATESTAKEPOOLCONFIG_ATTEMPT';
export const UPDATESTAKEPOOLCONFIG_FAILED = 'UPDATESTAKEPOOLCONFIG_FAILED';
export const UPDATESTAKEPOOLCONFIG_SUCCESS = 'UPDATESTAKEPOOLCONFIG_SUCCESS';

export function setStakePoolInformation(poolHost, apiKey, accountNum, internal) {
  return (dispatch) => {
    if (!internal) {
      dispatch({ type: UPDATESTAKEPOOLCONFIG_ATTEMPT });
    }
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
            dispatch(updateSavedConfig(response.data.data, poolHost, apiKey, accountNum));
          } else if (response.data.status == 'error') {
            if (response.data.message == 'purchaseinfo error - no address submitted') {
              dispatch(setStakePoolAddressAction(poolHost, apiKey, accountNum));
              return (true);
            } else {
              dispatch({ error: response.data.message, type: UPDATESTAKEPOOLCONFIG_FAILED });
            }
          }
        }
      }
    );
  };
}

function updateSavedConfig(newPoolInfo, poolHost, apiKey, accountNum) {
  return (dispatch) => {
    var config = getCfg();
    var stakePoolConfigs = config.get('stakepools');
    var successMessage = 'You have successfully configured ';
    for (var i = 0; i < stakePoolConfigs.length; i++) {
      if (stakePoolConfigs[i].Host == poolHost) {
        stakePoolConfigs[i].ApiKey = apiKey;
        stakePoolConfigs[i].PoolFees = newPoolInfo.PoolFees;
        stakePoolConfigs[i].PoolAddress = newPoolInfo.PoolAddress;
        stakePoolConfigs[i].Script = newPoolInfo.Script;
        stakePoolConfigs[i].TicketAddress = newPoolInfo.TicketAddress;
        stakePoolConfigs[i].VotingAccount = accountNum;
        successMessage += poolHost;
        break;
      }
    }
    config.set('stakepools', stakePoolConfigs);
    dispatch({ successMessage: successMessage, currentStakePoolConfig: stakePoolConfigs, type: UPDATESTAKEPOOLCONFIG_SUCCESS });
  };
}

function setStakePoolAddressAction(poolHost, apiKey, accountNum) {
  return (dispatch, getState) => {
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
            if (err) {
              dispatch({ error: err, type: UPDATESTAKEPOOLCONFIG_FAILED });
            } else if (response.data.status == 'success') {
              dispatch(setStakePoolInformation(poolHost, apiKey, accountNum, true));
            } else if (response.data.status == 'error') {
              dispatch({ error: response.data.message, type: UPDATESTAKEPOOLCONFIG_FAILED });
            } else {
              console.error('shouldn\'t be here set address:', response);
            }
          }
        );
      }
    }
  );
  };
}