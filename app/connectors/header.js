import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  newUnminedMessage: sel.newUnminedMessage
});

export default connect(mapStateToProps);
