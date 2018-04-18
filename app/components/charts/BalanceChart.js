import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { injectIntl } from "react-intl";
import messages from "./messages";
import { yAxisStyle, xAxisStyle, homeChartSize, padding, radiusTop,
  radiusMiddle, radiusBottom } from "./Styles";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, intl }) => {

  const availableKey = intl.formatMessage(messages.availableKey);
  const lockedKey = intl.formatMessage(messages.lockedKey);
  const immatureKey = intl.formatMessage(messages.immatureKey);

  const displayData = data.map(s => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [lockedKey]: s.locked,
    [immatureKey]: s.immature,
    [availableKey]: s.available,
  }));

  return (
    <BarChart stackOffset="sign" width={homeChartSize.width} height={homeChartSize.height} data={displayData}>
      <XAxis dataKey="name" style={yAxisStyle} />
      <YAxis orientation="right" style={xAxisStyle} padding={padding} />
      <Tooltip content={<ChartTooltip />} />
      <Bar barSize={8} dataKey={availableKey} stackId="a" fill="#2971ff" radius={radiusBottom} />
      <Bar barSize={8} dataKey={immatureKey} stackId="a" fill="#69d5f7" radius={radiusMiddle} />
      <Bar barSize={8} dataKey={lockedKey} stackId="a" fill="#0c1e3e" radius={radiusTop} />
    </BarChart>
  );
};

export default injectIntl(BalanceChart);
