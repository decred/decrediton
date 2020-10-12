import { useEffect, useCallback } from "react";

/**
 * useClickOutside custom hooks calls given callback in case
 * of a click _outside_ the provided react node ref.
 *
 * @param {Node} ref - react ref.
 * @param {Func} cb - callback function.
 */
const useClickOutside = (ref, cb) => {
  // Memorize callback ref
  const useCb = useCallback(() => cb(), [cb]);

  useEffect(() => {
    /**
     * Fire callback if clicked outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        useCb();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, useCb]);
};

export default useClickOutside;
