import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

const NetworkTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.network"
        m="General information about the current state of Decred's LN."
      />
    }
  />
);

export default NetworkTabHeader;
