import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as sta from "actions/StakePoolActions";

const mapStateToProps = selectorMap({
  configuredStakePools: sel.configuredStakePools,
  defaultStakePool: sel.defaultStakePool,
  stakePool: sel.selectedStakePool,
  agendas: sel.agendas
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onUpdateVotePreference: ca.setVoteChoicesAttempt,
  onChangeStakePool: sta.changeSelectedStakePool,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
