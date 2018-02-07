import exportPage from "connectors/exportPage";
import { transactionStats, dailyBalancesStats } from "actions/StatisticsActions";
import Page from "./Page";
import messages from "./messages";

const AvailableExports = [
  { ...messages.transactions,
    key: "transactions",
    calcFunction: transactionStats,
  },
  { ...messages.balances,
    key: "balances",
    calcFunction: dailyBalancesStats,
  }
];
@autobind
class ExportTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedExport: AvailableExports[0],
      destinationFile: "",
    };
  }

  onChangeSelectedExport(selectedExport) {
    this.setState({selectedExport});
  }

  exportCSV() {
    const { selectedExport, destinationFile } = this.state;
    const opts = {
      calcFunction: selectedExport.calcFunction,
      csvFilename: destinationFile,
    };
    this.props.exportStatToCSV(opts);
  }

  setDestinationFile(destinationFile) {
    this.setState({destinationFile});
  }

  render() {
    const { exportCSV, onChangeSelectedExport, setDestinationFile } = this;

    return (<Page
      {...this.props}
      {...this.state}
      availableExports={AvailableExports}
      exportCSV={exportCSV}
      onChangeSelectedExport={onChangeSelectedExport}
      setDestinationFile={setDestinationFile}
    />);
  }
}

export default exportPage(ExportTab);
