import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as sta from "../actions/StatisticsActions";

const mapStateToProps = selectorMap({
  exportingData: sel.exportingData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  exportStatToCSV: sta.exportStatToCSV,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
