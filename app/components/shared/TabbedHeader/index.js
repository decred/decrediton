import { injectIntl, intlShape } from "react-intl";
import { getPage, getTabs, getTab } from "helpers";
import { tabbedHeader } from "connectors";
import MessageBanner from "./MessageBanner";
import Balance from "Balance";
import Description from "./Description";
import messages from "messages";
import Tabs from "./Tabs";
import "style/Header.less";

const TabbedHeader = ({ intl, children, routes, totalBalance, ticketPrice, isTestNet, icon, title, subtitle }) => {
  const { tabDesc, desc, noIcon, ticketprice } = routes[1];
  const { balance, testNet } = routes[2] || {};
  const page = getPage(routes);
  const tabs = getTabs(routes);
  const titleText = [page, "title"].join(".");
  let description = [page, "description"].join(".");
  if (tabDesc) description = [description, getTab(routes)].join(".");
  if (testNet) description = [description, isTestNet ? "testnet" : "mainnet"].join(".");
  description = (desc || tabDesc) && typeof subtitle === "undefined" && intl.formatMessage(messages[description]);

  return (
    <div className="header">
      <div className="tabbedheader-top">
        <MessageBanner/>
      </div>

      { !noIcon &&
      <div className="tabbedheader-icon">
        <div className={icon || page} />
      </div> }

      <div className="tabbedheader-title">
        { title || intl.formatMessage(messages[titleText]) }
      </div>

      <div className="tabbedheader-content">
        <Description>{ subtitle || description }</Description>
        { balance ? <div className="small-balance"><Balance flat amount={ totalBalance }/></div> :
        ticketprice && <div className="small-balance"><Balance flat amount={ ticketPrice }/></div> }
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
