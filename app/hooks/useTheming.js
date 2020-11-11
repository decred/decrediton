import { useSelector } from "react-redux";
import * as sel from "selectors";

const useTheming = () => {
  const uiAnimations = useSelector(sel.uiAnimations);

  return {
    uiAnimations
  };
};

export default useTheming;
