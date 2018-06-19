import { GenerateRandomSeedRequest, DecodeSeedRequest } from "../middleware/walletrpc/api_pb";
import { withLogNoData as log } from "./index";

export const SEED_WORDS = require("../helpers/wordlist.js");
SEED_WORDS.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export const SEED_LENGTH = {
  WORDS: 33,
  HEX_MAX: 128,
  HEX_MIN: 32,
};

export const generateSeed = log((seederService) => new Promise((resolve, reject) => {
  const request = new GenerateRandomSeedRequest();
  seederService.generateRandomSeed(request, (err, response) => err ? reject(err) : resolve(response));
}), "Generate Seed");

export const decodeSeed = log((seederService, mnemonic) => new Promise((resolve, reject) => {
  const request = new DecodeSeedRequest();
  request.setUserInput(mnemonic);
  seederService.decodeSeed(request, (err, response) => err ? reject(err) : resolve(response));
}), "Decode Seed");
