// GENERATED CODE -- DO NOT EDIT!

'use strict';
var autopilot_pb = require('./autopilot_pb.js').autopilotrpc;

function serialize_autopilotrpc_ModifyStatusRequest(arg) {
  if (!(arg instanceof autopilot_pb.ModifyStatusRequest)) {
    throw new Error('Expected argument of type autopilotrpc.ModifyStatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_ModifyStatusRequest(buffer_arg) {
  return autopilot_pb.ModifyStatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_autopilotrpc_ModifyStatusResponse(arg) {
  if (!(arg instanceof autopilot_pb.ModifyStatusResponse)) {
    throw new Error('Expected argument of type autopilotrpc.ModifyStatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_ModifyStatusResponse(buffer_arg) {
  return autopilot_pb.ModifyStatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_autopilotrpc_QueryScoresRequest(arg) {
  if (!(arg instanceof autopilot_pb.QueryScoresRequest)) {
    throw new Error('Expected argument of type autopilotrpc.QueryScoresRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_QueryScoresRequest(buffer_arg) {
  return autopilot_pb.QueryScoresRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_autopilotrpc_QueryScoresResponse(arg) {
  if (!(arg instanceof autopilot_pb.QueryScoresResponse)) {
    throw new Error('Expected argument of type autopilotrpc.QueryScoresResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_QueryScoresResponse(buffer_arg) {
  return autopilot_pb.QueryScoresResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_autopilotrpc_SetScoresRequest(arg) {
  if (!(arg instanceof autopilot_pb.SetScoresRequest)) {
    throw new Error('Expected argument of type autopilotrpc.SetScoresRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_SetScoresRequest(buffer_arg) {
  return autopilot_pb.SetScoresRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_autopilotrpc_SetScoresResponse(arg) {
  if (!(arg instanceof autopilot_pb.SetScoresResponse)) {
    throw new Error('Expected argument of type autopilotrpc.SetScoresResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_SetScoresResponse(buffer_arg) {
  return autopilot_pb.SetScoresResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_autopilotrpc_StatusRequest(arg) {
  if (!(arg instanceof autopilot_pb.StatusRequest)) {
    throw new Error('Expected argument of type autopilotrpc.StatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_StatusRequest(buffer_arg) {
  return autopilot_pb.StatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_autopilotrpc_StatusResponse(arg) {
  if (!(arg instanceof autopilot_pb.StatusResponse)) {
    throw new Error('Expected argument of type autopilotrpc.StatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_autopilotrpc_StatusResponse(buffer_arg) {
  return autopilot_pb.StatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// Autopilot is a service that can be used to get information about the current
// state of the daemon's autopilot agent, and also supply it with information
// that can be used when deciding where to open channels.
var AutopilotService = exports['autopilotrpc.Autopilot'] = {
  //
// Status returns whether the daemon's autopilot agent is active.
status: {
    path: '/autopilotrpc.Autopilot/Status',
    requestStream: false,
    responseStream: false,
    requestType: autopilot_pb.StatusRequest,
    responseType: autopilot_pb.StatusResponse,
    requestSerialize: serialize_autopilotrpc_StatusRequest,
    requestDeserialize: deserialize_autopilotrpc_StatusRequest,
    responseSerialize: serialize_autopilotrpc_StatusResponse,
    responseDeserialize: deserialize_autopilotrpc_StatusResponse,
  },
  //
// ModifyStatus is used to modify the status of the autopilot agent, like
// enabling or disabling it.
modifyStatus: {
    path: '/autopilotrpc.Autopilot/ModifyStatus',
    requestStream: false,
    responseStream: false,
    requestType: autopilot_pb.ModifyStatusRequest,
    responseType: autopilot_pb.ModifyStatusResponse,
    requestSerialize: serialize_autopilotrpc_ModifyStatusRequest,
    requestDeserialize: deserialize_autopilotrpc_ModifyStatusRequest,
    responseSerialize: serialize_autopilotrpc_ModifyStatusResponse,
    responseDeserialize: deserialize_autopilotrpc_ModifyStatusResponse,
  },
  //
// QueryScores queries all available autopilot heuristics, in addition to any
// active combination of these heruristics, for the scores they would give to
// the given nodes.
queryScores: {
    path: '/autopilotrpc.Autopilot/QueryScores',
    requestStream: false,
    responseStream: false,
    requestType: autopilot_pb.QueryScoresRequest,
    responseType: autopilot_pb.QueryScoresResponse,
    requestSerialize: serialize_autopilotrpc_QueryScoresRequest,
    requestDeserialize: deserialize_autopilotrpc_QueryScoresRequest,
    responseSerialize: serialize_autopilotrpc_QueryScoresResponse,
    responseDeserialize: deserialize_autopilotrpc_QueryScoresResponse,
  },
  //
// SetScores attempts to set the scores used by the running autopilot agent,
// if the external scoring heuristic is enabled.
setScores: {
    path: '/autopilotrpc.Autopilot/SetScores',
    requestStream: false,
    responseStream: false,
    requestType: autopilot_pb.SetScoresRequest,
    responseType: autopilot_pb.SetScoresResponse,
    requestSerialize: serialize_autopilotrpc_SetScoresRequest,
    requestDeserialize: deserialize_autopilotrpc_SetScoresRequest,
    responseSerialize: serialize_autopilotrpc_SetScoresResponse,
    responseDeserialize: deserialize_autopilotrpc_SetScoresResponse,
  },
};

