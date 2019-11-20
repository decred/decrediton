import Input from "./Input";
import "style/Input.less";

const NumericInput = ({ className, ...props }) => <Input {...{ ...props, className: "numeric-input " + className }} />;

export default NumericInput;
