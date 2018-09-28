import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  showTicketList: ca.showTicketList
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
