import { useSelector } from "react-redux";
import * as sel from "selectors";

const useModalVisible = () => {
  const modalVisible = useSelector(sel.modalVisible);

  return {
    modalVisible
  };
};

export default useModalVisible;
