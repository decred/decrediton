import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";
import * as stakePoolActions from "../actions/StakePoolActions";

const mapStateToProps = selectorMap({
  ...substruct({
    configuredStakePools: null,
    unconfiguredStakePools: null,
    defaultStakePool: null
  }, selectors)
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...substruct({
    setStakePoolInformation: "onSetStakePoolInfo"
  }, stakePoolActions)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
