import { useSelector, useDispatch } from "react-redux";

import * as vspa from "actions/VSPActions";
import * as sel from "selectors";

export const useMyTicketsTab = () => {
  const isLegacy = useSelector(sel.getIsLegacy);
  const dispatch = useDispatch();
  const toggleIsLegacy = (isLegacy) => {
    dispatch(vspa.toggleIsLegacy(isLegacy));
  };

  return {
    isLegacy,
    toggleIsLegacy
  };
};
