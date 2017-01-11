process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import { getCert } from './client';
import grpc from 'grpc';
var services = require('../walletrpc/api_grpc_pb.js');

export function loader(request, cb) {
  var cert = getCert();
  var creds = grpc.credentials.createSsl(cert);
  var loader = new services.WalletLoaderServiceClient(request.address + ':' + request.port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 2;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(loader, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(loader);
    }
  });
}

export function walletExists(loader, request, cb) {
  loader.walletExists(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      return cb(response);
    }
  });
}

export function createWallet(loader, request, cb) {
  loader.createWallet(request, function(err) {
    if (err) {
      console.error(err);
      return cb(err);
    } else {
      return cb();
    }
  });
}

export function openWallet(loader, request, cb) {
  loader.openWallet(request, function(err) {
    if (err) {
      if (err.message.includes('wallet already loaded')) {
        return cb();
      } else {
        console.error(err.message);
        return cb(err);
      }
    } else {
      return cb();
    }
  });
}

export function closeWallet(loader,request, cb) {
  loader.closeWallet(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      return cb(response, null);
    }
  });
}

export function startConsensusRpc(loader, request, cb) {
  loader.startConsensusRpc(request, function(err) {
    if (err) {
      if (err.message.includes('RPC client already created')) {
        return cb();
      } else {
        console.error(err);
        return cb(err);
      }
    } else {
      return cb();
    }
  });
}

export function discoverAddresses(loader, request, cb) {
  loader.discoverAddresses(request, function(err) {
    if (err) {
      console.error(err);
      return cb(err);
    } else {
      return cb();
    }
  });
}

export function subscribeBlockNtfns(loader, request, cb) {
  loader.subscribeToBlockNotifications(request, function(err) {
    if (err) {
      console.error(err);
      return cb(err);
    } else {
      return cb();
    }
  });
}

export function fetchHeaders(loader, request, cb) {
  loader.fetchHeaders(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      return cb(response);
    }
  });
}
