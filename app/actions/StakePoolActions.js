import { stakePoolInfo, getPurchaseInfo, setStakePoolAddress } from '../middleware/stakepoolapi';
import { getNextAddress } from './ControlActions';
export const GETSTAKEPOOLINFO_ATTEMPT = 'GETSTAKEPOOLINFO_ATTEMPT';
export const GETSTAKEPOOLINFO_FAILED = 'GETSTAKEPOOLINFO_FAILED';
export const GETSTAKEPOOLINFO_SUCCESS = 'GETSTAKEPOOLINFO_SUCCESS';

import { NextAddressRequest } from '../middleware/walletrpc/api_pb';

function getStakePoolInfoError(error) {
  return { error, type: GETSTAKEPOOLINFO_FAILED };
}

function getStakePoolInfoSuccess(response) {
  return (dispatch, getState) => {
    const { network } = getState().grpc;
    const { stakePoolConfig } = getState().stakepool;
    var stakePoolNames = Object.keys(response.data);
    var usablePools = Array();
    // Only add matching network stakepool info
    var foundStakePoolConfigs = stakePoolConfig;
    for (var i = 0; i < stakePoolNames.length; i++) {
      if (response.data[stakePoolNames[i]].Network == network) {
        if (foundStakePoolConfigs == null) {
          foundStakePoolConfigs = Array({
            Host:response.data[stakePoolNames[i]].URL,
            ApiKey:"",
            MultigsigVoteScript:"",
            VotingAccount:"",
          });
        } else {
          foundStakePoolConfigs.push({
            Host:response.data[stakePoolNames[i]].URL,
            ApiKey:"",
            MultigsigVoteScript:"",
            VotingAccount:"",
          });
        }
      }
    }
    dispatch({ stakePoolConfig: foundStakePoolConfigs, type: GETSTAKEPOOLINFO_SUCCESS });
  };
}
export function getStakePoolInfoAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETSTAKEPOOLINFO_ATTEMPT });
    dispatch(getStakePoolInfoAction());
  };
}
function getStakePoolInfoAction() {
  return (dispatch) => {
    stakePoolInfo(function(response, err) {
      if (err) {
        dispatch(getStakePoolInfoError(err + ' Please try again'));
      } else {
        dispatch(getStakePoolInfoSuccess(response));
      }
    });
  };
}

export const SETSTAKEPOOLAPIKEY = "SETSTAKEPOOLAPIKEY"
export function setStakePoolInformation(poolHost, apiKey, accountNum) {
  return (dispatch, getState) => {
    var needAddress = false;
    var poolInfo = null;
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
            dispatch({ stakePoolData: response.data.data, type: SETSTAKEPOOLAPIKEY });
          } else if (response.data.status == 'error') {
            if (response.data.message == 'purchaseinfo error - no address submitted') {
              dispatch(setStakePoolAddressAction(poolHost, apiKey, accountNum));
              console.log("setting need address to true");
              return (true);
            } else {
              console.error(response.data.message);
            }
          } else {
            console.error("shouldn't be here:", response);
          }
          
        }
      }
    );
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
              dispatch(setStakePoolInformation(poolHost, apiKey, accountNum));
            } else if (response.data.status == 'error') {
              console.error(response.data.message);
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