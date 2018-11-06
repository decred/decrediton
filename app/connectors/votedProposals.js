// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  proposals: sel.votedProposals,
  loading: sel.getVettedProposalsAttempt,
  voteEnded: sel.votedProposals,
});

export default connect(mapStateToProps);
