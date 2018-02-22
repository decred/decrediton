import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import messages from "./messages";
import { injectIntl } from "react-intl";
import ChartTooltip from "./ChartTooltip";
import { yAxisStyle, xAxisStyle, homeChartSize, radiusMiddle, radiusTop, padding } from "./Styles";
import "style/Chart.less";

const BalanceChart = ({ data, intl }) => {
  const sentKey = intl.formatMessage(messages.sentKey);
  const receivedKey = intl.formatMessage(messages.receivedKey);

  const displayData = data.map(s => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [sentKey]: s.sent,
    [receivedKey]: s.received
  }));

  return (
    <BarChart stackOffset="sign" width={homeChartSize.width} height={homeChartSize.height} data={displayData}>
      <XAxis dataKey="name" style={xAxisStyle} />
      <YAxis orientation="right" style={yAxisStyle} padding={padding}/>
      <Tooltip content={<ChartTooltip />} />
      <Bar dataKey={sentKey} stackId="a" fill="#fd704a" barSize={8} radius={radiusMiddle} />
      <Bar dataKey={receivedKey} stackId="a" fill="#41bf53" barSize={8} radius={radiusTop} />
    </BarChart>
  );
};

export default injectIntl(BalanceChart);
