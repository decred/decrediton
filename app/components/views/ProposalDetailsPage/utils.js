import {
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_REJECTED,
  PROPOSAL_VOTING_APPROVED
} from "constants";

// politeiaMarkdownIndexMd returns markdown text from the payload of a politeia
// proposal file that corresponds to its index.md). This was extracted from the
// helpers.js file of politeia. Assumes the payload has been converted from
// base64 into bytes.
export const politeiaMarkdownIndexMd = (payload) => {
  const text = decodeURIComponent(escape(payload));
  return text.substring(text.indexOf("\n") + 1);
};

/**
 * Converts the vote counts {"yes": x, "no": y} obj into an array of data
 * that can be used to render the StatusBar
 * @param {Array} voteCounts
 * @returns {Array} status bar data [{label, color, amount}, ..]
 */
export const getStatusBarData = (voteCounts) =>
  voteCounts &&
  Object.entries(voteCounts)
    .map(([voteOption, votesReceived]) => ({
      label: voteOption,
      amount: votesReceived,
      color: voteOption === "yes" ? "#41BE53" : "#ED6D47"
    }))
    .sort((a) => (a.label === "yes" ? -1 : 1));

/**
 * Returns true if the given proposal is public
 * @param {Object} proposal
 * @returns {Boolean} isPublic
 */
const isPublicProposal = ({ status }) => status === PROPOSAL_STATUS_PUBLIC;

/**
 * Returns true if the given proposal is abandoned
 * @param {Object} proposal
 * @returns {Boolean} isAbandoned
 */
const isAbandonedProposal = ({ status }) =>
  status === PROPOSAL_STATUS_ABANDONED;

export const getProposalStatusTagProps = (
  proposal,
  voteStatus,
  isDarkTheme
) => {
  const isRfpSubmission = !!proposal.linkto;
  if (isPublicProposal(proposal) && !!voteStatus) {
    switch (voteStatus) {
      case PROPOSAL_VOTING_NOT_AUTHORIZED:
        return {
          type: isDarkTheme ? "blueTime" : "blackTime",
          text: isRfpSubmission
            ? "Waiting for runoff vote to start"
            : "Waiting for author to authorize voting"
        };
      case PROPOSAL_VOTING_AUTHORIZED:
        return {
          type: "yellowTime",
          text: "Waiting for admin to start voting"
        };
      case PROPOSAL_VOTING_ACTIVE:
        return { type: "bluePending", text: "Active" };
      case PROPOSAL_VOTING_FINISHED:
        return {
          type: isDarkTheme ? "blueNegative" : "grayNegative",
          text: "Finished"
        };
      case PROPOSAL_VOTING_REJECTED:
        return {
          type: "orangeNegativeCircled",
          text: "Rejected"
        };
      case PROPOSAL_VOTING_APPROVED:
        return { type: "greenCheck", text: "Approved" };
      default:
        break;
    }
  }

  if (isAbandonedProposal(proposal)) {
    return {
      type: isDarkTheme ? "blueNegative" : "grayNegative",
      text: "Abandoned"
    };
  }

  return { type: "grayNegative", text: "missing" };
};
