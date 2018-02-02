import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const BalanceChart = ({ data }) => (
    <BarChart width={400} height={244} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="7 7" />
        <Tooltip />
        <Legend />
        <Bar dataKey="spendable" stackId="a" fill="#0c1e3e" radius={[10, 10, 10, 10]} />
        <Bar dataKey="locked" stackId="a" fill="#2971ff" radius={[10, 10, 10, 10]} />
    </BarChart>
);

export default BalanceChart;
