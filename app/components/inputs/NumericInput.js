import Input from "./Input";
import "style/Input.less";

const NumericInput = ({ ...props }) => <Input {...{ ...props, className: "numeric-input" }} />;

export default NumericInput;
