import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { injectIntl } from "react-intl";
import messages from "./messages";
import ChartTooltip from "./ChartTooltip";
import { yAxisStyle, xAxisStyle, myTicketsChartSize, padding,
  radiusBottom, radiusMiddle, radiusTop } from "./Styles";

const VoteTimeChart = ({ data, intl }) => {

  const totalStakeKey = intl.formatMessage(messages.totalStake);
  const stakeRewardsKey = intl.formatMessage(messages.stakeRewards);
  const stakeFeesKey = intl.formatMessage(messages.stakeFees);

  const displayData = data.map(s => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [totalStakeKey]: s.totalStake,
    [stakeRewardsKey]: s.stakeRewards,
    [stakeFeesKey]: s.stakeFees,
  }));

  return (
    <BarChart stackOffset="sign" width={myTicketsChartSize.width} height={myTicketsChartSize.height} data={displayData}>
      <XAxis dataKey="name" style={yAxisStyle} />
      <YAxis orientation="right" style={xAxisStyle} padding={padding} />
      <Tooltip content={<ChartTooltip />} />
      <Bar barSize={8} dataKey={totalStakeKey} stackId="a" fill="#2971ff" radius={radiusBottom} />
      <Bar barSize={8} dataKey={stakeRewardsKey} stackId="a" fill="#0c1e3e" radius={radiusMiddle} />
      <Bar barSize={8} dataKey={stakeFeesKey} stackId="a" fill="#69d5f7" radius={radiusTop} />
    </BarChart>
  );
};

export default injectIntl(VoteTimeChart);
