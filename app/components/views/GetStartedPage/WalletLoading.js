import Header from "Header";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

const DaemonLoading = () => (
  <div className="get-started-view">
    <Header getStarted headerTitleOverview={<T id="getStarted.startingDaemonsOverview" m="Starting Hxd..." />} />
    <div className="get-started-content">
      <div className="get-started-content-title">
        <div className="get-started-content-title-text">
          <T id="getStarted.startingDaemons" m="Starting daemon and wallet" />
        </div>
      </div>
      <div className="get-started-content-nest">
        <div>
        </div>
      </div>
    </div>
  </div>
);

export default DaemonLoading;
