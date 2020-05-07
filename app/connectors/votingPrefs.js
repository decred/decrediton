import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as spa from "actions/StakePoolActions";

const mapStateToProps = selectorMap({
  configuredStakePools: sel.configuredStakePools,
  defaultStakePool: sel.defaultStakePool,
  stakePool: sel.selectedStakePool,
  allAgendas: sel.allAgendas
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onUpdateVotePreference: ca.setVoteChoicesAttempt,
      onChangeStakePool: spa.changeSelectedStakePool
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
