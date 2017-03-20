import { seeder } from '../middleware/grpc/client';
export const SEEDER_ATTEMPT = 'SEEDER_ATTEMPT';
export const SEEDER_FAILED = 'SEEDER_FAILED';
export const SEEDER_SUCCESS = 'SEEDER_SUCCESS';
import { GenerateRandomSeedRequest, DecodeSeedRequest } from '../middleware/walletrpc/api_pb';
function seederError(error) {
  return { error, type: SEEDER_FAILED };
}

function seederSuccess(seeder) {
  return (dispatch) => {
    dispatch({ seeder: seeder, type: SEEDER_SUCCESS });
  };
}

export function getSeederAttempt() {
  return (dispatch, getState) => {
    const { getLoaderRequest } = getState().walletLoader;
    dispatch({
      request:
      { address: getLoaderRequest.address, port: getLoaderRequest.port },
      type: SEEDER_ATTEMPT
    });
    dispatch(getSeeder());
  };
}

function getSeeder() {
  return (dispatch, getState) => {
    const { getSeederRequest } = getState().seedService;
    seeder(getSeederRequest, function (seeder, err) {
      if (err) {
        dispatch(seederError(err + ' Please try again'));
        //throw err
      } else {
        dispatch(seederSuccess(seeder));
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

function generateRandomSeedError(error) {
  return { error, type: GENERATERANDOMSEED_FAILED };
}

function generateRandomSeedSuccess(response) {
  return (dispatch) => {
    dispatch({ response: response, type: GENERATERANDOMSEED_SUCCESS });
  };
}

export function generateRandomSeedAttempt() {
  return (dispatch) => {
    dispatch({ request: {}, type: GENERATERANDOMSEED_ATTEMPT });
    dispatch(generateRandomSeedAction());
  };
}

function generateRandomSeedAction() {
  var request = new GenerateRandomSeedRequest();
  return (dispatch, getState) => {
    const { seeder } = getState().seedService;
    seeder.generateRandomSeed(request,
      function (err, response) {
        if (err) {
          dispatch(generateRandomSeedError(err + ' Please try again'));
        } else {
          dispatch(generateRandomSeedSuccess(response));
        }
      });
  };
}

export const DECODESEED_ATTEMPT = 'DECODESEED_ATTEMPT';
export const DECODESEED_FAILED = 'DECODESEED_FAILED';
export const DECODESEED_SUCCESS = 'DECODESEED_SUCCESS';

function decodeSeedError(error) {
  return { error, type: DECODESEED_FAILED };
}

function decodeSeedSuccess(response) {
  return (dispatch) => {
    dispatch({ response: response, type: DECODESEED_SUCCESS });
    //dispatch(createWalletRequest(pubPass, privPass, response.getDecodedSeed(), true));
  };
}

export function decodeSeedAttempt(mnemonic) {
  return (dispatch) => {
    dispatch({ request: {}, type: DECODESEED_ATTEMPT });
    dispatch(decodeSeedAction(mnemonic));
  };
}

function decodeSeedAction(mnemonic) {
  var request = new DecodeSeedRequest();
  request.setUserInput(mnemonic);
  return (dispatch, getState) => {
    const { seeder } = getState().seedService;
    seeder.decodeSeed(request,
      function (err, response) {
        if (err) {
          dispatch(decodeSeedError(err + ' Please try again'));
        } else {
          dispatch(decodeSeedSuccess(response));
        }
      });
  };
}
