import { VoteTimeChart } from "charts";
import { myTicketsCharts }  from "connectors";

const VoteTimeChartPage = ({ voteTimeStats }) =>
  <VoteTimeChart data={voteTimeStats}  />;

export default myTicketsCharts(VoteTimeChartPage);
