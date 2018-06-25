import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as sa from "../actions/StakePoolActions";

const mapStateToProps = selectorMap({
  isAddingCustomStakePool: sel.isAddingCustomStakePool,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addCustomStakePool: sa.addCustomStakePool,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
