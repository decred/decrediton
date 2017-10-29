export const Aux = ({ show, children }) => !!show && children;
Aux.defaultProps = { show: true };

export { default as CopyToClipboard } from "./CopyToClipboard";
export { default as RouteTransition } from "./RouteTransition";
export { default as Tooltip } from "./Tooltip";
export { default as LinkToAccounts } from "./LinkToAccounts";
