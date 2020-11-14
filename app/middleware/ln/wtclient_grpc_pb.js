// GENERATED CODE -- DO NOT EDIT!

'use strict';
var wtclient_pb = require('./wtclient_pb.js');

function serialize_wtclientrpc_AddTowerRequest(arg) {
  if (!(arg instanceof wtclient_pb.AddTowerRequest)) {
    throw new Error('Expected argument of type wtclientrpc.AddTowerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_AddTowerRequest(buffer_arg) {
  return wtclient_pb.AddTowerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_AddTowerResponse(arg) {
  if (!(arg instanceof wtclient_pb.AddTowerResponse)) {
    throw new Error('Expected argument of type wtclientrpc.AddTowerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_AddTowerResponse(buffer_arg) {
  return wtclient_pb.AddTowerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_GetTowerInfoRequest(arg) {
  if (!(arg instanceof wtclient_pb.GetTowerInfoRequest)) {
    throw new Error('Expected argument of type wtclientrpc.GetTowerInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_GetTowerInfoRequest(buffer_arg) {
  return wtclient_pb.GetTowerInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_ListTowersRequest(arg) {
  if (!(arg instanceof wtclient_pb.ListTowersRequest)) {
    throw new Error('Expected argument of type wtclientrpc.ListTowersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_ListTowersRequest(buffer_arg) {
  return wtclient_pb.ListTowersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_ListTowersResponse(arg) {
  if (!(arg instanceof wtclient_pb.ListTowersResponse)) {
    throw new Error('Expected argument of type wtclientrpc.ListTowersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_ListTowersResponse(buffer_arg) {
  return wtclient_pb.ListTowersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_PolicyRequest(arg) {
  if (!(arg instanceof wtclient_pb.PolicyRequest)) {
    throw new Error('Expected argument of type wtclientrpc.PolicyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_PolicyRequest(buffer_arg) {
  return wtclient_pb.PolicyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_PolicyResponse(arg) {
  if (!(arg instanceof wtclient_pb.PolicyResponse)) {
    throw new Error('Expected argument of type wtclientrpc.PolicyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_PolicyResponse(buffer_arg) {
  return wtclient_pb.PolicyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_RemoveTowerRequest(arg) {
  if (!(arg instanceof wtclient_pb.RemoveTowerRequest)) {
    throw new Error('Expected argument of type wtclientrpc.RemoveTowerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_RemoveTowerRequest(buffer_arg) {
  return wtclient_pb.RemoveTowerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_RemoveTowerResponse(arg) {
  if (!(arg instanceof wtclient_pb.RemoveTowerResponse)) {
    throw new Error('Expected argument of type wtclientrpc.RemoveTowerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_RemoveTowerResponse(buffer_arg) {
  return wtclient_pb.RemoveTowerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_StatsRequest(arg) {
  if (!(arg instanceof wtclient_pb.StatsRequest)) {
    throw new Error('Expected argument of type wtclientrpc.StatsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_StatsRequest(buffer_arg) {
  return wtclient_pb.StatsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_StatsResponse(arg) {
  if (!(arg instanceof wtclient_pb.StatsResponse)) {
    throw new Error('Expected argument of type wtclientrpc.StatsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_StatsResponse(buffer_arg) {
  return wtclient_pb.StatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wtclientrpc_Tower(arg) {
  if (!(arg instanceof wtclient_pb.Tower)) {
    throw new Error('Expected argument of type wtclientrpc.Tower');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wtclientrpc_Tower(buffer_arg) {
  return wtclient_pb.Tower.deserializeBinary(new Uint8Array(buffer_arg));
}


var WatchtowerClientService = exports['wtclientrpc.WatchtowerClient'] = {
  //
// AddTower adds a new watchtower reachable at the given address and
// considers it for new sessions. If the watchtower already exists, then
// any new addresses included will be considered when dialing it for
// session negotiations and backups.
addTower: {
    path: '/wtclientrpc.WatchtowerClient/AddTower',
    requestStream: false,
    responseStream: false,
    requestType: wtclient_pb.AddTowerRequest,
    responseType: wtclient_pb.AddTowerResponse,
    requestSerialize: serialize_wtclientrpc_AddTowerRequest,
    requestDeserialize: deserialize_wtclientrpc_AddTowerRequest,
    responseSerialize: serialize_wtclientrpc_AddTowerResponse,
    responseDeserialize: deserialize_wtclientrpc_AddTowerResponse,
  },
  //
// RemoveTower removes a watchtower from being considered for future session
// negotiations and from being used for any subsequent backups until it's added
// again. If an address is provided, then this RPC only serves as a way of
// removing the address from the watchtower instead.
removeTower: {
    path: '/wtclientrpc.WatchtowerClient/RemoveTower',
    requestStream: false,
    responseStream: false,
    requestType: wtclient_pb.RemoveTowerRequest,
    responseType: wtclient_pb.RemoveTowerResponse,
    requestSerialize: serialize_wtclientrpc_RemoveTowerRequest,
    requestDeserialize: deserialize_wtclientrpc_RemoveTowerRequest,
    responseSerialize: serialize_wtclientrpc_RemoveTowerResponse,
    responseDeserialize: deserialize_wtclientrpc_RemoveTowerResponse,
  },
  // ListTowers returns the list of watchtowers registered with the client.
listTowers: {
    path: '/wtclientrpc.WatchtowerClient/ListTowers',
    requestStream: false,
    responseStream: false,
    requestType: wtclient_pb.ListTowersRequest,
    responseType: wtclient_pb.ListTowersResponse,
    requestSerialize: serialize_wtclientrpc_ListTowersRequest,
    requestDeserialize: deserialize_wtclientrpc_ListTowersRequest,
    responseSerialize: serialize_wtclientrpc_ListTowersResponse,
    responseDeserialize: deserialize_wtclientrpc_ListTowersResponse,
  },
  // GetTowerInfo retrieves information for a registered watchtower.
getTowerInfo: {
    path: '/wtclientrpc.WatchtowerClient/GetTowerInfo',
    requestStream: false,
    responseStream: false,
    requestType: wtclient_pb.GetTowerInfoRequest,
    responseType: wtclient_pb.Tower,
    requestSerialize: serialize_wtclientrpc_GetTowerInfoRequest,
    requestDeserialize: deserialize_wtclientrpc_GetTowerInfoRequest,
    responseSerialize: serialize_wtclientrpc_Tower,
    responseDeserialize: deserialize_wtclientrpc_Tower,
  },
  // Stats returns the in-memory statistics of the client since startup.
stats: {
    path: '/wtclientrpc.WatchtowerClient/Stats',
    requestStream: false,
    responseStream: false,
    requestType: wtclient_pb.StatsRequest,
    responseType: wtclient_pb.StatsResponse,
    requestSerialize: serialize_wtclientrpc_StatsRequest,
    requestDeserialize: deserialize_wtclientrpc_StatsRequest,
    responseSerialize: serialize_wtclientrpc_StatsResponse,
    responseDeserialize: deserialize_wtclientrpc_StatsResponse,
  },
  // Policy returns the active watchtower client policy configuration.
policy: {
    path: '/wtclientrpc.WatchtowerClient/Policy',
    requestStream: false,
    responseStream: false,
    requestType: wtclient_pb.PolicyRequest,
    responseType: wtclient_pb.PolicyResponse,
    requestSerialize: serialize_wtclientrpc_PolicyRequest,
    requestDeserialize: deserialize_wtclientrpc_PolicyRequest,
    responseSerialize: serialize_wtclientrpc_PolicyResponse,
    responseDeserialize: deserialize_wtclientrpc_PolicyResponse,
  },
};

