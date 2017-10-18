import Promise from "promise";
import { stakePoolInfo } from "middleware/stakepoolapi";

export const getStakePoolInfo = () =>
  new Promise((resolve, reject) =>
    stakePoolInfo((response, error) => !response ? reject(error) : resolve(response)));
