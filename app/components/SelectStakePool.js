import React from "react";
import Select from "react-select";

const SelectStakePool = ({
  placeholder="Select stake pool...",
  valueKey="value",
  labelKey="label",
  multi=false,
  clearable=false,
  style={zIndex:"9"},
  ...props
}) => (
  <Select
    {...{
      placeholder,
      valueKey,
      labelKey,
      multi,
      clearable,
      style,
      ...props
    }}
  />
);

export default SelectStakePool;
