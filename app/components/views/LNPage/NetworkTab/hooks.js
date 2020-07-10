import * as sel from "selectors";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as lna from "actions/LNActions";

export function useNetworkTab() {
  const dispatch = useDispatch();
  const network = useSelector(sel.lnNetwork);
  const nodeInfo = useSelector(sel.lnNodeInfo);
  const getNodeInfoAttempt = useSelector(sel.lnGetNodeInfoAttempt);
  const tsDate = useSelector(sel.tsDate);

  useEffect(() => {
    !network && dispatch(lna.getNetworkInfo());
  }, [network, dispatch]);

  const getNodeInfo = nodeId => dispatch(lna.getNodeInfo(nodeId));

  return {
    network,
    nodeInfo,
    tsDate,
    getNodeInfo,
    getNodeInfoAttempt
  };
};
