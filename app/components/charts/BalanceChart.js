import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { injectIntl } from "react-intl";
import messages from "./messages";
import { yAxisStyle, xAxisStyle, homeChartSize, padding } from "./Styles";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, intl }) => {

  const availableKey = intl.formatMessage(messages.availableKey);
  const lockedKey = intl.formatMessage(messages.lockedKey);

  const displayData = data.map(s => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [availableKey]: s.available,
    [lockedKey]: s.locked
  }));

  return (
    <BarChart width={homeChartSize.width} height={homeChartSize.height} data={displayData}>
      <XAxis dataKey="name" style={yAxisStyle} />
      <YAxis orientation="right" style={xAxisStyle} padding={padding} />
      <Tooltip content={<ChartTooltip />} />
      <Bar barSize={8} dataKey={lockedKey} stackId="a" fill="#0c1e3e" radius={[ 0, 0, 10, 10 ]} margin={100} />
      <Bar barSize={8} dataKey={availableKey} stackId="a" fill="#2971ff" radius={[ 10, 10, 0, 0 ]} />
    </BarChart>
  );
};

export default injectIntl(BalanceChart);
