import { getCert } from './client';
import grpc from 'grpc';

export function getVersionService(address, port, cb) {
  var protoDescriptor = grpc.load('./app/api.proto');
  var walletrpc = protoDescriptor.walletrpc;

  var cert = getCert();
  var creds = grpc.credentials.createSsl(cert);
  var version = new walletrpc.VersionService(address + ':' + port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 2;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(version, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(version);
    }
  });
}

export function getWalletRPCVersion(versionService, request, cb) {
  if (versionService === null) {
    return cb(null, new Error('versionService not available to getCurrentVersion'));
  }

  versionService.version(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      return cb(response);
    }
  });
}