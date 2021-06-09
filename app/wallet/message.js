import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { withLogNoData as log } from "./app";
import { rawToHex } from "helpers/byteActions";
import { getClient } from "middleware/grpc/clientTracking";

const { SignMessageRequest, SignMessagesRequest, VerifyMessageRequest } = api;

export const signMessage = log((walletService, address, message) => {
  const request = new SignMessageRequest();
  request.setAddress(address);
  request.setMessage(message);
  return new Promise((resolve, reject) =>
    getClient(walletService).signMessage(request, (error, response) => {
      if (error) return reject(error);
      const res = {
        signature: rawToHex(response.getSignature())
      };
      resolve(res);
    })
  );
}, "Sign Message");

export const signMessages = log((walletService, messages) => {
  const reqMessages = messages.map((m) => {
    const rm = new SignMessagesRequest.Message();
    rm.setAddress(m.address);
    rm.setMessage(m.message);
    return rm;
  });

  const request = new SignMessagesRequest();
  request.setMessagesList(reqMessages);
  return new Promise((resolve, reject) =>
    getClient(walletService).signMessages(request, (error, response) => {
      if (error) return reject(error);
      const res = {
        replies: response.getRepliesList().map((v) => ({
          signature: rawToHex(v.getSignature()),
          error: v.getError()
        }))
      };
      resolve(res);
    })
  );
}, "Sign Messages");

export const verifyMessage = log(
  (verificationService, address, message, signature) => {
    const request = new VerifyMessageRequest();
    request.setAddress(address);
    request.setMessage(message);
    request.setSignature(signature);
    return new Promise((resolve, reject) =>
      getClient(verificationService).verifyMessage(request, (error, response) =>
        error ? reject(error) : resolve(response.toObject())
      )
    );
  },
  "Verify Message"
);
