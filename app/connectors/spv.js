import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  spvMode: sel.isSPV,
  blocksNumberToNextTicket: sel.blocksNumberToNextTicket,
});

export default connect(mapStateToProps);
