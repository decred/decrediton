import exportPage from "connectors/exportPage";
import {
  transactionStats, dailyBalancesStats, balancesStats, voteTimeStats,
  ticketStats,
} from "actions/StatisticsActions";
import Page from "./Page";
import messages from "./messages";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

export const ExportTabHeader = () =>
  <DescriptionHeader
    description={<T id="transactions.description.export" m="Export different types of statistics from your wallet." />}
  />;

const AvailableExports = [
  { ...messages.transactions,
    key: "transactions",
    calcFunction: transactionStats,
  },
  { ...messages.dailyBalances,
    key: "dailyBalances",
    calcFunction: dailyBalancesStats,
  },
  { ...messages.balances,
    key: "balances",
    calcFunction: balancesStats,
  },
  { ...messages.voteTime,
    key: "votetime",
    calcFunction: voteTimeStats,
  },
  { ...messages.tickets,
    key: "tickets",
    calcFunction: ticketStats,
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
    this.setState({ selectedExport });
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
    this.setState({ destinationFile });
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
