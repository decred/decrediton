import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { balance } from "connectors";
import ChartTooltip from "./ChartTooltip";
import {yAxisStyle, xAxisStyle, homeChartSize} from "./Styles";
import "style/Chart.less";

const BalanceChart = ({ data, currencyDisplay }) => (
  <BarChart stackOffset="sign" width={homeChartSize.width} height={homeChartSize.height} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <XAxis dataKey="name" style={xAxisStyle} />
    <YAxis orientation="right" style={yAxisStyle}/>
    <Tooltip content={<ChartTooltip />} />
    <ReferenceLine y={0} stroke='#000' />
    <Bar dataKey="sent" stackId="a" fill="#fd704a" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
    <Bar dataKey="received" stackId="a" fill="#41bf53" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
  </BarChart>
);

export default balance(BalanceChart);
