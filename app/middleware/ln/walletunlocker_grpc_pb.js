// GENERATED CODE -- DO NOT EDIT!

'use strict';
var walletunlocker_pb = require('./walletunlocker_pb.js');
var rpc_pb = require('./rpc_pb.js');

function serialize_lnrpc_ChangePasswordRequest(arg) {
  if (!(arg instanceof walletunlocker_pb.ChangePasswordRequest)) {
    throw new Error('Expected argument of type lnrpc.ChangePasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChangePasswordRequest(buffer_arg) {
  return walletunlocker_pb.ChangePasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChangePasswordResponse(arg) {
  if (!(arg instanceof walletunlocker_pb.ChangePasswordResponse)) {
    throw new Error('Expected argument of type lnrpc.ChangePasswordResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChangePasswordResponse(buffer_arg) {
  return walletunlocker_pb.ChangePasswordResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GenSeedRequest(arg) {
  if (!(arg instanceof walletunlocker_pb.GenSeedRequest)) {
    throw new Error('Expected argument of type lnrpc.GenSeedRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GenSeedRequest(buffer_arg) {
  return walletunlocker_pb.GenSeedRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GenSeedResponse(arg) {
  if (!(arg instanceof walletunlocker_pb.GenSeedResponse)) {
    throw new Error('Expected argument of type lnrpc.GenSeedResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GenSeedResponse(buffer_arg) {
  return walletunlocker_pb.GenSeedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_InitWalletRequest(arg) {
  if (!(arg instanceof walletunlocker_pb.InitWalletRequest)) {
    throw new Error('Expected argument of type lnrpc.InitWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_InitWalletRequest(buffer_arg) {
  return walletunlocker_pb.InitWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_InitWalletResponse(arg) {
  if (!(arg instanceof walletunlocker_pb.InitWalletResponse)) {
    throw new Error('Expected argument of type lnrpc.InitWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_InitWalletResponse(buffer_arg) {
  return walletunlocker_pb.InitWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_UnlockWalletRequest(arg) {
  if (!(arg instanceof walletunlocker_pb.UnlockWalletRequest)) {
    throw new Error('Expected argument of type lnrpc.UnlockWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_UnlockWalletRequest(buffer_arg) {
  return walletunlocker_pb.UnlockWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_UnlockWalletResponse(arg) {
  if (!(arg instanceof walletunlocker_pb.UnlockWalletResponse)) {
    throw new Error('Expected argument of type lnrpc.UnlockWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_UnlockWalletResponse(buffer_arg) {
  return walletunlocker_pb.UnlockWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


//
// Comments in this file will be directly parsed into the API
// Documentation as descriptions of the associated method, message, or field.
// These descriptions should go right above the definition of the object, and
// can be in either block or // comment format.
//
// An RPC method can be matched to an lncli command by placing a line in the
// beginning of the description in exactly the following format:
// lncli: `methodname`
//
// Failure to specify the exact name of the command will cause documentation
// generation to fail.
//
// More information on how exactly the gRPC documentation is generated from
// this proto file can be found here:
// https://github.com/lightninglabs/lightning-api
//
// WalletUnlocker is a service that is used to set up a wallet password for
// lnd at first startup, and unlock a previously set up wallet.
var WalletUnlockerService = exports['lnrpc.WalletUnlocker'] = {
  //
// GenSeed is the first method that should be used to instantiate a new lnd
// instance. This method allows a caller to generate a new aezeed cipher seed
// given an optional passphrase. If provided, the passphrase will be necessary
// to decrypt the cipherseed to expose the internal wallet seed.
//
// Once the cipherseed is obtained and verified by the user, the InitWallet
// method should be used to commit the newly generated seed, and create the
// wallet.
genSeed: {
    path: '/lnrpc.WalletUnlocker/GenSeed',
    requestStream: false,
    responseStream: false,
    requestType: walletunlocker_pb.GenSeedRequest,
    responseType: walletunlocker_pb.GenSeedResponse,
    requestSerialize: serialize_lnrpc_GenSeedRequest,
    requestDeserialize: deserialize_lnrpc_GenSeedRequest,
    responseSerialize: serialize_lnrpc_GenSeedResponse,
    responseDeserialize: deserialize_lnrpc_GenSeedResponse,
  },
  //
// InitWallet is used when lnd is starting up for the first time to fully
// initialize the daemon and its internal wallet. At the very least a wallet
// password must be provided. This will be used to encrypt sensitive material
// on disk.
//
// In the case of a recovery scenario, the user can also specify their aezeed
// mnemonic and passphrase. If set, then the daemon will use this prior state
// to initialize its internal wallet.
//
// Alternatively, this can be used along with the GenSeed RPC to obtain a
// seed, then present it to the user. Once it has been verified by the user,
// the seed can be fed into this RPC in order to commit the new wallet.
initWallet: {
    path: '/lnrpc.WalletUnlocker/InitWallet',
    requestStream: false,
    responseStream: false,
    requestType: walletunlocker_pb.InitWalletRequest,
    responseType: walletunlocker_pb.InitWalletResponse,
    requestSerialize: serialize_lnrpc_InitWalletRequest,
    requestDeserialize: deserialize_lnrpc_InitWalletRequest,
    responseSerialize: serialize_lnrpc_InitWalletResponse,
    responseDeserialize: deserialize_lnrpc_InitWalletResponse,
  },
  // lncli: `unlock`
// UnlockWallet is used at startup of lnd to provide a password to unlock
// the wallet database.
unlockWallet: {
    path: '/lnrpc.WalletUnlocker/UnlockWallet',
    requestStream: false,
    responseStream: false,
    requestType: walletunlocker_pb.UnlockWalletRequest,
    responseType: walletunlocker_pb.UnlockWalletResponse,
    requestSerialize: serialize_lnrpc_UnlockWalletRequest,
    requestDeserialize: deserialize_lnrpc_UnlockWalletRequest,
    responseSerialize: serialize_lnrpc_UnlockWalletResponse,
    responseDeserialize: deserialize_lnrpc_UnlockWalletResponse,
  },
  // lncli: `changepassword`
// ChangePassword changes the password of the encrypted wallet. This will
// automatically unlock the wallet database if successful.
changePassword: {
    path: '/lnrpc.WalletUnlocker/ChangePassword',
    requestStream: false,
    responseStream: false,
    requestType: walletunlocker_pb.ChangePasswordRequest,
    responseType: walletunlocker_pb.ChangePasswordResponse,
    requestSerialize: serialize_lnrpc_ChangePasswordRequest,
    requestDeserialize: deserialize_lnrpc_ChangePasswordRequest,
    responseSerialize: serialize_lnrpc_ChangePasswordResponse,
    responseDeserialize: deserialize_lnrpc_ChangePasswordResponse,
  },
};

