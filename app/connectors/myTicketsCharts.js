import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as sta from "actions/StatisticsActions";

const mapStateToProps = selectorMap({
  voteTimeStats: sel.voteTimeStats,
  getMyTicketsStatsRequest: sel.getMyTicketsStatsRequest,
  stakeROIStats: sel.stakeROIStats,
  dailyBalancesStats: sel.dailyBalancesStats,
  medianVoteTime: sel.medianVoteTime,
  ninetyFifthPercentileVoteTime: sel.ninetyFifthPercentileVoteTime,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getMyTicketsStats: sta.getMyTicketsStats,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
