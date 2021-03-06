import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import messages from "./messages";
import { injectIntl } from "react-intl";
import {
  yAxisStyle,
  xAxisStyle,
  homeChartSize,
  homeChartSizeSmall,
  padding,
  radiusMiddle,
  radiusTop,
  radiusBottom,
  hoverFill
} from "./Styles";
import ChartTooltip from "./ChartTooltip";
import styles from "./Charts.module.css";
import { useChart } from "./hooks";

const BalanceChart = ({ data, intl }) => {
  const { sidebarOnBottom } = useChart();
  const chartSize = sidebarOnBottom ? homeChartSizeSmall : homeChartSize;
  const lockedKey = intl.formatMessage(messages.lockedKey);
  const votedKey = intl.formatMessage(messages.votedKey);
  const ticketKey = intl.formatMessage(messages.ticketKey);
  const revokedKey = intl.formatMessage(messages.revokedKey);

  const displayData = data.map((s) => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [votedKey]: s.voted,
    [revokedKey]: s.revoked,
    [ticketKey]: s.ticket,
    [lockedKey]: s.locked
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
        dataKey={lockedKey}
        stackId="a"
        fill="#2971ff"
        radius={radiusBottom}
      />
      <Bar
        barSize={8}
        dataKey={revokedKey}
        stackId="a"
        fill="#8e1702"
        radius={radiusMiddle}
      />
      <Bar
        barSize={8}
        dataKey={ticketKey}
        stackId="a"
        fill="#69d5f7"
        radius={radiusMiddle}
      />
      <Bar
        barSize={8}
        dataKey={votedKey}
        stackId="a"
        fill="#2ed7a2"
        radius={radiusTop}
      />
    </BarChart>
  );
};

export default injectIntl(BalanceChart);
