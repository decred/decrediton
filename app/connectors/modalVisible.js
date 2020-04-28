import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  modalVisible: sel.modalVisible,
});

export default connect(mapStateToProps);
