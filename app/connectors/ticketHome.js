import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  sentAndReceivedTransactions: sel.sentAndReceivedTransactions,
  totalValueOfLiveTickets: sel.totalValueOfLiveTickets,
  earnedStakingReward: sel.totalSubsidy,
  liveTicketsCount: sel.liveTicketsCount,
  votedTicketsCount: sel.votedTicketsCount,
  ticketDataChart: sel.ticketDataChart
});

export default connect(mapStateToProps);
