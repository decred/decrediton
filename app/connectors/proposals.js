import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as ga from "actions/GovernanceActions";

const mapStateToProps = selectorMap({
  getActiveVoteProposalsAttempt: sel.getActiveVoteProposalsAttempt,
  activeVoteProposals: sel.activeVoteProposals,
  getVettedProposalsAttempt: sel.getVettedProposalsAttempt,
  vettedProposals: sel.vettedProposals,
  politeiaEnabled: sel.politeiaEnabled,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getActiveVoteProposals: ga.getActiveVoteProposals,
  getVettedProposals: ga.getVettedProposals,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
