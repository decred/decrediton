import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
// import * as sel from "../selectors";
import * as sta from "../actions/StatisticsActions";

const mapStateToProps = selectorMap({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  exportStatToCSV: sta.exportStatToCSV,
  //transactionStats: sta.transactionStats,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
