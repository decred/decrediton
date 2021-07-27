import { useState } from "react";
import Toggle from "./Toggle";

const TextToggle = ({
  activeButton,
  leftText,
  rightText,
  toggleAction,
  className,
  childClassName
}) => {
  const [active, setActive] = useState(activeButton);

  const onClick = (active) => {
    setActive(active);
    toggleAction(active);
  };

  return (
    <Toggle
      {...{
        leftText,
        rightText,
        activeButton: active,
        onClick,
        className,
        childClassName
      }}
    />
  );
};

export default TextToggle;
