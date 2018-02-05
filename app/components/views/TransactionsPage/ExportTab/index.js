import exportPage from "connectors/exportPage";
import { transactionStats, balancesStats } from "actions/StatisticsActions";
import Page from "./Page";
import messages from "./messages";

const AvailableExports = [
  { ...messages.transactions,
    key: "transactions",
    calcFunction: transactionStats,
  },
  { ...messages.balances,
    key: "balances",
    calcFunction: balancesStats,
  }
];
@autobind
class ExportTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedExport: AvailableExports[0]
    };
  }

  onChangeSelectedExport(selectedExport) {
    this.setState({selectedExport});
  }

  exportCSV() {
    const { selectedExport } = this.state;
    const opts = {
      calcFunction: selectedExport.calcFunction,
    };
    this.props.exportStatToCSV(opts);
  }

  render() {
    const { exportCSV, onChangeSelectedExport } = this;

    return (<Page
      {...this.props}
      {...this.state}
      availableExports={AvailableExports}
      exportCSV={exportCSV}
      onChangeSelectedExport={onChangeSelectedExport}
    />);
  }
}

export default exportPage(ExportTab);
