import StatisticsPage from "./Page";
import { myTicketsCharts } from "connectors";

@autobind
class Statistics extends React.Component{

  constructor(props) {
    super(props);
    if (!props.voteTimeStats && !props.getMyTicketsStatsRequest && props.hasTickets) {
      props.getMyTicketsStats();
    }
    this.state = { hasStats: props.voteTimeStats && !props.getMyTicketsStatsRequest };
  }

  componentDidUpdate(prevProps) {
    const hasStats = this.props.voteTimeStats && !this.props.getMyTicketsStatsRequest;
    if ((prevProps.voteTimeStats && !this.props.getMyTicketsStatsRequest) !== hasStats) {
      this.setState({ hasStats });
    }
  }

  componentDidMount() {
    this.setState({ hasStats: this.props.voteTimeStats && !this.props.getMyTicketsStatsRequest });
  }

  render() {
    return <StatisticsPage {...{
      ...this.props,
      ...this.state
    }} />;
  }
}

export default myTicketsCharts(Statistics);
