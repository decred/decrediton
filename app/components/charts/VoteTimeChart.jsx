import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { injectIntl } from "react-intl";
import messages from "./messages";
import {
  yAxisStyle,
  xAxisStyle,
  myTicketsChartSize,
  myTicketsChartSizeSmall,
  padding,
  radiusFull,
  hoverFill
} from "./Styles";
import { isArray } from "lodash";
import { FormattedMessage as T } from "react-intl";
import styles from "./Charts.module.css";
import { useChart } from "./hooks";

const ChartTooltip = ({ payload }) => {
  if (!payload || !isArray(payload) || !payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <T id="charts.voteTime.noVotesDay" m="No tickets voted in this range" />
      </div>
    );
  }

  const count = payload[0].value;
  const days = payload[0].payload.name;

  return (
    <div className={styles.chartTooltip}>
      <T
        id="charts.voteTime.daysToVoteCount"
        m="{count, plural, =0 {zero tickets} one {# ticket} other {# tickets} } voted {days, plural, =0 {in the same day} one {within one day} other {within # days} } of purchase"
        values={{ count, days }}
      />
    </div>
  );
};

const VoteTimeChart = ({ data, intl }) => {
  const { sidebarOnBottom } = useChart();
  const chartSize = sidebarOnBottom
    ? myTicketsChartSizeSmall
    : myTicketsChartSize;
  const countKey = intl.formatMessage(messages.ticketCountByDay);

  const displayData = data.data.map((s) => ({
    name: s.series.daysToVote,
    legendName: messages.day,
    [countKey]: s.series.count
  }));

  return (
    <BarChart
      stackOffset="sign"
      width={chartSize.width}
      height={chartSize.height}
      data={displayData}>
      <XAxis
        tickLine={false}
        dataKey="name"
        style={yAxisStyle}
        className={styles.xAxis}
      />
      <YAxis
        tickLine={false}
        orientation="right"
        style={xAxisStyle}
        padding={padding}
        className={styles.yAxis}
      />
      <Tooltip cursor={hoverFill} content={<ChartTooltip />} />
      <Bar
        barSize={8}
        dataKey={countKey}
        stackId="a"
        fill="#2971ff"
        radius={radiusFull}
      />
    </BarChart>
  );
};

export default injectIntl(VoteTimeChart);
