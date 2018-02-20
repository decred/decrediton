import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { balance } from "connectors";
import { yAxisStyle, xAxisStyle, homeChartSize, padding } from "./Styles";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, currencyDisplay }) => (
  <BarChart width={homeChartSize.width} height={homeChartSize.height} data={data}>
    <XAxis dataKey="name" style={yAxisStyle} />
    <YAxis orientation="right" style={xAxisStyle} padding={padding} />
    <Tooltip content={<ChartTooltip />} />
    <Bar barSize={8} dataKey="immature" stackId="a" fill="#69d5f7" radius={[ 0, 0, 10, 10 ]} unit={currencyDisplay} />
    <Bar barSize={8} dataKey="live" stackId="a" fill="#2971ff" radius={[ 10, 10, 10, 10 ]} unit={currencyDisplay} />
    <Bar barSize={8} dataKey="voted" stackId="a" fill="#2ed7a2" radius={[ 10, 10, 0, 0 ]} unit={currencyDisplay} />
  </BarChart>
);

export default balance(BalanceChart);
