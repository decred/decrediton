import { ToggleSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";

const AutoBuyerSwitch = ({
  enabled,
  onClick,
  disabled,
  className,
  tooltipClassName,
  disabledText,
  loading
}) => (
  <ToggleSwitch
    enabled={enabled}
    onClick={onClick}
    disabled={disabled}
    className={className}
    tooltipClassName={tooltipClassName}
    enabledText={<T id="autobuyer.enabled" m="Turn off auto buyer" />}
    notEnabledText={<T id="autobuyer.disabled" m="Turn on auto buyer" />}
    disabledText={
      disabledText ?? (
        <T id="autobuyer.disabledText" m="Auto buyer is disabled" />
      )
    }
    loading={loading}
  />
);

export default AutoBuyerSwitch;
