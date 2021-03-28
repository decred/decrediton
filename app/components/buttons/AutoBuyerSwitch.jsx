import { ToggleSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";

const AutoBuyerSwitch = ({ enabled, onClick, disabled, className }) => (
  <ToggleSwitch
    enabled={enabled}
    onClick={onClick}
    disabled={disabled}
    className={className}
    enabledText={<T id="autobuyer.enabled" m="Turn off auto buyer" />}
    notEnabledText={<T id="autobuyer.disabled" m="Turn on auto buyer" />}
  />
);

export default AutoBuyerSwitch;
