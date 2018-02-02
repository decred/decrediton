import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const BalanceChart = ({ data }) => (
    <BarChart width={400} height={244} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="locked" stackId="a" fill="#0c1e3e" radius={[0, 0, 10, 10]} />
        <Bar dataKey="available" stackId="a" fill="#2971ff" radius={[10, 10, 0, 0]} />
    </BarChart>
);

export default BalanceChart;
