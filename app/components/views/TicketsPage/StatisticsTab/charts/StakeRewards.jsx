import { StakeRewardsChart } from "charts";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { useStatistics } from "../hooks.js";
import styles from "../Statistics.module.css";

const StakeRewardsChartPage = () => {
  const { stakeRewardsStats, dailyBalancesStats } = useStatistics();
  const lastBalance = dailyBalancesStats[dailyBalancesStats.length - 1];
  if (!lastBalance) {
    return <span>No data</span>;
  }

  const totalStake = lastBalance.series.totalStake;
  const totalReward = lastBalance.series.stakeRewards;
  const totalFees = lastBalance.series.stakeFees;

  return (
    <>
      <div className={styles.myTicketsStatsIndicators}>
        <div className={styles.myTicketsStatsIndicatorsRow}>
          <span className={styles.myTicketsStatsIndicatorsTitle}>
            <T id="mytickets.statistics.stakerewards.title" m="Stake Rewards" />
          </span>
        </div>
        <div className={styles.myTicketsStatsIndicatorsRow}>
          <div className={styles.myTicketsStatsIndicatorsLabel}>
            <T
              id="mytickets.statistics.stakerewards.totalStake"
              m="Total Stake:"
            />
          </div>
          <div className={styles.myTicketsStatsIndicatorsValue}>
            <Balance amount={totalStake} flat={true} bold={false} />
          </div>
        </div>
        <div className={styles.myTicketsStatsIndicatorsRow}>
          <div className={styles.myTicketsStatsIndicatorsLabel}>
            <T
              id="mytickets.statistics.stakerewards.totalReward"
              m="Total Reward:"
            />
          </div>
          <div className={styles.myTicketsStatsIndicatorsValue}>
            <Balance amount={totalReward} flat={true} bold={false} />
          </div>
        </div>
        <div className={styles.myTicketsStatsIndicatorsRow}>
          <div className={styles.myTicketsStatsIndicatorsLabel}>
            <T
              id="mytickets.statistics.stakerewards.totalFees"
              m="Total Fees"
            />
          </div>
          <div className={styles.myTicketsStatsIndicatorsValue}>
            <Balance amount={totalFees} flat={true} bold={false} />
          </div>
        </div>
      </div>
      <div className={styles.myTicketsStatsChart}>
        <StakeRewardsChart data={stakeRewardsStats} />
      </div>
    </>
  );
};

export default StakeRewardsChartPage;
