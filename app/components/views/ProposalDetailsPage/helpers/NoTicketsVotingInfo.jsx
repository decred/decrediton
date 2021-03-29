import { FormattedMessage as T } from "react-intl";
import { VoteButton, NoTicketsMsg } from "./";

const NoTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <NoTicketsMsg>
      <T
        id="proposalDetails.votingInfo.noTickets"
        m="Voting is only available upon participation in Staking."
      />
    </NoTicketsMsg>
    <VoteButton onClick={showPurchaseTicketsPage}>
      <T id="proposalDetails.votingInfo.startStakingBtn" m="Start Staking" />
    </VoteButton>
  </>
);

export default NoTicketsVotingInfo;
