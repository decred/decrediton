import { useSelector, useDispatch } from "react-redux";
import * as ga from "actions/GovernanceActions";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

const useWallet = () => {
  const dispatch = useDispatch();
  const expandSideBar = useSelector(sel.expandSideBar);
  const politeiaEnabled = useSelector(sel.politeiaEnabled);
  const compareInventory = () => dispatch(ga.compareInventory());
  const getPeerInfo = () => dispatch(ca.getPeerInfo());

  return {
    getPeerInfo,
    expandSideBar,
    politeiaEnabled,
    compareInventory
  };
};

export default useWallet;
