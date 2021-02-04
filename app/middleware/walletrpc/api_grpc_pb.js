// GENERATED CODE -- DO NOT EDIT!

'use strict';
var api_pb = require('./api_pb.js');

function serialize_walletrpc_AbandonTransactionRequest(arg) {
  if (!(arg instanceof api_pb.AbandonTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.AbandonTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AbandonTransactionRequest(buffer_arg) {
  return api_pb.AbandonTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AbandonTransactionResponse(arg) {
  if (!(arg instanceof api_pb.AbandonTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.AbandonTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AbandonTransactionResponse(buffer_arg) {
  return api_pb.AbandonTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountNotificationsRequest(arg) {
  if (!(arg instanceof api_pb.AccountNotificationsRequest)) {
    throw new Error('Expected argument of type walletrpc.AccountNotificationsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNotificationsRequest(buffer_arg) {
  return api_pb.AccountNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountNotificationsResponse(arg) {
  if (!(arg instanceof api_pb.AccountNotificationsResponse)) {
    throw new Error('Expected argument of type walletrpc.AccountNotificationsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNotificationsResponse(buffer_arg) {
  return api_pb.AccountNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountNumberRequest(arg) {
  if (!(arg instanceof api_pb.AccountNumberRequest)) {
    throw new Error('Expected argument of type walletrpc.AccountNumberRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNumberRequest(buffer_arg) {
  return api_pb.AccountNumberRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountNumberResponse(arg) {
  if (!(arg instanceof api_pb.AccountNumberResponse)) {
    throw new Error('Expected argument of type walletrpc.AccountNumberResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AccountNumberResponse(buffer_arg) {
  return api_pb.AccountNumberResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountsRequest(arg) {
  if (!(arg instanceof api_pb.AccountsRequest)) {
    throw new Error('Expected argument of type walletrpc.AccountsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AccountsRequest(buffer_arg) {
  return api_pb.AccountsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AccountsResponse(arg) {
  if (!(arg instanceof api_pb.AccountsResponse)) {
    throw new Error('Expected argument of type walletrpc.AccountsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AccountsResponse(buffer_arg) {
  return api_pb.AccountsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AgendasRequest(arg) {
  if (!(arg instanceof api_pb.AgendasRequest)) {
    throw new Error('Expected argument of type walletrpc.AgendasRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AgendasRequest(buffer_arg) {
  return api_pb.AgendasRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_AgendasResponse(arg) {
  if (!(arg instanceof api_pb.AgendasResponse)) {
    throw new Error('Expected argument of type walletrpc.AgendasResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_AgendasResponse(buffer_arg) {
  return api_pb.AgendasResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BalanceRequest(arg) {
  if (!(arg instanceof api_pb.BalanceRequest)) {
    throw new Error('Expected argument of type walletrpc.BalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_BalanceRequest(buffer_arg) {
  return api_pb.BalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BalanceResponse(arg) {
  if (!(arg instanceof api_pb.BalanceResponse)) {
    throw new Error('Expected argument of type walletrpc.BalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_BalanceResponse(buffer_arg) {
  return api_pb.BalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BestBlockRequest(arg) {
  if (!(arg instanceof api_pb.BestBlockRequest)) {
    throw new Error('Expected argument of type walletrpc.BestBlockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_BestBlockRequest(buffer_arg) {
  return api_pb.BestBlockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BestBlockResponse(arg) {
  if (!(arg instanceof api_pb.BestBlockResponse)) {
    throw new Error('Expected argument of type walletrpc.BestBlockResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_BestBlockResponse(buffer_arg) {
  return api_pb.BestBlockResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BlockInfoRequest(arg) {
  if (!(arg instanceof api_pb.BlockInfoRequest)) {
    throw new Error('Expected argument of type walletrpc.BlockInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_BlockInfoRequest(buffer_arg) {
  return api_pb.BlockInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_BlockInfoResponse(arg) {
  if (!(arg instanceof api_pb.BlockInfoResponse)) {
    throw new Error('Expected argument of type walletrpc.BlockInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_BlockInfoResponse(buffer_arg) {
  return api_pb.BlockInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ChangePassphraseRequest(arg) {
  if (!(arg instanceof api_pb.ChangePassphraseRequest)) {
    throw new Error('Expected argument of type walletrpc.ChangePassphraseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ChangePassphraseRequest(buffer_arg) {
  return api_pb.ChangePassphraseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ChangePassphraseResponse(arg) {
  if (!(arg instanceof api_pb.ChangePassphraseResponse)) {
    throw new Error('Expected argument of type walletrpc.ChangePassphraseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ChangePassphraseResponse(buffer_arg) {
  return api_pb.ChangePassphraseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CloseWalletRequest(arg) {
  if (!(arg instanceof api_pb.CloseWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.CloseWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CloseWalletRequest(buffer_arg) {
  return api_pb.CloseWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CloseWalletResponse(arg) {
  if (!(arg instanceof api_pb.CloseWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.CloseWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CloseWalletResponse(buffer_arg) {
  return api_pb.CloseWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CoinTypeRequest(arg) {
  if (!(arg instanceof api_pb.CoinTypeRequest)) {
    throw new Error('Expected argument of type walletrpc.CoinTypeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CoinTypeRequest(buffer_arg) {
  return api_pb.CoinTypeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CoinTypeResponse(arg) {
  if (!(arg instanceof api_pb.CoinTypeResponse)) {
    throw new Error('Expected argument of type walletrpc.CoinTypeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CoinTypeResponse(buffer_arg) {
  return api_pb.CoinTypeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CommittedTicketsRequest(arg) {
  if (!(arg instanceof api_pb.CommittedTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.CommittedTicketsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CommittedTicketsRequest(buffer_arg) {
  return api_pb.CommittedTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CommittedTicketsResponse(arg) {
  if (!(arg instanceof api_pb.CommittedTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.CommittedTicketsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CommittedTicketsResponse(buffer_arg) {
  return api_pb.CommittedTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ConfirmationNotificationsRequest(arg) {
  if (!(arg instanceof api_pb.ConfirmationNotificationsRequest)) {
    throw new Error('Expected argument of type walletrpc.ConfirmationNotificationsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ConfirmationNotificationsRequest(buffer_arg) {
  return api_pb.ConfirmationNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ConfirmationNotificationsResponse(arg) {
  if (!(arg instanceof api_pb.ConfirmationNotificationsResponse)) {
    throw new Error('Expected argument of type walletrpc.ConfirmationNotificationsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ConfirmationNotificationsResponse(buffer_arg) {
  return api_pb.ConfirmationNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ConstructTransactionRequest(arg) {
  if (!(arg instanceof api_pb.ConstructTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.ConstructTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ConstructTransactionRequest(buffer_arg) {
  return api_pb.ConstructTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ConstructTransactionResponse(arg) {
  if (!(arg instanceof api_pb.ConstructTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.ConstructTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ConstructTransactionResponse(buffer_arg) {
  return api_pb.ConstructTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateSignatureRequest(arg) {
  if (!(arg instanceof api_pb.CreateSignatureRequest)) {
    throw new Error('Expected argument of type walletrpc.CreateSignatureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CreateSignatureRequest(buffer_arg) {
  return api_pb.CreateSignatureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateSignatureResponse(arg) {
  if (!(arg instanceof api_pb.CreateSignatureResponse)) {
    throw new Error('Expected argument of type walletrpc.CreateSignatureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CreateSignatureResponse(buffer_arg) {
  return api_pb.CreateSignatureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateWalletRequest(arg) {
  if (!(arg instanceof api_pb.CreateWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.CreateWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CreateWalletRequest(buffer_arg) {
  return api_pb.CreateWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateWalletResponse(arg) {
  if (!(arg instanceof api_pb.CreateWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.CreateWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CreateWalletResponse(buffer_arg) {
  return api_pb.CreateWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateWatchingOnlyWalletRequest(arg) {
  if (!(arg instanceof api_pb.CreateWatchingOnlyWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.CreateWatchingOnlyWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CreateWatchingOnlyWalletRequest(buffer_arg) {
  return api_pb.CreateWatchingOnlyWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_CreateWatchingOnlyWalletResponse(arg) {
  if (!(arg instanceof api_pb.CreateWatchingOnlyWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.CreateWatchingOnlyWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_CreateWatchingOnlyWalletResponse(buffer_arg) {
  return api_pb.CreateWatchingOnlyWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DecodeRawTransactionRequest(arg) {
  if (!(arg instanceof api_pb.DecodeRawTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.DecodeRawTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_DecodeRawTransactionRequest(buffer_arg) {
  return api_pb.DecodeRawTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DecodeRawTransactionResponse(arg) {
  if (!(arg instanceof api_pb.DecodeRawTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.DecodeRawTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_DecodeRawTransactionResponse(buffer_arg) {
  return api_pb.DecodeRawTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DecodeSeedRequest(arg) {
  if (!(arg instanceof api_pb.DecodeSeedRequest)) {
    throw new Error('Expected argument of type walletrpc.DecodeSeedRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_DecodeSeedRequest(buffer_arg) {
  return api_pb.DecodeSeedRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_DecodeSeedResponse(arg) {
  if (!(arg instanceof api_pb.DecodeSeedResponse)) {
    throw new Error('Expected argument of type walletrpc.DecodeSeedResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_DecodeSeedResponse(buffer_arg) {
  return api_pb.DecodeSeedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_FundTransactionRequest(arg) {
  if (!(arg instanceof api_pb.FundTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.FundTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_FundTransactionRequest(buffer_arg) {
  return api_pb.FundTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_FundTransactionResponse(arg) {
  if (!(arg instanceof api_pb.FundTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.FundTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_FundTransactionResponse(buffer_arg) {
  return api_pb.FundTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GenerateRandomSeedRequest(arg) {
  if (!(arg instanceof api_pb.GenerateRandomSeedRequest)) {
    throw new Error('Expected argument of type walletrpc.GenerateRandomSeedRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GenerateRandomSeedRequest(buffer_arg) {
  return api_pb.GenerateRandomSeedRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GenerateRandomSeedResponse(arg) {
  if (!(arg instanceof api_pb.GenerateRandomSeedResponse)) {
    throw new Error('Expected argument of type walletrpc.GenerateRandomSeedResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GenerateRandomSeedResponse(buffer_arg) {
  return api_pb.GenerateRandomSeedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetAccountExtendedPrivKeyRequest(arg) {
  if (!(arg instanceof api_pb.GetAccountExtendedPrivKeyRequest)) {
    throw new Error('Expected argument of type walletrpc.GetAccountExtendedPrivKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetAccountExtendedPrivKeyRequest(buffer_arg) {
  return api_pb.GetAccountExtendedPrivKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetAccountExtendedPrivKeyResponse(arg) {
  if (!(arg instanceof api_pb.GetAccountExtendedPrivKeyResponse)) {
    throw new Error('Expected argument of type walletrpc.GetAccountExtendedPrivKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetAccountExtendedPrivKeyResponse(buffer_arg) {
  return api_pb.GetAccountExtendedPrivKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetAccountExtendedPubKeyRequest(arg) {
  if (!(arg instanceof api_pb.GetAccountExtendedPubKeyRequest)) {
    throw new Error('Expected argument of type walletrpc.GetAccountExtendedPubKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetAccountExtendedPubKeyRequest(buffer_arg) {
  return api_pb.GetAccountExtendedPubKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetAccountExtendedPubKeyResponse(arg) {
  if (!(arg instanceof api_pb.GetAccountExtendedPubKeyResponse)) {
    throw new Error('Expected argument of type walletrpc.GetAccountExtendedPubKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetAccountExtendedPubKeyResponse(buffer_arg) {
  return api_pb.GetAccountExtendedPubKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetCFiltersRequest(arg) {
  if (!(arg instanceof api_pb.GetCFiltersRequest)) {
    throw new Error('Expected argument of type walletrpc.GetCFiltersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetCFiltersRequest(buffer_arg) {
  return api_pb.GetCFiltersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetCFiltersResponse(arg) {
  if (!(arg instanceof api_pb.GetCFiltersResponse)) {
    throw new Error('Expected argument of type walletrpc.GetCFiltersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetCFiltersResponse(buffer_arg) {
  return api_pb.GetCFiltersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetCoinjoinOutputspByAcctRequest(arg) {
  if (!(arg instanceof api_pb.GetCoinjoinOutputspByAcctRequest)) {
    throw new Error('Expected argument of type walletrpc.GetCoinjoinOutputspByAcctRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetCoinjoinOutputspByAcctRequest(buffer_arg) {
  return api_pb.GetCoinjoinOutputspByAcctRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetCoinjoinOutputspByAcctResponse(arg) {
  if (!(arg instanceof api_pb.GetCoinjoinOutputspByAcctResponse)) {
    throw new Error('Expected argument of type walletrpc.GetCoinjoinOutputspByAcctResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetCoinjoinOutputspByAcctResponse(buffer_arg) {
  return api_pb.GetCoinjoinOutputspByAcctResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetPeerInfoRequest(arg) {
  if (!(arg instanceof api_pb.GetPeerInfoRequest)) {
    throw new Error('Expected argument of type walletrpc.GetPeerInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetPeerInfoRequest(buffer_arg) {
  return api_pb.GetPeerInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetPeerInfoResponse(arg) {
  if (!(arg instanceof api_pb.GetPeerInfoResponse)) {
    throw new Error('Expected argument of type walletrpc.GetPeerInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetPeerInfoResponse(buffer_arg) {
  return api_pb.GetPeerInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetRawBlockRequest(arg) {
  if (!(arg instanceof api_pb.GetRawBlockRequest)) {
    throw new Error('Expected argument of type walletrpc.GetRawBlockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetRawBlockRequest(buffer_arg) {
  return api_pb.GetRawBlockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetRawBlockResponse(arg) {
  if (!(arg instanceof api_pb.GetRawBlockResponse)) {
    throw new Error('Expected argument of type walletrpc.GetRawBlockResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetRawBlockResponse(buffer_arg) {
  return api_pb.GetRawBlockResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTicketRequest(arg) {
  if (!(arg instanceof api_pb.GetTicketRequest)) {
    throw new Error('Expected argument of type walletrpc.GetTicketRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetTicketRequest(buffer_arg) {
  return api_pb.GetTicketRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTicketsRequest(arg) {
  if (!(arg instanceof api_pb.GetTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.GetTicketsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetTicketsRequest(buffer_arg) {
  return api_pb.GetTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTicketsResponse(arg) {
  if (!(arg instanceof api_pb.GetTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.GetTicketsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetTicketsResponse(buffer_arg) {
  return api_pb.GetTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTransactionRequest(arg) {
  if (!(arg instanceof api_pb.GetTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.GetTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetTransactionRequest(buffer_arg) {
  return api_pb.GetTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTransactionResponse(arg) {
  if (!(arg instanceof api_pb.GetTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.GetTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetTransactionResponse(buffer_arg) {
  return api_pb.GetTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTransactionsRequest(arg) {
  if (!(arg instanceof api_pb.GetTransactionsRequest)) {
    throw new Error('Expected argument of type walletrpc.GetTransactionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetTransactionsRequest(buffer_arg) {
  return api_pb.GetTransactionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetTransactionsResponse(arg) {
  if (!(arg instanceof api_pb.GetTransactionsResponse)) {
    throw new Error('Expected argument of type walletrpc.GetTransactionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetTransactionsResponse(buffer_arg) {
  return api_pb.GetTransactionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetVSPTicketsByFeeStatusRequest(arg) {
  if (!(arg instanceof api_pb.GetVSPTicketsByFeeStatusRequest)) {
    throw new Error('Expected argument of type walletrpc.GetVSPTicketsByFeeStatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetVSPTicketsByFeeStatusRequest(buffer_arg) {
  return api_pb.GetVSPTicketsByFeeStatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_GetVSPTicketsByFeeStatusResponse(arg) {
  if (!(arg instanceof api_pb.GetVSPTicketsByFeeStatusResponse)) {
    throw new Error('Expected argument of type walletrpc.GetVSPTicketsByFeeStatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_GetVSPTicketsByFeeStatusResponse(buffer_arg) {
  return api_pb.GetVSPTicketsByFeeStatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportPrivateKeyRequest(arg) {
  if (!(arg instanceof api_pb.ImportPrivateKeyRequest)) {
    throw new Error('Expected argument of type walletrpc.ImportPrivateKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ImportPrivateKeyRequest(buffer_arg) {
  return api_pb.ImportPrivateKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportPrivateKeyResponse(arg) {
  if (!(arg instanceof api_pb.ImportPrivateKeyResponse)) {
    throw new Error('Expected argument of type walletrpc.ImportPrivateKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ImportPrivateKeyResponse(buffer_arg) {
  return api_pb.ImportPrivateKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportScriptRequest(arg) {
  if (!(arg instanceof api_pb.ImportScriptRequest)) {
    throw new Error('Expected argument of type walletrpc.ImportScriptRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ImportScriptRequest(buffer_arg) {
  return api_pb.ImportScriptRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ImportScriptResponse(arg) {
  if (!(arg instanceof api_pb.ImportScriptResponse)) {
    throw new Error('Expected argument of type walletrpc.ImportScriptResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ImportScriptResponse(buffer_arg) {
  return api_pb.ImportScriptResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LoadActiveDataFiltersRequest(arg) {
  if (!(arg instanceof api_pb.LoadActiveDataFiltersRequest)) {
    throw new Error('Expected argument of type walletrpc.LoadActiveDataFiltersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_LoadActiveDataFiltersRequest(buffer_arg) {
  return api_pb.LoadActiveDataFiltersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LoadActiveDataFiltersResponse(arg) {
  if (!(arg instanceof api_pb.LoadActiveDataFiltersResponse)) {
    throw new Error('Expected argument of type walletrpc.LoadActiveDataFiltersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_LoadActiveDataFiltersResponse(buffer_arg) {
  return api_pb.LoadActiveDataFiltersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LockAccountRequest(arg) {
  if (!(arg instanceof api_pb.LockAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.LockAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_LockAccountRequest(buffer_arg) {
  return api_pb.LockAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LockAccountResponse(arg) {
  if (!(arg instanceof api_pb.LockAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.LockAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_LockAccountResponse(buffer_arg) {
  return api_pb.LockAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LockWalletRequest(arg) {
  if (!(arg instanceof api_pb.LockWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.LockWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_LockWalletRequest(buffer_arg) {
  return api_pb.LockWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_LockWalletResponse(arg) {
  if (!(arg instanceof api_pb.LockWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.LockWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_LockWalletResponse(buffer_arg) {
  return api_pb.LockWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NetworkRequest(arg) {
  if (!(arg instanceof api_pb.NetworkRequest)) {
    throw new Error('Expected argument of type walletrpc.NetworkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_NetworkRequest(buffer_arg) {
  return api_pb.NetworkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NetworkResponse(arg) {
  if (!(arg instanceof api_pb.NetworkResponse)) {
    throw new Error('Expected argument of type walletrpc.NetworkResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_NetworkResponse(buffer_arg) {
  return api_pb.NetworkResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAccountRequest(arg) {
  if (!(arg instanceof api_pb.NextAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.NextAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_NextAccountRequest(buffer_arg) {
  return api_pb.NextAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAccountResponse(arg) {
  if (!(arg instanceof api_pb.NextAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.NextAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_NextAccountResponse(buffer_arg) {
  return api_pb.NextAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAddressRequest(arg) {
  if (!(arg instanceof api_pb.NextAddressRequest)) {
    throw new Error('Expected argument of type walletrpc.NextAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_NextAddressRequest(buffer_arg) {
  return api_pb.NextAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_NextAddressResponse(arg) {
  if (!(arg instanceof api_pb.NextAddressResponse)) {
    throw new Error('Expected argument of type walletrpc.NextAddressResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_NextAddressResponse(buffer_arg) {
  return api_pb.NextAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_OpenWalletRequest(arg) {
  if (!(arg instanceof api_pb.OpenWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.OpenWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_OpenWalletRequest(buffer_arg) {
  return api_pb.OpenWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_OpenWalletResponse(arg) {
  if (!(arg instanceof api_pb.OpenWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.OpenWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_OpenWalletResponse(buffer_arg) {
  return api_pb.OpenWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PingRequest(arg) {
  if (!(arg instanceof api_pb.PingRequest)) {
    throw new Error('Expected argument of type walletrpc.PingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PingRequest(buffer_arg) {
  return api_pb.PingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PingResponse(arg) {
  if (!(arg instanceof api_pb.PingResponse)) {
    throw new Error('Expected argument of type walletrpc.PingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PingResponse(buffer_arg) {
  return api_pb.PingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ProcessManagedTicketsRequest(arg) {
  if (!(arg instanceof api_pb.ProcessManagedTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.ProcessManagedTicketsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ProcessManagedTicketsRequest(buffer_arg) {
  return api_pb.ProcessManagedTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ProcessManagedTicketsResponse(arg) {
  if (!(arg instanceof api_pb.ProcessManagedTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.ProcessManagedTicketsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ProcessManagedTicketsResponse(buffer_arg) {
  return api_pb.ProcessManagedTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ProcessUnmanagedTicketsRequest(arg) {
  if (!(arg instanceof api_pb.ProcessUnmanagedTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.ProcessUnmanagedTicketsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ProcessUnmanagedTicketsRequest(buffer_arg) {
  return api_pb.ProcessUnmanagedTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ProcessUnmanagedTicketsResponse(arg) {
  if (!(arg instanceof api_pb.ProcessUnmanagedTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.ProcessUnmanagedTicketsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ProcessUnmanagedTicketsResponse(buffer_arg) {
  return api_pb.ProcessUnmanagedTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PublishTransactionRequest(arg) {
  if (!(arg instanceof api_pb.PublishTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.PublishTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PublishTransactionRequest(buffer_arg) {
  return api_pb.PublishTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PublishTransactionResponse(arg) {
  if (!(arg instanceof api_pb.PublishTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.PublishTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PublishTransactionResponse(buffer_arg) {
  return api_pb.PublishTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PublishUnminedTransactionsRequest(arg) {
  if (!(arg instanceof api_pb.PublishUnminedTransactionsRequest)) {
    throw new Error('Expected argument of type walletrpc.PublishUnminedTransactionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PublishUnminedTransactionsRequest(buffer_arg) {
  return api_pb.PublishUnminedTransactionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PublishUnminedTransactionsResponse(arg) {
  if (!(arg instanceof api_pb.PublishUnminedTransactionsResponse)) {
    throw new Error('Expected argument of type walletrpc.PublishUnminedTransactionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PublishUnminedTransactionsResponse(buffer_arg) {
  return api_pb.PublishUnminedTransactionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PurchaseTicketsRequest(arg) {
  if (!(arg instanceof api_pb.PurchaseTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.PurchaseTicketsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PurchaseTicketsRequest(buffer_arg) {
  return api_pb.PurchaseTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_PurchaseTicketsResponse(arg) {
  if (!(arg instanceof api_pb.PurchaseTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.PurchaseTicketsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_PurchaseTicketsResponse(buffer_arg) {
  return api_pb.PurchaseTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RenameAccountRequest(arg) {
  if (!(arg instanceof api_pb.RenameAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.RenameAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RenameAccountRequest(buffer_arg) {
  return api_pb.RenameAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RenameAccountResponse(arg) {
  if (!(arg instanceof api_pb.RenameAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.RenameAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RenameAccountResponse(buffer_arg) {
  return api_pb.RenameAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RescanPointRequest(arg) {
  if (!(arg instanceof api_pb.RescanPointRequest)) {
    throw new Error('Expected argument of type walletrpc.RescanPointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RescanPointRequest(buffer_arg) {
  return api_pb.RescanPointRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RescanPointResponse(arg) {
  if (!(arg instanceof api_pb.RescanPointResponse)) {
    throw new Error('Expected argument of type walletrpc.RescanPointResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RescanPointResponse(buffer_arg) {
  return api_pb.RescanPointResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RescanRequest(arg) {
  if (!(arg instanceof api_pb.RescanRequest)) {
    throw new Error('Expected argument of type walletrpc.RescanRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RescanRequest(buffer_arg) {
  return api_pb.RescanRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RescanResponse(arg) {
  if (!(arg instanceof api_pb.RescanResponse)) {
    throw new Error('Expected argument of type walletrpc.RescanResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RescanResponse(buffer_arg) {
  return api_pb.RescanResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RevokeTicketsRequest(arg) {
  if (!(arg instanceof api_pb.RevokeTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.RevokeTicketsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RevokeTicketsRequest(buffer_arg) {
  return api_pb.RevokeTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RevokeTicketsResponse(arg) {
  if (!(arg instanceof api_pb.RevokeTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.RevokeTicketsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RevokeTicketsResponse(buffer_arg) {
  return api_pb.RevokeTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RpcSyncRequest(arg) {
  if (!(arg instanceof api_pb.RpcSyncRequest)) {
    throw new Error('Expected argument of type walletrpc.RpcSyncRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RpcSyncRequest(buffer_arg) {
  return api_pb.RpcSyncRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RpcSyncResponse(arg) {
  if (!(arg instanceof api_pb.RpcSyncResponse)) {
    throw new Error('Expected argument of type walletrpc.RpcSyncResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RpcSyncResponse(buffer_arg) {
  return api_pb.RpcSyncResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RunAccountMixerRequest(arg) {
  if (!(arg instanceof api_pb.RunAccountMixerRequest)) {
    throw new Error('Expected argument of type walletrpc.RunAccountMixerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RunAccountMixerRequest(buffer_arg) {
  return api_pb.RunAccountMixerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RunAccountMixerResponse(arg) {
  if (!(arg instanceof api_pb.RunAccountMixerResponse)) {
    throw new Error('Expected argument of type walletrpc.RunAccountMixerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RunAccountMixerResponse(buffer_arg) {
  return api_pb.RunAccountMixerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RunTicketBuyerRequest(arg) {
  if (!(arg instanceof api_pb.RunTicketBuyerRequest)) {
    throw new Error('Expected argument of type walletrpc.RunTicketBuyerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RunTicketBuyerRequest(buffer_arg) {
  return api_pb.RunTicketBuyerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_RunTicketBuyerResponse(arg) {
  if (!(arg instanceof api_pb.RunTicketBuyerResponse)) {
    throw new Error('Expected argument of type walletrpc.RunTicketBuyerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_RunTicketBuyerResponse(buffer_arg) {
  return api_pb.RunTicketBuyerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetAccountPassphraseRequest(arg) {
  if (!(arg instanceof api_pb.SetAccountPassphraseRequest)) {
    throw new Error('Expected argument of type walletrpc.SetAccountPassphraseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetAccountPassphraseRequest(buffer_arg) {
  return api_pb.SetAccountPassphraseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetAccountPassphraseResponse(arg) {
  if (!(arg instanceof api_pb.SetAccountPassphraseResponse)) {
    throw new Error('Expected argument of type walletrpc.SetAccountPassphraseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetAccountPassphraseResponse(buffer_arg) {
  return api_pb.SetAccountPassphraseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetAccountRequest(arg) {
  if (!(arg instanceof api_pb.SetAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.SetAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetAccountRequest(buffer_arg) {
  return api_pb.SetAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetAccountResponse(arg) {
  if (!(arg instanceof api_pb.SetAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.SetAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetAccountResponse(buffer_arg) {
  return api_pb.SetAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetBalanceToMaintainRequest(arg) {
  if (!(arg instanceof api_pb.SetBalanceToMaintainRequest)) {
    throw new Error('Expected argument of type walletrpc.SetBalanceToMaintainRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetBalanceToMaintainRequest(buffer_arg) {
  return api_pb.SetBalanceToMaintainRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetBalanceToMaintainResponse(arg) {
  if (!(arg instanceof api_pb.SetBalanceToMaintainResponse)) {
    throw new Error('Expected argument of type walletrpc.SetBalanceToMaintainResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetBalanceToMaintainResponse(buffer_arg) {
  return api_pb.SetBalanceToMaintainResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxFeeRequest(arg) {
  if (!(arg instanceof api_pb.SetMaxFeeRequest)) {
    throw new Error('Expected argument of type walletrpc.SetMaxFeeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxFeeRequest(buffer_arg) {
  return api_pb.SetMaxFeeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxFeeResponse(arg) {
  if (!(arg instanceof api_pb.SetMaxFeeResponse)) {
    throw new Error('Expected argument of type walletrpc.SetMaxFeeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxFeeResponse(buffer_arg) {
  return api_pb.SetMaxFeeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxPerBlockRequest(arg) {
  if (!(arg instanceof api_pb.SetMaxPerBlockRequest)) {
    throw new Error('Expected argument of type walletrpc.SetMaxPerBlockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxPerBlockRequest(buffer_arg) {
  return api_pb.SetMaxPerBlockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxPerBlockResponse(arg) {
  if (!(arg instanceof api_pb.SetMaxPerBlockResponse)) {
    throw new Error('Expected argument of type walletrpc.SetMaxPerBlockResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxPerBlockResponse(buffer_arg) {
  return api_pb.SetMaxPerBlockResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxPriceAbsoluteRequest(arg) {
  if (!(arg instanceof api_pb.SetMaxPriceAbsoluteRequest)) {
    throw new Error('Expected argument of type walletrpc.SetMaxPriceAbsoluteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxPriceAbsoluteRequest(buffer_arg) {
  return api_pb.SetMaxPriceAbsoluteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxPriceAbsoluteResponse(arg) {
  if (!(arg instanceof api_pb.SetMaxPriceAbsoluteResponse)) {
    throw new Error('Expected argument of type walletrpc.SetMaxPriceAbsoluteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxPriceAbsoluteResponse(buffer_arg) {
  return api_pb.SetMaxPriceAbsoluteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxPriceRelativeRequest(arg) {
  if (!(arg instanceof api_pb.SetMaxPriceRelativeRequest)) {
    throw new Error('Expected argument of type walletrpc.SetMaxPriceRelativeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxPriceRelativeRequest(buffer_arg) {
  return api_pb.SetMaxPriceRelativeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetMaxPriceRelativeResponse(arg) {
  if (!(arg instanceof api_pb.SetMaxPriceRelativeResponse)) {
    throw new Error('Expected argument of type walletrpc.SetMaxPriceRelativeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetMaxPriceRelativeResponse(buffer_arg) {
  return api_pb.SetMaxPriceRelativeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetPoolAddressRequest(arg) {
  if (!(arg instanceof api_pb.SetPoolAddressRequest)) {
    throw new Error('Expected argument of type walletrpc.SetPoolAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetPoolAddressRequest(buffer_arg) {
  return api_pb.SetPoolAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetPoolAddressResponse(arg) {
  if (!(arg instanceof api_pb.SetPoolAddressResponse)) {
    throw new Error('Expected argument of type walletrpc.SetPoolAddressResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetPoolAddressResponse(buffer_arg) {
  return api_pb.SetPoolAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetPoolFeesRequest(arg) {
  if (!(arg instanceof api_pb.SetPoolFeesRequest)) {
    throw new Error('Expected argument of type walletrpc.SetPoolFeesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetPoolFeesRequest(buffer_arg) {
  return api_pb.SetPoolFeesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetPoolFeesResponse(arg) {
  if (!(arg instanceof api_pb.SetPoolFeesResponse)) {
    throw new Error('Expected argument of type walletrpc.SetPoolFeesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetPoolFeesResponse(buffer_arg) {
  return api_pb.SetPoolFeesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetVoteChoicesRequest(arg) {
  if (!(arg instanceof api_pb.SetVoteChoicesRequest)) {
    throw new Error('Expected argument of type walletrpc.SetVoteChoicesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetVoteChoicesRequest(buffer_arg) {
  return api_pb.SetVoteChoicesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetVoteChoicesResponse(arg) {
  if (!(arg instanceof api_pb.SetVoteChoicesResponse)) {
    throw new Error('Expected argument of type walletrpc.SetVoteChoicesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetVoteChoicesResponse(buffer_arg) {
  return api_pb.SetVoteChoicesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetVotingAddressRequest(arg) {
  if (!(arg instanceof api_pb.SetVotingAddressRequest)) {
    throw new Error('Expected argument of type walletrpc.SetVotingAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetVotingAddressRequest(buffer_arg) {
  return api_pb.SetVotingAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SetVotingAddressResponse(arg) {
  if (!(arg instanceof api_pb.SetVotingAddressResponse)) {
    throw new Error('Expected argument of type walletrpc.SetVotingAddressResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SetVotingAddressResponse(buffer_arg) {
  return api_pb.SetVotingAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignHashesRequest(arg) {
  if (!(arg instanceof api_pb.SignHashesRequest)) {
    throw new Error('Expected argument of type walletrpc.SignHashesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignHashesRequest(buffer_arg) {
  return api_pb.SignHashesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignHashesResponse(arg) {
  if (!(arg instanceof api_pb.SignHashesResponse)) {
    throw new Error('Expected argument of type walletrpc.SignHashesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignHashesResponse(buffer_arg) {
  return api_pb.SignHashesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignMessageRequest(arg) {
  if (!(arg instanceof api_pb.SignMessageRequest)) {
    throw new Error('Expected argument of type walletrpc.SignMessageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignMessageRequest(buffer_arg) {
  return api_pb.SignMessageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignMessageResponse(arg) {
  if (!(arg instanceof api_pb.SignMessageResponse)) {
    throw new Error('Expected argument of type walletrpc.SignMessageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignMessageResponse(buffer_arg) {
  return api_pb.SignMessageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignMessagesRequest(arg) {
  if (!(arg instanceof api_pb.SignMessagesRequest)) {
    throw new Error('Expected argument of type walletrpc.SignMessagesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignMessagesRequest(buffer_arg) {
  return api_pb.SignMessagesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignMessagesResponse(arg) {
  if (!(arg instanceof api_pb.SignMessagesResponse)) {
    throw new Error('Expected argument of type walletrpc.SignMessagesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignMessagesResponse(buffer_arg) {
  return api_pb.SignMessagesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignTransactionRequest(arg) {
  if (!(arg instanceof api_pb.SignTransactionRequest)) {
    throw new Error('Expected argument of type walletrpc.SignTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignTransactionRequest(buffer_arg) {
  return api_pb.SignTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignTransactionResponse(arg) {
  if (!(arg instanceof api_pb.SignTransactionResponse)) {
    throw new Error('Expected argument of type walletrpc.SignTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignTransactionResponse(buffer_arg) {
  return api_pb.SignTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignTransactionsRequest(arg) {
  if (!(arg instanceof api_pb.SignTransactionsRequest)) {
    throw new Error('Expected argument of type walletrpc.SignTransactionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignTransactionsRequest(buffer_arg) {
  return api_pb.SignTransactionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SignTransactionsResponse(arg) {
  if (!(arg instanceof api_pb.SignTransactionsResponse)) {
    throw new Error('Expected argument of type walletrpc.SignTransactionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SignTransactionsResponse(buffer_arg) {
  return api_pb.SignTransactionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SpenderRequest(arg) {
  if (!(arg instanceof api_pb.SpenderRequest)) {
    throw new Error('Expected argument of type walletrpc.SpenderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SpenderRequest(buffer_arg) {
  return api_pb.SpenderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SpenderResponse(arg) {
  if (!(arg instanceof api_pb.SpenderResponse)) {
    throw new Error('Expected argument of type walletrpc.SpenderResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SpenderResponse(buffer_arg) {
  return api_pb.SpenderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SpvSyncRequest(arg) {
  if (!(arg instanceof api_pb.SpvSyncRequest)) {
    throw new Error('Expected argument of type walletrpc.SpvSyncRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SpvSyncRequest(buffer_arg) {
  return api_pb.SpvSyncRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SpvSyncResponse(arg) {
  if (!(arg instanceof api_pb.SpvSyncResponse)) {
    throw new Error('Expected argument of type walletrpc.SpvSyncResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SpvSyncResponse(buffer_arg) {
  return api_pb.SpvSyncResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StakeInfoRequest(arg) {
  if (!(arg instanceof api_pb.StakeInfoRequest)) {
    throw new Error('Expected argument of type walletrpc.StakeInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_StakeInfoRequest(buffer_arg) {
  return api_pb.StakeInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StakeInfoResponse(arg) {
  if (!(arg instanceof api_pb.StakeInfoResponse)) {
    throw new Error('Expected argument of type walletrpc.StakeInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_StakeInfoResponse(buffer_arg) {
  return api_pb.StakeInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StartAutoBuyerRequest(arg) {
  if (!(arg instanceof api_pb.StartAutoBuyerRequest)) {
    throw new Error('Expected argument of type walletrpc.StartAutoBuyerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_StartAutoBuyerRequest(buffer_arg) {
  return api_pb.StartAutoBuyerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StartAutoBuyerResponse(arg) {
  if (!(arg instanceof api_pb.StartAutoBuyerResponse)) {
    throw new Error('Expected argument of type walletrpc.StartAutoBuyerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_StartAutoBuyerResponse(buffer_arg) {
  return api_pb.StartAutoBuyerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StopAutoBuyerRequest(arg) {
  if (!(arg instanceof api_pb.StopAutoBuyerRequest)) {
    throw new Error('Expected argument of type walletrpc.StopAutoBuyerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_StopAutoBuyerRequest(buffer_arg) {
  return api_pb.StopAutoBuyerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_StopAutoBuyerResponse(arg) {
  if (!(arg instanceof api_pb.StopAutoBuyerResponse)) {
    throw new Error('Expected argument of type walletrpc.StopAutoBuyerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_StopAutoBuyerResponse(buffer_arg) {
  return api_pb.StopAutoBuyerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SweepAccountRequest(arg) {
  if (!(arg instanceof api_pb.SweepAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.SweepAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SweepAccountRequest(buffer_arg) {
  return api_pb.SweepAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SweepAccountResponse(arg) {
  if (!(arg instanceof api_pb.SweepAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.SweepAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SweepAccountResponse(buffer_arg) {
  return api_pb.SweepAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SyncVSPTicketsRequest(arg) {
  if (!(arg instanceof api_pb.SyncVSPTicketsRequest)) {
    throw new Error('Expected argument of type walletrpc.SyncVSPTicketsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SyncVSPTicketsRequest(buffer_arg) {
  return api_pb.SyncVSPTicketsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_SyncVSPTicketsResponse(arg) {
  if (!(arg instanceof api_pb.SyncVSPTicketsResponse)) {
    throw new Error('Expected argument of type walletrpc.SyncVSPTicketsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_SyncVSPTicketsResponse(buffer_arg) {
  return api_pb.SyncVSPTicketsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TicketBuyerConfigRequest(arg) {
  if (!(arg instanceof api_pb.TicketBuyerConfigRequest)) {
    throw new Error('Expected argument of type walletrpc.TicketBuyerConfigRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_TicketBuyerConfigRequest(buffer_arg) {
  return api_pb.TicketBuyerConfigRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TicketBuyerConfigResponse(arg) {
  if (!(arg instanceof api_pb.TicketBuyerConfigResponse)) {
    throw new Error('Expected argument of type walletrpc.TicketBuyerConfigResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_TicketBuyerConfigResponse(buffer_arg) {
  return api_pb.TicketBuyerConfigResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TicketPriceRequest(arg) {
  if (!(arg instanceof api_pb.TicketPriceRequest)) {
    throw new Error('Expected argument of type walletrpc.TicketPriceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_TicketPriceRequest(buffer_arg) {
  return api_pb.TicketPriceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TicketPriceResponse(arg) {
  if (!(arg instanceof api_pb.TicketPriceResponse)) {
    throw new Error('Expected argument of type walletrpc.TicketPriceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_TicketPriceResponse(buffer_arg) {
  return api_pb.TicketPriceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TransactionNotificationsRequest(arg) {
  if (!(arg instanceof api_pb.TransactionNotificationsRequest)) {
    throw new Error('Expected argument of type walletrpc.TransactionNotificationsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_TransactionNotificationsRequest(buffer_arg) {
  return api_pb.TransactionNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_TransactionNotificationsResponse(arg) {
  if (!(arg instanceof api_pb.TransactionNotificationsResponse)) {
    throw new Error('Expected argument of type walletrpc.TransactionNotificationsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_TransactionNotificationsResponse(buffer_arg) {
  return api_pb.TransactionNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_UnlockAccountRequest(arg) {
  if (!(arg instanceof api_pb.UnlockAccountRequest)) {
    throw new Error('Expected argument of type walletrpc.UnlockAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_UnlockAccountRequest(buffer_arg) {
  return api_pb.UnlockAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_UnlockAccountResponse(arg) {
  if (!(arg instanceof api_pb.UnlockAccountResponse)) {
    throw new Error('Expected argument of type walletrpc.UnlockAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_UnlockAccountResponse(buffer_arg) {
  return api_pb.UnlockAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_UnlockWalletRequest(arg) {
  if (!(arg instanceof api_pb.UnlockWalletRequest)) {
    throw new Error('Expected argument of type walletrpc.UnlockWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_UnlockWalletRequest(buffer_arg) {
  return api_pb.UnlockWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_UnlockWalletResponse(arg) {
  if (!(arg instanceof api_pb.UnlockWalletResponse)) {
    throw new Error('Expected argument of type walletrpc.UnlockWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_UnlockWalletResponse(buffer_arg) {
  return api_pb.UnlockWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_UnspentOutputResponse(arg) {
  if (!(arg instanceof api_pb.UnspentOutputResponse)) {
    throw new Error('Expected argument of type walletrpc.UnspentOutputResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_UnspentOutputResponse(buffer_arg) {
  return api_pb.UnspentOutputResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_UnspentOutputsRequest(arg) {
  if (!(arg instanceof api_pb.UnspentOutputsRequest)) {
    throw new Error('Expected argument of type walletrpc.UnspentOutputsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_UnspentOutputsRequest(buffer_arg) {
  return api_pb.UnspentOutputsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ValidateAddressRequest(arg) {
  if (!(arg instanceof api_pb.ValidateAddressRequest)) {
    throw new Error('Expected argument of type walletrpc.ValidateAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ValidateAddressRequest(buffer_arg) {
  return api_pb.ValidateAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_ValidateAddressResponse(arg) {
  if (!(arg instanceof api_pb.ValidateAddressResponse)) {
    throw new Error('Expected argument of type walletrpc.ValidateAddressResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_ValidateAddressResponse(buffer_arg) {
  return api_pb.ValidateAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VerifyMessageRequest(arg) {
  if (!(arg instanceof api_pb.VerifyMessageRequest)) {
    throw new Error('Expected argument of type walletrpc.VerifyMessageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_VerifyMessageRequest(buffer_arg) {
  return api_pb.VerifyMessageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VerifyMessageResponse(arg) {
  if (!(arg instanceof api_pb.VerifyMessageResponse)) {
    throw new Error('Expected argument of type walletrpc.VerifyMessageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_VerifyMessageResponse(buffer_arg) {
  return api_pb.VerifyMessageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VersionRequest(arg) {
  if (!(arg instanceof api_pb.VersionRequest)) {
    throw new Error('Expected argument of type walletrpc.VersionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_VersionRequest(buffer_arg) {
  return api_pb.VersionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VersionResponse(arg) {
  if (!(arg instanceof api_pb.VersionResponse)) {
    throw new Error('Expected argument of type walletrpc.VersionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_VersionResponse(buffer_arg) {
  return api_pb.VersionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VoteChoicesRequest(arg) {
  if (!(arg instanceof api_pb.VoteChoicesRequest)) {
    throw new Error('Expected argument of type walletrpc.VoteChoicesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_VoteChoicesRequest(buffer_arg) {
  return api_pb.VoteChoicesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_VoteChoicesResponse(arg) {
  if (!(arg instanceof api_pb.VoteChoicesResponse)) {
    throw new Error('Expected argument of type walletrpc.VoteChoicesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_VoteChoicesResponse(buffer_arg) {
  return api_pb.VoteChoicesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_WalletExistsRequest(arg) {
  if (!(arg instanceof api_pb.WalletExistsRequest)) {
    throw new Error('Expected argument of type walletrpc.WalletExistsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_WalletExistsRequest(buffer_arg) {
  return api_pb.WalletExistsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_walletrpc_WalletExistsResponse(arg) {
  if (!(arg instanceof api_pb.WalletExistsResponse)) {
    throw new Error('Expected argument of type walletrpc.WalletExistsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_walletrpc_WalletExistsResponse(buffer_arg) {
  return api_pb.WalletExistsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var VersionServiceService = exports['walletrpc.VersionService'] = {
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

var WalletServiceService = exports['walletrpc.WalletService'] = {
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
  coinType: {
    path: '/walletrpc.WalletService/CoinType',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.CoinTypeRequest,
    responseType: api_pb.CoinTypeResponse,
    requestSerialize: serialize_walletrpc_CoinTypeRequest,
    requestDeserialize: deserialize_walletrpc_CoinTypeRequest,
    responseSerialize: serialize_walletrpc_CoinTypeResponse,
    responseDeserialize: deserialize_walletrpc_CoinTypeResponse,
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
  getAccountExtendedPubKey: {
    path: '/walletrpc.WalletService/GetAccountExtendedPubKey',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetAccountExtendedPubKeyRequest,
    responseType: api_pb.GetAccountExtendedPubKeyResponse,
    requestSerialize: serialize_walletrpc_GetAccountExtendedPubKeyRequest,
    requestDeserialize: deserialize_walletrpc_GetAccountExtendedPubKeyRequest,
    responseSerialize: serialize_walletrpc_GetAccountExtendedPubKeyResponse,
    responseDeserialize: deserialize_walletrpc_GetAccountExtendedPubKeyResponse,
  },
  getAccountExtendedPrivKey: {
    path: '/walletrpc.WalletService/GetAccountExtendedPrivKey',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetAccountExtendedPrivKeyRequest,
    responseType: api_pb.GetAccountExtendedPrivKeyResponse,
    requestSerialize: serialize_walletrpc_GetAccountExtendedPrivKeyRequest,
    requestDeserialize: deserialize_walletrpc_GetAccountExtendedPrivKeyRequest,
    responseSerialize: serialize_walletrpc_GetAccountExtendedPrivKeyResponse,
    responseDeserialize: deserialize_walletrpc_GetAccountExtendedPrivKeyResponse,
  },
  getTransaction: {
    path: '/walletrpc.WalletService/GetTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetTransactionRequest,
    responseType: api_pb.GetTransactionResponse,
    requestSerialize: serialize_walletrpc_GetTransactionRequest,
    requestDeserialize: deserialize_walletrpc_GetTransactionRequest,
    responseSerialize: serialize_walletrpc_GetTransactionResponse,
    responseDeserialize: deserialize_walletrpc_GetTransactionResponse,
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
  getTicket: {
    path: '/walletrpc.WalletService/GetTicket',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetTicketRequest,
    responseType: api_pb.GetTicketsResponse,
    requestSerialize: serialize_walletrpc_GetTicketRequest,
    requestDeserialize: deserialize_walletrpc_GetTicketRequest,
    responseSerialize: serialize_walletrpc_GetTicketsResponse,
    responseDeserialize: deserialize_walletrpc_GetTicketsResponse,
  },
  getTickets: {
    path: '/walletrpc.WalletService/GetTickets',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.GetTicketsRequest,
    responseType: api_pb.GetTicketsResponse,
    requestSerialize: serialize_walletrpc_GetTicketsRequest,
    requestDeserialize: deserialize_walletrpc_GetTicketsRequest,
    responseSerialize: serialize_walletrpc_GetTicketsResponse,
    responseDeserialize: deserialize_walletrpc_GetTicketsResponse,
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
  blockInfo: {
    path: '/walletrpc.WalletService/BlockInfo',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.BlockInfoRequest,
    responseType: api_pb.BlockInfoResponse,
    requestSerialize: serialize_walletrpc_BlockInfoRequest,
    requestDeserialize: deserialize_walletrpc_BlockInfoRequest,
    responseSerialize: serialize_walletrpc_BlockInfoResponse,
    responseDeserialize: deserialize_walletrpc_BlockInfoResponse,
  },
  bestBlock: {
    path: '/walletrpc.WalletService/BestBlock',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.BestBlockRequest,
    responseType: api_pb.BestBlockResponse,
    requestSerialize: serialize_walletrpc_BestBlockRequest,
    requestDeserialize: deserialize_walletrpc_BestBlockRequest,
    responseSerialize: serialize_walletrpc_BestBlockResponse,
    responseDeserialize: deserialize_walletrpc_BestBlockResponse,
  },
  spender: {
    path: '/walletrpc.WalletService/Spender',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SpenderRequest,
    responseType: api_pb.SpenderResponse,
    requestSerialize: serialize_walletrpc_SpenderRequest,
    requestDeserialize: deserialize_walletrpc_SpenderRequest,
    responseSerialize: serialize_walletrpc_SpenderResponse,
    responseDeserialize: deserialize_walletrpc_SpenderResponse,
  },
  getCFilters: {
    path: '/walletrpc.WalletService/GetCFilters',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.GetCFiltersRequest,
    responseType: api_pb.GetCFiltersResponse,
    requestSerialize: serialize_walletrpc_GetCFiltersRequest,
    requestDeserialize: deserialize_walletrpc_GetCFiltersRequest,
    responseSerialize: serialize_walletrpc_GetCFiltersResponse,
    responseDeserialize: deserialize_walletrpc_GetCFiltersResponse,
  },
  getPeerInfo: {
    path: '/walletrpc.WalletService/GetPeerInfo',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetPeerInfoRequest,
    responseType: api_pb.GetPeerInfoResponse,
    requestSerialize: serialize_walletrpc_GetPeerInfoRequest,
    requestDeserialize: deserialize_walletrpc_GetPeerInfoRequest,
    responseSerialize: serialize_walletrpc_GetPeerInfoResponse,
    responseDeserialize: deserialize_walletrpc_GetPeerInfoResponse,
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
  confirmationNotifications: {
    path: '/walletrpc.WalletService/ConfirmationNotifications',
    requestStream: true,
    responseStream: true,
    requestType: api_pb.ConfirmationNotificationsRequest,
    responseType: api_pb.ConfirmationNotificationsResponse,
    requestSerialize: serialize_walletrpc_ConfirmationNotificationsRequest,
    requestDeserialize: deserialize_walletrpc_ConfirmationNotificationsRequest,
    responseSerialize: serialize_walletrpc_ConfirmationNotificationsResponse,
    responseDeserialize: deserialize_walletrpc_ConfirmationNotificationsResponse,
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
  unspentOutputs: {
    path: '/walletrpc.WalletService/UnspentOutputs',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.UnspentOutputsRequest,
    responseType: api_pb.UnspentOutputResponse,
    requestSerialize: serialize_walletrpc_UnspentOutputsRequest,
    requestDeserialize: deserialize_walletrpc_UnspentOutputsRequest,
    responseSerialize: serialize_walletrpc_UnspentOutputResponse,
    responseDeserialize: deserialize_walletrpc_UnspentOutputResponse,
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
  signTransactions: {
    path: '/walletrpc.WalletService/SignTransactions',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SignTransactionsRequest,
    responseType: api_pb.SignTransactionsResponse,
    requestSerialize: serialize_walletrpc_SignTransactionsRequest,
    requestDeserialize: deserialize_walletrpc_SignTransactionsRequest,
    responseSerialize: serialize_walletrpc_SignTransactionsResponse,
    responseDeserialize: deserialize_walletrpc_SignTransactionsResponse,
  },
  createSignature: {
    path: '/walletrpc.WalletService/CreateSignature',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.CreateSignatureRequest,
    responseType: api_pb.CreateSignatureResponse,
    requestSerialize: serialize_walletrpc_CreateSignatureRequest,
    requestDeserialize: deserialize_walletrpc_CreateSignatureRequest,
    responseSerialize: serialize_walletrpc_CreateSignatureResponse,
    responseDeserialize: deserialize_walletrpc_CreateSignatureResponse,
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
  publishUnminedTransactions: {
    path: '/walletrpc.WalletService/PublishUnminedTransactions',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.PublishUnminedTransactionsRequest,
    responseType: api_pb.PublishUnminedTransactionsResponse,
    requestSerialize: serialize_walletrpc_PublishUnminedTransactionsRequest,
    requestDeserialize: deserialize_walletrpc_PublishUnminedTransactionsRequest,
    responseSerialize: serialize_walletrpc_PublishUnminedTransactionsResponse,
    responseDeserialize: deserialize_walletrpc_PublishUnminedTransactionsResponse,
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
  revokeTickets: {
    path: '/walletrpc.WalletService/RevokeTickets',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.RevokeTicketsRequest,
    responseType: api_pb.RevokeTicketsResponse,
    requestSerialize: serialize_walletrpc_RevokeTicketsRequest,
    requestDeserialize: deserialize_walletrpc_RevokeTicketsRequest,
    responseSerialize: serialize_walletrpc_RevokeTicketsResponse,
    responseDeserialize: deserialize_walletrpc_RevokeTicketsResponse,
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
  signMessage: {
    path: '/walletrpc.WalletService/SignMessage',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SignMessageRequest,
    responseType: api_pb.SignMessageResponse,
    requestSerialize: serialize_walletrpc_SignMessageRequest,
    requestDeserialize: deserialize_walletrpc_SignMessageRequest,
    responseSerialize: serialize_walletrpc_SignMessageResponse,
    responseDeserialize: deserialize_walletrpc_SignMessageResponse,
  },
  signMessages: {
    path: '/walletrpc.WalletService/SignMessages',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SignMessagesRequest,
    responseType: api_pb.SignMessagesResponse,
    requestSerialize: serialize_walletrpc_SignMessagesRequest,
    requestDeserialize: deserialize_walletrpc_SignMessagesRequest,
    responseSerialize: serialize_walletrpc_SignMessagesResponse,
    responseDeserialize: deserialize_walletrpc_SignMessagesResponse,
  },
  validateAddress: {
    path: '/walletrpc.WalletService/ValidateAddress',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ValidateAddressRequest,
    responseType: api_pb.ValidateAddressResponse,
    requestSerialize: serialize_walletrpc_ValidateAddressRequest,
    requestDeserialize: deserialize_walletrpc_ValidateAddressRequest,
    responseSerialize: serialize_walletrpc_ValidateAddressResponse,
    responseDeserialize: deserialize_walletrpc_ValidateAddressResponse,
  },
  committedTickets: {
    path: '/walletrpc.WalletService/CommittedTickets',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.CommittedTicketsRequest,
    responseType: api_pb.CommittedTicketsResponse,
    requestSerialize: serialize_walletrpc_CommittedTicketsRequest,
    requestDeserialize: deserialize_walletrpc_CommittedTicketsRequest,
    responseSerialize: serialize_walletrpc_CommittedTicketsResponse,
    responseDeserialize: deserialize_walletrpc_CommittedTicketsResponse,
  },
  sweepAccount: {
    path: '/walletrpc.WalletService/SweepAccount',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SweepAccountRequest,
    responseType: api_pb.SweepAccountResponse,
    requestSerialize: serialize_walletrpc_SweepAccountRequest,
    requestDeserialize: deserialize_walletrpc_SweepAccountRequest,
    responseSerialize: serialize_walletrpc_SweepAccountResponse,
    responseDeserialize: deserialize_walletrpc_SweepAccountResponse,
  },
  abandonTransaction: {
    path: '/walletrpc.WalletService/AbandonTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.AbandonTransactionRequest,
    responseType: api_pb.AbandonTransactionResponse,
    requestSerialize: serialize_walletrpc_AbandonTransactionRequest,
    requestDeserialize: deserialize_walletrpc_AbandonTransactionRequest,
    responseSerialize: serialize_walletrpc_AbandonTransactionResponse,
    responseDeserialize: deserialize_walletrpc_AbandonTransactionResponse,
  },
  signHashes: {
    path: '/walletrpc.WalletService/SignHashes',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SignHashesRequest,
    responseType: api_pb.SignHashesResponse,
    requestSerialize: serialize_walletrpc_SignHashesRequest,
    requestDeserialize: deserialize_walletrpc_SignHashesRequest,
    responseSerialize: serialize_walletrpc_SignHashesResponse,
    responseDeserialize: deserialize_walletrpc_SignHashesResponse,
  },
  getCoinjoinOutputspByAcct: {
    path: '/walletrpc.WalletService/GetCoinjoinOutputspByAcct',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetCoinjoinOutputspByAcctRequest,
    responseType: api_pb.GetCoinjoinOutputspByAcctResponse,
    requestSerialize: serialize_walletrpc_GetCoinjoinOutputspByAcctRequest,
    requestDeserialize: deserialize_walletrpc_GetCoinjoinOutputspByAcctRequest,
    responseSerialize: serialize_walletrpc_GetCoinjoinOutputspByAcctResponse,
    responseDeserialize: deserialize_walletrpc_GetCoinjoinOutputspByAcctResponse,
  },
  setAccountPassphrase: {
    path: '/walletrpc.WalletService/SetAccountPassphrase',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetAccountPassphraseRequest,
    responseType: api_pb.SetAccountPassphraseResponse,
    requestSerialize: serialize_walletrpc_SetAccountPassphraseRequest,
    requestDeserialize: deserialize_walletrpc_SetAccountPassphraseRequest,
    responseSerialize: serialize_walletrpc_SetAccountPassphraseResponse,
    responseDeserialize: deserialize_walletrpc_SetAccountPassphraseResponse,
  },
  unlockAccount: {
    path: '/walletrpc.WalletService/UnlockAccount',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.UnlockAccountRequest,
    responseType: api_pb.UnlockAccountResponse,
    requestSerialize: serialize_walletrpc_UnlockAccountRequest,
    requestDeserialize: deserialize_walletrpc_UnlockAccountRequest,
    responseSerialize: serialize_walletrpc_UnlockAccountResponse,
    responseDeserialize: deserialize_walletrpc_UnlockAccountResponse,
  },
  lockAccount: {
    path: '/walletrpc.WalletService/LockAccount',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.LockAccountRequest,
    responseType: api_pb.LockAccountResponse,
    requestSerialize: serialize_walletrpc_LockAccountRequest,
    requestDeserialize: deserialize_walletrpc_LockAccountRequest,
    responseSerialize: serialize_walletrpc_LockAccountResponse,
    responseDeserialize: deserialize_walletrpc_LockAccountResponse,
  },
  unlockWallet: {
    path: '/walletrpc.WalletService/UnlockWallet',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.UnlockWalletRequest,
    responseType: api_pb.UnlockWalletResponse,
    requestSerialize: serialize_walletrpc_UnlockWalletRequest,
    requestDeserialize: deserialize_walletrpc_UnlockWalletRequest,
    responseSerialize: serialize_walletrpc_UnlockWalletResponse,
    responseDeserialize: deserialize_walletrpc_UnlockWalletResponse,
  },
  lockWallet: {
    path: '/walletrpc.WalletService/LockWallet',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.LockWalletRequest,
    responseType: api_pb.LockWalletResponse,
    requestSerialize: serialize_walletrpc_LockWalletRequest,
    requestDeserialize: deserialize_walletrpc_LockWalletRequest,
    responseSerialize: serialize_walletrpc_LockWalletResponse,
    responseDeserialize: deserialize_walletrpc_LockWalletResponse,
  },
  syncVSPFailedTickets: {
    path: '/walletrpc.WalletService/SyncVSPFailedTickets',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SyncVSPTicketsRequest,
    responseType: api_pb.SyncVSPTicketsResponse,
    requestSerialize: serialize_walletrpc_SyncVSPTicketsRequest,
    requestDeserialize: deserialize_walletrpc_SyncVSPTicketsRequest,
    responseSerialize: serialize_walletrpc_SyncVSPTicketsResponse,
    responseDeserialize: deserialize_walletrpc_SyncVSPTicketsResponse,
  },
  getVSPTicketsByFeeStatus: {
    path: '/walletrpc.WalletService/GetVSPTicketsByFeeStatus',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetVSPTicketsByFeeStatusRequest,
    responseType: api_pb.GetVSPTicketsByFeeStatusResponse,
    requestSerialize: serialize_walletrpc_GetVSPTicketsByFeeStatusRequest,
    requestDeserialize: deserialize_walletrpc_GetVSPTicketsByFeeStatusRequest,
    responseSerialize: serialize_walletrpc_GetVSPTicketsByFeeStatusResponse,
    responseDeserialize: deserialize_walletrpc_GetVSPTicketsByFeeStatusResponse,
  },
  processManagedTickets: {
    path: '/walletrpc.WalletService/ProcessManagedTickets',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ProcessManagedTicketsRequest,
    responseType: api_pb.ProcessManagedTicketsResponse,
    requestSerialize: serialize_walletrpc_ProcessManagedTicketsRequest,
    requestDeserialize: deserialize_walletrpc_ProcessManagedTicketsRequest,
    responseSerialize: serialize_walletrpc_ProcessManagedTicketsResponse,
    responseDeserialize: deserialize_walletrpc_ProcessManagedTicketsResponse,
  },
  processUnmanagedTickets: {
    path: '/walletrpc.WalletService/ProcessUnmanagedTickets',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ProcessUnmanagedTicketsRequest,
    responseType: api_pb.ProcessUnmanagedTicketsResponse,
    requestSerialize: serialize_walletrpc_ProcessUnmanagedTicketsRequest,
    requestDeserialize: deserialize_walletrpc_ProcessUnmanagedTicketsRequest,
    responseSerialize: serialize_walletrpc_ProcessUnmanagedTicketsResponse,
    responseDeserialize: deserialize_walletrpc_ProcessUnmanagedTicketsResponse,
  },
};

var WalletLoaderServiceService = exports['walletrpc.WalletLoaderService'] = {
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
  createWatchingOnlyWallet: {
    path: '/walletrpc.WalletLoaderService/CreateWatchingOnlyWallet',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.CreateWatchingOnlyWalletRequest,
    responseType: api_pb.CreateWatchingOnlyWalletResponse,
    requestSerialize: serialize_walletrpc_CreateWatchingOnlyWalletRequest,
    requestDeserialize: deserialize_walletrpc_CreateWatchingOnlyWalletRequest,
    responseSerialize: serialize_walletrpc_CreateWatchingOnlyWalletResponse,
    responseDeserialize: deserialize_walletrpc_CreateWatchingOnlyWalletResponse,
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
  spvSync: {
    path: '/walletrpc.WalletLoaderService/SpvSync',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.SpvSyncRequest,
    responseType: api_pb.SpvSyncResponse,
    requestSerialize: serialize_walletrpc_SpvSyncRequest,
    requestDeserialize: deserialize_walletrpc_SpvSyncRequest,
    responseSerialize: serialize_walletrpc_SpvSyncResponse,
    responseDeserialize: deserialize_walletrpc_SpvSyncResponse,
  },
  rpcSync: {
    path: '/walletrpc.WalletLoaderService/RpcSync',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.RpcSyncRequest,
    responseType: api_pb.RpcSyncResponse,
    requestSerialize: serialize_walletrpc_RpcSyncRequest,
    requestDeserialize: deserialize_walletrpc_RpcSyncRequest,
    responseSerialize: serialize_walletrpc_RpcSyncResponse,
    responseDeserialize: deserialize_walletrpc_RpcSyncResponse,
  },
  rescanPoint: {
    path: '/walletrpc.WalletLoaderService/RescanPoint',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.RescanPointRequest,
    responseType: api_pb.RescanPointResponse,
    requestSerialize: serialize_walletrpc_RescanPointRequest,
    requestDeserialize: deserialize_walletrpc_RescanPointRequest,
    responseSerialize: serialize_walletrpc_RescanPointResponse,
    responseDeserialize: deserialize_walletrpc_RescanPointResponse,
  },
};

var AccountMixerServiceService = exports['walletrpc.AccountMixerService'] = {
  runAccountMixer: {
    path: '/walletrpc.AccountMixerService/RunAccountMixer',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.RunAccountMixerRequest,
    responseType: api_pb.RunAccountMixerResponse,
    requestSerialize: serialize_walletrpc_RunAccountMixerRequest,
    requestDeserialize: deserialize_walletrpc_RunAccountMixerRequest,
    responseSerialize: serialize_walletrpc_RunAccountMixerResponse,
    responseDeserialize: deserialize_walletrpc_RunAccountMixerResponse,
  },
};

var TicketBuyerV2ServiceService = exports['walletrpc.TicketBuyerV2Service'] = {
  runTicketBuyer: {
    path: '/walletrpc.TicketBuyerV2Service/RunTicketBuyer',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.RunTicketBuyerRequest,
    responseType: api_pb.RunTicketBuyerResponse,
    requestSerialize: serialize_walletrpc_RunTicketBuyerRequest,
    requestDeserialize: deserialize_walletrpc_RunTicketBuyerRequest,
    responseSerialize: serialize_walletrpc_RunTicketBuyerResponse,
    responseDeserialize: deserialize_walletrpc_RunTicketBuyerResponse,
  },
};

var TicketBuyerServiceService = exports['walletrpc.TicketBuyerService'] = {
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
  ticketBuyerConfig: {
    path: '/walletrpc.TicketBuyerService/TicketBuyerConfig',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.TicketBuyerConfigRequest,
    responseType: api_pb.TicketBuyerConfigResponse,
    requestSerialize: serialize_walletrpc_TicketBuyerConfigRequest,
    requestDeserialize: deserialize_walletrpc_TicketBuyerConfigRequest,
    responseSerialize: serialize_walletrpc_TicketBuyerConfigResponse,
    responseDeserialize: deserialize_walletrpc_TicketBuyerConfigResponse,
  },
  setAccount: {
    path: '/walletrpc.TicketBuyerService/SetAccount',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetAccountRequest,
    responseType: api_pb.SetAccountResponse,
    requestSerialize: serialize_walletrpc_SetAccountRequest,
    requestDeserialize: deserialize_walletrpc_SetAccountRequest,
    responseSerialize: serialize_walletrpc_SetAccountResponse,
    responseDeserialize: deserialize_walletrpc_SetAccountResponse,
  },
  setBalanceToMaintain: {
    path: '/walletrpc.TicketBuyerService/SetBalanceToMaintain',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetBalanceToMaintainRequest,
    responseType: api_pb.SetBalanceToMaintainResponse,
    requestSerialize: serialize_walletrpc_SetBalanceToMaintainRequest,
    requestDeserialize: deserialize_walletrpc_SetBalanceToMaintainRequest,
    responseSerialize: serialize_walletrpc_SetBalanceToMaintainResponse,
    responseDeserialize: deserialize_walletrpc_SetBalanceToMaintainResponse,
  },
  setMaxFee: {
    path: '/walletrpc.TicketBuyerService/SetMaxFee',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetMaxFeeRequest,
    responseType: api_pb.SetMaxFeeResponse,
    requestSerialize: serialize_walletrpc_SetMaxFeeRequest,
    requestDeserialize: deserialize_walletrpc_SetMaxFeeRequest,
    responseSerialize: serialize_walletrpc_SetMaxFeeResponse,
    responseDeserialize: deserialize_walletrpc_SetMaxFeeResponse,
  },
  setMaxPriceRelative: {
    path: '/walletrpc.TicketBuyerService/SetMaxPriceRelative',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetMaxPriceRelativeRequest,
    responseType: api_pb.SetMaxPriceRelativeResponse,
    requestSerialize: serialize_walletrpc_SetMaxPriceRelativeRequest,
    requestDeserialize: deserialize_walletrpc_SetMaxPriceRelativeRequest,
    responseSerialize: serialize_walletrpc_SetMaxPriceRelativeResponse,
    responseDeserialize: deserialize_walletrpc_SetMaxPriceRelativeResponse,
  },
  setMaxPriceAbsolute: {
    path: '/walletrpc.TicketBuyerService/SetMaxPriceAbsolute',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetMaxPriceAbsoluteRequest,
    responseType: api_pb.SetMaxPriceAbsoluteResponse,
    requestSerialize: serialize_walletrpc_SetMaxPriceAbsoluteRequest,
    requestDeserialize: deserialize_walletrpc_SetMaxPriceAbsoluteRequest,
    responseSerialize: serialize_walletrpc_SetMaxPriceAbsoluteResponse,
    responseDeserialize: deserialize_walletrpc_SetMaxPriceAbsoluteResponse,
  },
  setVotingAddress: {
    path: '/walletrpc.TicketBuyerService/SetVotingAddress',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetVotingAddressRequest,
    responseType: api_pb.SetVotingAddressResponse,
    requestSerialize: serialize_walletrpc_SetVotingAddressRequest,
    requestDeserialize: deserialize_walletrpc_SetVotingAddressRequest,
    responseSerialize: serialize_walletrpc_SetVotingAddressResponse,
    responseDeserialize: deserialize_walletrpc_SetVotingAddressResponse,
  },
  setPoolAddress: {
    path: '/walletrpc.TicketBuyerService/SetPoolAddress',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetPoolAddressRequest,
    responseType: api_pb.SetPoolAddressResponse,
    requestSerialize: serialize_walletrpc_SetPoolAddressRequest,
    requestDeserialize: deserialize_walletrpc_SetPoolAddressRequest,
    responseSerialize: serialize_walletrpc_SetPoolAddressResponse,
    responseDeserialize: deserialize_walletrpc_SetPoolAddressResponse,
  },
  setPoolFees: {
    path: '/walletrpc.TicketBuyerService/SetPoolFees',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetPoolFeesRequest,
    responseType: api_pb.SetPoolFeesResponse,
    requestSerialize: serialize_walletrpc_SetPoolFeesRequest,
    requestDeserialize: deserialize_walletrpc_SetPoolFeesRequest,
    responseSerialize: serialize_walletrpc_SetPoolFeesResponse,
    responseDeserialize: deserialize_walletrpc_SetPoolFeesResponse,
  },
  setMaxPerBlock: {
    path: '/walletrpc.TicketBuyerService/SetMaxPerBlock',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetMaxPerBlockRequest,
    responseType: api_pb.SetMaxPerBlockResponse,
    requestSerialize: serialize_walletrpc_SetMaxPerBlockRequest,
    requestDeserialize: deserialize_walletrpc_SetMaxPerBlockRequest,
    responseSerialize: serialize_walletrpc_SetMaxPerBlockResponse,
    responseDeserialize: deserialize_walletrpc_SetMaxPerBlockResponse,
  },
};

var SeedServiceService = exports['walletrpc.SeedService'] = {
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

var AgendaServiceService = exports['walletrpc.AgendaService'] = {
  agendas: {
    path: '/walletrpc.AgendaService/Agendas',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.AgendasRequest,
    responseType: api_pb.AgendasResponse,
    requestSerialize: serialize_walletrpc_AgendasRequest,
    requestDeserialize: deserialize_walletrpc_AgendasRequest,
    responseSerialize: serialize_walletrpc_AgendasResponse,
    responseDeserialize: deserialize_walletrpc_AgendasResponse,
  },
};

var VotingServiceService = exports['walletrpc.VotingService'] = {
  voteChoices: {
    path: '/walletrpc.VotingService/VoteChoices',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.VoteChoicesRequest,
    responseType: api_pb.VoteChoicesResponse,
    requestSerialize: serialize_walletrpc_VoteChoicesRequest,
    requestDeserialize: deserialize_walletrpc_VoteChoicesRequest,
    responseSerialize: serialize_walletrpc_VoteChoicesResponse,
    responseDeserialize: deserialize_walletrpc_VoteChoicesResponse,
  },
  setVoteChoices: {
    path: '/walletrpc.VotingService/SetVoteChoices',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.SetVoteChoicesRequest,
    responseType: api_pb.SetVoteChoicesResponse,
    requestSerialize: serialize_walletrpc_SetVoteChoicesRequest,
    requestDeserialize: deserialize_walletrpc_SetVoteChoicesRequest,
    responseSerialize: serialize_walletrpc_SetVoteChoicesResponse,
    responseDeserialize: deserialize_walletrpc_SetVoteChoicesResponse,
  },
};

var MessageVerificationServiceService = exports['walletrpc.MessageVerificationService'] = {
  verifyMessage: {
    path: '/walletrpc.MessageVerificationService/VerifyMessage',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.VerifyMessageRequest,
    responseType: api_pb.VerifyMessageResponse,
    requestSerialize: serialize_walletrpc_VerifyMessageRequest,
    requestDeserialize: deserialize_walletrpc_VerifyMessageRequest,
    responseSerialize: serialize_walletrpc_VerifyMessageResponse,
    responseDeserialize: deserialize_walletrpc_VerifyMessageResponse,
  },
};

var NetworkServiceService = exports['walletrpc.NetworkService'] = {
  getRawBlock: {
    path: '/walletrpc.NetworkService/GetRawBlock',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetRawBlockRequest,
    responseType: api_pb.GetRawBlockResponse,
    requestSerialize: serialize_walletrpc_GetRawBlockRequest,
    requestDeserialize: deserialize_walletrpc_GetRawBlockRequest,
    responseSerialize: serialize_walletrpc_GetRawBlockResponse,
    responseDeserialize: deserialize_walletrpc_GetRawBlockResponse,
  },
};

var DecodeMessageServiceService = exports['walletrpc.DecodeMessageService'] = {
  decodeRawTransaction: {
    path: '/walletrpc.DecodeMessageService/DecodeRawTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.DecodeRawTransactionRequest,
    responseType: api_pb.DecodeRawTransactionResponse,
    requestSerialize: serialize_walletrpc_DecodeRawTransactionRequest,
    requestDeserialize: deserialize_walletrpc_DecodeRawTransactionRequest,
    responseSerialize: serialize_walletrpc_DecodeRawTransactionResponse,
    responseDeserialize: deserialize_walletrpc_DecodeRawTransactionResponse,
  },
};

