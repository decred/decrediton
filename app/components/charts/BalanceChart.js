import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import {balance} from "connectors";
import {yAxisStyle, xAxisStyle, homeChartSize} from "./Styles";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, currencyDisplay }) => (
    <BarChart width={homeChartSize.width} height={homeChartSize.height} data={data}>
        <XAxis dataKey="name" style={yAxisStyle}/>
        <YAxis orientation="right" style={xAxisStyle}/>
        <Tooltip content={<ChartTooltip />} />
        <Bar barSize={8} dataKey="locked" stackId="a" fill="#0c1e3e" radius={[0, 0, 10, 10]} unit={currencyDisplay} />
        <Bar barSize={8} dataKey="available" stackId="a" fill="#2971ff" radius={[10, 10, 0, 0]} unit={currencyDisplay} />
    </BarChart>
);

export default balance(BalanceChart);
