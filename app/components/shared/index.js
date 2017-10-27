import { createElement as h } from "react";

export const showCheck = C => ({ show, ...p }) => !!show && h(C, p);
export const Aux = ({ children }) => children;

export { default as cxs } from "./cxs";
export * from "./grid";
export * from "./typography";
export { default as Icon } from "./Icon";
export { default as Tooltip } from "./Tooltip";
export { default as CopyToClipboard } from "./CopyToClipboard";
export { default as RouteTransition } from "./RouteTransition";
export { default as LinkToAccounts } from "./LinkToAccounts";
