// @flow
export function reverseHash(s) {
  s = s.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
  var a = s.match(/../g);             // split number in groups of two
  a.reverse();                        // reverse the groups
  var s2 = a.join("");
  return s2;
}
