import { proposals } from "connectors";

const ProposalDetails = ({ viewedProposalDetails }) => (
  <div>
    vieweing proposal { viewedProposalDetails ? viewedProposalDetails.name : "null" }
  </div>
);

export default proposals(ProposalDetails);
