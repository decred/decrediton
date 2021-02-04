process.env["GRPC_SSL_CIPHER_SUITES"] = "HIGH+ECDSA";

const grpc = require("@grpc/grpc-js");

import { getWalletCert } from "config.js";
import { getWalletPath } from "main_dev/paths.js";

const proto = require("../walletrpc/api_grpc_pb.js");
const services = grpc.loadPackageDefinition(proto).walletrpc;

const getServiceClient = (clientClass) => (
  isTestNet,
  walletPath,
  address,
  port,
  grpcKey,
  grpcCert,
  cb
) => {
  const cert = getWalletCert(getWalletPath(isTestNet, walletPath));
  if (cert == "") {
    return cb(
      null,
      "Unable to load dcrwallet certificate.  dcrwallet not running?"
    );
  }

  try {
    // dcrwallet sends the key and cert on the same payload after starting.
    // So we can use the same value for both of them.
    const creds = grpc.credentials.createSsl(
      cert,
      Buffer.from(grpcKey),
      Buffer.from(grpcCert)
    );
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

export const getWalletService = getServiceClient(
  services.WalletService
);
export const getTicketBuyerV2Service = getServiceClient(
  services.TicketBuyerV2Service
);
export const loader = getServiceClient(
  services.WalletLoaderService
);
export const getSeedService = getServiceClient(
  services.SeedService
);
export const getVersionService = getServiceClient(
  services.VersionService
);
export const getVotingService = getServiceClient(
  services.VotingService
);
export const getAgendaService = getServiceClient(
  services.AgendaService
);
export const getMessageVerificationService = getServiceClient(
  services.MessageVerificationService
);
export const getAccountMixerService = getServiceClient(
  services.AccountMixerService
);
