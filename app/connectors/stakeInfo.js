import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  ticketPoolSize: sel.ticketPoolSize,
  votedTicketsCount: sel.votedTicketsCount,
  allMempoolTicketsCount: sel.allMempoolTicketsCount,
  missedTicketsCount: sel.missedTicketsCount,
  ownMempoolTicketsCount: sel.ownMempoolTicketsCount,
  revokedTicketsCount: sel.revokedTicketsCount,
  immatureTicketsCount: sel.immatureTicketsCount,
  expiredTicketsCount: sel.expiredTicketsCount,
  liveTicketsCount: sel.liveTicketsCount,
  totalSubsidy: sel.totalSubsidy
});

export default connect(mapStateToProps);
