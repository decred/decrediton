import SecurityPageHeader from "./Header";
import { securityPage } from "connectors";
import "style/Layout.less";
import "style/StakePool.less";

const SecurityPage = ({
  location,
  onToggleSecurityMessage,
  children,
}) => {
  return (
    <div className="page-view">
      <SecurityPageHeader {...{ onToggleSecurityMessage, location }} />
      {children}
    </div>
  );
};

export default securityPage(SecurityPage);
