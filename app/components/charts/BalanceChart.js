import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {balance} from "connectors";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, currencyDisplay }) => (
    <BarChart width={400} height={244} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        <Bar barSize={8} dataKey="locked" stackId="a" fill="#0c1e3e" radius={[0, 0, 10, 10]} unit={currencyDisplay} />
        <Bar barSize={8} dataKey="available" stackId="a" fill="#2971ff" radius={[10, 10, 0, 0]} unit={currencyDisplay} />
    </BarChart>
);

export default balance(BalanceChart);
