import InputComponent from "./InputComponent";
import "style/Input.less";

const NumericInput = ({ ...props }) => <InputComponent {...{ ...props, className: "numeric-input" }} />;

export default NumericInput;
