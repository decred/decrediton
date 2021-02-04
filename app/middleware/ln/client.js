process.env["GRPC_SSL_CIPHER_SUITES"] = "HIGH+ECDSA";

const grpc = require("@grpc/grpc-js");
import fs from "fs";


const proto = require("./rpc_grpc_pb.js");
const services = grpc.loadPackageDefinition(proto).lnrpc;

const wuProto =  require("./walletunlocker_grpc_pb.js");
const wuServices = grpc.loadPackageDefinition(wuProto).lnrpc;

const wtProto =  require("./wtclient_grpc_pb.js");
const wtServices = grpc.loadPackageDefinition(wtProto).wtclientrpc;

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

  const deadlineInSeconds = 30;
  const deadline = new Date().getTime() + deadlineInSeconds*1000;
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

export const getLightningClient = getServiceClient(
  services.Lightning
);
export const getWatchtowerClient = getServiceClient(
  wtServices.WatchtowerClient
);
export const getWalletUnlockerClient = getServiceClient(
  wuServices.WalletUnlocker
);
