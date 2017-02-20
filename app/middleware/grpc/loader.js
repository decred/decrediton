process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import { getCert } from '../../config.js';
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