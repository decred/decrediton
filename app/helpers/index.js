import { createElement as h } from "react";

export const showCheck = C => {
  const Checked = ({ show, ...p }) => !!show && h(C, p);
  Checked.defaultProps = { show: true };
  Checked.displayName = `Checked: ${C.displayName}`;
  return Checked;
};
