import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useModalVisible = () => {
  const modalVisible = useSelector(sel.modalVisible);

  return {
    modalVisible
  };
};
