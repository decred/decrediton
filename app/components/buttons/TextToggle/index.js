import { useState } from "react";
import Toggle from "./Toggle";

const TextToggle = ({ activeButton, leftText, rightText, toggleAction }) => {
  const [active, setActive] = useState(activeButton);

  const onClick = (active) => {
    setActive(active);
    toggleAction(active);
  };

  return <Toggle {...{ leftText, rightText, activeButton: active, onClick }} />;
};

export default TextToggle;
