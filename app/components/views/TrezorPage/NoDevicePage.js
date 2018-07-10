import { FormattedMessage as T } from "react-intl";
import Header from "./Header";
import { StandalonePage } from "layout";

export default () => (
  <StandalonePage header={<Header />}>
    <div>
      <T id="trezor.noDevice.message" m="No trezor device detected. Connect the device and check if trezor bridge is installed and running." />
    </div>
  </StandalonePage>
);
