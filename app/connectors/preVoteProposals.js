// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  proposals: sel.preVoteProposals,
  loading: sel.initialProposalLoading,
});

export default connect(mapStateToProps);
