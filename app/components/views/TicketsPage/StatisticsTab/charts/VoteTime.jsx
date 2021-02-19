import { VoteTimeChart } from "charts";
import { FormattedMessage as T } from "react-intl";
import { useStatistics } from "../hooks.js";
import styles from "../Statistics.module.css";

const VoteTimeChartPage = () => {
  const {
    voteTimeStats,
    averageVoteTime,
    medianVoteTime,
    ninetyFifthPercentileVoteTime
  } = useStatistics();
  return (
    <>
      <div className={styles.myTicketsStatsIndicators}>
        <div className={styles.myTicketsStatsIndicatorsRow}>
          <span className={styles.myTicketsStatsIndicatorsTitle}>
            <T id="mytickets.statistics.votetime.title" m="Vote Time" />
          </span>
        </div>
        <div className={styles.myTicketsStatsIndicatorsRow}>
          <div className={styles.myTicketsStatsIndicatorsLabel}>
            <T
              id="mytickets.statistics.votetime.average.label"
              m="Average vote time:"
            />
          </div>
          <div className={styles.myTicketsStatsIndicatorsValue}>
            <T
              id="mytickets.statistics.votetime.average.value"
              m="{value, plural, =0 {in the same day} one { within one day } other {within # days} }"
              values={{ value: averageVoteTime }}
            />
          </div>
        </div>

        <div className={styles.myTicketsStatsIndicatorsRow}>
          <div className={styles.myTicketsStatsIndicatorsLabel}>
            <T
              id="mytickets.statistics.votetime.median.label"
              m="Median vote time:"
            />
          </div>
          <div className={styles.myTicketsStatsIndicatorsValue}>
            <T
              id="mytickets.statistics.votetime.median.value"
              m="{value, plural, =0 {in the same day} one { within one day } other {within # days} }"
              values={{ value: medianVoteTime }}
            />
          </div>
        </div>

        <div className={styles.myTicketsStatsIndicatorsRow}>
          <div className={styles.myTicketsStatsIndicatorsLabel}>
            <T
              id="mytickets.statistics.votetime.ninetyfifthpercentile.label"
              m="95% of tickets voted:"
            />
          </div>
          <div className={styles.myTicketsStatsIndicatorsValue}>
            <T
              id="mytickets.statistics.votetime.ninetyfifthpercentile.value"
              m="{value, plural, =0 {in the same day} one { within one day } other {within # days} }"
              values={{ value: ninetyFifthPercentileVoteTime }}
            />
          </div>
        </div>
      </div>
      <div className={styles.myTicketsStatsChart}>
        <VoteTimeChart data={voteTimeStats} />
      </div>
    </>
  );
};

export default VoteTimeChartPage;
