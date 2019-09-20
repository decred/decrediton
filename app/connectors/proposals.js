import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as ga from "actions/GovernanceActions";
import * as ca from "actions/ClientActions";

const mapStateToProps = selectorMap({
  politeiaEnabled: sel.politeiaEnabled,
  viewedProposalDetails: sel.viewedProposalDetails,
  proposalsDetails: sel.proposalsDetails,
  getProposalAttempt: sel.getProposalAttempt,
  getProposalError: sel.getProposalError,
  hasTickets: sel.hasTickets,
  updateVoteChoiceAttempt: sel.updateVoteChoiceAttempt,
  lastVettedFetchTime: sel.lastVettedFetchTime,
  tsDate: sel.tsDate,
  inventory: sel.inventory,
  loading: sel.initialProposalLoading,
  proposalsList: sel.proposals,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getVettedProposals: ga.getVettedProposals,
  getProposalsAndUpdateVoteStatus: ga.getProposalsAndUpdateVoteStatus,
  getProposalDetails: ga.getProposalDetails,
  viewProposalDetails: ga.viewProposalDetails,
  showPurchaseTicketsPage: ca.showPurchaseTicketsPage,
  updateVoteChoice: ga.updateVoteChoice,
  goBackHistory: ca.goBackHistory,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
