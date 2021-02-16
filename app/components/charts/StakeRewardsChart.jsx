import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { injectIntl } from "react-intl";
import messages from "./messages";
import {
  yAxisStyle,
  xAxisStyle,
  myTicketsChartSize,
  myTicketsChartSizeSmall,
  padding,
  radiusBottom,
  radiusTop,
  hoverFill
} from "./Styles";
import { FormattedMessage as T } from "react-intl";
import styles from "./Charts.module.css";
import { useChart } from "./hooks";

const ChartTooltip = (props) => {
  const { payload } = props;
  if (
    !payload ||
    payload.length === 0 ||
    !payload[0] ||
    !payload[0].payload ||
    !payload[0].payload.legendName
  ) {
    return null;
  }

  const rowLegend = payload[0].payload.legendName;

  return (
    <div className={styles.chartTooltip}>
      <div className={styles.rowLegend}>{rowLegend}</div>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className={styles.tooltipLine}>
          <div
            className={styles.circleTooltip}
            style={{ background: entry.fill }}></div>
          <T
            id="charts.tooltip.value"
            m="{key}: {value, number, precise-percent}"
            values={{
              key: entry.dataKey,
              value: entry.value / 100
            }}
          />
        </div>
      ))}
    </div>
  );
};

const VoteTimeChart = ({ data, intl }) => {
  const { sidebarOnBottom } = useChart();
  const chartSize = sidebarOnBottom
    ? myTicketsChartSizeSmall
    : myTicketsChartSize;
  const stakeRewardsKey = intl.formatMessage(messages.stakeRewards);
  const stakeFeesKey = intl.formatMessage(messages.stakeFees);

  const displayData = data.map((s) => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [stakeFeesKey]: s.stakeFeesPerc * 100,
    [stakeRewardsKey]: s.stakeRewardPerc * 100
  }));

  return (
    <LineChart
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
      <Line
        barSize={8}
        dataKey={stakeRewardsKey}
        stackId="a"
        fill="#0c1e3e"
        radius={radiusBottom}
      />
      <Line
        barSize={8}
        dataKey={stakeFeesKey}
        stackId="a"
        fill="#69d5f7"
        radius={radiusTop}
      />
    </LineChart>
  );
};

export default injectIntl(VoteTimeChart);
