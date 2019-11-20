import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as sta from "actions/StatisticsActions";

const mapStateToProps = selectorMap({
  ticketPoolSize: sel.ticketPoolSize,
  allStakePoolStats: sel.networkStakePoolStatsList,
  voteTimeStats: sel.voteTimeStats,
  getMyTicketsStatsRequest: sel.getMyTicketsStatsRequest,
  stakeRewardsStats: sel.stakeRewardsStats,
  dailyBalancesStats: sel.fullDailyBalancesStats,
  medianVoteTime: sel.medianVoteTime,
  averageVoteTime: sel.averageVoteTime,
  ninetyFifthPercentileVoteTime: sel.ninetyFifthPercentileVoteTime,
  hasTickets: sel.hasTickets,
  selectedStakePool: sel.selectedStakePool,
  ticketDataHeatmap: sel.ticketDataHeatmap
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getMyTicketsStats: sta.getMyTicketsStats,
  getTicketsHeatmapStats: sta.getTicketsHeatmapStats
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
