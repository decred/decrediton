import { useEffect } from "react";

/**
 * useMountEffect is a custom to run an effect on mount
 * it accepts an effect as function and executes it
 * only after succesful mount (empty array as second argument
 * in useEffect call)
 *
 * @param {*} fun - effect to run on mount
 */
const useMountEffect = (fun) => useEffect(fun, []);

export default useMountEffect;
