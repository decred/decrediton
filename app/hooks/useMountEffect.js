import { useEffect } from "react";

/**
 * useMountEffect is a custom hook to run an effect on mount
 * only once, it accepts an effect/function and executes it
 * only after succesful mount (empty array as second argument
 * in useEffect call)
 *
 * Note: eslint react-hooks/exhaustive-deps is disabled here due to this being
 * specifically to run a function on the very first mount, independently of fun
 * changing, thus `fun` is not supposed to actually be a dependency.
 *
 * @param {*} fun - effect to run on mount
 */
const useMountEffect = (fun) => useEffect(fun, []); // eslint-disable-line react-hooks/exhaustive-deps

export default useMountEffect;
