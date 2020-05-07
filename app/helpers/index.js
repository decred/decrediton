import { createElement as h, useRef, useEffect } from "react";
export * from "./dateFormat";
export * from "./strings";
export * from "./byteActions";
export * from "./addresses";
export * from "./arrays";
export * from "./dom.js";

// kidCheck takes a component and returns a component that only renders if it has children
export const kidCheck = (C) => {
  const Comp = (p) => !!p.children && h(C, p);
  Comp.displayName = `KidChecked: ${C.displayName || C.name || C}`;
  return Comp;
};

// showCheck takes a component and returns a component that can be passed a `show` prop and only renders if show is true
// show is set to true as default behavior.
export const showCheck = (C) => {
  const Comp = ({ show, ...p }) => !!show && h(C, p);
  Comp.defaultProps = { show: true };
  Comp.displayName = `ShowChecked: ${C.displayName || C.name || C}`;
  return Comp;
};

// usePrevious keeps reference for later comparing when hook had have change.
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
