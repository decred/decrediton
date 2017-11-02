import { TabbedHeader } from "shared";
import "style/Layout.less";
import "style/StakePool.less";

const SecurityPage = ({
  children,
}) => {
  return (
    <Aux>
      <TabbedHeader/>
      {children}
    </Aux>
  );
};

export default SecurityPage;
