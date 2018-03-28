import StatisticsPage from "./Page";
import { myTicketsCharts } from "connectors";

@autobind
class Statistics extends React.Component{

  constructor(props) {
    super(props);
    if (!props.voteTimeStats && !props.getMyTicketsStatsRequest && props.allTickets.length > 0) {
      props.getMyTicketsStats();
    }
    this.state = { hasStats: props.voteTimeStats && !props.getMyTicketsStatsRequest };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ hasStats: nextProps.voteTimeStats && !nextProps.getMyTicketsStatsRequest });
  }

  render() {
    return <StatisticsPage {...{
      ...this.props,
      ...this.state
    }} />;
  }
}

export default myTicketsCharts(Statistics);
