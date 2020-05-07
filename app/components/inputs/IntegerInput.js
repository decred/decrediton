import NumericInput from "./NumericInput";

const IntegerInput = ({ ...props }) => {
  let value = props.value;

  const onChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    if (value !== newValue) {
      value = newValue;
      e.target.value = newValue;
      props.onChange && props.onChange(e);
    }
  };

  return <NumericInput {...props} onChange={onChange} value={value} />;
};

export default IntegerInput;
