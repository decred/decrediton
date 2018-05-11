import { isString } from "util";

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
    .replace(/\.[.]+/g, ".")                  // remove repetitive periods
    .replace(/^\.(.*)$/, "0.$1")              // prepend 0 when starting with period
    .replace(/^([\d]*)(\.?[\d]*).*/, "$1$2"); // use only the first run of numbers
}

// Converts a string encoded as stdDecimalString (ie, a string protected by
// restrictToStdDecimalNumber) into a decred atom amount. This performs a
// conversion from a string into a JS number and then scales the number
// according to unitDivisor so the value represents an atom amount.
//
// Due to floating point inacuracies, a rounding function compatible to dcrutil
// `round` is used (see:
// https://github.com/decred/dcrd/blob/v1.1.2/dcrutil/amount.go#L77)
//
// Note that, since JS doesn't actually have an integer type (all numbers
// are floating-point numbers), the Math.trunc function is used to simulate
// the float64 -> int64 conversion.
//
// This is fine for representing numbers within the range of the total decred
// supply (up to 21e14) but may not be arbitrarily applicable.
export function strToDcrAtoms(s, unitDivisor) {
  return Math.trunc(parseFloat(s) * unitDivisor + 0.5);
}

// Restricts the given stdDecimalString (ie, a string projected by
// restrictToStdDecimalNumber) to the given amount of fractional digits (ie,
// digits after the decimal point).
//
// This function does **not** pad the string if less than maxFracDigits are
// present.
export function limitFractionalDigits(s, maxFracDigits) {
  if (!isString(s)) return s;

  const match = s.match(/(\d+)\.(\d*)/);
  if (!match) return s;
  if (!maxFracDigits) return s[1]; // no fractional digits, return just the int part
  if (match[2].length <= maxFracDigits) return s;
  return match[1] + "." + match[2].substr(0, maxFracDigits);
}

// politeiaMarkdownIndexMd returns markdown text from the payload of a politeia
// proposal file that corresponds to its index.md). This was extracted from the
// helpers.js file of politeia. Assumes the payload has been converted from
// base64 into bytes.
export function politeiaMarkdownIndexMd(payload) {
  let text = decodeURIComponent(escape(payload));
  return text.substring(text.indexOf("\n") + 1);
}
