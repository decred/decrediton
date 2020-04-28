import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  network: sel.network,
  networks: sel.networks,
  isTestNet: sel.isTestNet,
  isMainNet: sel.isMainNet,
});

export default connect(mapStateToProps);
