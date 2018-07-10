import Input from "./Input";

const PathInput = ({ onChange, ...props }) =>
  <Input {...{ ...props, className: "path-input", onChange: (e) => onChange(e.target.value) }}/>;

export default PathInput;
