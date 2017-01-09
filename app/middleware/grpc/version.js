import { getCert, getApi } from './client';
import grpc from 'grpc';
var messages = require('../walletrpc/api_pb');
var services = require('../walletrpc/api_grpc_pb.js');
export function getVersionService(address, port, cb) {
  var cert = getCert();
  if (cert == '') {
    return cb(null, 'Unable to load dcrwallet certificate.  dcrwallet not running?');
  }
  var creds = grpc.credentials.createSsl(cert);
  var version = new services.VersionServiceClient(address + ':' + port, creds);

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
      console.log(response);
      return cb(response);
    }
  });
}
