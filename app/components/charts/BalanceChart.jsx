import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { injectIntl } from "react-intl";
import messages from "./messages";
import {
  yAxisStyle,
  xAxisStyle,
  homeChartSize,
  homeChartSizeSmall,
  padding,
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
  const availableKey = intl.formatMessage(messages.availableKey);
  const lockedKey = intl.formatMessage(messages.lockedKey);

  const displayData = data.map((s) => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [availableKey]: s.available,
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
        fill="#0c1e3e"
        radius={radiusBottom}
      />
      <Bar
        barSize={8}
        dataKey={availableKey}
        stackId="a"
        fill="#2971ff"
        radius={radiusTop}
      />
    </BarChart>
  );
};

export default injectIntl(BalanceChart);
