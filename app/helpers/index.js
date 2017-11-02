import { createElement as h } from "react";

export const kidCheck = C => {
  const Comp = p => !!p.children && h(C, p);
  Comp.displayName = `KidChecked: ${ C.displayName || C.name || C }`;
  return Comp;
};

export const showCheck = C => {
  const Comp = ({ show, ...p }) => !!show && h(C, p);
  Comp.defaultProps = { show: true };
  Comp.displayName = `ShowChecked: ${ C.displayName || C.name || C }`;
  return Comp;
};
