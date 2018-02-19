import Input from "./Input";

const PasswordInput = ({ ...props }) =>
  <Input {...{ ...props, type: "password" }} />;

export default PasswordInput;
