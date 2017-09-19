import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  configuredStakePools: sel.configuredStakePools,
  defaultStakePool: sel.defaultStakePool,
  agendas: sel.agendas
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onUpdateVotePreference: ca.setVoteChoicesAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
