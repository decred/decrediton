import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import { StandaloneHeader } from "layout";

const DexViewHeader = () => (
  <StandaloneHeader
    title={<T id="dex.launchDexWindow.title" m="Launch DEX Window" />}
    description={
      <T
        id="dex.launchDexWIndow.description"
        m="Launch the window to access the DEX"
      />
    }
    iconType={DEX_ICON}
  />
);

export default DexViewHeader;
