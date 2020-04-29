import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip } from "recharts";
import messages from "./messages";
import { injectIntl } from "react-intl";
import ChartTooltip from "./ChartTooltip";
import {
  yAxisStyle,
  xAxisStyle,
  homeChartSize,
  radiusFull,
  padding,
  hoverFill
} from "./Styles";
import "style/Chart.less";

const BalanceChart = ({ data, intl }) => {
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
      width={homeChartSize.width}
      height={homeChartSize.height}
      data={displayData}>
      <XAxis
        tickLine={false}
        dataKey="name"
        style={xAxisStyle}
        className="xAxis"
      />
      <YAxis
        tickLine={false}
        orientation="right"
        style={yAxisStyle}
        padding={padding}
        className="yAxis"
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

export default injectIntl(BalanceChart);
