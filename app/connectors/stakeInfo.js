import { connect } from "react-redux";
import { selectorMap } from "../fp";
import {
  ticketPoolSize,
  votedTicketsCount,
  allMempoolTicketsCount,
  missedTicketsCount,
  ownMempoolTicketsCount,
  revokedTicketsCount,
  immatureTicketsCount,
  expiredTicketsCount,
  liveTicketsCount
} from "../selectors";

const mapStateToProps = selectorMap({
  ticketPoolSize,
  votedTicketsCount,
  allMempoolTicketsCount,
  missedTicketsCount,
  ownMempoolTicketsCount,
  revokedTicketsCount,
  immatureTicketsCount,
  expiredTicketsCount,
  liveTicketsCount
});

export default connect(mapStateToProps);
