export { createSelector } from "reselect";
export { compose, reduce, find, filter, get, eq, map } from "lodash/fp";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";

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

// Currently redux state is not immutable causing issues with real selectors
// This is a temporary hack to allow same code style until that is fixed.
export const createSelectorEager = (keyFns, resultFn) =>
  (...args) => resultFn(...keyFns.map(fn => fn(...args)));

// Given a hash of keys to functions, creates a selector that returns a map of function results
export const selectorMap = (fns) => createSelectorEager(
  Object.keys(fns).map(key => fns[key]),
  (...args) => Object.keys(fns).reduce((res, key, idx) => ({ ...res, [key]: args[idx] }), {})
);

export const substruct = (structure, obj) => Object.keys(structure)
  .reduce((res, key) => ({ ...res, [structure[key] || key]: get(key, obj) }), {});

export const apply = (fn, ...args) => fn(...args);
