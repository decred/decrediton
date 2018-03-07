import { StakeROIChart } from "charts";
import { myTicketsCharts }  from "connectors";

const StakeROIChartPage = ({ stakeROIStats }) =>
  <StakeROIChart data={stakeROIStats}  />;

export default myTicketsCharts(StakeROIChartPage);
