import { StakeROIChart } from "charts";
import { myTicketsCharts }  from "connectors";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";

const StakeROIChartPage = ({ stakeROIStats, dailyBalancesStats }) => {
  const lastBalance = dailyBalancesStats[dailyBalancesStats.length-1];
  if (!lastBalance) { return <span>No data</span>; }

  const totalStake = lastBalance.series.totalStake;
  const totalReward = lastBalance.series.stakeRewards;
  const totalFees = lastBalance.series.stakeFees;

  return (
    <Aux>
      <div className="my-tickets-stats-chart">
        <StakeROIChart data={stakeROIStats}  />
      </div>
      <div className="my-tickets-stats-indicators">
        <T id="mytickets.statistics.stakeroi.totalStake"
          m="Total Stake: {value}"
          values={{ value: <Balance amount={totalStake} /> }} />
        <T id="mytickets.statistics.stakeroi.totalReward"
          m="Total Reward: {value}"
          values={{ value: <Balance amount={totalReward} /> }} />
        <T id="mytickets.statistics.stakeroi.totalFees"
          m="Total Fees: {value}"
          values={{ value: <Balance amount={totalFees} /> }} />
      </div>
    </Aux>
  );
};

export default myTicketsCharts(StakeROIChartPage);
