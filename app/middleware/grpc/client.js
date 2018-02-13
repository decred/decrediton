process.env["GRPC_SSL_CIPHER_SUITES"] = "HIGH+ECDSA";

import grpc from "grpc";

import { getWalletCert, getWalletPath } from "config.js";
var services = require("../walletrpc/api_grpc_pb.js");

const getServiceClient = (clientClass) => (isTestNet, walletPath, address, port, cb) => {
  var cert = getWalletCert(getWalletPath(isTestNet, walletPath));
  if (cert == "") {
    return cb(null, "Unable to load dcrwallet certificate.  dcrwallet not running?");
  }
  var creds = grpc.credentials.createSsl(cert);
  var client = new clientClass(address + ":" + port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 30;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(client, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(client);
    }
  });
};

export const getWalletService = getServiceClient(services.WalletServiceClient);
export const getTicketBuyerService = getServiceClient(services.TicketBuyerServiceClient);
export const loader = getServiceClient(services.WalletLoaderServiceClient);
export const seeder = getServiceClient(services.SeedServiceClient);
export const getVersionService = getServiceClient(services.VersionServiceClient);
export const getVotingService = getServiceClient(services.VotingServiceClient);
export const getAgendaService = getServiceClient(services.AgendaServiceClient);
export const getMessageVerificationService = getServiceClient(services.MessageVerificationServiceClient);
export const getDecodeMessageService = getServiceClient(services.DecodeMessageServiceClient);
