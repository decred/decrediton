process.env["GRPC_SSL_CIPHER_SUITES"] = "HIGH+ECDSA";

import grpc from "grpc";

import { getWalletCert } from "config.js";
import { getWalletPath } from "main_dev/paths.js";
const services = require("../walletrpc/api_grpc_pb.js");

const getServiceClient = (clientClass) => (
  network,
  walletPath,
  address,
  port,
  grpcKey,
  grpccert,
  cb
) => {
  const cert = getWalletCert(getWalletPath(network, walletPath));
  if (cert == "") {
    return cb(
      null,
      "Unable to load dcrwallet certificate.  dcrwallet not running?"
    );
  }

  try {
    // dcrwallet sends the key and cert on the same payload after starting.
    // So we can use the same value for both of them.
    const creds = grpc.credentials.createSsl(cert, grpcKey, grpccert);
    const client = new clientClass(address + ":" + port, creds);

    const deadline = new Date();
    const deadlineInSeconds = 30;
    deadline.setSeconds(deadline.getSeconds() + deadlineInSeconds);
    grpc.waitForClientReady(client, deadline, function (err) {
      if (err) {
        return cb(null, err);
      } else {
        return cb(client);
      }
    });
  } catch (err) {
    return cb(null, err);
  }
};

export const getWalletService = getServiceClient(services.WalletServiceClient);
export const getTicketBuyerV2Service = getServiceClient(
  services.TicketBuyerV2ServiceClient
);
export const loader = getServiceClient(services.WalletLoaderServiceClient);
export const getSeedService = getServiceClient(services.SeedServiceClient);
export const getVersionService = getServiceClient(
  services.VersionServiceClient
);
export const getVotingService = getServiceClient(services.VotingServiceClient);
export const getAgendaService = getServiceClient(services.AgendaServiceClient);
export const getMessageVerificationService = getServiceClient(
  services.MessageVerificationServiceClient
);
export const getAccountMixerService = getServiceClient(
  services.AccountMixerServiceClient
);
