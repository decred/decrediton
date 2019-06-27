import Input from "./Input";
import "style/Input.less";

const NumericInput = ({ ...props }) => <Input className={"numeric-input " + props.className} {...props} />;

export default NumericInput;
