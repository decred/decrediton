import { withRouter } from "react-router";
import { injectIntl, intlShape } from "react-intl";
import messages from "messages";
import Description from "./Description";
import Tabs from "./Tabs";
import MessageBanner from "./MessageBanner";
import "style/Header.less";

const TabbedHeader = ({ intl, children, routes }) => {
  const page = routes[1].path;
  const tabs = routes[1].childRoutes;
  const headerIcon = ["header-icon", page].join("-");
  const title = [page, "title"].join(".");

  return (
    <div className="header">
      <div className="header-top">
        <MessageBanner/>
      </div>

      <div className="tabbedheader-title">
        <span className={ "tabbedheader-icon " + headerIcon } />
        { intl.formatMessage(messages[title]) }
      </div>

      <Description>
        { children }
      </Description>

      { tabs && <Tabs/> }
    </div>
  );
};

TabbedHeader.propTypes = {
  routes: PropTypes.array,
  intl: intlShape
};

export default injectIntl(withRouter(TabbedHeader));
