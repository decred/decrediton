import Promise from "promise";
import * as api from "../middleware/politeiaapi";
import { withLogNoData } from "./index";

const promisifyReqLogNoData = (fnName, Req) => {
  return withLogNoData(
    (...args) =>
      new Promise((ok, fail) =>
        Req(...args, (res, err) => (err ? fail(err) : ok(res)))
      ),
    fnName
  );
};

export const getActiveVotes = promisifyReqLogNoData(
  "getActiveVotes",
  api.getActiveVotes
);
export const getVetted = promisifyReqLogNoData(
  "getVetted",
  api.getVetted
);
export const getVotesStatus = promisifyReqLogNoData(
  "getVotesStatus",
  api.getVotesStatus
);
export const getProposal = promisifyReqLogNoData(
  "getProposal",
  api.getProposal
);
export const getProposalVotes = promisifyReqLogNoData(
  "getProposalVotes",
  api.getProposalVotes
);
export const getProposalVoteStatus = promisifyReqLogNoData(
  "getProposalVoteStatus",
  api.getProposalVoteStatus
);
export const getTokenInventory = promisifyReqLogNoData(
  "getTokenInventory",
  api.getTokenInventory
);
export const castVotes = promisifyReqLogNoData(
  "castVotes",
  api.castVotes
);
export const getProposalsBatch = promisifyReqLogNoData(
  "getProposalsBatch",
  api.getProposalsBatch
);
export const getProposalsVoteStatusBatch = promisifyReqLogNoData(
  "getProposalsVoteStatusBatch",
  api.getProposalsVoteStatusBatch
);
