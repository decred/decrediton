import { TabbedHeader } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/StakePool.less";

const SecurityPage = ({
  children,
}) => {
  return (
    <Aux>
      <TabbedHeader>
        <T id="securitycenter.header.description" m="Various tools that help in different aspects of crypto currency security will be located here." />
      </TabbedHeader>
      {children}
    </Aux>
  );
};

export default SecurityPage;
