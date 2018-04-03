import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as ga from "actions/GovernanceActions";
import * as ca from "actions/ClientActions";

const mapStateToProps = selectorMap({
  getActiveVoteProposalsAttempt: sel.getActiveVoteProposalsAttempt,
  activeVoteProposals: sel.activeVoteProposals,
  getVettedProposalsAttempt: sel.getVettedProposalsAttempt,
  vettedProposals: sel.vettedProposals,
  politeiaEnabled: sel.politeiaEnabled,
  viewedProposalDetails: sel.viewedProposalDetails,
  getProposalAttempt: sel.getProposalAttempt,
  getProposalError: sel.getProposalError,
  hasTickets: sel.hasTickets,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getActiveVoteProposals: ga.getActiveVoteProposals,
  getVettedProposals: ga.getVettedProposals,
  getProposalDetails: ga.getProposalDetails,
  viewProposalDetails: ga.viewProposalDetails,
  showPurchaseTicketsPage: ca.showPurchaseTicketsPage,
  updateVoteChoice: ga.updateVoteChoice,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
