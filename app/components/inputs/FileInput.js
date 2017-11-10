import Input from "./Input";

const FileInput = ({...props}) =>
  <Input {...{...props, type: "file"}} />;

export default FileInput;
