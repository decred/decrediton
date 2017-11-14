import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  synced: sel.synced,
  changePassphraseError: sel.changePassphraseError,
  changePassphraseSuccess: sel.changePassphraseSuccess,
  getNextAccountSuccess: sel.getNextAccountSuccess,
  getNextAccountError: sel.getNextAccountError,
  renameAccountError: sel.renameAccountError,
  renameAccountSuccess: sel.renameAccountSuccess
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onClearChangePassphraseError: ca.clearChangePassphraseError,
  onClearChangePassphraseSuccess: ca.clearChangePassphraseSuccess,
  onClearNewAccountSuccess: ca.clearNewAccountSuccess,
  onClearNewAccountError: ca.clearNewAccountError,
  onClearRenameAccountSuccess: ca.clearRenameAccountSuccess,
  onClearRenameAccountError: ca.clearRenameAccountError
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
