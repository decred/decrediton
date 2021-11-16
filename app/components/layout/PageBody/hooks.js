import { useSelector } from "react-redux";
import * as sel from "selectors";

export const usePageBody = () => {
  const pageBodyScrollHandler = useSelector(sel.pageBodyScrollHandler);

  return {
    pageBodyScrollHandler
  };
};
