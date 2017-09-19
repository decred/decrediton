import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  currentBlockHeight: sel.currentBlockHeight
});

export default connect(mapStateToProps);
