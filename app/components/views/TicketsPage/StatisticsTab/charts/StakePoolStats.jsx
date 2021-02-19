import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { MeteredChart } from "charts";
import { LEGACY_StakePoolSelect } from "inputs";
import styles from "../Statistics.module.css";
import { useStatistics } from "../hooks.js";

const StakePoolStats = () => {
  const {
    stakePool,
    setStakePool,
    allStakePoolStats,
    ticketPoolSize
  } = useStatistics();

  const ticketPercentage = stakePool ? stakePool.ProportionLive * 100 : 0;
  const votedPercentage = stakePool ? stakePool.ProportionMissed * 100 : 0;

  return (
    <>
      <div className={styles.myTicketsStatsIndicators}>
        <div className={styles.myTicketsStatsIndicatorsRow}>
          <span className={styles.myTicketsStatsIndicatorsTitle}>
            <T id="mytickets.statistics.stakepool.title" m="VSP" />
          </span>
        </div>
        <div className={styles.myTicketsStakepoolStatsSelectorRow}>
          <div className={styles.stakepoolUnconfiguredSelect}>
            {/* TODO change this select to VSPSelect.jsx */}
            <LEGACY_StakePoolSelect
              options={allStakePoolStats}
              value={stakePool}
              onChange={setStakePool}
            />
          </div>
        </div>
        <div className={styles.myTicketsStakepoolStatsRow}>
          <Tooltip
            content={
              <T
                id="mytickets.statistics.stakepool.ticketsTip"
                m="{percentage}% proportion of network tickets"
                values={{ percentage: ticketPercentage.toFixed(1) }}
              />
            }>
            <MeteredChart
              additive={true}
              blueValue={ticketPoolSize}
              blueLabel={
                <T
                  id="mytickets.statistics.stakepool.networkTickets"
                  m="All Network Tickets"
                />
              }
              blackValue={stakePool.Live}
              blackLabel={
                <T
                  id="mytickets.statistics.stakepool.stakepoolTickets"
                  m="VSP Tickets"
                />
              }
            />
          </Tooltip>
        </div>
        <div className={styles.myTicketsStakepoolStatsRow}>
          <Tooltip
            content={
              <T
                id="mytickets.statistics.stakepool.votedTip"
                m="{percentage}% of tickets missed"
                values={{ percentage: votedPercentage.toFixed(1) }}
              />
            }>
            <MeteredChart
              additive={true}
              blueValue={stakePool.Voted}
              blueLabel="Voted Tickets"
              blackValue={stakePool.Missed}
              blackLabel="Missed Tickets"
            />
          </Tooltip>
        </div>
        <div className={styles.myTicketsStakepoolStatsRow}>
          <MeteredChart
            additive={true}
            blueValue={stakePool.UserCountActive}
            blueLabel="Active Users"
            blackValue={stakePool.UserCount}
            blackLabel="Total Users"
          />
        </div>
      </div>
    </>
  );
};

export default StakePoolStats;
