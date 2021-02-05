import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip } from "recharts";
import messages from "./messages";
import { injectIntl } from "react-intl";
import ChartTooltip from "./ChartTooltip";
import {
  yAxisStyle,
  xAxisStyle,
  homeChartSize,
  homeChartSizeSmall,
  radiusFull,
  padding,
  hoverFill
} from "./Styles";
import styles from "./Charts.module.css";
import { useChart } from "./hooks";

const TransactionChart = ({ data, intl }) => {
  const { sidebarOnBottom } = useChart();
  const chartSize = sidebarOnBottom ? homeChartSizeSmall : homeChartSize;
  const sentKey = intl.formatMessage(messages.sentKey);
  const receivedKey = intl.formatMessage(messages.receivedKey);

  const displayData = data.map((s) => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [sentKey]: s.sent,
    [receivedKey]: s.received
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
        style={xAxisStyle}
        className={styles.xAxis}
      />
      <YAxis
        tickLine={false}
        orientation="right"
        style={yAxisStyle}
        padding={padding}
        className={styles.yAxis}
      />
      <Tooltip cursor={hoverFill} content={<ChartTooltip />} />
      <ReferenceLine y={0} stroke="#f3f6f6" />
      <Bar
        dataKey={sentKey}
        stackId="a"
        fill="#fd704a"
        barSize={8}
        radius={radiusFull}
      />
      <Bar
        dataKey={receivedKey}
        stackId="a"
        fill="#41bf53"
        barSize={8}
        radius={radiusFull}
      />
    </BarChart>
  );
};

export default injectIntl(TransactionChart);
