import { FormattedMessage as T } from "react-intl";
import { VoteButton, NoTicketsMsg } from "./";

const NoElligibleTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
  <>
    <NoTicketsMsg>
      <T
        id="proposalDetails.votingInfo.noElligibleTickets"
        m="You don't have tickets elligible for voting on this proposal. Purchase tickets to vote on future proposals."
      />
    </NoTicketsMsg>
    <VoteButton onClick={showPurchaseTicketsPage}>
      <T
        id="proposalDetails.votingInfo.purchaseTicketsBtn"
        m="Purchase Tickets"
      />
    </VoteButton>
  </>
);

export default NoElligibleTicketsVotingInfo;
