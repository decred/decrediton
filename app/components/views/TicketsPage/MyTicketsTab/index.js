import ErrorScreen from "ErrorScreen";
import MyTicketsPage from "./Page";
import service from "connectors/service";

@autobind
class MyTickets extends React.Component{
  render() {
    const { walletService } = this.props;

    return walletService
      ? <MyTicketsPage {...{
        ...this.props,
        ...this.state
      }} />
      : <ErrorScreen />;
  }
}

export default service(MyTickets);
