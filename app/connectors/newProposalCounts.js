import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  newActiveVoteProposalsCount: sel.newActiveVoteProposalsCount,
  newPreVoteProposalsCount: sel.newPreVoteProposalsCount,
  newProposalsStartedVoting: sel.newProposalsStartedVoting,
});

export default connect(mapStateToProps);
