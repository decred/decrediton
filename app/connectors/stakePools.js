import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as spa from "../actions/StakePoolActions";

const mapStateToProps = selectorMap({
  configuredStakePools: sel.configuredStakePools,
  unconfiguredStakePools: sel.unconfiguredStakePools,
  defaultStakePool: sel.defaultStakePool,
  rescanRequest: sel.rescanRequest
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onSetStakePoolInfo: spa.setStakePoolInformation,
  discoverAvailableStakepools: spa.discoverAvailableStakepools
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
