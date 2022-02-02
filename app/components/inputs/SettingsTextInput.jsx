import Input from "./Input";
import { useState } from "react";

export default ({ onChange, value, ...props }) => {
  const [inputValue, setInputValue] = useState(value);

  const onSubmit = () => {
    onChange?.(inputValue);
  };

  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDownSubmit={onSubmit}
      onBlur={onSubmit}
      {...props}
    />
  );
};
