import Promise from "promise";
import { SignMessageRequest, VerifyMessageRequest }  from "middleware/walletrpc/api_pb";
import { withLogNoData as log } from "./app";

export const signMessage = log((walletService, address, message, passphrase) => {
  const request = new SignMessageRequest();
  request.setAddress(address);
  request.setMessage(message);
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  return new Promise((resolve, reject) => walletService.signMessage(
    request, (error, response) => error ? reject(error) : resolve(response)
  ));
}, "Sign Message");

export const verifyMessage = log((verificationService, address, message, signature) => {
  const request = new VerifyMessageRequest();
  request.setAddress(address);
  request.setMessage(message);
  request.setSignature(signature);
  return new Promise((resolve, reject) => verificationService
    .verifyMessage(request, (error, response) => error ? reject(error) : resolve(response)));
}, "Verify Message");
