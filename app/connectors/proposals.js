import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as ga from "actions/GovernanceActions";
import * as ca from "actions/ClientActions";

const mapStateToProps = selectorMap({
  activeVoteProposals: sel.activeVoteProposals,
  getVettedProposalsAttempt: sel.getVettedProposalsAttempt,
  politeiaEnabled: sel.politeiaEnabled,
  viewedProposalDetails: sel.viewedProposalDetails,
  getProposalAttempt: sel.getProposalAttempt,
  getProposalError: sel.getProposalError,
  hasTickets: sel.hasTickets,
  updateVoteChoiceAttempt: sel.updateVoteChoiceAttempt,
  lastVettedFetchTime: sel.lastVettedFetchTime,
  tsDate: sel.tsDate,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getVettedProposals: ga.getVettedProposals,
  getProposalDetails: ga.getProposalDetails,
  viewProposalDetails: ga.viewProposalDetails,
  showPurchaseTicketsPage: ca.showPurchaseTicketsPage,
  updateVoteChoice: ga.updateVoteChoice,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
