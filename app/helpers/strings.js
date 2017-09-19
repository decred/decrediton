// @flow

// This function adds spaces around text to fix an issue with double-clicking to select it
// when it's rendered inside of a floated element. Without the spaces, double-clicking will
// highlight floated text that comes before or after it in the DOM.
export function addSpacingAroundText(s) {
  return " " + s + " ";
}

// restrictToStdDecimalChars returns a new version of the string s, removing
// all non-decimal chars and converting "," to "." and making sure the number
// is a decimal-looking number (123.456)
export function restrictToStdDecimalNumber(s) {
  return s
    .replace(/,/g, ".")                       // comma to period
    .replace(/[^\d.]/g, "")                   // remove non-numbers
    .replace(/\.[\.]+/g, ".")                 // remove repetitive periods
    .replace(/^\.(.*)$/, "0.$1")              // prepend 0 when starting with period
    .replace(/^([\d]*)(\.?[\d]*).*/, "$1$2"); // use only the first run of numbers
}
