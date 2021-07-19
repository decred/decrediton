import {
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_VOTING_REJECTED,
  PROPOSAL_VOTING_INELIGIBLE
} from "constants";

export const mapTabsToStatus = {
  underReview: ["activeVote", "authorizedVote", "unauthorizedVote"],
  finishedVote: ["approvedVote", "rejectedVote"],
  abandonedVote: ["abandonedVote"]
};

export const mapStatusLabelToValue = {
  activeVote: PROPOSAL_VOTING_ACTIVE,
  abandonedVote: PROPOSAL_VOTING_INELIGIBLE,
  approvedVote: PROPOSAL_VOTING_APPROVED,
  rejectedVote: PROPOSAL_VOTING_REJECTED,
  unauthorizedVote: PROPOSAL_VOTING_NOT_AUTHORIZED,
  authorizedVote: PROPOSAL_VOTING_AUTHORIZED
};
