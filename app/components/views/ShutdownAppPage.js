import Header from "Header";
import { FormattedMessage as T } from "react-intl";
import { shutdownPage } from "connectors";
import { DecredLoading } from "indicators";
import "style/Layout.less";

class ShutdownAppPage extends React.Component{
  componentDidMount() {
    this.props.cleanShutdown();
  }

  render() {
    return (
      <div className="page-view inverted-colors">
        <Header
          getStarted
          headerTitleOverview={<T id="shutdown.header.title" m="Shutting down Hxify" />}
          headerMetaOverview={<T id="shutdown.header.meta" m="Shutting down daemons and wallet" />} />
        />
        <div className="page-content-fixed">
          <DecredLoading  className="get-started-loading" />
        </div>
      </div>
    );
  }
}

export default shutdownPage(ShutdownAppPage);
