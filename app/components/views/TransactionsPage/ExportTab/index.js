import exportPage from "connectors/exportPage";
import { transactionStats } from "actions/StatisticsActions";

@autobind
class ExportTab extends React.Component {

  constructor(props) {
    super(props);
  }

  export() {
    const opts = {
      calcFunction: transactionStats,
    };
    this.props.exportStatToCSV(opts);
  }

  render() {
    return <div><button onClick={this.export}>export</button></div>;
  }
}

export default exportPage(ExportTab);
