export { default as compose } from "lodash/fp/compose";
export { default as get } from "lodash/fp/get";
export { default as eq } from "lodash/fp/eq";
export { createSelector } from "reselect";
import compose from "lodash/fp/compose";
import { createSelector } from "reselect";

export const not = fn => (...args) => !fn(...args);
export const bool = compose(not, not);
export const or = (...fns) => (...args) => {
  let result;
  return fns.find(fn => result = fn(...args)) ? result : false;
};
export const and = (...fns) => (...args) => {
  let result;
  return !fns.find((fn, idx) => idx === 0 ? !(result = fn(...args)) : !fn(...args)) ? result : false;
};

// Given a hash of keys to functions, creates a selector that returns a map of function results
export const selectorMap = (fns) => createSelector(
  Object.keys(fns).map(key => fns[key]),
  (...args) => Object.keys(fns).reduce((res, key, idx) => ({...res, [key]: args[idx] }), {})
);
