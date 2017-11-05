import { injectIntl, intlShape } from "react-intl";
import { getPage, getTabs, getTab } from "helpers";
import { tabbedHeader } from "connectors";
import MessageBanner from "./MessageBanner";
import Balance from "Balance";
import Description from "./Description";
import messages from "messages";
import Icon from "../Icon";
import Tabs from "./Tabs";
import "style/Header.less";

const TabbedHeader = ({ intl, children, routes, isTestNet, icon, title, subtitle }) => {
  const { tabDesc, noDesc, noIcon } = routes[1];
  const page = getPage(routes);
  const tabs = getTabs(routes);
  const titleText = [page, "title"].join(".");
  let description = [page, "description"].join(".");
  if (tabDesc) description = [description, getTab(routes)].join(".");
  if (routes[2] && routes[2].testNet) description = [description, isTestNet ? "testnet" : "mainnet"].join(".");
  description = !noDesc && typeof subtitle === "undefined" && intl.formatMessage(messages[description]);

  return (
    <div className="header">
      <div className="header-top">
        <MessageBanner/>
      </div>

      { !noIcon &&
      <div className="tabbedheader-icon">
        <Icon i={ icon || page } s={ 30 }/>
      </div> }

      <div className="tabbedheader-title">
        { title || intl.formatMessage(messages[titleText]) }
      </div>

      <div className="tabbedheader-content">
        <Description>{ subtitle || description }</Description>
        { routes[2] && routes[2].balance &&
        <div className="small-balance">
          <Balance flat/>
        </div> }
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
