import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from "recharts";
import { balance } from "connectors";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, currencyDisplay }) => (
  <BarChart stackOffset="sign" width={400} height={244} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <XAxis dataKey="name" />
    <YAxis orientation="right" />
    <Tooltip content={<ChartTooltip />} />
    <Legend />
    <ReferenceLine y={0} stroke='#000' />
    <Bar dataKey="sent" stackId="a" fill="#f60fff" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
    <Bar dataKey="received" stackId="a" fill="#8539dd" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
  </BarChart>
);

export default balance(BalanceChart);
