import ErrorScreen from "ErrorScreen";
import StatisticsPage from "./Page";
import service from "connectors/service";

@autobind
class Statistics extends React.Component{
  render() {
    const { walletService } = this.props;

    return walletService
      ? <StatisticsPage {...{
        ...this.props,
        ...this.state
      }} />
      : <ErrorScreen />;
  }
}

export default service(Statistics);
