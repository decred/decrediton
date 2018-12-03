import { FormattedMessage as T } from "react-intl";
import Header from "./Header";
import { StandalonePage } from "layout";
import { InvisibleButton } from "buttons";

export default ({ onReloadDeviceList }) => (
  <StandalonePage header={<Header />}>
    <div>
      <T id="trezor.noDevice.message" m="No trezor device detected. Connect the device and check if trezor bridge is installed and running." />
    </div>
    <div>
      <InvisibleButton onClick={onReloadDeviceList}>
        <T id="trezor.noDevice.btnReloadDeviceList" m="Reload Device List"/>
      </InvisibleButton>
    </div>
  </StandalonePage>
);
