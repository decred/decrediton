import Select from "react-select";
import { Box } from "shared";
import { injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select Stakepool..."
  }
});

const SelectStakePool = ({
  valueKey="value",
  labelKey="label",
  multi=false,
  clearable=false,
  intl,
  options,
  value,
  onChange,
  ...props
}) => (
  <Box f={ 16 } { ...props }>
    <Select
      placeholder={intl.formatMessage(messages.placeholder)}
      {...{
        valueKey, labelKey, multi, clearable,
        options,  value, onChange
      }} />
  </Box>
);

export default injectIntl(SelectStakePool);
