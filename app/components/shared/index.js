import { createElement as h } from "react";
export { default as cxs } from "./cxs";
export * from "./grid";
export * from "./typography";
export { default as Icon } from "./Icon";
export { default as Tooltip } from "./Tooltip";

export const showCheck = C => ({ show, ...p }) => !!show && h(C, p);
