import Input from "./Input/Input";

const PasswordInput = ({ ...props }) => (
  <Input {...{ ...props, type: "password" }} />
);

export default PasswordInput;
