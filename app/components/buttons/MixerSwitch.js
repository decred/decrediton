import { ToggleSwitch } from "buttons";
import { FormattedMessage as T } from "react-intl";

const MixerSwitch = ({ enabled, onClick, disabled }) => (
  <ToggleSwitch
    enabled={enabled}
    onClick={onClick}
    disabled={disabled}
    enabledText={<T id="mixer.enabled" m="Stop mixing" />}
    notEnabledText={<T id="mixer.disabled" m="Start mixing" />}
  />
);

export default MixerSwitch;
