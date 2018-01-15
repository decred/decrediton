import { injectIntl, intlShape } from "react-intl";
import { getPage, getTabs, getTab } from "helpers";
import { tabbedHeader } from "connectors";
// import MessageBanner from "./MessageBanner";
// import { Balance } from "shared";
// import Description from "./Description";
// import messages from "messages";
import Tabs from "./Tabs";
import "style/Header.less";

const TabbedHeader = ({ intl, routes, totalBalance, ticketPrice }) => {
  const { noIcon, ticketprice, noHeader, className} = routes[1];
  const page = getPage(routes);
  const tabs = getTabs(routes);

  return (
    <div className={[noHeader ? "" : "header", className].join(" ")}>
      {/* <div className="tabbedheader-top">
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
      </div> */}

      { tabs && <Tabs className="home-tab" {...{ routes }}/> }
    </div>
  );
};

TabbedHeader.propTypes = {
  intl: intlShape,
  routes: PropTypes.array,
  isTestNet: PropTypes.bool,
};

export default injectIntl(tabbedHeader(TabbedHeader));
