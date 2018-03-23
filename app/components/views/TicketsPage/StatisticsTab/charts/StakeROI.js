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
        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.stakeroi.totalStake" m="Total Stake:"/>
          </div>
          <div className="my-tickets-stats-indicators-value">
            <Balance amount={totalStake} />
          </div>
        </div>
        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.stakeroi.totalReward" m="Total Reward:" />
          </div>
          <div className="my-tickets-stats-indicators-value">
            <Balance amount={totalReward} />
          </div>
        </div>
        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.stakeroi.totalFees" m="Total Fees"/>
          </div>
          <div className="my-tickets-stats-indicators-value">
            <Balance amount={totalFees} />
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default myTicketsCharts(StakeROIChartPage);
