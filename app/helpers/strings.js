// @flow

// This function adds spaces around text to fix an issue with double-clicking to select it
// when it's rendered inside of a floated element. Without the spaces, double-clicking will
// highlight floated text that comes before or after it in the DOM.
export function addSpacingAroundText(s) {
  return ' ' + s + ' ';
}