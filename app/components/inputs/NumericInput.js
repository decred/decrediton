// Legacy input component no longer in use as replaced with Numeric Input Cash

import Input from "./Input";
import "style/Input.less";

const NumericInput = ({ ...props }) => <Input {...{ ...props, className: "numeric-input" }} />;

export default NumericInput;
