import { injectIntl, intlShape } from "react-intl";
import { getPage, getTabs, getTab } from "helpers";
import { tabbedHeader } from "connectors";
import MessageBanner from "./MessageBanner";
import Description from "./Description";
import messages from "messages";
import Icon from "../Icon";
import Tabs from "./Tabs";
import "style/Header.less";

const TabbedHeader = ({ intl, children, routes, isTestNet }) => {
  const { tabDesc, noDesc, noIcon } = routes[1];
  const page = getPage(routes);
  const tabs = getTabs(routes);
  const title = [page, "title"].join(".");
  let description = [page, "description"].join(".");
  if (tabDesc) description = [description, getTab(routes)].join(".");
  if (routes[2] && routes[2].testNet) description = [description, isTestNet ? "testnet" : "mainnet"].join(".");

  return (
    <div className="header">
      <div className="header-top">
        <MessageBanner/>
      </div>

      { !noIcon &&
      <div className="tabbedheader-icon">
        <Icon i={ page } s={ 30 }/>
      </div> }

      <div className="tabbedheader-title">
        { intl.formatMessage(messages[title]) }
      </div>

      <div className="tabbedheader-content">
        { !noDesc && <Description>{ intl.formatMessage(messages[description]) }</Description> }
        { children }
      </div>

      { tabs && <Tabs {...{ routes }}/> }
    </div>
  );
};

TabbedHeader.propTypes = {
  intl: intlShape,
  routes: PropTypes.array,
  isTestNet: PropTypes.bool,
};

export default injectIntl(tabbedHeader(TabbedHeader));
