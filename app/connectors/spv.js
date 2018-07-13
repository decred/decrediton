import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  spvMode: sel.spvMode,
  blocksPassedOnTicketInterval: sel.blocksPassedOnTicketInterval,
});

export default connect(mapStateToProps);
