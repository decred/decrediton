// import StatisticsPage from "./Page";
import Page from "./Heatmap";
import { myTicketsCharts } from "connectors";
import ticketData from "./mockTicketData.json";

@autobind
class Heatmap extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return <Page {...{ data: ticketData }}/>
  }
}

export default myTicketsCharts(Heatmap);
