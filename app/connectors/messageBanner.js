import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  getNextAccountSuccess: sel.getNextAccountSuccess,
  getNextAccountError: sel.getNextAccountError,
  renameAccountError: sel.renameAccountError,
  renameAccountSuccess: sel.renameAccountSuccess
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onClearNewAccountSuccess: ca.clearNewAccountSuccess,
  onClearNewAccountError: ca.clearNewAccountError,
  onClearRenameAccountSuccess: ca.clearRenameAccountSuccess,
  onClearRenameAccountError: ca.clearRenameAccountError
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
