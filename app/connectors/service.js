import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { walletService } from "../selectors";

const mapStateToProps = selectorMap({ walletService });

export default connect(mapStateToProps);
