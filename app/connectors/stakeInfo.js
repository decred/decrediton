import { connect } from "react-redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";

const mapStateToProps = selectorMap({
  ...substruct({
    ticketPoolSize: null,
    votedTicketsCount: null,
    allMempoolTicketsCount: null,
    missedTicketsCount: null,
    ownMempoolTicketsCount: null,
    revokedTicketsCount: null,
    immatureTicketsCount: null,
    expiredTicketsCount: null,
    liveTicketsCount: null
  }, selectors)
});

export default connect(mapStateToProps);
