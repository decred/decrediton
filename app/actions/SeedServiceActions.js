import { seeder, generateRandomSeed, decodeSeed } from '../middleware/grpc/seeder';

import path from 'path';
import os from 'os';
import fs from 'fs';


var Buffer = require('buffer/').Buffer;

export const SEEDER_ATTEMPT = 'SEEDER_ATTEMPT';
export const SEEDER_FAILED = 'SEEDER_FAILED';
export const SEEDER_SUCCESS = 'SEEDER_SUCCESS';

function seederError(error) {
  return { error, type: SEEDER_FAILED };
}

function seederSuccess(seeder) {
  return (dispatch) => {
    dispatch({seeder: seeder, type: SEEDER_SUCCESS });
    dispatch(generateRandomSeedAttempt());
  };
}

export function seederRequest() {
  return (dispatch, getState) => {
    const { getLoaderRequest } = getState().walletLoader;
    dispatch({
      request:
      { address: getLoaderRequest.address, port: getLoaderRequest.port },
      type: SEEDER_ATTEMPT });
    dispatch(getSeeder());
  };
}

function getSeeder() {
  return (dispatch, getState) => {
    const { getSeederRequest } = getState().seedService;
    seeder(getSeederRequest, function(seeder, err) {
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
export const GENERATERANDOMSEED_FAILED = 'GENERATERANDOMSEED_FAILED';
export const GENERATERANDOMSEED_SUCCESS = 'GENERATERANDOMSEED_SUCCESS';

function generateRandomSeedError(error) {
  return { error, type: GENERATERANDOMSEED_FAILED };
}

function generateRandomSeedSuccess(response) {
  return (dispatch) => {
    dispatch({ response: response, type: GENERATERANDOMSEED_SUCCESS });
    dispatch(decodeSeedAttempt(response.seed_mnemonic));
  };
}

export function generateRandomSeedAttempt() {
  return (dispatch) => {
    dispatch({request: {seed_length:0}, type: GENERATERANDOMSEED_ATTEMPT });
    dispatch(generateRandomSeedAction());
  };
}

function generateRandomSeedAction() {
  return (dispatch, getState) => {
    const { seeder, generateRandomSeedRequest } = getState().seedService;
    generateRandomSeed(seeder, generateRandomSeedRequest,
        function(response, err) {
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
    dispatch({response: response, type: DECODESEED_SUCCESS });
  };
}

export function decodeSeedAttempt(mnemonic) {
  return (dispatch) => {
    console.log(mnemonic);
    dispatch({request: {user_input:mnemonic}, type: DECODESEED_ATTEMPT });
    dispatch(decodeSeedAction());
  };
}

function decodeSeedAction() {
  return (dispatch, getState) => {
    const { seeder, decodeSeedRequest } = getState().seedService;
    decodeSeed(seeder, decodeSeedRequest,
        function(response, err) {
          if (err) {
            dispatch(decodeSeedError(err + ' Please try again'));
          } else {
            dispatch(decodeSeedSuccess(response));
          }
        });
  };
}