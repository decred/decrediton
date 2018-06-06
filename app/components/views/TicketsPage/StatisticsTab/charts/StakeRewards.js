import { StakeRewardsChart } from "charts";
import { myTicketsCharts }  from "connectors";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";

const StakeRewardsChartPage = ({ stakeRewardsStats, dailyBalancesStats }) => {
  const lastBalance = dailyBalancesStats[dailyBalancesStats.length-1];
  if (!lastBalance) { return <span>No data</span>; }

  const totalStake = lastBalance.series.totalStake;
  const totalReward = lastBalance.series.stakeRewards;
  const totalFees = lastBalance.series.stakeFees;

  return (
    <Aux>
      <div className="my-tickets-stats-indicators">
        <div className="my-tickets-stats-indicators-row">
          <span className="my-tickets-stats-indicators-title">
            <T id="mytickets.statistics.stakerewards.title" m="Stake Rewards" />
          </span>
        </div>
        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.stakerewards.totalStake" m="Total Stake:"/>
          </div>
          <div className="my-tickets-stats-indicators-value">
            <Balance amount={totalStake} flat={true} bold={false}/>
          </div>
        </div>
        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.stakerewards.totalReward" m="Total Reward:" />
          </div>
          <div className="my-tickets-stats-indicators-value">
            <Balance amount={totalReward} flat={true} bold={false}/>
          </div>
        </div>
        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.stakerewards.totalFees" m="Total Fees"/>
          </div>
          <div className="my-tickets-stats-indicators-value">
            <Balance amount={totalFees} flat={true} bold={false}/>
          </div>
        </div>
      </div>
      <div className="my-tickets-stats-chart">
        <StakeRewardsChart data={stakeRewardsStats}  />
      </div>
    </Aux>
  );
};

export default myTicketsCharts(StakeRewardsChartPage);
