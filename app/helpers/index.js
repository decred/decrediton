import { createElement as h } from "react";
export * from "./dateFormat";
export * from "./strings";
export * from "./byteActions";
export * from "./addresses";
export * from "./arrays";
export * from "./dom.js";
export * from "./transactions";
export * from "./msgTx";
export * from "./politeia";
export * from "./scripts";
export * from "./tickets";
export * from "./displayWalletGradients";

// kidCheck takes a component and returns a component that only renders if it
// has children.
export const kidCheck = (C) => {
  const Comp = (p) => !!p.children && h(C, p);
  Comp.displayName = `KidChecked: ${C.displayName || C.name || C}`;
  return Comp;
};

// showCheck takes a component and returns a component that can be passed a
// `show` prop and only renders if show is true.
// show is set to true by default.
export const showCheck = (C) => {
  const Comp = ({ show, ...p }) => !!show && h(C, p);
  Comp.defaultProps = { show: true };
  Comp.displayName = `ShowChecked: ${C.displayName || C.name || C}`;
  return Comp;
};
