import Input from "../Input";
import style from "./PathInput.module.css";
import { classNames } from "pi-ui";

const PathInput = ({ onChange, className, ...props }) => (
  <Input
    {...{
      ...props,
      className: classNames(style.pathInput, className),
      onChange: (e) => onChange(e.target.value)
    }}
  />
);

export default PathInput;
