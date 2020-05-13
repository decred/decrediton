import { Tooltip, Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { GoBackMsg } from "../messages";

export default ({ children, onSendBack }) => (
  <>
    <div className="go-back-screen-button-area">
      <Tooltip text={<GoBackMsg />}>
        <div className="go-back-screen-button" onClick={onSendBack} />
      </Tooltip>
    </div>
    <Subtitle title={<T id="settings.trezorConfig" m="Trezor Config" />} />
    <div className="getstarted-trezor-config-sections">{children}</div>
  </>
);
