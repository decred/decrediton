import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

const useWallet = () => {
  const dispatch = useDispatch();
  const expandSideBar = useSelector(sel.expandSideBar);
  const getPeerInfo = () => dispatch(ca.getPeerInfo());

  return {
    getPeerInfo,
    expandSideBar
  };
};

export default useWallet;
