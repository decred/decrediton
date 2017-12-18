import { createElement as h } from "react";
export { tsToDate } from "./dateFormat";
export { addSpacingAroundText, restrictToStdDecimalNumber } from "./strings";
export { reverseHash } from "./byteActions";
export * from "./addresses";

// kidCheck takes a component and returns a component that only renders if it has children
export const kidCheck = C => {
  const Comp = p => !!p.children && h(C, p);
  Comp.displayName = `KidChecked: ${ C.displayName || C.name || C }`;
  return Comp;
};

// showCheck takes a component and returns a component that can be passed a `show` prop and only renders if show is true
// show is set to true as default behavior.
export const showCheck = C => {
  const Comp = ({ show, ...p }) => !!show && h(C, p);
  Comp.defaultProps = { show: true };
  Comp.displayName = `ShowChecked: ${ C.displayName || C.name || C }`;
  return Comp;
};

// our tabbed pages and headers rely on knowing which page and tab they're on and what others are available.
// This centralizes the logic for how those are resolved in case this changes when we upgrade to react router 4
export const getTabs = routes => routes[1].childRoutes && routes[1].childRoutes.map( route => route.path );
export const getTab = routes => routes[2] && routes[2].path;
export const getPage = routes => (routes[1] && routes[1].path) || "root";
