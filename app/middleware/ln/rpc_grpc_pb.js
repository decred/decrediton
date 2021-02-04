// GENERATED CODE -- DO NOT EDIT!

'use strict';
var rpc_pb = require('./rpc_pb.js');

function serialize_lnrpc_AbandonChannelRequest(arg) {
  if (!(arg instanceof rpc_pb.AbandonChannelRequest)) {
    throw new Error('Expected argument of type lnrpc.AbandonChannelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_AbandonChannelRequest(buffer_arg) {
  return rpc_pb.AbandonChannelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_AbandonChannelResponse(arg) {
  if (!(arg instanceof rpc_pb.AbandonChannelResponse)) {
    throw new Error('Expected argument of type lnrpc.AbandonChannelResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_AbandonChannelResponse(buffer_arg) {
  return rpc_pb.AbandonChannelResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_AddInvoiceResponse(arg) {
  if (!(arg instanceof rpc_pb.AddInvoiceResponse)) {
    throw new Error('Expected argument of type lnrpc.AddInvoiceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_AddInvoiceResponse(buffer_arg) {
  return rpc_pb.AddInvoiceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_BakeMacaroonRequest(arg) {
  if (!(arg instanceof rpc_pb.BakeMacaroonRequest)) {
    throw new Error('Expected argument of type lnrpc.BakeMacaroonRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_BakeMacaroonRequest(buffer_arg) {
  return rpc_pb.BakeMacaroonRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_BakeMacaroonResponse(arg) {
  if (!(arg instanceof rpc_pb.BakeMacaroonResponse)) {
    throw new Error('Expected argument of type lnrpc.BakeMacaroonResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_BakeMacaroonResponse(buffer_arg) {
  return rpc_pb.BakeMacaroonResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChanBackupExportRequest(arg) {
  if (!(arg instanceof rpc_pb.ChanBackupExportRequest)) {
    throw new Error('Expected argument of type lnrpc.ChanBackupExportRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChanBackupExportRequest(buffer_arg) {
  return rpc_pb.ChanBackupExportRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChanBackupSnapshot(arg) {
  if (!(arg instanceof rpc_pb.ChanBackupSnapshot)) {
    throw new Error('Expected argument of type lnrpc.ChanBackupSnapshot');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChanBackupSnapshot(buffer_arg) {
  return rpc_pb.ChanBackupSnapshot.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChanInfoRequest(arg) {
  if (!(arg instanceof rpc_pb.ChanInfoRequest)) {
    throw new Error('Expected argument of type lnrpc.ChanInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChanInfoRequest(buffer_arg) {
  return rpc_pb.ChanInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelAcceptRequest(arg) {
  if (!(arg instanceof rpc_pb.ChannelAcceptRequest)) {
    throw new Error('Expected argument of type lnrpc.ChannelAcceptRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelAcceptRequest(buffer_arg) {
  return rpc_pb.ChannelAcceptRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelAcceptResponse(arg) {
  if (!(arg instanceof rpc_pb.ChannelAcceptResponse)) {
    throw new Error('Expected argument of type lnrpc.ChannelAcceptResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelAcceptResponse(buffer_arg) {
  return rpc_pb.ChannelAcceptResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelBackup(arg) {
  if (!(arg instanceof rpc_pb.ChannelBackup)) {
    throw new Error('Expected argument of type lnrpc.ChannelBackup');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelBackup(buffer_arg) {
  return rpc_pb.ChannelBackup.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelBackupSubscription(arg) {
  if (!(arg instanceof rpc_pb.ChannelBackupSubscription)) {
    throw new Error('Expected argument of type lnrpc.ChannelBackupSubscription');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelBackupSubscription(buffer_arg) {
  return rpc_pb.ChannelBackupSubscription.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelBalanceRequest(arg) {
  if (!(arg instanceof rpc_pb.ChannelBalanceRequest)) {
    throw new Error('Expected argument of type lnrpc.ChannelBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelBalanceRequest(buffer_arg) {
  return rpc_pb.ChannelBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelBalanceResponse(arg) {
  if (!(arg instanceof rpc_pb.ChannelBalanceResponse)) {
    throw new Error('Expected argument of type lnrpc.ChannelBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelBalanceResponse(buffer_arg) {
  return rpc_pb.ChannelBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelEdge(arg) {
  if (!(arg instanceof rpc_pb.ChannelEdge)) {
    throw new Error('Expected argument of type lnrpc.ChannelEdge');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelEdge(buffer_arg) {
  return rpc_pb.ChannelEdge.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelEventSubscription(arg) {
  if (!(arg instanceof rpc_pb.ChannelEventSubscription)) {
    throw new Error('Expected argument of type lnrpc.ChannelEventSubscription');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelEventSubscription(buffer_arg) {
  return rpc_pb.ChannelEventSubscription.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelEventUpdate(arg) {
  if (!(arg instanceof rpc_pb.ChannelEventUpdate)) {
    throw new Error('Expected argument of type lnrpc.ChannelEventUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelEventUpdate(buffer_arg) {
  return rpc_pb.ChannelEventUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelGraph(arg) {
  if (!(arg instanceof rpc_pb.ChannelGraph)) {
    throw new Error('Expected argument of type lnrpc.ChannelGraph');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelGraph(buffer_arg) {
  return rpc_pb.ChannelGraph.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelGraphRequest(arg) {
  if (!(arg instanceof rpc_pb.ChannelGraphRequest)) {
    throw new Error('Expected argument of type lnrpc.ChannelGraphRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelGraphRequest(buffer_arg) {
  return rpc_pb.ChannelGraphRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ChannelPoint(arg) {
  if (!(arg instanceof rpc_pb.ChannelPoint)) {
    throw new Error('Expected argument of type lnrpc.ChannelPoint');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChannelPoint(buffer_arg) {
  return rpc_pb.ChannelPoint.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_CloseChannelRequest(arg) {
  if (!(arg instanceof rpc_pb.CloseChannelRequest)) {
    throw new Error('Expected argument of type lnrpc.CloseChannelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_CloseChannelRequest(buffer_arg) {
  return rpc_pb.CloseChannelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_CloseStatusUpdate(arg) {
  if (!(arg instanceof rpc_pb.CloseStatusUpdate)) {
    throw new Error('Expected argument of type lnrpc.CloseStatusUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_CloseStatusUpdate(buffer_arg) {
  return rpc_pb.CloseStatusUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ClosedChannelsRequest(arg) {
  if (!(arg instanceof rpc_pb.ClosedChannelsRequest)) {
    throw new Error('Expected argument of type lnrpc.ClosedChannelsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ClosedChannelsRequest(buffer_arg) {
  return rpc_pb.ClosedChannelsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ClosedChannelsResponse(arg) {
  if (!(arg instanceof rpc_pb.ClosedChannelsResponse)) {
    throw new Error('Expected argument of type lnrpc.ClosedChannelsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ClosedChannelsResponse(buffer_arg) {
  return rpc_pb.ClosedChannelsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ConnectPeerRequest(arg) {
  if (!(arg instanceof rpc_pb.ConnectPeerRequest)) {
    throw new Error('Expected argument of type lnrpc.ConnectPeerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ConnectPeerRequest(buffer_arg) {
  return rpc_pb.ConnectPeerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ConnectPeerResponse(arg) {
  if (!(arg instanceof rpc_pb.ConnectPeerResponse)) {
    throw new Error('Expected argument of type lnrpc.ConnectPeerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ConnectPeerResponse(buffer_arg) {
  return rpc_pb.ConnectPeerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DebugLevelRequest(arg) {
  if (!(arg instanceof rpc_pb.DebugLevelRequest)) {
    throw new Error('Expected argument of type lnrpc.DebugLevelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DebugLevelRequest(buffer_arg) {
  return rpc_pb.DebugLevelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DebugLevelResponse(arg) {
  if (!(arg instanceof rpc_pb.DebugLevelResponse)) {
    throw new Error('Expected argument of type lnrpc.DebugLevelResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DebugLevelResponse(buffer_arg) {
  return rpc_pb.DebugLevelResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DeleteAllPaymentsRequest(arg) {
  if (!(arg instanceof rpc_pb.DeleteAllPaymentsRequest)) {
    throw new Error('Expected argument of type lnrpc.DeleteAllPaymentsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DeleteAllPaymentsRequest(buffer_arg) {
  return rpc_pb.DeleteAllPaymentsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DeleteAllPaymentsResponse(arg) {
  if (!(arg instanceof rpc_pb.DeleteAllPaymentsResponse)) {
    throw new Error('Expected argument of type lnrpc.DeleteAllPaymentsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DeleteAllPaymentsResponse(buffer_arg) {
  return rpc_pb.DeleteAllPaymentsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DeleteMacaroonIDRequest(arg) {
  if (!(arg instanceof rpc_pb.DeleteMacaroonIDRequest)) {
    throw new Error('Expected argument of type lnrpc.DeleteMacaroonIDRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DeleteMacaroonIDRequest(buffer_arg) {
  return rpc_pb.DeleteMacaroonIDRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DeleteMacaroonIDResponse(arg) {
  if (!(arg instanceof rpc_pb.DeleteMacaroonIDResponse)) {
    throw new Error('Expected argument of type lnrpc.DeleteMacaroonIDResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DeleteMacaroonIDResponse(buffer_arg) {
  return rpc_pb.DeleteMacaroonIDResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DisconnectPeerRequest(arg) {
  if (!(arg instanceof rpc_pb.DisconnectPeerRequest)) {
    throw new Error('Expected argument of type lnrpc.DisconnectPeerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DisconnectPeerRequest(buffer_arg) {
  return rpc_pb.DisconnectPeerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_DisconnectPeerResponse(arg) {
  if (!(arg instanceof rpc_pb.DisconnectPeerResponse)) {
    throw new Error('Expected argument of type lnrpc.DisconnectPeerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_DisconnectPeerResponse(buffer_arg) {
  return rpc_pb.DisconnectPeerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_EstimateFeeRequest(arg) {
  if (!(arg instanceof rpc_pb.EstimateFeeRequest)) {
    throw new Error('Expected argument of type lnrpc.EstimateFeeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_EstimateFeeRequest(buffer_arg) {
  return rpc_pb.EstimateFeeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_EstimateFeeResponse(arg) {
  if (!(arg instanceof rpc_pb.EstimateFeeResponse)) {
    throw new Error('Expected argument of type lnrpc.EstimateFeeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_EstimateFeeResponse(buffer_arg) {
  return rpc_pb.EstimateFeeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ExportChannelBackupRequest(arg) {
  if (!(arg instanceof rpc_pb.ExportChannelBackupRequest)) {
    throw new Error('Expected argument of type lnrpc.ExportChannelBackupRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ExportChannelBackupRequest(buffer_arg) {
  return rpc_pb.ExportChannelBackupRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_FeeReportRequest(arg) {
  if (!(arg instanceof rpc_pb.FeeReportRequest)) {
    throw new Error('Expected argument of type lnrpc.FeeReportRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_FeeReportRequest(buffer_arg) {
  return rpc_pb.FeeReportRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_FeeReportResponse(arg) {
  if (!(arg instanceof rpc_pb.FeeReportResponse)) {
    throw new Error('Expected argument of type lnrpc.FeeReportResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_FeeReportResponse(buffer_arg) {
  return rpc_pb.FeeReportResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ForwardingHistoryRequest(arg) {
  if (!(arg instanceof rpc_pb.ForwardingHistoryRequest)) {
    throw new Error('Expected argument of type lnrpc.ForwardingHistoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ForwardingHistoryRequest(buffer_arg) {
  return rpc_pb.ForwardingHistoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ForwardingHistoryResponse(arg) {
  if (!(arg instanceof rpc_pb.ForwardingHistoryResponse)) {
    throw new Error('Expected argument of type lnrpc.ForwardingHistoryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ForwardingHistoryResponse(buffer_arg) {
  return rpc_pb.ForwardingHistoryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_FundingStateStepResp(arg) {
  if (!(arg instanceof rpc_pb.FundingStateStepResp)) {
    throw new Error('Expected argument of type lnrpc.FundingStateStepResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_FundingStateStepResp(buffer_arg) {
  return rpc_pb.FundingStateStepResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_FundingTransitionMsg(arg) {
  if (!(arg instanceof rpc_pb.FundingTransitionMsg)) {
    throw new Error('Expected argument of type lnrpc.FundingTransitionMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_FundingTransitionMsg(buffer_arg) {
  return rpc_pb.FundingTransitionMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GetInfoRequest(arg) {
  if (!(arg instanceof rpc_pb.GetInfoRequest)) {
    throw new Error('Expected argument of type lnrpc.GetInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GetInfoRequest(buffer_arg) {
  return rpc_pb.GetInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GetInfoResponse(arg) {
  if (!(arg instanceof rpc_pb.GetInfoResponse)) {
    throw new Error('Expected argument of type lnrpc.GetInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GetInfoResponse(buffer_arg) {
  return rpc_pb.GetInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GetRecoveryInfoRequest(arg) {
  if (!(arg instanceof rpc_pb.GetRecoveryInfoRequest)) {
    throw new Error('Expected argument of type lnrpc.GetRecoveryInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GetRecoveryInfoRequest(buffer_arg) {
  return rpc_pb.GetRecoveryInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GetRecoveryInfoResponse(arg) {
  if (!(arg instanceof rpc_pb.GetRecoveryInfoResponse)) {
    throw new Error('Expected argument of type lnrpc.GetRecoveryInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GetRecoveryInfoResponse(buffer_arg) {
  return rpc_pb.GetRecoveryInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GetTransactionsRequest(arg) {
  if (!(arg instanceof rpc_pb.GetTransactionsRequest)) {
    throw new Error('Expected argument of type lnrpc.GetTransactionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GetTransactionsRequest(buffer_arg) {
  return rpc_pb.GetTransactionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GraphTopologySubscription(arg) {
  if (!(arg instanceof rpc_pb.GraphTopologySubscription)) {
    throw new Error('Expected argument of type lnrpc.GraphTopologySubscription');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GraphTopologySubscription(buffer_arg) {
  return rpc_pb.GraphTopologySubscription.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GraphTopologyUpdate(arg) {
  if (!(arg instanceof rpc_pb.GraphTopologyUpdate)) {
    throw new Error('Expected argument of type lnrpc.GraphTopologyUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GraphTopologyUpdate(buffer_arg) {
  return rpc_pb.GraphTopologyUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_Invoice(arg) {
  if (!(arg instanceof rpc_pb.Invoice)) {
    throw new Error('Expected argument of type lnrpc.Invoice');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_Invoice(buffer_arg) {
  return rpc_pb.Invoice.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_InvoiceSubscription(arg) {
  if (!(arg instanceof rpc_pb.InvoiceSubscription)) {
    throw new Error('Expected argument of type lnrpc.InvoiceSubscription');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_InvoiceSubscription(buffer_arg) {
  return rpc_pb.InvoiceSubscription.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListChannelsRequest(arg) {
  if (!(arg instanceof rpc_pb.ListChannelsRequest)) {
    throw new Error('Expected argument of type lnrpc.ListChannelsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListChannelsRequest(buffer_arg) {
  return rpc_pb.ListChannelsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListChannelsResponse(arg) {
  if (!(arg instanceof rpc_pb.ListChannelsResponse)) {
    throw new Error('Expected argument of type lnrpc.ListChannelsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListChannelsResponse(buffer_arg) {
  return rpc_pb.ListChannelsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListInvoiceRequest(arg) {
  if (!(arg instanceof rpc_pb.ListInvoiceRequest)) {
    throw new Error('Expected argument of type lnrpc.ListInvoiceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListInvoiceRequest(buffer_arg) {
  return rpc_pb.ListInvoiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListInvoiceResponse(arg) {
  if (!(arg instanceof rpc_pb.ListInvoiceResponse)) {
    throw new Error('Expected argument of type lnrpc.ListInvoiceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListInvoiceResponse(buffer_arg) {
  return rpc_pb.ListInvoiceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListMacaroonIDsRequest(arg) {
  if (!(arg instanceof rpc_pb.ListMacaroonIDsRequest)) {
    throw new Error('Expected argument of type lnrpc.ListMacaroonIDsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListMacaroonIDsRequest(buffer_arg) {
  return rpc_pb.ListMacaroonIDsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListMacaroonIDsResponse(arg) {
  if (!(arg instanceof rpc_pb.ListMacaroonIDsResponse)) {
    throw new Error('Expected argument of type lnrpc.ListMacaroonIDsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListMacaroonIDsResponse(buffer_arg) {
  return rpc_pb.ListMacaroonIDsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListPaymentsRequest(arg) {
  if (!(arg instanceof rpc_pb.ListPaymentsRequest)) {
    throw new Error('Expected argument of type lnrpc.ListPaymentsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListPaymentsRequest(buffer_arg) {
  return rpc_pb.ListPaymentsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListPaymentsResponse(arg) {
  if (!(arg instanceof rpc_pb.ListPaymentsResponse)) {
    throw new Error('Expected argument of type lnrpc.ListPaymentsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListPaymentsResponse(buffer_arg) {
  return rpc_pb.ListPaymentsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListPeersRequest(arg) {
  if (!(arg instanceof rpc_pb.ListPeersRequest)) {
    throw new Error('Expected argument of type lnrpc.ListPeersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListPeersRequest(buffer_arg) {
  return rpc_pb.ListPeersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListPeersResponse(arg) {
  if (!(arg instanceof rpc_pb.ListPeersResponse)) {
    throw new Error('Expected argument of type lnrpc.ListPeersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListPeersResponse(buffer_arg) {
  return rpc_pb.ListPeersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListPermissionsRequest(arg) {
  if (!(arg instanceof rpc_pb.ListPermissionsRequest)) {
    throw new Error('Expected argument of type lnrpc.ListPermissionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListPermissionsRequest(buffer_arg) {
  return rpc_pb.ListPermissionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListPermissionsResponse(arg) {
  if (!(arg instanceof rpc_pb.ListPermissionsResponse)) {
    throw new Error('Expected argument of type lnrpc.ListPermissionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListPermissionsResponse(buffer_arg) {
  return rpc_pb.ListPermissionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListUnspentRequest(arg) {
  if (!(arg instanceof rpc_pb.ListUnspentRequest)) {
    throw new Error('Expected argument of type lnrpc.ListUnspentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListUnspentRequest(buffer_arg) {
  return rpc_pb.ListUnspentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListUnspentResponse(arg) {
  if (!(arg instanceof rpc_pb.ListUnspentResponse)) {
    throw new Error('Expected argument of type lnrpc.ListUnspentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListUnspentResponse(buffer_arg) {
  return rpc_pb.ListUnspentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NetworkInfo(arg) {
  if (!(arg instanceof rpc_pb.NetworkInfo)) {
    throw new Error('Expected argument of type lnrpc.NetworkInfo');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NetworkInfo(buffer_arg) {
  return rpc_pb.NetworkInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NetworkInfoRequest(arg) {
  if (!(arg instanceof rpc_pb.NetworkInfoRequest)) {
    throw new Error('Expected argument of type lnrpc.NetworkInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NetworkInfoRequest(buffer_arg) {
  return rpc_pb.NetworkInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NewAddressRequest(arg) {
  if (!(arg instanceof rpc_pb.NewAddressRequest)) {
    throw new Error('Expected argument of type lnrpc.NewAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NewAddressRequest(buffer_arg) {
  return rpc_pb.NewAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NewAddressResponse(arg) {
  if (!(arg instanceof rpc_pb.NewAddressResponse)) {
    throw new Error('Expected argument of type lnrpc.NewAddressResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NewAddressResponse(buffer_arg) {
  return rpc_pb.NewAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NodeInfo(arg) {
  if (!(arg instanceof rpc_pb.NodeInfo)) {
    throw new Error('Expected argument of type lnrpc.NodeInfo');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NodeInfo(buffer_arg) {
  return rpc_pb.NodeInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NodeInfoRequest(arg) {
  if (!(arg instanceof rpc_pb.NodeInfoRequest)) {
    throw new Error('Expected argument of type lnrpc.NodeInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NodeInfoRequest(buffer_arg) {
  return rpc_pb.NodeInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NodeMetricsRequest(arg) {
  if (!(arg instanceof rpc_pb.NodeMetricsRequest)) {
    throw new Error('Expected argument of type lnrpc.NodeMetricsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NodeMetricsRequest(buffer_arg) {
  return rpc_pb.NodeMetricsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NodeMetricsResponse(arg) {
  if (!(arg instanceof rpc_pb.NodeMetricsResponse)) {
    throw new Error('Expected argument of type lnrpc.NodeMetricsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NodeMetricsResponse(buffer_arg) {
  return rpc_pb.NodeMetricsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_OpenChannelRequest(arg) {
  if (!(arg instanceof rpc_pb.OpenChannelRequest)) {
    throw new Error('Expected argument of type lnrpc.OpenChannelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_OpenChannelRequest(buffer_arg) {
  return rpc_pb.OpenChannelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_OpenStatusUpdate(arg) {
  if (!(arg instanceof rpc_pb.OpenStatusUpdate)) {
    throw new Error('Expected argument of type lnrpc.OpenStatusUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_OpenStatusUpdate(buffer_arg) {
  return rpc_pb.OpenStatusUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PayReq(arg) {
  if (!(arg instanceof rpc_pb.PayReq)) {
    throw new Error('Expected argument of type lnrpc.PayReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PayReq(buffer_arg) {
  return rpc_pb.PayReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PayReqString(arg) {
  if (!(arg instanceof rpc_pb.PayReqString)) {
    throw new Error('Expected argument of type lnrpc.PayReqString');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PayReqString(buffer_arg) {
  return rpc_pb.PayReqString.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PaymentHash(arg) {
  if (!(arg instanceof rpc_pb.PaymentHash)) {
    throw new Error('Expected argument of type lnrpc.PaymentHash');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PaymentHash(buffer_arg) {
  return rpc_pb.PaymentHash.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PeerEvent(arg) {
  if (!(arg instanceof rpc_pb.PeerEvent)) {
    throw new Error('Expected argument of type lnrpc.PeerEvent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PeerEvent(buffer_arg) {
  return rpc_pb.PeerEvent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PeerEventSubscription(arg) {
  if (!(arg instanceof rpc_pb.PeerEventSubscription)) {
    throw new Error('Expected argument of type lnrpc.PeerEventSubscription');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PeerEventSubscription(buffer_arg) {
  return rpc_pb.PeerEventSubscription.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PendingChannelsRequest(arg) {
  if (!(arg instanceof rpc_pb.PendingChannelsRequest)) {
    throw new Error('Expected argument of type lnrpc.PendingChannelsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PendingChannelsRequest(buffer_arg) {
  return rpc_pb.PendingChannelsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PendingChannelsResponse(arg) {
  if (!(arg instanceof rpc_pb.PendingChannelsResponse)) {
    throw new Error('Expected argument of type lnrpc.PendingChannelsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PendingChannelsResponse(buffer_arg) {
  return rpc_pb.PendingChannelsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PolicyUpdateRequest(arg) {
  if (!(arg instanceof rpc_pb.PolicyUpdateRequest)) {
    throw new Error('Expected argument of type lnrpc.PolicyUpdateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PolicyUpdateRequest(buffer_arg) {
  return rpc_pb.PolicyUpdateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_PolicyUpdateResponse(arg) {
  if (!(arg instanceof rpc_pb.PolicyUpdateResponse)) {
    throw new Error('Expected argument of type lnrpc.PolicyUpdateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_PolicyUpdateResponse(buffer_arg) {
  return rpc_pb.PolicyUpdateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_QueryRoutesRequest(arg) {
  if (!(arg instanceof rpc_pb.QueryRoutesRequest)) {
    throw new Error('Expected argument of type lnrpc.QueryRoutesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_QueryRoutesRequest(buffer_arg) {
  return rpc_pb.QueryRoutesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_QueryRoutesResponse(arg) {
  if (!(arg instanceof rpc_pb.QueryRoutesResponse)) {
    throw new Error('Expected argument of type lnrpc.QueryRoutesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_QueryRoutesResponse(buffer_arg) {
  return rpc_pb.QueryRoutesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_RestoreBackupResponse(arg) {
  if (!(arg instanceof rpc_pb.RestoreBackupResponse)) {
    throw new Error('Expected argument of type lnrpc.RestoreBackupResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_RestoreBackupResponse(buffer_arg) {
  return rpc_pb.RestoreBackupResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_RestoreChanBackupRequest(arg) {
  if (!(arg instanceof rpc_pb.RestoreChanBackupRequest)) {
    throw new Error('Expected argument of type lnrpc.RestoreChanBackupRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_RestoreChanBackupRequest(buffer_arg) {
  return rpc_pb.RestoreChanBackupRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendCoinsRequest(arg) {
  if (!(arg instanceof rpc_pb.SendCoinsRequest)) {
    throw new Error('Expected argument of type lnrpc.SendCoinsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendCoinsRequest(buffer_arg) {
  return rpc_pb.SendCoinsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendCoinsResponse(arg) {
  if (!(arg instanceof rpc_pb.SendCoinsResponse)) {
    throw new Error('Expected argument of type lnrpc.SendCoinsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendCoinsResponse(buffer_arg) {
  return rpc_pb.SendCoinsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendManyRequest(arg) {
  if (!(arg instanceof rpc_pb.SendManyRequest)) {
    throw new Error('Expected argument of type lnrpc.SendManyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendManyRequest(buffer_arg) {
  return rpc_pb.SendManyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendManyResponse(arg) {
  if (!(arg instanceof rpc_pb.SendManyResponse)) {
    throw new Error('Expected argument of type lnrpc.SendManyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendManyResponse(buffer_arg) {
  return rpc_pb.SendManyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendRequest(arg) {
  if (!(arg instanceof rpc_pb.SendRequest)) {
    throw new Error('Expected argument of type lnrpc.SendRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendRequest(buffer_arg) {
  return rpc_pb.SendRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendResponse(arg) {
  if (!(arg instanceof rpc_pb.SendResponse)) {
    throw new Error('Expected argument of type lnrpc.SendResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendResponse(buffer_arg) {
  return rpc_pb.SendResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendToRouteRequest(arg) {
  if (!(arg instanceof rpc_pb.SendToRouteRequest)) {
    throw new Error('Expected argument of type lnrpc.SendToRouteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendToRouteRequest(buffer_arg) {
  return rpc_pb.SendToRouteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SignMessageRequest(arg) {
  if (!(arg instanceof rpc_pb.SignMessageRequest)) {
    throw new Error('Expected argument of type lnrpc.SignMessageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SignMessageRequest(buffer_arg) {
  return rpc_pb.SignMessageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SignMessageResponse(arg) {
  if (!(arg instanceof rpc_pb.SignMessageResponse)) {
    throw new Error('Expected argument of type lnrpc.SignMessageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SignMessageResponse(buffer_arg) {
  return rpc_pb.SignMessageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_StopRequest(arg) {
  if (!(arg instanceof rpc_pb.StopRequest)) {
    throw new Error('Expected argument of type lnrpc.StopRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_StopRequest(buffer_arg) {
  return rpc_pb.StopRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_StopResponse(arg) {
  if (!(arg instanceof rpc_pb.StopResponse)) {
    throw new Error('Expected argument of type lnrpc.StopResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_StopResponse(buffer_arg) {
  return rpc_pb.StopResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_Transaction(arg) {
  if (!(arg instanceof rpc_pb.Transaction)) {
    throw new Error('Expected argument of type lnrpc.Transaction');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_Transaction(buffer_arg) {
  return rpc_pb.Transaction.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_TransactionDetails(arg) {
  if (!(arg instanceof rpc_pb.TransactionDetails)) {
    throw new Error('Expected argument of type lnrpc.TransactionDetails');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_TransactionDetails(buffer_arg) {
  return rpc_pb.TransactionDetails.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_VerifyChanBackupResponse(arg) {
  if (!(arg instanceof rpc_pb.VerifyChanBackupResponse)) {
    throw new Error('Expected argument of type lnrpc.VerifyChanBackupResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_VerifyChanBackupResponse(buffer_arg) {
  return rpc_pb.VerifyChanBackupResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_VerifyMessageRequest(arg) {
  if (!(arg instanceof rpc_pb.VerifyMessageRequest)) {
    throw new Error('Expected argument of type lnrpc.VerifyMessageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_VerifyMessageRequest(buffer_arg) {
  return rpc_pb.VerifyMessageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_VerifyMessageResponse(arg) {
  if (!(arg instanceof rpc_pb.VerifyMessageResponse)) {
    throw new Error('Expected argument of type lnrpc.VerifyMessageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_VerifyMessageResponse(buffer_arg) {
  return rpc_pb.VerifyMessageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_WalletBalanceRequest(arg) {
  if (!(arg instanceof rpc_pb.WalletBalanceRequest)) {
    throw new Error('Expected argument of type lnrpc.WalletBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_WalletBalanceRequest(buffer_arg) {
  return rpc_pb.WalletBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_WalletBalanceResponse(arg) {
  if (!(arg instanceof rpc_pb.WalletBalanceResponse)) {
    throw new Error('Expected argument of type lnrpc.WalletBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_WalletBalanceResponse(buffer_arg) {
  return rpc_pb.WalletBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
// Lightning is the main RPC server of the daemon.
var LightningService = exports['lnrpc.Lightning'] = {
  // lncli: `walletbalance`
// WalletBalance returns total unspent outputs(confirmed and unconfirmed), all
// confirmed unspent outputs and all unconfirmed unspent outputs under control
// of the wallet.
walletBalance: {
    path: '/lnrpc.Lightning/WalletBalance',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.WalletBalanceRequest,
    responseType: rpc_pb.WalletBalanceResponse,
    requestSerialize: serialize_lnrpc_WalletBalanceRequest,
    requestDeserialize: deserialize_lnrpc_WalletBalanceRequest,
    responseSerialize: serialize_lnrpc_WalletBalanceResponse,
    responseDeserialize: deserialize_lnrpc_WalletBalanceResponse,
  },
  // lncli: `channelbalance`
// ChannelBalance returns the total funds available across all open channels
// in atoms.
channelBalance: {
    path: '/lnrpc.Lightning/ChannelBalance',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ChannelBalanceRequest,
    responseType: rpc_pb.ChannelBalanceResponse,
    requestSerialize: serialize_lnrpc_ChannelBalanceRequest,
    requestDeserialize: deserialize_lnrpc_ChannelBalanceRequest,
    responseSerialize: serialize_lnrpc_ChannelBalanceResponse,
    responseDeserialize: deserialize_lnrpc_ChannelBalanceResponse,
  },
  // lncli: `listchaintxns`
// GetTransactions returns a list describing all the known transactions
// relevant to the wallet.
getTransactions: {
    path: '/lnrpc.Lightning/GetTransactions',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.GetTransactionsRequest,
    responseType: rpc_pb.TransactionDetails,
    requestSerialize: serialize_lnrpc_GetTransactionsRequest,
    requestDeserialize: deserialize_lnrpc_GetTransactionsRequest,
    responseSerialize: serialize_lnrpc_TransactionDetails,
    responseDeserialize: deserialize_lnrpc_TransactionDetails,
  },
  // lncli: `estimatefee`
// EstimateFee asks the chain backend to estimate the fee rate and total fees
// for a transaction that pays to multiple specified outputs.
//
// When using REST, the `AddrToAmount` map type can be set by appending
// `&AddrToAmount[<address>]=<amount_to_send>` to the URL. Unfortunately this
// map type doesn't appear in the REST API documentation because of a bug in
// the grpc-gateway library.
estimateFee: {
    path: '/lnrpc.Lightning/EstimateFee',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.EstimateFeeRequest,
    responseType: rpc_pb.EstimateFeeResponse,
    requestSerialize: serialize_lnrpc_EstimateFeeRequest,
    requestDeserialize: deserialize_lnrpc_EstimateFeeRequest,
    responseSerialize: serialize_lnrpc_EstimateFeeResponse,
    responseDeserialize: deserialize_lnrpc_EstimateFeeResponse,
  },
  // lncli: `sendcoins`
// SendCoins executes a request to send coins to a particular address. Unlike
// SendMany, this RPC call only allows creating a single output at a time. If
// neither target_conf, or atoms_per_byte are set, then the internal wallet
// will consult its fee model to determine a fee for the default confirmation
// target.
sendCoins: {
    path: '/lnrpc.Lightning/SendCoins',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SendCoinsRequest,
    responseType: rpc_pb.SendCoinsResponse,
    requestSerialize: serialize_lnrpc_SendCoinsRequest,
    requestDeserialize: deserialize_lnrpc_SendCoinsRequest,
    responseSerialize: serialize_lnrpc_SendCoinsResponse,
    responseDeserialize: deserialize_lnrpc_SendCoinsResponse,
  },
  // lncli: `listunspent`
// Deprecated, use walletrpc.ListUnspent instead.
//
// ListUnspent returns a list of all utxos spendable by the wallet with a
// number of confirmations between the specified minimum and maximum.
listUnspent: {
    path: '/lnrpc.Lightning/ListUnspent',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListUnspentRequest,
    responseType: rpc_pb.ListUnspentResponse,
    requestSerialize: serialize_lnrpc_ListUnspentRequest,
    requestDeserialize: deserialize_lnrpc_ListUnspentRequest,
    responseSerialize: serialize_lnrpc_ListUnspentResponse,
    responseDeserialize: deserialize_lnrpc_ListUnspentResponse,
  },
  //
// SubscribeTransactions creates a uni-directional stream from the server to
// the client in which any newly discovered transactions relevant to the
// wallet are sent over.
subscribeTransactions: {
    path: '/lnrpc.Lightning/SubscribeTransactions',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.GetTransactionsRequest,
    responseType: rpc_pb.Transaction,
    requestSerialize: serialize_lnrpc_GetTransactionsRequest,
    requestDeserialize: deserialize_lnrpc_GetTransactionsRequest,
    responseSerialize: serialize_lnrpc_Transaction,
    responseDeserialize: deserialize_lnrpc_Transaction,
  },
  // lncli: `sendmany`
// SendMany handles a request for a transaction that creates multiple specified
// outputs in parallel. If neither target_conf, or atoms_per_byte are set, then
// the internal wallet will consult its fee model to determine a fee for the
// default confirmation target.
sendMany: {
    path: '/lnrpc.Lightning/SendMany',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SendManyRequest,
    responseType: rpc_pb.SendManyResponse,
    requestSerialize: serialize_lnrpc_SendManyRequest,
    requestDeserialize: deserialize_lnrpc_SendManyRequest,
    responseSerialize: serialize_lnrpc_SendManyResponse,
    responseDeserialize: deserialize_lnrpc_SendManyResponse,
  },
  // lncli: `newaddress`
// NewAddress creates a new address under control of the local wallet.
newAddress: {
    path: '/lnrpc.Lightning/NewAddress',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.NewAddressRequest,
    responseType: rpc_pb.NewAddressResponse,
    requestSerialize: serialize_lnrpc_NewAddressRequest,
    requestDeserialize: deserialize_lnrpc_NewAddressRequest,
    responseSerialize: serialize_lnrpc_NewAddressResponse,
    responseDeserialize: deserialize_lnrpc_NewAddressResponse,
  },
  // lncli: `signmessage`
// SignMessage signs a message with this node's private key. The returned
// signature string is `zbase32` encoded and pubkey recoverable, meaning that
// only the message digest and signature are needed for verification.
signMessage: {
    path: '/lnrpc.Lightning/SignMessage',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SignMessageRequest,
    responseType: rpc_pb.SignMessageResponse,
    requestSerialize: serialize_lnrpc_SignMessageRequest,
    requestDeserialize: deserialize_lnrpc_SignMessageRequest,
    responseSerialize: serialize_lnrpc_SignMessageResponse,
    responseDeserialize: deserialize_lnrpc_SignMessageResponse,
  },
  // lncli: `verifymessage`
// VerifyMessage verifies a signature over a msg. The signature must be
// zbase32 encoded and signed by an active node in the resident node's
// channel database. In addition to returning the validity of the signature,
// VerifyMessage also returns the recovered pubkey from the signature.
verifyMessage: {
    path: '/lnrpc.Lightning/VerifyMessage',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.VerifyMessageRequest,
    responseType: rpc_pb.VerifyMessageResponse,
    requestSerialize: serialize_lnrpc_VerifyMessageRequest,
    requestDeserialize: deserialize_lnrpc_VerifyMessageRequest,
    responseSerialize: serialize_lnrpc_VerifyMessageResponse,
    responseDeserialize: deserialize_lnrpc_VerifyMessageResponse,
  },
  // lncli: `connect`
// ConnectPeer attempts to establish a connection to a remote peer. This is at
// the networking level, and is used for communication between nodes. This is
// distinct from establishing a channel with a peer.
connectPeer: {
    path: '/lnrpc.Lightning/ConnectPeer',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ConnectPeerRequest,
    responseType: rpc_pb.ConnectPeerResponse,
    requestSerialize: serialize_lnrpc_ConnectPeerRequest,
    requestDeserialize: deserialize_lnrpc_ConnectPeerRequest,
    responseSerialize: serialize_lnrpc_ConnectPeerResponse,
    responseDeserialize: deserialize_lnrpc_ConnectPeerResponse,
  },
  // lncli: `disconnect`
// DisconnectPeer attempts to disconnect one peer from another identified by a
// given pubKey. In the case that we currently have a pending or active channel
// with the target peer, then this action will be not be allowed.
disconnectPeer: {
    path: '/lnrpc.Lightning/DisconnectPeer',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.DisconnectPeerRequest,
    responseType: rpc_pb.DisconnectPeerResponse,
    requestSerialize: serialize_lnrpc_DisconnectPeerRequest,
    requestDeserialize: deserialize_lnrpc_DisconnectPeerRequest,
    responseSerialize: serialize_lnrpc_DisconnectPeerResponse,
    responseDeserialize: deserialize_lnrpc_DisconnectPeerResponse,
  },
  // lncli: `listpeers`
// ListPeers returns a verbose listing of all currently active peers.
listPeers: {
    path: '/lnrpc.Lightning/ListPeers',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListPeersRequest,
    responseType: rpc_pb.ListPeersResponse,
    requestSerialize: serialize_lnrpc_ListPeersRequest,
    requestDeserialize: deserialize_lnrpc_ListPeersRequest,
    responseSerialize: serialize_lnrpc_ListPeersResponse,
    responseDeserialize: deserialize_lnrpc_ListPeersResponse,
  },
  //
// SubscribePeerEvents creates a uni-directional stream from the server to
// the client in which any events relevant to the state of peers are sent
// over. Events include peers going online and offline.
subscribePeerEvents: {
    path: '/lnrpc.Lightning/SubscribePeerEvents',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.PeerEventSubscription,
    responseType: rpc_pb.PeerEvent,
    requestSerialize: serialize_lnrpc_PeerEventSubscription,
    requestDeserialize: deserialize_lnrpc_PeerEventSubscription,
    responseSerialize: serialize_lnrpc_PeerEvent,
    responseDeserialize: deserialize_lnrpc_PeerEvent,
  },
  // lncli: `getinfo`
// GetInfo returns general information concerning the lightning node including
// it's identity pubkey, alias, the chains it is connected to, and information
// concerning the number of open+pending channels.
getInfo: {
    path: '/lnrpc.Lightning/GetInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.GetInfoRequest,
    responseType: rpc_pb.GetInfoResponse,
    requestSerialize: serialize_lnrpc_GetInfoRequest,
    requestDeserialize: deserialize_lnrpc_GetInfoRequest,
    responseSerialize: serialize_lnrpc_GetInfoResponse,
    responseDeserialize: deserialize_lnrpc_GetInfoResponse,
  },
  // * lncli: `getrecoveryinfo`
// GetRecoveryInfo returns information concerning the recovery mode including
// whether it's in a recovery mode, whether the recovery is finished, and the
// progress made so far.
getRecoveryInfo: {
    path: '/lnrpc.Lightning/GetRecoveryInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.GetRecoveryInfoRequest,
    responseType: rpc_pb.GetRecoveryInfoResponse,
    requestSerialize: serialize_lnrpc_GetRecoveryInfoRequest,
    requestDeserialize: deserialize_lnrpc_GetRecoveryInfoRequest,
    responseSerialize: serialize_lnrpc_GetRecoveryInfoResponse,
    responseDeserialize: deserialize_lnrpc_GetRecoveryInfoResponse,
  },
  // TODO(roasbeef): merge with below with bool?
//
// lncli: `pendingchannels`
// PendingChannels returns a list of all the channels that are currently
// considered "pending". A channel is pending if it has finished the funding
// workflow and is waiting for confirmations for the funding txn, or is in the
// process of closure, either initiated cooperatively or non-cooperatively.
pendingChannels: {
    path: '/lnrpc.Lightning/PendingChannels',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.PendingChannelsRequest,
    responseType: rpc_pb.PendingChannelsResponse,
    requestSerialize: serialize_lnrpc_PendingChannelsRequest,
    requestDeserialize: deserialize_lnrpc_PendingChannelsRequest,
    responseSerialize: serialize_lnrpc_PendingChannelsResponse,
    responseDeserialize: deserialize_lnrpc_PendingChannelsResponse,
  },
  // lncli: `listchannels`
// ListChannels returns a description of all the open channels that this node
// is a participant in.
listChannels: {
    path: '/lnrpc.Lightning/ListChannels',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListChannelsRequest,
    responseType: rpc_pb.ListChannelsResponse,
    requestSerialize: serialize_lnrpc_ListChannelsRequest,
    requestDeserialize: deserialize_lnrpc_ListChannelsRequest,
    responseSerialize: serialize_lnrpc_ListChannelsResponse,
    responseDeserialize: deserialize_lnrpc_ListChannelsResponse,
  },
  //
// SubscribeChannelEvents creates a uni-directional stream from the server to
// the client in which any updates relevant to the state of the channels are
// sent over. Events include new active channels, inactive channels, and closed
// channels.
subscribeChannelEvents: {
    path: '/lnrpc.Lightning/SubscribeChannelEvents',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.ChannelEventSubscription,
    responseType: rpc_pb.ChannelEventUpdate,
    requestSerialize: serialize_lnrpc_ChannelEventSubscription,
    requestDeserialize: deserialize_lnrpc_ChannelEventSubscription,
    responseSerialize: serialize_lnrpc_ChannelEventUpdate,
    responseDeserialize: deserialize_lnrpc_ChannelEventUpdate,
  },
  // lncli: `closedchannels`
// ClosedChannels returns a description of all the closed channels that
// this node was a participant in.
closedChannels: {
    path: '/lnrpc.Lightning/ClosedChannels',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ClosedChannelsRequest,
    responseType: rpc_pb.ClosedChannelsResponse,
    requestSerialize: serialize_lnrpc_ClosedChannelsRequest,
    requestDeserialize: deserialize_lnrpc_ClosedChannelsRequest,
    responseSerialize: serialize_lnrpc_ClosedChannelsResponse,
    responseDeserialize: deserialize_lnrpc_ClosedChannelsResponse,
  },
  //
// OpenChannelSync is a synchronous version of the OpenChannel RPC call. This
// call is meant to be consumed by clients to the REST proxy. As with all
// other sync calls, all byte slices are intended to be populated as hex
// encoded strings.
openChannelSync: {
    path: '/lnrpc.Lightning/OpenChannelSync',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.OpenChannelRequest,
    responseType: rpc_pb.ChannelPoint,
    requestSerialize: serialize_lnrpc_OpenChannelRequest,
    requestDeserialize: deserialize_lnrpc_OpenChannelRequest,
    responseSerialize: serialize_lnrpc_ChannelPoint,
    responseDeserialize: deserialize_lnrpc_ChannelPoint,
  },
  // lncli: `openchannel`
// OpenChannel attempts to open a singly funded channel specified in the
// request to a remote peer. Users are able to specify a target number of
// blocks that the funding transaction should be confirmed in, or a manual fee
// rate to us for the funding transaction. If neither are specified, then a
// lax block confirmation target is used. Each OpenStatusUpdate will return
// the pending channel ID of the in-progress channel. Depending on the
// arguments specified in the OpenChannelRequest, this pending channel ID can
// then be used to manually progress the channel funding flow.
openChannel: {
    path: '/lnrpc.Lightning/OpenChannel',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.OpenChannelRequest,
    responseType: rpc_pb.OpenStatusUpdate,
    requestSerialize: serialize_lnrpc_OpenChannelRequest,
    requestDeserialize: deserialize_lnrpc_OpenChannelRequest,
    responseSerialize: serialize_lnrpc_OpenStatusUpdate,
    responseDeserialize: deserialize_lnrpc_OpenStatusUpdate,
  },
  //
// FundingStateStep is an advanced funding related call that allows the caller
// to either execute some preparatory steps for a funding workflow, or
// manually progress a funding workflow. The primary way a funding flow is
// identified is via its pending channel ID. As an example, this method can be
// used to specify that we're expecting a funding flow for a particular
// pending channel ID, for which we need to use specific parameters.
// Alternatively, this can be used to interactively drive PSBT signing for
// funding for partially complete funding transactions.
fundingStateStep: {
    path: '/lnrpc.Lightning/FundingStateStep',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.FundingTransitionMsg,
    responseType: rpc_pb.FundingStateStepResp,
    requestSerialize: serialize_lnrpc_FundingTransitionMsg,
    requestDeserialize: deserialize_lnrpc_FundingTransitionMsg,
    responseSerialize: serialize_lnrpc_FundingStateStepResp,
    responseDeserialize: deserialize_lnrpc_FundingStateStepResp,
  },
  //
// ChannelAcceptor dispatches a bi-directional streaming RPC in which
// OpenChannel requests are sent to the client and the client responds with
// a boolean that tells LND whether or not to accept the channel. This allows
// node operators to specify their own criteria for accepting inbound channels
// through a single persistent connection.
channelAcceptor: {
    path: '/lnrpc.Lightning/ChannelAcceptor',
    requestStream: true,
    responseStream: true,
    requestType: rpc_pb.ChannelAcceptResponse,
    responseType: rpc_pb.ChannelAcceptRequest,
    requestSerialize: serialize_lnrpc_ChannelAcceptResponse,
    requestDeserialize: deserialize_lnrpc_ChannelAcceptResponse,
    responseSerialize: serialize_lnrpc_ChannelAcceptRequest,
    responseDeserialize: deserialize_lnrpc_ChannelAcceptRequest,
  },
  // lncli: `closechannel`
// CloseChannel attempts to close an active channel identified by its channel
// outpoint (ChannelPoint). The actions of this method can additionally be
// augmented to attempt a force close after a timeout period in the case of an
// inactive peer. If a non-force close (cooperative closure) is requested,
// then the user can specify either a target number of blocks until the
// closure transaction is confirmed, or a manual fee rate. If neither are
// specified, then a default lax, block confirmation target is used.
closeChannel: {
    path: '/lnrpc.Lightning/CloseChannel',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.CloseChannelRequest,
    responseType: rpc_pb.CloseStatusUpdate,
    requestSerialize: serialize_lnrpc_CloseChannelRequest,
    requestDeserialize: deserialize_lnrpc_CloseChannelRequest,
    responseSerialize: serialize_lnrpc_CloseStatusUpdate,
    responseDeserialize: deserialize_lnrpc_CloseStatusUpdate,
  },
  // lncli: `abandonchannel`
// AbandonChannel removes all channel state from the database except for a
// close summary. This method can be used to get rid of permanently unusable
// channels due to bugs fixed in newer versions of lnd. This method can also be
// used to remove externally funded channels where the funding transaction was
// never broadcast. Only available for non-externally funded channels in dev
// build.
abandonChannel: {
    path: '/lnrpc.Lightning/AbandonChannel',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.AbandonChannelRequest,
    responseType: rpc_pb.AbandonChannelResponse,
    requestSerialize: serialize_lnrpc_AbandonChannelRequest,
    requestDeserialize: deserialize_lnrpc_AbandonChannelRequest,
    responseSerialize: serialize_lnrpc_AbandonChannelResponse,
    responseDeserialize: deserialize_lnrpc_AbandonChannelResponse,
  },
  // lncli: `sendpayment`
// Deprecated, use routerrpc.SendPaymentV2. SendPayment dispatches a
// bi-directional streaming RPC for sending payments through the Lightning
// Network. A single RPC invocation creates a persistent bi-directional
// stream allowing clients to rapidly send payments through the Lightning
// Network with a single persistent connection.
sendPayment: {
    path: '/lnrpc.Lightning/SendPayment',
    requestStream: true,
    responseStream: true,
    requestType: rpc_pb.SendRequest,
    responseType: rpc_pb.SendResponse,
    requestSerialize: serialize_lnrpc_SendRequest,
    requestDeserialize: deserialize_lnrpc_SendRequest,
    responseSerialize: serialize_lnrpc_SendResponse,
    responseDeserialize: deserialize_lnrpc_SendResponse,
  },
  //
// SendPaymentSync is the synchronous non-streaming version of SendPayment.
// This RPC is intended to be consumed by clients of the REST proxy.
// Additionally, this RPC expects the destination's public key and the payment
// hash (if any) to be encoded as hex strings.
sendPaymentSync: {
    path: '/lnrpc.Lightning/SendPaymentSync',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SendRequest,
    responseType: rpc_pb.SendResponse,
    requestSerialize: serialize_lnrpc_SendRequest,
    requestDeserialize: deserialize_lnrpc_SendRequest,
    responseSerialize: serialize_lnrpc_SendResponse,
    responseDeserialize: deserialize_lnrpc_SendResponse,
  },
  // lncli: `sendtoroute`
// Deprecated, use routerrpc.SendToRouteV2. SendToRoute is a bi-directional
// streaming RPC for sending payment through the Lightning Network. This
// method differs from SendPayment in that it allows users to specify a full
// route manually. This can be used for things like rebalancing, and atomic
// swaps.
sendToRoute: {
    path: '/lnrpc.Lightning/SendToRoute',
    requestStream: true,
    responseStream: true,
    requestType: rpc_pb.SendToRouteRequest,
    responseType: rpc_pb.SendResponse,
    requestSerialize: serialize_lnrpc_SendToRouteRequest,
    requestDeserialize: deserialize_lnrpc_SendToRouteRequest,
    responseSerialize: serialize_lnrpc_SendResponse,
    responseDeserialize: deserialize_lnrpc_SendResponse,
  },
  //
// SendToRouteSync is a synchronous version of SendToRoute. It Will block
// until the payment either fails or succeeds.
sendToRouteSync: {
    path: '/lnrpc.Lightning/SendToRouteSync',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SendToRouteRequest,
    responseType: rpc_pb.SendResponse,
    requestSerialize: serialize_lnrpc_SendToRouteRequest,
    requestDeserialize: deserialize_lnrpc_SendToRouteRequest,
    responseSerialize: serialize_lnrpc_SendResponse,
    responseDeserialize: deserialize_lnrpc_SendResponse,
  },
  // lncli: `addinvoice`
// AddInvoice attempts to add a new invoice to the invoice database. Any
// duplicated invoices are rejected, therefore all invoices *must* have a
// unique payment preimage.
addInvoice: {
    path: '/lnrpc.Lightning/AddInvoice',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Invoice,
    responseType: rpc_pb.AddInvoiceResponse,
    requestSerialize: serialize_lnrpc_Invoice,
    requestDeserialize: deserialize_lnrpc_Invoice,
    responseSerialize: serialize_lnrpc_AddInvoiceResponse,
    responseDeserialize: deserialize_lnrpc_AddInvoiceResponse,
  },
  // lncli: `listinvoices`
// ListInvoices returns a list of all the invoices currently stored within the
// database. Any active debug invoices are ignored. It has full support for
// paginated responses, allowing users to query for specific invoices through
// their add_index. This can be done by using either the first_index_offset or
// last_index_offset fields included in the response as the index_offset of the
// next request. By default, the first 100 invoices created will be returned.
// Backwards pagination is also supported through the Reversed flag.
listInvoices: {
    path: '/lnrpc.Lightning/ListInvoices',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListInvoiceRequest,
    responseType: rpc_pb.ListInvoiceResponse,
    requestSerialize: serialize_lnrpc_ListInvoiceRequest,
    requestDeserialize: deserialize_lnrpc_ListInvoiceRequest,
    responseSerialize: serialize_lnrpc_ListInvoiceResponse,
    responseDeserialize: deserialize_lnrpc_ListInvoiceResponse,
  },
  // lncli: `lookupinvoice`
// LookupInvoice attempts to look up an invoice according to its payment hash.
// The passed payment hash *must* be exactly 32 bytes, if not, an error is
// returned.
lookupInvoice: {
    path: '/lnrpc.Lightning/LookupInvoice',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.PaymentHash,
    responseType: rpc_pb.Invoice,
    requestSerialize: serialize_lnrpc_PaymentHash,
    requestDeserialize: deserialize_lnrpc_PaymentHash,
    responseSerialize: serialize_lnrpc_Invoice,
    responseDeserialize: deserialize_lnrpc_Invoice,
  },
  //
// SubscribeInvoices returns a uni-directional stream (server -> client) for
// notifying the client of newly added/settled invoices. The caller can
// optionally specify the add_index and/or the settle_index. If the add_index
// is specified, then we'll first start by sending add invoice events for all
// invoices with an add_index greater than the specified value. If the
// settle_index is specified, the next, we'll send out all settle events for
// invoices with a settle_index greater than the specified value. One or both
// of these fields can be set. If no fields are set, then we'll only send out
// the latest add/settle events.
subscribeInvoices: {
    path: '/lnrpc.Lightning/SubscribeInvoices',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.InvoiceSubscription,
    responseType: rpc_pb.Invoice,
    requestSerialize: serialize_lnrpc_InvoiceSubscription,
    requestDeserialize: deserialize_lnrpc_InvoiceSubscription,
    responseSerialize: serialize_lnrpc_Invoice,
    responseDeserialize: deserialize_lnrpc_Invoice,
  },
  // lncli: `decodepayreq`
// DecodePayReq takes an encoded payment request string and attempts to decode
// it, returning a full description of the conditions encoded within the
// payment request.
decodePayReq: {
    path: '/lnrpc.Lightning/DecodePayReq',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.PayReqString,
    responseType: rpc_pb.PayReq,
    requestSerialize: serialize_lnrpc_PayReqString,
    requestDeserialize: deserialize_lnrpc_PayReqString,
    responseSerialize: serialize_lnrpc_PayReq,
    responseDeserialize: deserialize_lnrpc_PayReq,
  },
  // lncli: `listpayments`
// ListPayments returns a list of all outgoing payments.
listPayments: {
    path: '/lnrpc.Lightning/ListPayments',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListPaymentsRequest,
    responseType: rpc_pb.ListPaymentsResponse,
    requestSerialize: serialize_lnrpc_ListPaymentsRequest,
    requestDeserialize: deserialize_lnrpc_ListPaymentsRequest,
    responseSerialize: serialize_lnrpc_ListPaymentsResponse,
    responseDeserialize: deserialize_lnrpc_ListPaymentsResponse,
  },
  //
// DeleteAllPayments deletes all outgoing payments from DB.
deleteAllPayments: {
    path: '/lnrpc.Lightning/DeleteAllPayments',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.DeleteAllPaymentsRequest,
    responseType: rpc_pb.DeleteAllPaymentsResponse,
    requestSerialize: serialize_lnrpc_DeleteAllPaymentsRequest,
    requestDeserialize: deserialize_lnrpc_DeleteAllPaymentsRequest,
    responseSerialize: serialize_lnrpc_DeleteAllPaymentsResponse,
    responseDeserialize: deserialize_lnrpc_DeleteAllPaymentsResponse,
  },
  // lncli: `describegraph`
// DescribeGraph returns a description of the latest graph state from the
// point of view of the node. The graph information is partitioned into two
// components: all the nodes/vertexes, and all the edges that connect the
// vertexes themselves. As this is a directed graph, the edges also contain
// the node directional specific routing policy which includes: the time lock
// delta, fee information, etc.
describeGraph: {
    path: '/lnrpc.Lightning/DescribeGraph',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ChannelGraphRequest,
    responseType: rpc_pb.ChannelGraph,
    requestSerialize: serialize_lnrpc_ChannelGraphRequest,
    requestDeserialize: deserialize_lnrpc_ChannelGraphRequest,
    responseSerialize: serialize_lnrpc_ChannelGraph,
    responseDeserialize: deserialize_lnrpc_ChannelGraph,
  },
  // lncli: `getnodemetrics`
// GetNodeMetrics returns node metrics calculated from the graph. Currently
// the only supported metric is betweenness centrality of individual nodes.
getNodeMetrics: {
    path: '/lnrpc.Lightning/GetNodeMetrics',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.NodeMetricsRequest,
    responseType: rpc_pb.NodeMetricsResponse,
    requestSerialize: serialize_lnrpc_NodeMetricsRequest,
    requestDeserialize: deserialize_lnrpc_NodeMetricsRequest,
    responseSerialize: serialize_lnrpc_NodeMetricsResponse,
    responseDeserialize: deserialize_lnrpc_NodeMetricsResponse,
  },
  // lncli: `getchaninfo`
// GetChanInfo returns the latest authenticated network announcement for the
// given channel identified by its channel ID: an 8-byte integer which
// uniquely identifies the location of transaction's funding output within the
// blockchain.
getChanInfo: {
    path: '/lnrpc.Lightning/GetChanInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ChanInfoRequest,
    responseType: rpc_pb.ChannelEdge,
    requestSerialize: serialize_lnrpc_ChanInfoRequest,
    requestDeserialize: deserialize_lnrpc_ChanInfoRequest,
    responseSerialize: serialize_lnrpc_ChannelEdge,
    responseDeserialize: deserialize_lnrpc_ChannelEdge,
  },
  // lncli: `getnodeinfo`
// GetNodeInfo returns the latest advertised, aggregated, and authenticated
// channel information for the specified node identified by its public key.
getNodeInfo: {
    path: '/lnrpc.Lightning/GetNodeInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.NodeInfoRequest,
    responseType: rpc_pb.NodeInfo,
    requestSerialize: serialize_lnrpc_NodeInfoRequest,
    requestDeserialize: deserialize_lnrpc_NodeInfoRequest,
    responseSerialize: serialize_lnrpc_NodeInfo,
    responseDeserialize: deserialize_lnrpc_NodeInfo,
  },
  // lncli: `queryroutes`
// QueryRoutes attempts to query the daemon's Channel Router for a possible
// route to a target destination capable of carrying a specific amount of
// atoms. The retuned route contains the full details required to craft and
// send an HTLC, also including the necessary information that should be
// present within the Sphinx packet encapsulated within the HTLC.
//
// When using REST, the `dest_custom_records` map type can be set by appending
// `&dest_custom_records[<record_number>]=<record_data_base64_url_encoded>`
// to the URL. Unfortunately this map type doesn't appear in the REST API
// documentation because of a bug in the grpc-gateway library.
queryRoutes: {
    path: '/lnrpc.Lightning/QueryRoutes',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.QueryRoutesRequest,
    responseType: rpc_pb.QueryRoutesResponse,
    requestSerialize: serialize_lnrpc_QueryRoutesRequest,
    requestDeserialize: deserialize_lnrpc_QueryRoutesRequest,
    responseSerialize: serialize_lnrpc_QueryRoutesResponse,
    responseDeserialize: deserialize_lnrpc_QueryRoutesResponse,
  },
  // lncli: `getnetworkinfo`
// GetNetworkInfo returns some basic stats about the known channel graph from
// the point of view of the node.
getNetworkInfo: {
    path: '/lnrpc.Lightning/GetNetworkInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.NetworkInfoRequest,
    responseType: rpc_pb.NetworkInfo,
    requestSerialize: serialize_lnrpc_NetworkInfoRequest,
    requestDeserialize: deserialize_lnrpc_NetworkInfoRequest,
    responseSerialize: serialize_lnrpc_NetworkInfo,
    responseDeserialize: deserialize_lnrpc_NetworkInfo,
  },
  // lncli: `stop`
// StopDaemon will send a shutdown request to the interrupt handler, triggering
// a graceful shutdown of the daemon.
stopDaemon: {
    path: '/lnrpc.Lightning/StopDaemon',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.StopRequest,
    responseType: rpc_pb.StopResponse,
    requestSerialize: serialize_lnrpc_StopRequest,
    requestDeserialize: deserialize_lnrpc_StopRequest,
    responseSerialize: serialize_lnrpc_StopResponse,
    responseDeserialize: deserialize_lnrpc_StopResponse,
  },
  //
// SubscribeChannelGraph launches a streaming RPC that allows the caller to
// receive notifications upon any changes to the channel graph topology from
// the point of view of the responding node. Events notified include: new
// nodes coming online, nodes updating their authenticated attributes, new
// channels being advertised, updates in the routing policy for a directional
// channel edge, and when channels are closed on-chain.
subscribeChannelGraph: {
    path: '/lnrpc.Lightning/SubscribeChannelGraph',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.GraphTopologySubscription,
    responseType: rpc_pb.GraphTopologyUpdate,
    requestSerialize: serialize_lnrpc_GraphTopologySubscription,
    requestDeserialize: deserialize_lnrpc_GraphTopologySubscription,
    responseSerialize: serialize_lnrpc_GraphTopologyUpdate,
    responseDeserialize: deserialize_lnrpc_GraphTopologyUpdate,
  },
  // lncli: `debuglevel`
// DebugLevel allows a caller to programmatically set the logging verbosity of
// lnd. The logging can be targeted according to a coarse daemon-wide logging
// level, or in a granular fashion to specify the logging for a target
// sub-system.
debugLevel: {
    path: '/lnrpc.Lightning/DebugLevel',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.DebugLevelRequest,
    responseType: rpc_pb.DebugLevelResponse,
    requestSerialize: serialize_lnrpc_DebugLevelRequest,
    requestDeserialize: deserialize_lnrpc_DebugLevelRequest,
    responseSerialize: serialize_lnrpc_DebugLevelResponse,
    responseDeserialize: deserialize_lnrpc_DebugLevelResponse,
  },
  // lncli: `feereport`
// FeeReport allows the caller to obtain a report detailing the current fee
// schedule enforced by the node globally for each channel.
feeReport: {
    path: '/lnrpc.Lightning/FeeReport',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.FeeReportRequest,
    responseType: rpc_pb.FeeReportResponse,
    requestSerialize: serialize_lnrpc_FeeReportRequest,
    requestDeserialize: deserialize_lnrpc_FeeReportRequest,
    responseSerialize: serialize_lnrpc_FeeReportResponse,
    responseDeserialize: deserialize_lnrpc_FeeReportResponse,
  },
  // lncli: `updatechanpolicy`
// UpdateChannelPolicy allows the caller to update the fee schedule and
// channel policies for all channels globally, or a particular channel.
updateChannelPolicy: {
    path: '/lnrpc.Lightning/UpdateChannelPolicy',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.PolicyUpdateRequest,
    responseType: rpc_pb.PolicyUpdateResponse,
    requestSerialize: serialize_lnrpc_PolicyUpdateRequest,
    requestDeserialize: deserialize_lnrpc_PolicyUpdateRequest,
    responseSerialize: serialize_lnrpc_PolicyUpdateResponse,
    responseDeserialize: deserialize_lnrpc_PolicyUpdateResponse,
  },
  // lncli: `fwdinghistory`
// ForwardingHistory allows the caller to query the htlcswitch for a record of
// all HTLCs forwarded within the target time range, and integer offset
// within that time range. If no time-range is specified, then the first chunk
// of the past 24 hrs of forwarding history are returned.
//
// A list of forwarding events are returned. The size of each forwarding event
// is 40 bytes, and the max message size able to be returned in gRPC is 4 MiB.
// As a result each message can only contain 50k entries. Each response has
// the index offset of the last entry. The index offset can be provided to the
// request to allow the caller to skip a series of records.
forwardingHistory: {
    path: '/lnrpc.Lightning/ForwardingHistory',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ForwardingHistoryRequest,
    responseType: rpc_pb.ForwardingHistoryResponse,
    requestSerialize: serialize_lnrpc_ForwardingHistoryRequest,
    requestDeserialize: deserialize_lnrpc_ForwardingHistoryRequest,
    responseSerialize: serialize_lnrpc_ForwardingHistoryResponse,
    responseDeserialize: deserialize_lnrpc_ForwardingHistoryResponse,
  },
  // lncli: `exportchanbackup`
// ExportChannelBackup attempts to return an encrypted static channel backup
// for the target channel identified by it channel point. The backup is
// encrypted with a key generated from the aezeed seed of the user. The
// returned backup can either be restored using the RestoreChannelBackup
// method once lnd is running, or via the InitWallet and UnlockWallet methods
// from the WalletUnlocker service.
exportChannelBackup: {
    path: '/lnrpc.Lightning/ExportChannelBackup',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ExportChannelBackupRequest,
    responseType: rpc_pb.ChannelBackup,
    requestSerialize: serialize_lnrpc_ExportChannelBackupRequest,
    requestDeserialize: deserialize_lnrpc_ExportChannelBackupRequest,
    responseSerialize: serialize_lnrpc_ChannelBackup,
    responseDeserialize: deserialize_lnrpc_ChannelBackup,
  },
  //
// ExportAllChannelBackups returns static channel backups for all existing
// channels known to lnd. A set of regular singular static channel backups for
// each channel are returned. Additionally, a multi-channel backup is returned
// as well, which contains a single encrypted blob containing the backups of
// each channel.
exportAllChannelBackups: {
    path: '/lnrpc.Lightning/ExportAllChannelBackups',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ChanBackupExportRequest,
    responseType: rpc_pb.ChanBackupSnapshot,
    requestSerialize: serialize_lnrpc_ChanBackupExportRequest,
    requestDeserialize: deserialize_lnrpc_ChanBackupExportRequest,
    responseSerialize: serialize_lnrpc_ChanBackupSnapshot,
    responseDeserialize: deserialize_lnrpc_ChanBackupSnapshot,
  },
  //
// VerifyChanBackup allows a caller to verify the integrity of a channel backup
// snapshot. This method will accept either a packed Single or a packed Multi.
// Specifying both will result in an error.
verifyChanBackup: {
    path: '/lnrpc.Lightning/VerifyChanBackup',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ChanBackupSnapshot,
    responseType: rpc_pb.VerifyChanBackupResponse,
    requestSerialize: serialize_lnrpc_ChanBackupSnapshot,
    requestDeserialize: deserialize_lnrpc_ChanBackupSnapshot,
    responseSerialize: serialize_lnrpc_VerifyChanBackupResponse,
    responseDeserialize: deserialize_lnrpc_VerifyChanBackupResponse,
  },
  // lncli: `restorechanbackup`
// RestoreChannelBackups accepts a set of singular channel backups, or a
// single encrypted multi-chan backup and attempts to recover any funds
// remaining within the channel. If we are able to unpack the backup, then the
// new channel will be shown under listchannels, as well as pending channels.
restoreChannelBackups: {
    path: '/lnrpc.Lightning/RestoreChannelBackups',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.RestoreChanBackupRequest,
    responseType: rpc_pb.RestoreBackupResponse,
    requestSerialize: serialize_lnrpc_RestoreChanBackupRequest,
    requestDeserialize: deserialize_lnrpc_RestoreChanBackupRequest,
    responseSerialize: serialize_lnrpc_RestoreBackupResponse,
    responseDeserialize: deserialize_lnrpc_RestoreBackupResponse,
  },
  //
// SubscribeChannelBackups allows a client to sub-subscribe to the most up to
// date information concerning the state of all channel backups. Each time a
// new channel is added, we return the new set of channels, along with a
// multi-chan backup containing the backup info for all channels. Each time a
// channel is closed, we send a new update, which contains new new chan back
// ups, but the updated set of encrypted multi-chan backups with the closed
// channel(s) removed.
subscribeChannelBackups: {
    path: '/lnrpc.Lightning/SubscribeChannelBackups',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.ChannelBackupSubscription,
    responseType: rpc_pb.ChanBackupSnapshot,
    requestSerialize: serialize_lnrpc_ChannelBackupSubscription,
    requestDeserialize: deserialize_lnrpc_ChannelBackupSubscription,
    responseSerialize: serialize_lnrpc_ChanBackupSnapshot,
    responseDeserialize: deserialize_lnrpc_ChanBackupSnapshot,
  },
  // lncli: `bakemacaroon`
// BakeMacaroon allows the creation of a new macaroon with custom read and
// write permissions. No first-party caveats are added since this can be done
// offline.
bakeMacaroon: {
    path: '/lnrpc.Lightning/BakeMacaroon',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.BakeMacaroonRequest,
    responseType: rpc_pb.BakeMacaroonResponse,
    requestSerialize: serialize_lnrpc_BakeMacaroonRequest,
    requestDeserialize: deserialize_lnrpc_BakeMacaroonRequest,
    responseSerialize: serialize_lnrpc_BakeMacaroonResponse,
    responseDeserialize: deserialize_lnrpc_BakeMacaroonResponse,
  },
  // lncli: `listmacaroonids`
// ListMacaroonIDs returns all root key IDs that are in use.
listMacaroonIDs: {
    path: '/lnrpc.Lightning/ListMacaroonIDs',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListMacaroonIDsRequest,
    responseType: rpc_pb.ListMacaroonIDsResponse,
    requestSerialize: serialize_lnrpc_ListMacaroonIDsRequest,
    requestDeserialize: deserialize_lnrpc_ListMacaroonIDsRequest,
    responseSerialize: serialize_lnrpc_ListMacaroonIDsResponse,
    responseDeserialize: deserialize_lnrpc_ListMacaroonIDsResponse,
  },
  // lncli: `deletemacaroonid`
// DeleteMacaroonID deletes the specified macaroon ID and invalidates all
// macaroons derived from that ID.
deleteMacaroonID: {
    path: '/lnrpc.Lightning/DeleteMacaroonID',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.DeleteMacaroonIDRequest,
    responseType: rpc_pb.DeleteMacaroonIDResponse,
    requestSerialize: serialize_lnrpc_DeleteMacaroonIDRequest,
    requestDeserialize: deserialize_lnrpc_DeleteMacaroonIDRequest,
    responseSerialize: serialize_lnrpc_DeleteMacaroonIDResponse,
    responseDeserialize: deserialize_lnrpc_DeleteMacaroonIDResponse,
  },
  // lncli: `listpermissions`
// ListPermissions lists all RPC method URIs and their required macaroon
// permissions to access them.
listPermissions: {
    path: '/lnrpc.Lightning/ListPermissions',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListPermissionsRequest,
    responseType: rpc_pb.ListPermissionsResponse,
    requestSerialize: serialize_lnrpc_ListPermissionsRequest,
    requestDeserialize: deserialize_lnrpc_ListPermissionsRequest,
    responseSerialize: serialize_lnrpc_ListPermissionsResponse,
    responseDeserialize: deserialize_lnrpc_ListPermissionsResponse,
  },
};

