import { FormattedRelativeTime, injectIntl } from "react-intl";
import { selectUnit } from "@formatjs/intl-utils";

const FormattedRelative = ( { value, updateInterval } ) => {
  const fmt  = selectUnit(value.getTime());
  const isUpdatableInterval = [ "second", "minute", "hour" ].indexOf(fmt.unit) > -1;
  const updtInterval = updateInterval && isUpdatableInterval ? updateInterval / 1000 : null;
  return (
    <FormattedRelativeTime
      value={fmt.value}
      unit={fmt.unit}
      numeric="auto"
      updateIntervalInSeconds={updtInterval}
    />
  );
};

export default injectIntl(FormattedRelative);
