process.env["GRPC_SSL_CIPHER_SUITES"] = "HIGH+ECDSA";

import grpc from "grpc";
import fs from "fs";

const services = require("./rpc_grpc_pb.js");

const getServiceClient = (clientClass) => async (
  address,
  port,
  certPath,
  macaroonPath
) => {
  let macaroon, macaroonCreds;

  const readFile = (fname) =>
    new Promise((resolve, reject) => {
      let tries = 0;
      const maxTries = 30;
      const wait = 1000;

      const readIfExists = () => {
        try {
          const file = fs.readFileSync(fname);
          resolve(file);
        } catch (err) {
          tries++;
          if (tries < maxTries) {
            setTimeout(readIfExists, wait);
            return;
          }
          if (err.code === "ENOENT") {
            reject(new Error("file " + fname + " does not exist"));
          } else if (err.code === "EACCES") {
            reject(new Error("file " + fname + " cannot be opened"));
          } else {
            reject(new Error("error accessing file " + fname + ": " + err));
          }
        }
      };
      readIfExists();
    });

  const cert = await readFile(certPath);

  if (macaroonPath) {
    macaroon = await readFile(macaroonPath);
    macaroonCreds = grpc.credentials.createFromMetadataGenerator((args, cb) => {
      const metadata = new grpc.Metadata();
      metadata.add("macaroon", macaroon.toString("hex"));
      cb(null, metadata);
    });
  }

  const sslCreds = grpc.credentials.createSsl(cert);
  const creds = macaroonCreds
    ? grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds)
    : sslCreds;

  const client = new clientClass(address + ":" + port, creds);

  const deadline = new Date();
  const deadlineInSeconds = 30;
  deadline.setSeconds(deadline.getSeconds() + deadlineInSeconds);
  return await new Promise((resolve, reject) => {
    grpc.waitForClientReady(client, deadline, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
};

export const getLightningClient = getServiceClient(services.LightningClient);
export const getWalletUnlockerClient = getServiceClient(
  services.WalletUnlockerClient
);
