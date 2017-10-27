import SecurityPageHeader from "./Header";
import { securityPage } from "connectors";
import "style/Layout.less";
import "style/StakePool.less";

const SecurityPage = ({
  children,
}) => {
  return (
    <Aux>
      <SecurityPageHeader />
      {children}
    </Aux>
  );
};

export default securityPage(SecurityPage);
