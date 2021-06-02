import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { withLogNoData as log } from "./index";
import { mappedRequest } from "middleware/grpc/clientTracking";
import { rawToHex } from "../helpers/byteActions";

const { GenerateRandomSeedRequest, DecodeSeedRequest } = api;

export const generateSeed = log(
  (seederService) =>
    mappedRequest(
      seederService,
      "generateRandomSeed",
      new GenerateRandomSeedRequest(),
      (res) => ({
        seedBytes: rawToHex(res.getSeedBytes()),
        seedHex: res.getSeedHex(),
        seedMnemonic: res.getSeedMnemonic()
      })
    ),
  "Generate Seed"
);

export const decodeSeed = log((seederService, mnemonic) => {
  const request = new DecodeSeedRequest();
  request.setUserInput(mnemonic);
  return mappedRequest(seederService, "decodeSeed", request, (res) => ({
    decodedSeed: rawToHex(res.getDecodedSeed())
  }));
}, "Decode Seed");
