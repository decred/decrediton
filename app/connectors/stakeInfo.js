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
  unspentTicketsCount: sel.unspentTicketsCount,
  totalSubsidy: sel.totalSubsidy,
  isSPV: sel.isSPV,
  lastVotedTicket: sel.lastVotedTicket
});

export default connect(mapStateToProps);
