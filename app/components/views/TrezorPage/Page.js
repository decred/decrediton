import { StandalonePage } from "layout";
import ConfigSections from "./ConfigSections";
import Header from "./Header";

export default props => (
  <StandalonePage header={<Header />}>
    <ConfigSections { ...props } />
  </StandalonePage>
);
