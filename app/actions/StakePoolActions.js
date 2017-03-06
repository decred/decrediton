import { stakePoolInfo, getPurchaseInfo, setStakePoolAddress } from '../middleware/stakepoolapi';
import { getNextAddress } from './ControlActions';
export const GETSTAKEPOOLINFO_ATTEMPT = 'GETSTAKEPOOLINFO_ATTEMPT';
export const GETSTAKEPOOLINFO_FAILED = 'GETSTAKEPOOLINFO_FAILED';
export const GETSTAKEPOOLINFO_SUCCESS = 'GETSTAKEPOOLINFO_SUCCESS';

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
    getPurchaseInfo(
      poolHost, 
      apiKey,
      function(response, err) {
        if (err) {
          console.error(err);
          return;
        } else {
          // parse response data for no err
          if (response.data.message == 'success') {
            console.log(response.data.data);
          } else if (response.data.message == 'error') {
            console.error(response.data.data)
          }
          
        }
      });
      /*
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
          addressPubKey = getNextAddressResponse.GetPublicKey();
        }
      });
    

    dispatch({ updatedStakePoolConfig: updatedStakePoolConfig, type: SETSTAKEPOOLAPIKEY });
    */
  };
}

function setStakePoolAddressAttempt(poolConfig) {
  return (dispatch, getState) => {
    const { getNextAddress } = getState().control
    setStakePoolAddress(
      poolConfig.Host, 
      poolConfig.ApiKey,
      getNextAddress.GetPublicKey(),
      function(response, err) {
        if (err) {
          console.error(err);
        } else {
          // parse response data for no err
          console.log(response);
        }
    });
  }
}