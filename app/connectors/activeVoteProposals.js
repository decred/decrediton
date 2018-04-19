// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  proposals: sel.activeVoteProposals,
  loading: sel.getActiveVoteProposalsAttempt,
});

export default connect(mapStateToProps);
