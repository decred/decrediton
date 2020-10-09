import { FormattedMessage as T } from "react-intl";
import Header from "./Header";
import { StandalonePage } from "layout";
import { InvisibleButton } from "buttons";

export default ({ onConnect }) => (
  <StandalonePage header={<Header />}>
    <div>
      <T
        id="trezor.noDevice.message"
        m="No trezor device detected. Connect the device and check if trezor bridge is installed and running."
      />
    </div>
    <div>
      <InvisibleButton onClick={onConnect}>
        <T id="trezor.noDevice.btnConnect" m="Connect to Trezor" />
      </InvisibleButton>
    </div>
  </StandalonePage>
);
