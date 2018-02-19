import Select from "react-select";
import { injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select Stakepool..."
  }
});

const StakePoolSelect = ({
  valueKey="value",
  labelKey="label",
  multi=false,
  clearable=false,
  style={ zIndex:"9" },
  intl,
  ...props
}) => (
  <Select
    placeholder={intl.formatMessage(messages.placeholder)}
    {...{
      valueKey,
      labelKey,
      multi,
      clearable,
      style,
      ...props
    }}
  />
);

export default injectIntl(StakePoolSelect);
