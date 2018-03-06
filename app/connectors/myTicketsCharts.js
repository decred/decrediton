import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as sta from "actions/StatisticsActions";

const mapStateToProps = selectorMap({
  voteTimeStats: sel.voteTimeStats,
  getMyTicketsStatsRequest: sel.getMyTicketsStatsRequest,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getMyTicketsStats: sta.getMyTicketsStats,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
