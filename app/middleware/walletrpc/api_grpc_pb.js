// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var api_pb = require('./api_pb.js');

function serialize_walletrpc_AccountNotificationsRequest(arg) {
  if (!(arg instanceof api_pb.AccountNotificationsRequest)) {
    throw new Error('Expected argument of type walletrpc.AccountNotificationsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNotificationsRequest(buffer_arg) {
  return api_pb.AccountNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountNotificationsResponse(arg) {
  if (!(arg instanceof api_pb.AccountNotificationsResponse)) {
    throw new Error('Expected argument of type walletrpc.AccountNotificationsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNotificationsResponse(buffer_arg) {
  return api_pb.AccountNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountNumberRequest(arg) {
  if (!(arg instanceof api_pb.AccountNumberRequest)) {
    throw new Error('Expected argument of type walletrpc.AccountNumberRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNumberRequest(buffer_arg) {
  return api_pb.AccountNumberRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountNumberResponse(arg) {
  if (!(arg instanceof api_pb.AccountNumberResponse)) {
    throw new Error('Expected argument of type walletrpc.AccountNumberResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNumberResponse(buffer_arg) {
  return api_pb.AccountNumberResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountsRequest(arg) {
  if (!(arg instanceof api_pb.AccountsRequest)) {
    throw new Error('Expected argument of type walletrpc.AccountsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_AccountsRequest(buffer_arg) {
  return api_pb.AccountsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountsResponse(arg) {
  if (!(arg instanceof api_pb.AccountsResponse)) {
    throw new Error('Expected argument of type walletrpc.AccountsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_AccountsResponse(buffer_arg) {
  return api_pb.AccountsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BalanceRequest(arg) {
  if (!(arg instanceof api_pb.BalanceRequest)) {
    throw new Error('Expected argument of type walletrpc.BalanceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_BalanceRequest(buffer_arg) {
  return api_pb.BalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BalanceResponse(arg) {
  if (!(arg instanceof api_pb.BalanceResponse)) {
    throw new Error('Expected argument of type walletrpc.BalanceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_BalanceResponse(buffer_arg) {
  return api_pb.BalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ChangePassphraseRequest(arg) {
  if (!(arg instanceof api_pb.ChangePassphraseRequest)) {
    throw new Error('Expected argument of type walletrpc.ChangePassphraseRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ChangePassphraseRequest(buffer_arg) {
  return api_pb.ChangePassphraseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ChangePassphraseResponse(arg) {
  if (!(arg instanceof api_pb.ChangePassphraseResponse)) {
    throw new Error('Expected argument of type walletrpc.ChangePassphraseResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ChangePassphraseResponse(buffer_arg) {
  return api_pb.ChangePassphraseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CloseWalletRequest(arg) {
  if (!(arg instanceof api_pb.CloseWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.CloseWalletRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_CloseWalletRequest(buffer_arg) {
  return api_pb.CloseWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CloseWalletResponse(arg) {
  if (!(arg instanceof api_pb.CloseWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.CloseWalletResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_CloseWalletResponse(buffer_arg) {
  return api_pb.CloseWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ConstructTransactionRequest(arg) {
  if (!(arg instanceof api_pb.ConstructTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.ConstructTransactionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ConstructTransactionRequest(buffer_arg) {
  return api_pb.ConstructTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ConstructTransactionResponse(arg) {
  if (!(arg instanceof api_pb.ConstructTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.ConstructTransactionResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ConstructTransactionResponse(buffer_arg) {
  return api_pb.ConstructTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateWalletRequest(arg) {
  if (!(arg instanceof api_pb.CreateWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.CreateWalletRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_CreateWalletRequest(buffer_arg) {
  return api_pb.CreateWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateWalletResponse(arg) {
  if (!(arg instanceof api_pb.CreateWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.CreateWalletResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_CreateWalletResponse(buffer_arg) {
  return api_pb.CreateWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DecodeSeedRequest(arg) {
  if (!(arg instanceof api_pb.DecodeSeedRequest)) {
    throw new Error('Expected argument of type walletrpc.DecodeSeedRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_DecodeSeedRequest(buffer_arg) {
  return api_pb.DecodeSeedRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DecodeSeedResponse(arg) {
  if (!(arg instanceof api_pb.DecodeSeedResponse)) {
    throw new Error('Expected argument of type walletrpc.DecodeSeedResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_DecodeSeedResponse(buffer_arg) {
  return api_pb.DecodeSeedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DiscoverAddressesRequest(arg) {
  if (!(arg instanceof api_pb.DiscoverAddressesRequest)) {
    throw new Error('Expected argument of type walletrpc.DiscoverAddressesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_DiscoverAddressesRequest(buffer_arg) {
  return api_pb.DiscoverAddressesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DiscoverAddressesResponse(arg) {
  if (!(arg instanceof api_pb.DiscoverAddressesResponse)) {
    throw new Error('Expected argument of type walletrpc.DiscoverAddressesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_DiscoverAddressesResponse(buffer_arg) {
  return api_pb.DiscoverAddressesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_FetchHeadersRequest(arg) {
  if (!(arg instanceof api_pb.FetchHeadersRequest)) {
    throw new Error('Expected argument of type walletrpc.FetchHeadersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_FetchHeadersRequest(buffer_arg) {
  return api_pb.FetchHeadersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_FetchHeadersResponse(arg) {
  if (!(arg instanceof api_pb.FetchHeadersResponse)) {
    throw new Error('Expected argument of type walletrpc.FetchHeadersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_FetchHeadersResponse(buffer_arg) {
  return api_pb.FetchHeadersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_FundTransactionRequest(arg) {
  if (!(arg instanceof api_pb.FundTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.FundTransactionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_FundTransactionRequest(buffer_arg) {
  return api_pb.FundTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_FundTransactionResponse(arg) {
  if (!(arg instanceof api_pb.FundTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.FundTransactionResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_FundTransactionResponse(buffer_arg) {
  return api_pb.FundTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GenerateRandomSeedRequest(arg) {
  if (!(arg instanceof api_pb.GenerateRandomSeedRequest)) {
    throw new Error('Expected argument of type walletrpc.GenerateRandomSeedRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_GenerateRandomSeedRequest(buffer_arg) {
  return api_pb.GenerateRandomSeedRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GenerateRandomSeedResponse(arg) {
  if (!(arg instanceof api_pb.GenerateRandomSeedResponse)) {
    throw new Error('Expected argument of type walletrpc.GenerateRandomSeedResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_GenerateRandomSeedResponse(buffer_arg) {
  return api_pb.GenerateRandomSeedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTransactionsRequest(arg) {
  if (!(arg instanceof api_pb.GetTransactionsRequest)) {
    throw new Error('Expected argument of type walletrpc.GetTransactionsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_GetTransactionsRequest(buffer_arg) {
  return api_pb.GetTransactionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTransactionsResponse(arg) {
  if (!(arg instanceof api_pb.GetTransactionsResponse)) {
    throw new Error('Expected argument of type walletrpc.GetTransactionsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_GetTransactionsResponse(buffer_arg) {
  return api_pb.GetTransactionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportPrivateKeyRequest(arg) {
  if (!(arg instanceof api_pb.ImportPrivateKeyRequest)) {
    throw new Error('Expected argument of type walletrpc.ImportPrivateKeyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ImportPrivateKeyRequest(buffer_arg) {
  return api_pb.ImportPrivateKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportPrivateKeyResponse(arg) {
  if (!(arg instanceof api_pb.ImportPrivateKeyResponse)) {
    throw new Error('Expected argument of type walletrpc.ImportPrivateKeyResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ImportPrivateKeyResponse(buffer_arg) {
  return api_pb.ImportPrivateKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportScriptRequest(arg) {
  if (!(arg instanceof api_pb.ImportScriptRequest)) {
    throw new Error('Expected argument of type walletrpc.ImportScriptRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ImportScriptRequest(buffer_arg) {
  return api_pb.ImportScriptRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportScriptResponse(arg) {
  if (!(arg instanceof api_pb.ImportScriptResponse)) {
    throw new Error('Expected argument of type walletrpc.ImportScriptResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_ImportScriptResponse(buffer_arg) {
  return api_pb.ImportScriptResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LoadActiveDataFiltersRequest(arg) {
  if (!(arg instanceof api_pb.LoadActiveDataFiltersRequest)) {
    throw new Error('Expected argument of type walletrpc.LoadActiveDataFiltersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_LoadActiveDataFiltersRequest(buffer_arg) {
  return api_pb.LoadActiveDataFiltersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LoadActiveDataFiltersResponse(arg) {
  if (!(arg instanceof api_pb.LoadActiveDataFiltersResponse)) {
    throw new Error('Expected argument of type walletrpc.LoadActiveDataFiltersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_LoadActiveDataFiltersResponse(buffer_arg) {
  return api_pb.LoadActiveDataFiltersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NetworkRequest(arg) {
  if (!(arg instanceof api_pb.NetworkRequest)) {
    throw new Error('Expected argument of type walletrpc.NetworkRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_NetworkRequest(buffer_arg) {
  return api_pb.NetworkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NetworkResponse(arg) {
  if (!(arg instanceof api_pb.NetworkResponse)) {
    throw new Error('Expected argument of type walletrpc.NetworkResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_NetworkResponse(buffer_arg) {
  return api_pb.NetworkResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAccountRequest(arg) {
  if (!(arg instanceof api_pb.NextAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.NextAccountRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_NextAccountRequest(buffer_arg) {
  return api_pb.NextAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAccountResponse(arg) {
  if (!(arg instanceof api_pb.NextAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.NextAccountResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_NextAccountResponse(buffer_arg) {
  return api_pb.NextAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAddressRequest(arg) {
  if (!(arg instanceof api_pb.NextAddressRequest)) {
    throw new Error('Expected argument of type walletrpc.NextAddressRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_NextAddressRequest(buffer_arg) {
  return api_pb.NextAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAddressResponse(arg) {
  if (!(arg instanceof api_pb.NextAddressResponse)) {
    throw new Error('Expected argument of type walletrpc.NextAddressResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_NextAddressResponse(buffer_arg) {
  return api_pb.NextAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_OpenWalletRequest(arg) {
  if (!(arg instanceof api_pb.OpenWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.OpenWalletRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_OpenWalletRequest(buffer_arg) {
  return api_pb.OpenWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_OpenWalletResponse(arg) {
  if (!(arg instanceof api_pb.OpenWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.OpenWalletResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_OpenWalletResponse(buffer_arg) {
  return api_pb.OpenWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PingRequest(arg) {
  if (!(arg instanceof api_pb.PingRequest)) {
    throw new Error('Expected argument of type walletrpc.PingRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_PingRequest(buffer_arg) {
  return api_pb.PingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PingResponse(arg) {
  if (!(arg instanceof api_pb.PingResponse)) {
    throw new Error('Expected argument of type walletrpc.PingResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_PingResponse(buffer_arg) {
  return api_pb.PingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PublishTransactionRequest(arg) {
  if (!(arg instanceof api_pb.PublishTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.PublishTransactionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_PublishTransactionRequest(buffer_arg) {
  return api_pb.PublishTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PublishTransactionResponse(arg) {
  if (!(arg instanceof api_pb.PublishTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.PublishTransactionResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_PublishTransactionResponse(buffer_arg) {
  return api_pb.PublishTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PurchaseTicketsRequest(arg) {
  if (!(arg instanceof api_pb.PurchaseTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.PurchaseTicketsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_PurchaseTicketsRequest(buffer_arg) {
  return api_pb.PurchaseTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PurchaseTicketsResponse(arg) {
  if (!(arg instanceof api_pb.PurchaseTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.PurchaseTicketsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_PurchaseTicketsResponse(buffer_arg) {
  return api_pb.PurchaseTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RenameAccountRequest(arg) {
  if (!(arg instanceof api_pb.RenameAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.RenameAccountRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_RenameAccountRequest(buffer_arg) {
  return api_pb.RenameAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RenameAccountResponse(arg) {
  if (!(arg instanceof api_pb.RenameAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.RenameAccountResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_RenameAccountResponse(buffer_arg) {
  return api_pb.RenameAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RescanRequest(arg) {
  if (!(arg instanceof api_pb.RescanRequest)) {
    throw new Error('Expected argument of type walletrpc.RescanRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_RescanRequest(buffer_arg) {
  return api_pb.RescanRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RescanResponse(arg) {
  if (!(arg instanceof api_pb.RescanResponse)) {
    throw new Error('Expected argument of type walletrpc.RescanResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_RescanResponse(buffer_arg) {
  return api_pb.RescanResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignTransactionRequest(arg) {
  if (!(arg instanceof api_pb.SignTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.SignTransactionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_SignTransactionRequest(buffer_arg) {
  return api_pb.SignTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignTransactionResponse(arg) {
  if (!(arg instanceof api_pb.SignTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.SignTransactionResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_SignTransactionResponse(buffer_arg) {
  return api_pb.SignTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SpentnessNotificationsRequest(arg) {
  if (!(arg instanceof api_pb.SpentnessNotificationsRequest)) {
    throw new Error('Expected argument of type walletrpc.SpentnessNotificationsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_SpentnessNotificationsRequest(buffer_arg) {
  return api_pb.SpentnessNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SpentnessNotificationsResponse(arg) {
  if (!(arg instanceof api_pb.SpentnessNotificationsResponse)) {
    throw new Error('Expected argument of type walletrpc.SpentnessNotificationsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_SpentnessNotificationsResponse(buffer_arg) {
  return api_pb.SpentnessNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StakeInfoRequest(arg) {
  if (!(arg instanceof api_pb.StakeInfoRequest)) {
    throw new Error('Expected argument of type walletrpc.StakeInfoRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StakeInfoRequest(buffer_arg) {
  return api_pb.StakeInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StakeInfoResponse(arg) {
  if (!(arg instanceof api_pb.StakeInfoResponse)) {
    throw new Error('Expected argument of type walletrpc.StakeInfoResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StakeInfoResponse(buffer_arg) {
  return api_pb.StakeInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StartAutoBuyerRequest(arg) {
  if (!(arg instanceof api_pb.StartAutoBuyerRequest)) {
    throw new Error('Expected argument of type walletrpc.StartAutoBuyerRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StartAutoBuyerRequest(buffer_arg) {
  return api_pb.StartAutoBuyerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StartAutoBuyerResponse(arg) {
  if (!(arg instanceof api_pb.StartAutoBuyerResponse)) {
    throw new Error('Expected argument of type walletrpc.StartAutoBuyerResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StartAutoBuyerResponse(buffer_arg) {
  return api_pb.StartAutoBuyerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StartConsensusRpcRequest(arg) {
  if (!(arg instanceof api_pb.StartConsensusRpcRequest)) {
    throw new Error('Expected argument of type walletrpc.StartConsensusRpcRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StartConsensusRpcRequest(buffer_arg) {
  return api_pb.StartConsensusRpcRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StartConsensusRpcResponse(arg) {
  if (!(arg instanceof api_pb.StartConsensusRpcResponse)) {
    throw new Error('Expected argument of type walletrpc.StartConsensusRpcResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StartConsensusRpcResponse(buffer_arg) {
  return api_pb.StartConsensusRpcResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StopAutoBuyerRequest(arg) {
  if (!(arg instanceof api_pb.StopAutoBuyerRequest)) {
    throw new Error('Expected argument of type walletrpc.StopAutoBuyerRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StopAutoBuyerRequest(buffer_arg) {
  return api_pb.StopAutoBuyerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StopAutoBuyerResponse(arg) {
  if (!(arg instanceof api_pb.StopAutoBuyerResponse)) {
    throw new Error('Expected argument of type walletrpc.StopAutoBuyerResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_StopAutoBuyerResponse(buffer_arg) {
  return api_pb.StopAutoBuyerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SubscribeToBlockNotificationsRequest(arg) {
  if (!(arg instanceof api_pb.SubscribeToBlockNotificationsRequest)) {
    throw new Error('Expected argument of type walletrpc.SubscribeToBlockNotificationsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_SubscribeToBlockNotificationsRequest(buffer_arg) {
  return api_pb.SubscribeToBlockNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SubscribeToBlockNotificationsResponse(arg) {
  if (!(arg instanceof api_pb.SubscribeToBlockNotificationsResponse)) {
    throw new Error('Expected argument of type walletrpc.SubscribeToBlockNotificationsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_SubscribeToBlockNotificationsResponse(buffer_arg) {
  return api_pb.SubscribeToBlockNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TicketPriceRequest(arg) {
  if (!(arg instanceof api_pb.TicketPriceRequest)) {
    throw new Error('Expected argument of type walletrpc.TicketPriceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_TicketPriceRequest(buffer_arg) {
  return api_pb.TicketPriceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TicketPriceResponse(arg) {
  if (!(arg instanceof api_pb.TicketPriceResponse)) {
    throw new Error('Expected argument of type walletrpc.TicketPriceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_TicketPriceResponse(buffer_arg) {
  return api_pb.TicketPriceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TransactionNotificationsRequest(arg) {
  if (!(arg instanceof api_pb.TransactionNotificationsRequest)) {
    throw new Error('Expected argument of type walletrpc.TransactionNotificationsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_TransactionNotificationsRequest(buffer_arg) {
  return api_pb.TransactionNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TransactionNotificationsResponse(arg) {
  if (!(arg instanceof api_pb.TransactionNotificationsResponse)) {
    throw new Error('Expected argument of type walletrpc.TransactionNotificationsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_TransactionNotificationsResponse(buffer_arg) {
  return api_pb.TransactionNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VersionRequest(arg) {
  if (!(arg instanceof api_pb.VersionRequest)) {
    throw new Error('Expected argument of type walletrpc.VersionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_VersionRequest(buffer_arg) {
  return api_pb.VersionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VersionResponse(arg) {
  if (!(arg instanceof api_pb.VersionResponse)) {
    throw new Error('Expected argument of type walletrpc.VersionResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_VersionResponse(buffer_arg) {
  return api_pb.VersionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_WalletExistsRequest(arg) {
  if (!(arg instanceof api_pb.WalletExistsRequest)) {
    throw new Error('Expected argument of type walletrpc.WalletExistsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_WalletExistsRequest(buffer_arg) {
  return api_pb.WalletExistsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_WalletExistsResponse(arg) {
  if (!(arg instanceof api_pb.WalletExistsResponse)) {
    throw new Error('Expected argument of type walletrpc.WalletExistsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_walletrpc_WalletExistsResponse(buffer_arg) {
  return api_pb.WalletExistsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var VersionServiceService = exports.VersionServiceService = {
  version: {
    path: '/walletrpc.VersionService/Version',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.VersionRequest,
    responseType: api_pb.VersionResponse,
    requestSerialize: serialize_walletrpc_VersionRequest,
    requestDeserialize: deserialize_walletrpc_VersionRequest,
    responseSerialize: serialize_walletrpc_VersionResponse,
    responseDeserialize: deserialize_walletrpc_VersionResponse,
  },
};

exports.VersionServiceClient = grpc.makeGenericClientConstructor(VersionServiceService);
var WalletServiceService = exports.WalletServiceService = {
  // Queries
  ping: {
    path: '/walletrpc.WalletService/Ping',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.PingRequest,
    responseType: api_pb.PingResponse,
    requestSerialize: serialize_walletrpc_PingRequest,
    requestDeserialize: deserialize_walletrpc_PingRequest,
    responseSerialize: serialize_walletrpc_PingResponse,
    responseDeserialize: deserialize_walletrpc_PingResponse,
  },
  network: {
    path: '/walletrpc.WalletService/Network',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.NetworkRequest,
    responseType: api_pb.NetworkResponse,
    requestSerialize: serialize_walletrpc_NetworkRequest,
    requestDeserialize: deserialize_walletrpc_NetworkRequest,
    responseSerialize: serialize_walletrpc_NetworkResponse,
    responseDeserialize: deserialize_walletrpc_NetworkResponse,
  },
  accountNumber: {
    path: '/walletrpc.WalletService/AccountNumber',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.AccountNumberRequest,
    responseType: api_pb.AccountNumberResponse,
    requestSerialize: serialize_walletrpc_AccountNumberRequest,
    requestDeserialize: deserialize_walletrpc_AccountNumberRequest,
    responseSerialize: serialize_walletrpc_AccountNumberResponse,
    responseDeserialize: deserialize_walletrpc_AccountNumberResponse,
  },
  accounts: {
    path: '/walletrpc.WalletService/Accounts',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.AccountsRequest,
    responseType: api_pb.AccountsResponse,
    requestSerialize: serialize_walletrpc_AccountsRequest,
    requestDeserialize: deserialize_walletrpc_AccountsRequest,
    responseSerialize: serialize_walletrpc_AccountsResponse,
    responseDeserialize: deserialize_walletrpc_AccountsResponse,
  },
  balance: {
    path: '/walletrpc.WalletService/Balance',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.BalanceRequest,
    responseType: api_pb.BalanceResponse,
    requestSerialize: serialize_walletrpc_BalanceRequest,
    requestDeserialize: deserialize_walletrpc_BalanceRequest,
    responseSerialize: serialize_walletrpc_BalanceResponse,
    responseDeserialize: deserialize_walletrpc_BalanceResponse,
  },
  getTransactions: {
    path: '/walletrpc.WalletService/GetTransactions',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.GetTransactionsRequest,
    responseType: api_pb.GetTransactionsResponse,
    requestSerialize: serialize_walletrpc_GetTransactionsRequest,
    requestDeserialize: deserialize_walletrpc_GetTransactionsRequest,
    responseSerialize: serialize_walletrpc_GetTransactionsResponse,
    responseDeserialize: deserialize_walletrpc_GetTransactionsResponse,
  },
  ticketPrice: {
    path: '/walletrpc.WalletService/TicketPrice',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.TicketPriceRequest,
    responseType: api_pb.TicketPriceResponse,
    requestSerialize: serialize_walletrpc_TicketPriceRequest,
    requestDeserialize: deserialize_walletrpc_TicketPriceRequest,
    responseSerialize: serialize_walletrpc_TicketPriceResponse,
    responseDeserialize: deserialize_walletrpc_TicketPriceResponse,
  },
  stakeInfo: {
    path: '/walletrpc.WalletService/StakeInfo',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.StakeInfoRequest,
    responseType: api_pb.StakeInfoResponse,
    requestSerialize: serialize_walletrpc_StakeInfoRequest,
    requestDeserialize: deserialize_walletrpc_StakeInfoRequest,
    responseSerialize: serialize_walletrpc_StakeInfoResponse,
    responseDeserialize: deserialize_walletrpc_StakeInfoResponse,
  },
  // Notifications
  transactionNotifications: {
    path: '/walletrpc.WalletService/TransactionNotifications',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.TransactionNotificationsRequest,
    responseType: api_pb.TransactionNotificationsResponse,
    requestSerialize: serialize_walletrpc_TransactionNotificationsRequest,
    requestDeserialize: deserialize_walletrpc_TransactionNotificationsRequest,
    responseSerialize: serialize_walletrpc_TransactionNotificationsResponse,
    responseDeserialize: deserialize_walletrpc_TransactionNotificationsResponse,
  },
  spentnessNotifications: {
    path: '/walletrpc.WalletService/SpentnessNotifications',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.SpentnessNotificationsRequest,
    responseType: api_pb.SpentnessNotificationsResponse,
    requestSerialize: serialize_walletrpc_SpentnessNotificationsRequest,
    requestDeserialize: deserialize_walletrpc_SpentnessNotificationsRequest,
    responseSerialize: serialize_walletrpc_SpentnessNotificationsResponse,
    responseDeserialize: deserialize_walletrpc_SpentnessNotificationsResponse,
  },
  accountNotifications: {
    path: '/walletrpc.WalletService/AccountNotifications',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.AccountNotificationsRequest,
    responseType: api_pb.AccountNotificationsResponse,
    requestSerialize: serialize_walletrpc_AccountNotificationsRequest,
    requestDeserialize: deserialize_walletrpc_AccountNotificationsRequest,
    responseSerialize: serialize_walletrpc_AccountNotificationsResponse,
    responseDeserialize: deserialize_walletrpc_AccountNotificationsResponse,
  },
  // Control
  changePassphrase: {
    path: '/walletrpc.WalletService/ChangePassphrase',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ChangePassphraseRequest,
    responseType: api_pb.ChangePassphraseResponse,
    requestSerialize: serialize_walletrpc_ChangePassphraseRequest,
    requestDeserialize: deserialize_walletrpc_ChangePassphraseRequest,
    responseSerialize: serialize_walletrpc_ChangePassphraseResponse,
    responseDeserialize: deserialize_walletrpc_ChangePassphraseResponse,
  },
  renameAccount: {
    path: '/walletrpc.WalletService/RenameAccount',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.RenameAccountRequest,
    responseType: api_pb.RenameAccountResponse,
    requestSerialize: serialize_walletrpc_RenameAccountRequest,
    requestDeserialize: deserialize_walletrpc_RenameAccountRequest,
    responseSerialize: serialize_walletrpc_RenameAccountResponse,
    responseDeserialize: deserialize_walletrpc_RenameAccountResponse,
  },
  rescan: {
    path: '/walletrpc.WalletService/Rescan',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.RescanRequest,
    responseType: api_pb.RescanResponse,
    requestSerialize: serialize_walletrpc_RescanRequest,
    requestDeserialize: deserialize_walletrpc_RescanRequest,
    responseSerialize: serialize_walletrpc_RescanResponse,
    responseDeserialize: deserialize_walletrpc_RescanResponse,
  },
  nextAccount: {
    path: '/walletrpc.WalletService/NextAccount',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.NextAccountRequest,
    responseType: api_pb.NextAccountResponse,
    requestSerialize: serialize_walletrpc_NextAccountRequest,
    requestDeserialize: deserialize_walletrpc_NextAccountRequest,
    responseSerialize: serialize_walletrpc_NextAccountResponse,
    responseDeserialize: deserialize_walletrpc_NextAccountResponse,
  },
  nextAddress: {
    path: '/walletrpc.WalletService/NextAddress',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.NextAddressRequest,
    responseType: api_pb.NextAddressResponse,
    requestSerialize: serialize_walletrpc_NextAddressRequest,
    requestDeserialize: deserialize_walletrpc_NextAddressRequest,
    responseSerialize: serialize_walletrpc_NextAddressResponse,
    responseDeserialize: deserialize_walletrpc_NextAddressResponse,
  },
  importPrivateKey: {
    path: '/walletrpc.WalletService/ImportPrivateKey',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ImportPrivateKeyRequest,
    responseType: api_pb.ImportPrivateKeyResponse,
    requestSerialize: serialize_walletrpc_ImportPrivateKeyRequest,
    requestDeserialize: deserialize_walletrpc_ImportPrivateKeyRequest,
    responseSerialize: serialize_walletrpc_ImportPrivateKeyResponse,
    responseDeserialize: deserialize_walletrpc_ImportPrivateKeyResponse,
  },
  importScript: {
    path: '/walletrpc.WalletService/ImportScript',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ImportScriptRequest,
    responseType: api_pb.ImportScriptResponse,
    requestSerialize: serialize_walletrpc_ImportScriptRequest,
    requestDeserialize: deserialize_walletrpc_ImportScriptRequest,
    responseSerialize: serialize_walletrpc_ImportScriptResponse,
    responseDeserialize: deserialize_walletrpc_ImportScriptResponse,
  },
  fundTransaction: {
    path: '/walletrpc.WalletService/FundTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.FundTransactionRequest,
    responseType: api_pb.FundTransactionResponse,
    requestSerialize: serialize_walletrpc_FundTransactionRequest,
    requestDeserialize: deserialize_walletrpc_FundTransactionRequest,
    responseSerialize: serialize_walletrpc_FundTransactionResponse,
    responseDeserialize: deserialize_walletrpc_FundTransactionResponse,
  },
  constructTransaction: {
    path: '/walletrpc.WalletService/ConstructTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ConstructTransactionRequest,
    responseType: api_pb.ConstructTransactionResponse,
    requestSerialize: serialize_walletrpc_ConstructTransactionRequest,
    requestDeserialize: deserialize_walletrpc_ConstructTransactionRequest,
    responseSerialize: serialize_walletrpc_ConstructTransactionResponse,
    responseDeserialize: deserialize_walletrpc_ConstructTransactionResponse,
  },
  signTransaction: {
    path: '/walletrpc.WalletService/SignTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SignTransactionRequest,
    responseType: api_pb.SignTransactionResponse,
    requestSerialize: serialize_walletrpc_SignTransactionRequest,
    requestDeserialize: deserialize_walletrpc_SignTransactionRequest,
    responseSerialize: serialize_walletrpc_SignTransactionResponse,
    responseDeserialize: deserialize_walletrpc_SignTransactionResponse,
  },
  publishTransaction: {
    path: '/walletrpc.WalletService/PublishTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.PublishTransactionRequest,
    responseType: api_pb.PublishTransactionResponse,
    requestSerialize: serialize_walletrpc_PublishTransactionRequest,
    requestDeserialize: deserialize_walletrpc_PublishTransactionRequest,
    responseSerialize: serialize_walletrpc_PublishTransactionResponse,
    responseDeserialize: deserialize_walletrpc_PublishTransactionResponse,
  },
  purchaseTickets: {
    path: '/walletrpc.WalletService/PurchaseTickets',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.PurchaseTicketsRequest,
    responseType: api_pb.PurchaseTicketsResponse,
    requestSerialize: serialize_walletrpc_PurchaseTicketsRequest,
    requestDeserialize: deserialize_walletrpc_PurchaseTicketsRequest,
    responseSerialize: serialize_walletrpc_PurchaseTicketsResponse,
    responseDeserialize: deserialize_walletrpc_PurchaseTicketsResponse,
  },
  loadActiveDataFilters: {
    path: '/walletrpc.WalletService/LoadActiveDataFilters',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.LoadActiveDataFiltersRequest,
    responseType: api_pb.LoadActiveDataFiltersResponse,
    requestSerialize: serialize_walletrpc_LoadActiveDataFiltersRequest,
    requestDeserialize: deserialize_walletrpc_LoadActiveDataFiltersRequest,
    responseSerialize: serialize_walletrpc_LoadActiveDataFiltersResponse,
    responseDeserialize: deserialize_walletrpc_LoadActiveDataFiltersResponse,
  },
};

exports.WalletServiceClient = grpc.makeGenericClientConstructor(WalletServiceService);
var WalletLoaderServiceService = exports.WalletLoaderServiceService = {
  walletExists: {
    path: '/walletrpc.WalletLoaderService/WalletExists',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.WalletExistsRequest,
    responseType: api_pb.WalletExistsResponse,
    requestSerialize: serialize_walletrpc_WalletExistsRequest,
    requestDeserialize: deserialize_walletrpc_WalletExistsRequest,
    responseSerialize: serialize_walletrpc_WalletExistsResponse,
    responseDeserialize: deserialize_walletrpc_WalletExistsResponse,
  },
  createWallet: {
    path: '/walletrpc.WalletLoaderService/CreateWallet',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.CreateWalletRequest,
    responseType: api_pb.CreateWalletResponse,
    requestSerialize: serialize_walletrpc_CreateWalletRequest,
    requestDeserialize: deserialize_walletrpc_CreateWalletRequest,
    responseSerialize: serialize_walletrpc_CreateWalletResponse,
    responseDeserialize: deserialize_walletrpc_CreateWalletResponse,
  },
  openWallet: {
    path: '/walletrpc.WalletLoaderService/OpenWallet',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.OpenWalletRequest,
    responseType: api_pb.OpenWalletResponse,
    requestSerialize: serialize_walletrpc_OpenWalletRequest,
    requestDeserialize: deserialize_walletrpc_OpenWalletRequest,
    responseSerialize: serialize_walletrpc_OpenWalletResponse,
    responseDeserialize: deserialize_walletrpc_OpenWalletResponse,
  },
  closeWallet: {
    path: '/walletrpc.WalletLoaderService/CloseWallet',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.CloseWalletRequest,
    responseType: api_pb.CloseWalletResponse,
    requestSerialize: serialize_walletrpc_CloseWalletRequest,
    requestDeserialize: deserialize_walletrpc_CloseWalletRequest,
    responseSerialize: serialize_walletrpc_CloseWalletResponse,
    responseDeserialize: deserialize_walletrpc_CloseWalletResponse,
  },
  startConsensusRpc: {
    path: '/walletrpc.WalletLoaderService/StartConsensusRpc',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.StartConsensusRpcRequest,
    responseType: api_pb.StartConsensusRpcResponse,
    requestSerialize: serialize_walletrpc_StartConsensusRpcRequest,
    requestDeserialize: deserialize_walletrpc_StartConsensusRpcRequest,
    responseSerialize: serialize_walletrpc_StartConsensusRpcResponse,
    responseDeserialize: deserialize_walletrpc_StartConsensusRpcResponse,
  },
  discoverAddresses: {
    path: '/walletrpc.WalletLoaderService/DiscoverAddresses',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.DiscoverAddressesRequest,
    responseType: api_pb.DiscoverAddressesResponse,
    requestSerialize: serialize_walletrpc_DiscoverAddressesRequest,
    requestDeserialize: deserialize_walletrpc_DiscoverAddressesRequest,
    responseSerialize: serialize_walletrpc_DiscoverAddressesResponse,
    responseDeserialize: deserialize_walletrpc_DiscoverAddressesResponse,
  },
  subscribeToBlockNotifications: {
    path: '/walletrpc.WalletLoaderService/SubscribeToBlockNotifications',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SubscribeToBlockNotificationsRequest,
    responseType: api_pb.SubscribeToBlockNotificationsResponse,
    requestSerialize: serialize_walletrpc_SubscribeToBlockNotificationsRequest,
    requestDeserialize: deserialize_walletrpc_SubscribeToBlockNotificationsRequest,
    responseSerialize: serialize_walletrpc_SubscribeToBlockNotificationsResponse,
    responseDeserialize: deserialize_walletrpc_SubscribeToBlockNotificationsResponse,
  },
  fetchHeaders: {
    path: '/walletrpc.WalletLoaderService/FetchHeaders',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.FetchHeadersRequest,
    responseType: api_pb.FetchHeadersResponse,
    requestSerialize: serialize_walletrpc_FetchHeadersRequest,
    requestDeserialize: deserialize_walletrpc_FetchHeadersRequest,
    responseSerialize: serialize_walletrpc_FetchHeadersResponse,
    responseDeserialize: deserialize_walletrpc_FetchHeadersResponse,
  },
};

exports.WalletLoaderServiceClient = grpc.makeGenericClientConstructor(WalletLoaderServiceService);
var TicketBuyerServiceService = exports.TicketBuyerServiceService = {
  startAutoBuyer: {
    path: '/walletrpc.TicketBuyerService/StartAutoBuyer',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.StartAutoBuyerRequest,
    responseType: api_pb.StartAutoBuyerResponse,
    requestSerialize: serialize_walletrpc_StartAutoBuyerRequest,
    requestDeserialize: deserialize_walletrpc_StartAutoBuyerRequest,
    responseSerialize: serialize_walletrpc_StartAutoBuyerResponse,
    responseDeserialize: deserialize_walletrpc_StartAutoBuyerResponse,
  },
  stopAutoBuyer: {
    path: '/walletrpc.TicketBuyerService/StopAutoBuyer',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.StopAutoBuyerRequest,
    responseType: api_pb.StopAutoBuyerResponse,
    requestSerialize: serialize_walletrpc_StopAutoBuyerRequest,
    requestDeserialize: deserialize_walletrpc_StopAutoBuyerRequest,
    responseSerialize: serialize_walletrpc_StopAutoBuyerResponse,
    responseDeserialize: deserialize_walletrpc_StopAutoBuyerResponse,
  },
};

exports.TicketBuyerServiceClient = grpc.makeGenericClientConstructor(TicketBuyerServiceService);
var SeedServiceService = exports.SeedServiceService = {
  generateRandomSeed: {
    path: '/walletrpc.SeedService/GenerateRandomSeed',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GenerateRandomSeedRequest,
    responseType: api_pb.GenerateRandomSeedResponse,
    requestSerialize: serialize_walletrpc_GenerateRandomSeedRequest,
    requestDeserialize: deserialize_walletrpc_GenerateRandomSeedRequest,
    responseSerialize: serialize_walletrpc_GenerateRandomSeedResponse,
    responseDeserialize: deserialize_walletrpc_GenerateRandomSeedResponse,
  },
  decodeSeed: {
    path: '/walletrpc.SeedService/DecodeSeed',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.DecodeSeedRequest,
    responseType: api_pb.DecodeSeedResponse,
    requestSerialize: serialize_walletrpc_DecodeSeedRequest,
    requestDeserialize: deserialize_walletrpc_DecodeSeedRequest,
    responseSerialize: serialize_walletrpc_DecodeSeedResponse,
    responseDeserialize: deserialize_walletrpc_DecodeSeedResponse,
  },
};

exports.SeedServiceClient = grpc.makeGenericClientConstructor(SeedServiceService);
