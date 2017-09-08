import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";
import * as clientActions from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  ...substruct({
    configuredStakePools: null,
    defaultStakePool: null,
    agendas: null
  }, selectors)
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...substruct({
    setVoteChoicesAttempt: "onUpdateVotePreference"
  }, clientActions)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
