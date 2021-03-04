import Input from "./Input/Input";

// AddressInput is an input that restricts values to a decred address
// doesn't do validation yet, but may in the future
const AddressInput = ({ ...props }) => <Input {...{ ...props }} />;

export default AddressInput;
