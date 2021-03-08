import { useSelector } from "react-redux";
import * as sel from "selectors";

const useLocale = () => {
  const currentLocaleName = useSelector(sel.currentLocaleName);

  return {
    currentLocaleName
  };
};

export default useLocale;
