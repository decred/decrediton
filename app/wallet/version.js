import Promise from "promise";
import { getVersionService as getService } from "../middleware/grpc/client";
import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { withLog as log, withLogNoData } from "./index";

export const getVersionService = withLogNoData(
  (network, walletPath, address, port, grpckey, grpccert) =>
    new Promise((resolve, reject) =>
      getService(
        network,
        walletPath,
        address,
        port,
        grpckey,
        grpccert,
        (versionService, error) =>
          error ? reject(error) : resolve(versionService)
      )
    ),
  "Get Version Service"
);

export const getVersionResponse = log((versionService) => {
  return new Promise((resolve, reject) =>
    versionService.version(new api.VersionRequest(), (error, response) =>
      error ? reject(error) : resolve(response)
    )
  );
}, "Get Version Response");
