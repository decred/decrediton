import { getVersionService as getService } from "../middleware/grpc/client";
import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { withLog as log, withLogNoData } from "./index";
import { trackClient, getClient } from "middleware/grpc/clientTracking";

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
          error ? reject(error) : resolve(trackClient(versionService))
      )
    ),
  "Get Version Service"
);

export const getVersionResponse = log((versionService) => {
  return new Promise((resolve, reject) =>
    getClient(versionService).version(
      new api.VersionRequest(),
      (error, response) =>
        error ? reject(error) : resolve(response.toObject())
    )
  );
}, "Get Version Response");
