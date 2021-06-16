import * as api from "../middleware/politeiaapi";
import { withLogNoData } from "./index";
export {
  setPoliteiaPath,
  getEligibleTickets,
  saveEligibleTickets,
  savePiVote,
  getProposalWalletVote,
  removeCachedProposals
} from "main_dev/paths";

const promisifyReqLogNoData = (fnName, Req) => {
  return withLogNoData(
    (...args) =>
      new Promise((ok, fail) =>
        Req(...args, (res, err) => (err ? fail(err) : ok(res)))
      ),
    fnName
  );
};

export const getProposalDetails = promisifyReqLogNoData(
  "getProposalDetails",
  api.getProposalDetails
);

export const getProposalVotes = promisifyReqLogNoData(
  "getProposalVotes",
  api.getProposalVotes
);

export const getVotesInventory = promisifyReqLogNoData(
  "getVotesInventory",
  api.getVotesInventory
);

export const castBallot = promisifyReqLogNoData("castBallot", api.castBallot);

export const getProposalsBatch = promisifyReqLogNoData(
  "getProposalsBatch",
  api.getProposalsBatch
);

export const getProposalsVoteSummaryBatch = promisifyReqLogNoData(
  "getProposalsVoteSummaryBatch",
  api.getProposalsVoteSummaryBatch
);
