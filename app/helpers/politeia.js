import {
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_INDEX_MD_FILE,
  PROPOSAL_METADATA_FILE,
  PROPOSAL_VOTE_METADATA_FILE
} from "constants";

export const atou = (str) => decodeURIComponent(escape(window.atob(str)));

// parseProposalStatuses iterate over proposal's status changes array returned
// from BE and returns proposal's timestamps accordingly
export const parseProposalStatuses = (sChanges) => {
  let publishedat = 0,
    abandonedat = 0;

  sChanges.forEach(({ status, timestamp }) => {
    if (status === PROPOSAL_STATUS_PUBLIC) {
      publishedat = timestamp;
    }
    if (status === PROPOSAL_STATUS_ABANDONED) {
      abandonedat = timestamp;
    }
  });
  return { publishedat, abandonedat };
};

// parseProposalMetadata accepts a proposal object parses it's metadata
// and returns it as object of the form { name }
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
export const parseProposalMetadata = (proposal = {}) => {
  const metadata =
    proposal.files &&
    proposal.files.find((f) => f.name === PROPOSAL_METADATA_FILE);
  return metadata ? JSON.parse(atob(metadata.payload)) : {};
};

// parseVoteMetadata accepts a proposal object parses it's metadata
// and returns it as object of the form { linkto, linkby }
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
export const parseVoteMetadata = (proposal = {}) => {
  const metadata =
    proposal.files &&
    proposal.files.find((f) => f.name === PROPOSAL_VOTE_METADATA_FILE);
  return metadata ? JSON.parse(atob(metadata.payload)) : {};
};

// This function extracts the content of index.md's payload which includes the
// propsoal description.
export const getTextFromIndexMd = (file = {}) => {
  if (!file.payload) return "";
  return atou(file.payload);
};

// parseProposalIndexFile accepts a proposal object parses it's metadata
// and returns it as object of the form { description }
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
export const parseProposalIndexFile = (proposal = {}) => {
  const index =
    proposal.files &&
    proposal.files.find((f) => f.name === PROPOSAL_INDEX_MD_FILE);
  return index ? { description: getTextFromIndexMd(index) } : {};
};

// parseRawProposal accepts raw proposal object received from BE and parses
// it's metadata & status changes.
export const parseRawProposal = (proposal) => {
  // Parse statuses.
  const { publishedat, abandonedat } = parseProposalStatuses(
    proposal.statuses || []
  );
  // Parse metdata.
  // Censored proposal's metadata isn't available.
  const { name } = parseProposalMetadata(proposal);
  const { linkby, linkto } = parseVoteMetadata(proposal);
  const { description } = parseProposalIndexFile(proposal);
  return {
    ...proposal,
    description: description || proposal.description,
    name: name || proposal.name,
    linkby,
    linkto,
    publishedat,
    abandonedat
  };
};
