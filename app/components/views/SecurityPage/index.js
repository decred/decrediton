import { TabbedHeader } from "shared";

const SecurityPage = ({ children, routes }) => (
  <Aux>
    <TabbedHeader {...{ routes }}/>
    {children}
  </Aux>
);

export default SecurityPage;
