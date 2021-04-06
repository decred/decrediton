import { NotVotingMsg } from "./";
import { FormattedMessage as T } from "react-intl";

const ProposalAbandoned = () => (
  <NotVotingMsg>
    <T
      id="proposalDetails.votingInfo.abandoned"
      m="Proposal has been abandoned"
    />
  </NotVotingMsg>
);

export default ProposalAbandoned;
