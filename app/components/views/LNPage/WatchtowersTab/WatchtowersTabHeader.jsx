import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

const WatchtowersTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.watchtowers"
        m="Manage connection to watchtowers."
      />
    }
  />
);

export default WatchtowersTabHeader;
