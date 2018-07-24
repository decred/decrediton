import Promise from "promise";
import { SignMessageRequest, SignMessagesRequest, VerifyMessageRequest }  from "middleware/walletrpc/api_pb";
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

export const signMessages = log((walletService, passphrase, messages) => {
  const reqMessages = messages.map(m => {
    const rm = new SignMessagesRequest.Message();
    rm.setAddress(m.address);
    rm.setMessage(m.message);
    return rm;
  });

  const request = new SignMessagesRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setMessagesList(reqMessages);
  return new Promise((resolve, reject) => walletService.signMessages(
    request, (error, response) => error ? reject(error) : resolve(response)
  ));
}, "Sign Messages");

export const verifyMessage = log((verificationService, address, message, signature) => {
  const request = new VerifyMessageRequest();
  request.setAddress(address);
  request.setMessage(message);
  request.setSignature(signature);
  return new Promise((resolve, reject) => verificationService
    .verifyMessage(request, (error, response) => error ? reject(error) : resolve(response)));
}, "Verify Message");
