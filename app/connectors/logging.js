// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  getCredentials: sel.getCredentials,
});

export default connect(mapStateToProps);
