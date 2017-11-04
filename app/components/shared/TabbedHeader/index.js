import { withRouter } from "react-router";
import { injectIntl, intlShape } from "react-intl";
import { tabbedHeader } from "connectors";
import MessageBanner from "./MessageBanner";
import Description from "./Description";
import messages from "messages";
import Icon from "../Icon";
import Tabs from "./Tabs";
import "style/Header.less";

const TabbedHeader = ({ intl, children, routes, noDesc, testNet, isTestNet, noIcon }) => {
  const page = routes[1].path;
  const tabs = routes[1].childRoutes;
  const title = [page, "title"].join(".");
  let description = [page, "description"].join(".");
  if (testNet) description = [description, isTestNet ? "testnet" : "mainnet"].join(".");

  return (
    <div className="header">
      <div className="header-top">
        <MessageBanner/>
      </div>

      <div className="tabbedheader-icon">
        { !noIcon && <Icon i={ page } s={ 30 }/> }
      </div>

      <div className="tabbedheader-title">
        { intl.formatMessage(messages[title]) }
      </div>

      <div className="tabbedheader-content">
        { !noDesc && <Description>{ intl.formatMessage(messages[description]) }</Description> }
        { children }
      </div>

      { tabs && <Tabs/> }
    </div>
  );
};

TabbedHeader.propTypes = {
  intl: intlShape,
  routes: PropTypes.array,
  noDesc: PropTypes.bool,
  isTestNet: PropTypes.bool,
  testNet: PropTypes.bool,
  noIcon: PropTypes.bool,
};

export default injectIntl(withRouter(tabbedHeader(TabbedHeader)));
