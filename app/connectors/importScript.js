import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

const mapStateToProps = selectorMap({
  rescanRequest: sel.rescanRequest,
  isImportingScript: sel.isImportingScript,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onImportScript: ca.manualImportScriptAttempt,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
