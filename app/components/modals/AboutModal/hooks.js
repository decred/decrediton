import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useAboutModal() {
  const version = useSelector(sel.appVersion);
  const updateAvailable = useSelector(sel.updateAvailable);

  return {
    version,
    updateAvailable
  };
}
