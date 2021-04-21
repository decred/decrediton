import Input from "../Input";
import style from "./NumericInput.module.css";
import { classNames } from "pi-ui";

const NumericInput = ({ className, ...props }) => (
  <Input
    {...{
      ...props,
      className: classNames(style.numericInput, className),
      unitAreaClassName: style.numericInputUnitArea
    }}
  />
);

export default NumericInput;
