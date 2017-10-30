import { FormattedMessage as T } from "react-intl";
import "style/Header.less";

const SecurityPageHeader = () => {
  return (
    <div className="header">
      <div className="header-top"></div>

      <div className="tabbedheader-title">
        <span className={ "tabbedheader-icon header-icon-security-center" } />
        <T id="securitycenter.header.title" m="Security Center" />
      </div>

      <div className="tabbedheader-description">
        <T id="securitycenter.header.description" m="Various tools that help in different aspects of crypto currency security will be located here." />
      </div>

      <div className="tabbedheader-tabs">
        <div className="tabbedheader-tabs-stub"/>
      </div>
    </div>
  );
};

export default SecurityPageHeader;
