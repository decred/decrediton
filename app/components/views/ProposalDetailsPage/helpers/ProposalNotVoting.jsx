import { FormattedMessage as T } from "react-intl";
import { NotVotingMsg } from "./";

const ProposalNotVoting = () => (
  <NotVotingMsg>
    <T
      id="proposalDetails.votingInfo.notVoting"
      m="Proposal not yet on voting stage"
    />
  </NotVotingMsg>
);

export default ProposalNotVoting;
