// import StatisticsPage from "./Page";
import Page from "./Heatmap";
import { myTicketsCharts } from "connectors";
import ticketData from "./mockTicketData.json";

@autobind
class Heatmap extends React.Component{
  constructor(props) {
    super(props);
    this.props.getTicketsHeatmapStats();
  }

  render() {
    const { timezone, ticketDataHeatmap } = this.props;
    return <Page {...{ data: ticketDataHeatmap, timezone }}/>
  }
}

export default myTicketsCharts(Heatmap);
