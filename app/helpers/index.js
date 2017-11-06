import { createElement as h } from "react";
export { tsToDate } from "./dateFormat";
export { addSpacingAroundText, restrictToStdDecimalNumber } from "./strings";

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

export const getTabs = routes => routes[1].childRoutes && routes[1].childRoutes.map( route => route.path );

export const getTab = routes => routes[2] && routes[2].path;

export const getPage = routes => (routes[1] && routes[1].path) || "root";
