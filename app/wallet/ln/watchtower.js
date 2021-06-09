import { wtclientrpc as wpb } from "middleware/ln/wtclient_pb";
import { hexToBytes } from "helpers/byteActions.js";
import { getClient } from "middleware/grpc/clientTracking";

export const addTower = (wtClient, wtPubKey, addr) => {
  const request = new wpb.AddTowerRequest();
  request.setPubkey(hexToBytes(wtPubKey));
  request.setAddress(addr);
  return new Promise((resolve, reject) =>
    getClient(wtClient).addTower(request, (err, resp) =>
      err ? reject(err) : resolve(resp.toObject())
    )
  );
};

export const listWatchtowers = (wtClient) => {
  const request = new wpb.ListTowersRequest();
  return new Promise((resolve, reject) =>
    getClient(wtClient).listTowers(request, (err, resp) => {
      if (err) {
        reject(err);
        return;
      }
      const towers = resp.getTowersList().map((towerData) => {
        const tower = towerData.toObject();
        const pubkeyHex = Buffer.from(tower.pubkey, "base64").toString("hex");

        return {
          ...tower,
          pubkeyHex
        };
      });
      return resolve(towers);
    })
  );
};

export const removeTower = (wtClient, wtPubKey) => {
  const request = new wpb.RemoveTowerRequest();
  request.setPubkey(hexToBytes(wtPubKey));
  return new Promise((resolve, reject) =>
    getClient(wtClient).removeTower(request, (err, resp) =>
      err ? reject(err) : resolve(resp.toObject())
    )
  );
};
