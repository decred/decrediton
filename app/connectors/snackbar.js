import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  messages: sel.snackbarMessages,
});

export default connect(mapStateToProps);
