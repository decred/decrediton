// @flow
import { seeder } from '../middleware/grpc/client';
export const SEEDER_ATTEMPT = 'SEEDER_ATTEMPT';
export const SEEDER_FAILED = 'SEEDER_FAILED';
export const SEEDER_SUCCESS = 'SEEDER_SUCCESS';
import { GenerateRandomSeedRequest, DecodeSeedRequest } from '../middleware/walletrpc/api_pb';

export function getSeederAttempt() {
  return (dispatch, getState) => {
    const { address, port } = getState().walletLoader;
    dispatch({ type: SEEDER_ATTEMPT });
    var request = { address: address, port: port };
    seeder(request, function(seeder, error) {
      if (error) {
        dispatch({ error, type: SEEDER_FAILED });
      } else {
        dispatch({seeder: seeder, type: SEEDER_SUCCESS });
      }
    });
  };
}

export const GENERATERANDOMSEED_ATTEMPT = 'GENERATERANDOMSEED_ATTEMPT';
export const GENERATERANDOMSEED_CLEAR = 'GENERATERANDOMSEED_CLEAR';
export const GENERATERANDOMSEED_FAILED = 'GENERATERANDOMSEED_FAILED';
export const GENERATERANDOMSEED_SUCCESS = 'GENERATERANDOMSEED_SUCCESS';

export function generateRandomSeedClear(response) {
  return (dispatch) => {
    dispatch({ response: response, type: GENERATERANDOMSEED_CLEAR });
  };
}

export function generateRandomSeedAttempt() {
  var request = new GenerateRandomSeedRequest();
  return (dispatch, getState) => {
    dispatch({request: {}, type: GENERATERANDOMSEED_ATTEMPT });
    const { seeder } = getState().seedService;
    seeder.generateRandomSeed(request,
      function(error, response) {
        if (error) {
          dispatch({ error, type: GENERATERANDOMSEED_FAILED });
        } else {
          dispatch({ response: response, type: GENERATERANDOMSEED_SUCCESS });
        }
      });
  };
}

export const DECODESEED_ATTEMPT = 'DECODESEED_ATTEMPT';
export const DECODESEED_FAILED = 'DECODESEED_FAILED';
export const DECODESEED_SUCCESS = 'DECODESEED_SUCCESS';


export function decodeSeedAttempt(mnemonic) {
  var request = new DecodeSeedRequest();
  request.setUserInput(mnemonic);
  return (dispatch, getState) => {
    dispatch({request: {}, type: DECODESEED_ATTEMPT });
    const { seeder } = getState().seedService;
    seeder.decodeSeed(request,
        function(error, response) {
          if (error) {
            dispatch({ error, type: DECODESEED_FAILED });
          } else {
            dispatch({response: response, type: DECODESEED_SUCCESS });
          }
        });
  };
}
