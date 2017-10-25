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
    <Aux>
      <SecurityPageHeader {...{ onToggleSecurityMessage, location }} />
      {children}
    </Aux>
  );
};

export default securityPage(SecurityPage);
