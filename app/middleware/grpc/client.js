process.env["GRPC_SSL_CIPHER_SUITES"] = "HIGH+ECDSA";

import grpc from "grpc";

import { getCert } from "../../config.js";
var services = require("../walletrpc/api_grpc_pb.js");

const getServiceClient = (clientClass) => (address, port, cb) => {
  var cert = getCert();
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

export function transactionNtfs(client, request, cb) {
    // Register Notification Streams from Wallet
  var transactionNtfns = client.transactionNotifications(request);
  transactionNtfns.on("data", function(response) {
    return cb(response);
  });
  transactionNtfns.on("end", function() {
    console.log("Transaction notifications done");
        // The server has finished sending
  });
  transactionNtfns.on("status", function(status) {
    console.log("Transaction notifications status:", status);
  });
}
export function spentnessNtfs(client, request, cb) {
  var spentnessNtfns = client.spentnessNotifications(request);
  spentnessNtfns.on("data", function(response) {
    return cb(response);
  });
  spentnessNtfns.on("end", function() {
    console.log("Spentness notifications done");
        // The server has finished sending
  });
  spentnessNtfns.on("status", function(status) {
    console.log("Spentness notifications status:", status);
  });
}

export function accountNtfs(client, request, cb) {
  var accountNtfns = client.accountNotifications(request);
  accountNtfns.on("data", function(response) {
    return cb(response);
  });
  accountNtfns.on("end", function() {
    console.log("Account notifications done");
        // The server has finished sending
  });
  accountNtfns.on("status", function(status) {
    console.log("Account notifications status:", status);
  });
}
