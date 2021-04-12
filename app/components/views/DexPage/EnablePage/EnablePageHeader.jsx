import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import { StandaloneHeader } from "layout";

export const EnablePageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.enablePage.title" m="Enable DEX" />}
    description={
      <T
        id="dex.enablePage.description"
        m="You must enable DEX features to use them."
      />
    }
    iconType={DEX_ICON}
  />
);
