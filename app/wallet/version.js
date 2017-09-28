import Promise from "promise";
import { getVersionService as getService } from "../middleware/grpc/client";
const messages = require("../middleware/walletrpc/api_pb");

export const getVersionService = (address, port) =>
  new Promise((resolve, reject) =>
    getService(address, port, (versionService, error) =>
      error ? reject(error) : resolve(versionService)));

export const getVersionResponse = (versionService) =>
  new Promise((resolve, reject) =>
    versionService.version(
      new messages.VersionRequest(),
      (error, response) => error ? reject(error) : resolve(response)
    )
  );
