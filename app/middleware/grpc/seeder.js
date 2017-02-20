process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import { getCert } from '../../config.js';
import grpc from 'grpc';
var services = require('../walletrpc/api_grpc_pb.js');
export function seeder(request, cb) {
  var cert = getCert();
  var creds = grpc.credentials.createSsl(cert);
  var seeder = new services.SeedServiceClient(request.address + ':' + request.port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 2;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(seeder, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(seeder);
    }
  });
}

/*
bject {seed_bytes: Buffer[32], seed_hex: "59b335d2a7cd7d0a133106d1f779c987e65c842d6b5664925cc1a4b779a8442c", seed_mnemonic: "endow pocketful chopper sensation repay sandalwood…ssor jawbone paramount crumpled Chicago snowslide"}
seed_bytes
:
Buffer[32]
seed_hex
:
"59b335d2a7cd7d0a133106d1f779c987e65c842d6b5664925cc1a4b779a8442c"
seed_mnemonic
:
"endow pocketful chopper sensation repay sandalwood klaxon Apollo Aztec company afflict scavenger virus inertia spearhead liberty tracker fascinate mural clergyman glitter escapade flytrap misnomer escape recover regain processor jawbone paramount crumpled Chicago snowslide"
*/
