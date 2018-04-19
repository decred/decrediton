// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  proposals: sel.vettedProposals,
  loading: sel.getVettedProposalsAttempt,
});

export default connect(mapStateToProps);
