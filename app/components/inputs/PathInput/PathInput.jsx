import Input from "../Input/Input";
import style from "./PathInput.module.css";

const PathInput = ({ onChange, ...props }) => (
  <Input
    {...{
      ...props,
      className: style.pathInput,
      onChange: (e) => onChange(e.target.value)
    }}
  />
);

export default PathInput;
