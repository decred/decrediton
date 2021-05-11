import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { withLogNoData as log } from "./index";

const { GenerateRandomSeedRequest, DecodeSeedRequest } = api;

export const generateSeed = log(
  (seederService) =>
    new Promise((resolve, reject) => {
      const request = new GenerateRandomSeedRequest();
      seederService.generateRandomSeed(request, (err, response) =>
        err ? reject(err) : resolve(response)
      );
    }),
  "Generate Seed"
);

export const decodeSeed = log(
  (seederService, mnemonic) =>
    new Promise((resolve, reject) => {
      const request = new DecodeSeedRequest();
      request.setUserInput(mnemonic);
      seederService.decodeSeed(request, (err, response) =>
        err ? reject(err) : resolve(response)
      );
    }),
  "Decode Seed"
);
