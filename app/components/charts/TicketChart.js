import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import messages from "./messages";
import { injectIntl } from "react-intl";
import { yAxisStyle, xAxisStyle, homeChartSize, padding } from "./Styles";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, intl }) => {

  const lockedKey = intl.formatMessage(messages.lockedKey);
  const votedKey = intl.formatMessage(messages.votedKey);
  const ticketKey = intl.formatMessage(messages.ticketKey);
  const revokedKey = intl.formatMessage(messages.revokedKey);

  const displayData = data.map(s => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [votedKey]: s.voted,
    [lockedKey]: s.locked,
    [ticketKey]: s.ticket,
    [revokedKey]: s.revoked,
  }));

  return (
    <BarChart width={homeChartSize.width} height={homeChartSize.height} data={displayData}>
      <XAxis dataKey="name" style={yAxisStyle} />
      <YAxis orientation="right" style={xAxisStyle} padding={padding} />
      <Tooltip content={<ChartTooltip />} />
      <Bar barSize={8} dataKey={ticketKey} stackId="a" fill="#69d5f7" radius={[ 0, 0, 10, 10 ]} />
      <Bar barSize={8} dataKey={lockedKey} stackId="a" fill="#2971ff" radius={[ 10, 10, 10, 10 ]} />
      <Bar barSize={8} dataKey={votedKey} stackId="a" fill="#2ed7a2" radius={[ 10, 10, 0, 0 ]} />
      <Bar barSize={8} dataKey={revokedKey} stackId="a" fill="#8e1702" radius={[ 10, 10, 0, 0 ]} />
    </BarChart>
  );
};

export default injectIntl(BalanceChart);
