import Input from "./Input";

// AddressInput is an input that restricts values to a decred address
const AddressInput = ({ ...props }) => {
  let value = props.value;

  const onChange = (e) => {
    const newValue = e.target.value.trim();
    if (value !== newValue) {
      value = newValue;
      e.target.value = newValue;
      props.onChange && props.onChange(e);
    }
  };
  return <Input {...props} onChange={onChange} value={value} />;
};

export default AddressInput;
